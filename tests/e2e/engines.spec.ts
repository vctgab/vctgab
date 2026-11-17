/**
 * Pontos de risco entre motores (etapa 0.3): color-mix(), script de tema
 * antes da primeira pintura, LiveClock e suporte de hifenização e
 * text-wrap. Roda em chromium, webkit e firefox.
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { expect, test } from "@playwright/test"
import { applyTheme, collectConsole, THEMES } from "./helpers"

interface GeneratedTheme {
  id: string
  semantic: Record<string, string>
}

const generated = JSON.parse(
  readFileSync(join(process.cwd(), "src/styles/tokens.generated.json"), "utf8"),
) as { themes: GeneratedTheme[] }

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

for (const theme of THEMES) {
  test(`color-mix: tokens semânticos do tema ${theme} pintam o hex do build`, async ({
    page,
  }) => {
    const expected = Object.entries(
      generated.themes.find((t) => t.id === theme)?.semantic ?? {},
    ).filter(([, v]) => /^#[0-9A-F]{6}$/i.test(v))
    expect(expected.length).toBeGreaterThan(30)

    await applyTheme(page, theme)
    await page.goto("/sistema", { waitUntil: "load" })
    const painted = await page.evaluate(
      (names) => {
        // O canvas normaliza qualquer sintaxe (rgb(), color(srgb …)) em pixels.
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 1
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        const probe = document.createElement("span")
        document.body.append(probe)
        const out: Record<string, number[]> = {}
        for (const name of names) {
          probe.style.color = `var(--${name})`
          const color = getComputedStyle(probe).color
          if (!ctx) continue
          ctx.clearRect(0, 0, 1, 1)
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 1, 1)
          out[name] = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3))
        }
        probe.remove()
        return out
      },
      expected.map(([name]) => name),
    )

    const off = expected
      .map(([name, hex]) => {
        const want = hexToRgb(hex)
        const got = painted[name] ?? []
        const delta = Math.max(...want.map((c, i) => Math.abs(c - (got[i] ?? -99))))
        return { name, hex, got: got.join(","), delta }
      })
      // ±1 por canal: arredondamento de cada motor no color-mix.
      .filter((x) => x.delta > 1)
    expect(off).toEqual([])
  })
}

test("tema salvo já está no <html> quando o <body> entra (antes da primeira pintura)", async ({
  page,
}) => {
  await applyTheme(page, "outono-escuro")
  await page.addInitScript(() => {
    const w = window as unknown as { __temaNoBody?: string[] }
    new MutationObserver((_, obs) => {
      if (document.body) {
        const root = document.documentElement
        w.__temaNoBody = [
          root.getAttribute("data-season") ?? "",
          root.getAttribute("data-mode") ?? "",
        ]
        obs.disconnect()
      }
    }).observe(document, { childList: true, subtree: true })
  })
  await page.goto("/", { waitUntil: "load" })
  const seen = await page.evaluate(
    () => (window as unknown as { __temaNoBody?: string[] }).__temaNoBody,
  )
  expect(seen).toEqual(["outono", "escuro"])
})

// A estação do calendário brasileiro (hemisfério sul) em America/Sao_Paulo,
// calculada no script do <head> antes da primeira pintura (CA-2), nos três motores.
const CALENDAR: [string, string][] = [
  ["2026-09-22T02:59:59Z", "inverno"], // 23:59:59 de 21/09 em São Paulo
  ["2026-09-22T03:00:00Z", "primavera"],
  ["2026-12-21T02:59:59Z", "primavera"],
  ["2026-12-21T03:00:00Z", "verao"],
  ["2027-03-20T03:00:00Z", "outono"],
  ["2027-06-21T03:00:00Z", "inverno"],
]
for (const [iso, season] of CALENDAR) {
  test(`sem escolha salva, ${iso} abre em ${season} e, com sistema escuro, no modo escuro`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" })
    const page = await context.newPage()
    await page.clock.setFixedTime(new Date(iso))
    await page.goto("/", { waitUntil: "load" })
    await expect(page.locator("html")).toHaveAttribute("data-season", season)
    await expect(page.locator("html")).toHaveAttribute("data-mode", "escuro")
    await context.close()
  })
}

test("o tema antigo (vg-tema) migra para estação e modo e a chave some", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "load" })
  await page.evaluate(() => window.localStorage.setItem("vg-tema", "noturno"))
  await page.reload({ waitUntil: "load" })
  await expect(page.locator("html")).toHaveAttribute("data-season", "primavera")
  await expect(page.locator("html")).toHaveAttribute("data-mode", "escuro")
  const stored = await page.evaluate(() => [
    window.localStorage.getItem("vg-tema"),
    window.localStorage.getItem("vg-estacao"),
    window.localStorage.getItem("vg-modo"),
  ])
  expect(stored).toEqual([null, "primavera", "escuro"])
})

test("LiveClock mostra a hora de Teresina em HH:mm, avança e não gera aviso", async ({
  page,
}) => {
  const messages = collectConsole(page)
  // 12:34:50 UTC = 09:34 em Teresina (America/Fortaleza, UTC−3, sem horário de verão).
  await page.clock.install({ time: new Date("2026-11-17T12:34:50Z") })
  await page.goto("/sistema/hero", { waitUntil: "networkidle" })
  const clock = page.locator("main time").first()
  await expect(clock).toHaveText("09:34")
  await expect(clock).toHaveAttribute("aria-label", "Horário em Teresina: 09:34")
  await page.clock.runFor(15_000)
  await expect(clock).toHaveText("09:35")
  expect(messages.filter((m) => !m.includes("favicon"))).toEqual([])
})

test("suporte de hifenização e text-wrap (registro, não falha)", async ({
  page,
}, testInfo) => {
  await page.goto("/sistema/tipografia", { waitUntil: "load" })
  const support = await page.evaluate(() => ({
    hyphensAuto: CSS.supports("hyphens", "auto"),
    hyphenateLimitChars: CSS.supports("hyphenate-limit-chars", "7 4 3"),
    textWrapPretty: CSS.supports("text-wrap", "pretty"),
    textWrapBalance: CSS.supports("text-wrap", "balance"),
    colorMix: CSS.supports("color", "color-mix(in srgb, red 50%, white)"),
    has: CSS.supports("selector(:has(a))"),
    round: CSS.supports("width", "round(10px, 1px)"),
    // Dicionário de pt-BR presente? Numa coluna estreita, palavras longas
    // hifenizadas ocupam menos linhas que sem hifenização.
    hyphenatesPtBr: (() => {
      const box = document.createElement("p")
      box.lang = "pt-BR"
      box.style.cssText =
        "width:9ch;position:absolute;visibility:hidden;font-size:16px;overflow-wrap:normal;word-break:normal"
      box.textContent = "desenvolvimento responsabilidade compartilhamento"
      document.body.append(box)
      box.style.hyphens = "manual"
      const manual = box.getBoundingClientRect().height
      box.style.hyphens = "auto"
      const auto = box.getBoundingClientRect().height
      box.remove()
      // Sem dicionário, a palavra longa transborda numa linha só; com ele, quebra.
      return auto !== manual
    })(),
  }))
  testInfo.annotations.push({ type: "suporte", description: JSON.stringify(support) })
  console.log(`[${testInfo.project.name}] ${JSON.stringify(support)}`)
  // O que o sistema exige para funcionar (o resto é refinamento progressivo).
  expect(support.colorMix).toBe(true)
  expect(support.has).toBe(true)
})
