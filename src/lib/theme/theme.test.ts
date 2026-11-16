import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { seasonForDate, seasonForMonthDay } from "./season"
import { themeScript } from "./theme-script"
import {
  ensureThemeAttributes,
  getThemeState,
  migrateLegacyTheme,
  setMode,
  setSeason,
} from "./theme-store"
import { getThemeColor, THEME_COMBOS } from "./themes"

/** Resposta independente da tabela de início das estações (caminho de código diferente). */
function oracle(month: number, day: number): string {
  const key = month * 100 + day
  if (key >= 1221 || key <= 319) return "verao"
  if (key <= 620) return "outono"
  if (key <= 921) return "inverno"
  return "primavera"
}

function stubMatchMedia(dark: boolean) {
  window.matchMedia = ((query: string) =>
    ({
      matches: dark && query.includes("dark"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList) as typeof window.matchMedia
}

describe("regra de estação (CA-2)", () => {
  it("segue o calendário brasileiro nos dias de virada", () => {
    expect(seasonForMonthDay(9, 21)).toBe("inverno")
    expect(seasonForMonthDay(9, 22)).toBe("primavera")
    expect(seasonForMonthDay(12, 20)).toBe("primavera")
    expect(seasonForMonthDay(12, 21)).toBe("verao")
    expect(seasonForMonthDay(12, 31)).toBe("verao")
    expect(seasonForMonthDay(1, 1)).toBe("verao")
    expect(seasonForMonthDay(3, 19)).toBe("verao")
    expect(seasonForMonthDay(3, 20)).toBe("outono")
    expect(seasonForMonthDay(6, 20)).toBe("outono")
    expect(seasonForMonthDay(6, 21)).toBe("inverno")
  })

  it("usa o dia de America/Sao_Paulo, não o do fuso de quem visita", () => {
    // 02:59:59Z é 23:59:59 em São Paulo (UTC-3) no dia anterior.
    expect(seasonForDate(new Date("2026-09-22T02:59:59Z"))).toBe("inverno")
    expect(seasonForDate(new Date("2026-09-22T03:00:00Z"))).toBe("primavera")
    expect(seasonForDate(new Date("2026-12-21T02:59:59Z"))).toBe("primavera")
    expect(seasonForDate(new Date("2026-12-21T03:00:00Z"))).toBe("verao")
    expect(seasonForDate(new Date("2027-01-01T02:59:59Z"))).toBe("verao")
    expect(seasonForDate(new Date("2026-03-20T02:59:59Z"))).toBe("verao")
    expect(seasonForDate(new Date("2026-03-20T03:00:00Z"))).toBe("outono")
    expect(seasonForDate(new Date("2026-06-21T02:59:59Z"))).toBe("outono")
    expect(seasonForDate(new Date("2026-06-21T03:00:00Z"))).toBe("inverno")
  })

  it("dá primavera em 16/11/2026, a data deste projeto", () => {
    expect(seasonForDate(new Date("2026-11-16T15:00:00Z"))).toBe("primavera")
  })

  it("concorda com a resposta independente em todos os dias de 2026 a 2028", () => {
    const wrong: string[] = []
    for (let t = Date.UTC(2026, 0, 1, 12); t < Date.UTC(2029, 0, 1); t += 864e5) {
      const date = new Date(t)
      const expected = oracle(date.getUTCMonth() + 1, date.getUTCDate())
      if (seasonForDate(date) !== expected) wrong.push(date.toISOString())
    }
    expect(wrong).toEqual([])
  })
})

describe("script do <head> (CA-1, CA-2, CA-3, CA-5)", () => {
  const run = new Function(themeScript()) as () => void
  const root = document.documentElement
  const original = window.matchMedia

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-11-16T15:00:00Z"))
    stubMatchMedia(false)
    root.removeAttribute("data-season")
    root.removeAttribute("data-mode")
    document.head.innerHTML = '<meta name="theme-color" content="#000000">'
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    window.matchMedia = original
    document.head.innerHTML = ""
  })

  const applied = () => [root.getAttribute("data-season"), root.getAttribute("data-mode")]

  it("sem escolha: estação do calendário e modo do sistema", () => {
    run()
    expect(applied()).toEqual(["primavera", "claro"])
    stubMatchMedia(true)
    run()
    expect(applied()).toEqual(["primavera", "escuro"])
  })

  it("a estação do script concorda com seasonForDate em todos os dias", () => {
    const wrong: string[] = []
    for (let t = Date.UTC(2026, 0, 1, 12); t < Date.UTC(2029, 0, 1); t += 864e5) {
      vi.setSystemTime(new Date(t))
      run()
      if (root.getAttribute("data-season") !== seasonForDate(new Date(t))) {
        wrong.push(new Date(t).toISOString())
      }
    }
    expect(wrong).toEqual([])
  })

  it("a estação do script segue o fuso de São Paulo na virada", () => {
    vi.setSystemTime(new Date("2026-09-22T02:59:59Z"))
    run()
    expect(root.getAttribute("data-season")).toBe("inverno")
    vi.setSystemTime(new Date("2026-09-22T03:00:00Z"))
    run()
    expect(root.getAttribute("data-season")).toBe("primavera")
  })

  it("a escolha salva de cada eixo prevalece, separadamente", () => {
    window.localStorage.setItem("vg-estacao", "outono")
    run()
    expect(applied()).toEqual(["outono", "claro"])
    window.localStorage.setItem("vg-modo", "escuro")
    window.localStorage.removeItem("vg-estacao")
    run()
    expect(applied()).toEqual(["primavera", "escuro"])
  })

  it("ignora valores salvos inválidos", () => {
    window.localStorage.setItem("vg-estacao", "ipe")
    window.localStorage.setItem("vg-modo", "automatico")
    run()
    expect(applied()).toEqual(["primavera", "claro"])
  })

  it("migra vg-tema: ipe vira primavera clara e noturno, primavera escura", () => {
    window.localStorage.setItem("vg-tema", "ipe")
    run()
    expect(applied()).toEqual(["primavera", "claro"])
    expect(window.localStorage.getItem("vg-estacao")).toBe("primavera")
    expect(window.localStorage.getItem("vg-modo")).toBe("claro")
    expect(window.localStorage.getItem("vg-tema")).toBeNull()

    window.localStorage.clear()
    vi.setSystemTime(new Date("2026-07-10T15:00:00Z"))
    window.localStorage.setItem("vg-tema", "noturno")
    run()
    expect(applied()).toEqual(["primavera", "escuro"])
    expect(window.localStorage.getItem("vg-tema")).toBeNull()
  })

  it("migra outono e inverno antigos para a estação e o modo claro", () => {
    window.localStorage.setItem("vg-tema", "inverno")
    run()
    expect(applied()).toEqual(["inverno", "claro"])
    expect(window.localStorage.getItem("vg-modo")).toBe("claro")
  })

  it("não sobrescreve escolhas novas com o valor antigo e apaga o antigo", () => {
    window.localStorage.setItem("vg-estacao", "verao")
    window.localStorage.setItem("vg-tema", "noturno")
    run()
    expect(applied()).toEqual(["verao", "claro"])
    expect(window.localStorage.getItem("vg-tema")).toBeNull()
  })

  it("tolera valor antigo desconhecido, inclusive nomes herdados de Object", () => {
    window.localStorage.setItem("vg-tema", "constructor")
    expect(() => run()).not.toThrow()
    expect(applied()).toEqual(["primavera", "claro"])
    expect(window.localStorage.getItem("vg-tema")).toBeNull()
  })

  it("atualiza o theme-color da combinação aplicada", () => {
    window.localStorage.setItem("vg-estacao", "verao")
    window.localStorage.setItem("vg-modo", "escuro")
    run()
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
    ).toBe(getThemeColor("verao", "escuro"))
  })

  it("funciona sem localStorage e sem matchMedia", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado")
    })
    window.matchMedia = (() => {
      throw new Error("sem matchMedia")
    }) as unknown as typeof window.matchMedia
    expect(() => run()).not.toThrow()
    expect(applied()).toEqual(["primavera", "claro"])
  })
})

describe("store (CA-3, CA-4)", () => {
  const root = document.documentElement
  const original = window.matchMedia

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-11-16T15:00:00Z"))
    stubMatchMedia(false)
    root.setAttribute("data-season", "primavera")
    root.setAttribute("data-mode", "claro")
    document.head.innerHTML = '<meta name="theme-color" content="#000000">'
  })

  afterEach(() => {
    vi.useRealTimers()
    window.matchMedia = original
    document.head.innerHTML = ""
  })

  it("grava estação e modo em chaves separadas e aplica os atributos", () => {
    setSeason("verao")
    expect(root.getAttribute("data-season")).toBe("verao")
    expect(root.getAttribute("data-mode")).toBe("claro")
    expect(window.localStorage.getItem("vg-estacao")).toBe("verao")
    expect(window.localStorage.getItem("vg-modo")).toBeNull()
    setMode("escuro")
    expect(root.getAttribute("data-season")).toBe("verao")
    expect(root.getAttribute("data-mode")).toBe("escuro")
    expect(window.localStorage.getItem("vg-modo")).toBe("escuro")
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
    ).toBe(getThemeColor("verao", "escuro"))
  })

  it("'Automática' volta ao calendário e 'Do sistema' volta ao sistema", () => {
    setSeason("inverno")
    setMode("escuro")
    expect(getThemeState()).toMatchObject({
      season: "inverno",
      mode: "escuro",
      seasonPref: "inverno",
      modePref: "escuro",
      autoSeason: "primavera",
    })
    setSeason(null)
    expect(root.getAttribute("data-season")).toBe("primavera")
    expect(window.localStorage.getItem("vg-estacao")).toBeNull()
    expect(getThemeState().seasonPref).toBeNull()
    setMode(null)
    expect(root.getAttribute("data-mode")).toBe("claro")
    expect(window.localStorage.getItem("vg-modo")).toBeNull()
    expect(getThemeState().modePref).toBeNull()
  })

  it("ignora valores inválidos", () => {
    setSeason("ipe")
    setMode("noturno")
    expect(root.getAttribute("data-season")).toBe("primavera")
    expect(root.getAttribute("data-mode")).toBe("claro")
    expect(window.localStorage.getItem("vg-estacao")).toBeNull()
  })

  it("devolve a mesma referência enquanto nada muda", () => {
    const a = getThemeState()
    expect(getThemeState()).toBe(a)
    setSeason("outono")
    expect(getThemeState()).not.toBe(a)
  })

  it("ensureThemeAttributes reaplica os atributos que sumiram", () => {
    root.removeAttribute("data-season")
    root.removeAttribute("data-mode")
    window.localStorage.setItem("vg-estacao", "outono")
    ensureThemeAttributes()
    expect(root.getAttribute("data-season")).toBe("outono")
    expect(root.getAttribute("data-mode")).toBe("claro")
  })

  it("migrateLegacyTheme dá o mesmo resultado do script", () => {
    window.localStorage.setItem("vg-tema", "noturno")
    migrateLegacyTheme()
    expect(window.localStorage.getItem("vg-estacao")).toBe("primavera")
    expect(window.localStorage.getItem("vg-modo")).toBe("escuro")
    expect(window.localStorage.getItem("vg-tema")).toBeNull()
  })
})

describe("combinações", () => {
  it("tem 8 combinações e uma cor de tema para cada uma", () => {
    expect(THEME_COMBOS).toHaveLength(8)
    for (const c of THEME_COMBOS) {
      expect(getThemeColor(c.season, c.mode)).toMatch(/^#[0-9A-F]{6}$/)
    }
  })
})
