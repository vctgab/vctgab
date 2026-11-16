import { readFileSync } from "node:fs"
import {
  contrastRatio,
  hue,
  hueDistance,
  mixSrgb,
  parseHex,
  quantize,
  toHex,
} from "./color"
import { parseThemeCss, resolveColor, themeDeclarations } from "./css-eval"
import { buildTokenReport } from "./report"

const white = parseHex("#ffffff")
const black = parseHex("#000000")
const rosa = parseHex("#EE2476")

describe("color", () => {
  it("lê e escreve hexadecimais curtos e longos", () => {
    expect(toHex(parseHex("#abc"))).toBe("#AABBCC")
    expect(toHex(parseHex("#EE2476"))).toBe("#EE2476")
    expect(parseHex("#00000080").a).toBeCloseTo(0.5, 2)
  })

  it("mistura em sRGB como color-mix", () => {
    expect(toHex(quantize(mixSrgb(white, 92, rosa, 8)))).toBe("#FEEDF4")
    expect(toHex(quantize(mixSrgb(black, 12, rosa, 88)))).toBe("#D12068")
    expect(toHex(quantize(mixSrgb(black, 78, rosa, 22)))).toBe("#34081A")
  })

  it("calcula contraste WCAG com os valores de referência do briefing", () => {
    expect(contrastRatio(rosa, white)).toBeCloseTo(4.08, 2)
    expect(contrastRatio(white, parseHex("#D12068"))).toBeCloseTo(5.1, 1)
    expect(contrastRatio(white, parseHex("#AB1A55"))).toBeCloseTo(6.98, 1)
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5)
  })

  it("mede a distância de matiz", () => {
    expect(hue(parseHex("#ff0000"))).toBe(0)
    expect(hueDistance(350, 10)).toBe(20)
  })
})

describe("css-eval", () => {
  const css = `
    :root, [data-season], [data-mode] { --a-50: color-mix(in srgb, white 92%, var(--seed)); --x: var(--a-50); --paper: white; }
    :root:not([data-season]), [data-season="um"] { --seed: #EE2476; }
    [data-season="dois"] { --seed: #3B7EA1; --x: var(--seed); }
    [data-mode="escuro"] { --paper: black; --x: var(--paper); }
    [data-season="um"][data-mode="escuro"] { --x: #123456; }
    @media (min-width: 10px) { :root { --seed: #000000; } }
  `
  const parsed = parseThemeCss(css)
  const hex = (season: string, mode: string, expr = "var(--x)") =>
    toHex(quantize(resolveColor(expr, themeDeclarations(parsed, season, mode))))

  it("separa o bloco base das estações e acha a padrão", () => {
    expect(parsed.seasons).toEqual(["um", "dois"])
    expect(parsed.defaultSeason).toBe("um")
  })

  it("resolve var() e color-mix por estação, ignorando @media", () => {
    expect(hex("um", "claro")).toBe("#FEEDF4")
    expect(hex("dois", "claro")).toBe("#3B7EA1")
  })

  it("aplica o modo e depois a combinação, por especificidade e ordem", () => {
    expect(hex("dois", "escuro")).toBe("#000000")
    expect(hex("um", "escuro")).toBe("#123456")
    expect(hex("um", "escuro", "var(--paper)")).toBe("#000000")
  })

  it("acusa estação inexistente, variável indefinida e ciclo", () => {
    expect(() => themeDeclarations(parsed, "tres", "claro")).toThrow()
    expect(() => resolveColor("var(--nada)", new Map())).toThrow()
    expect(() => resolveColor("var(--a)", new Map([["--a", "var(--a)"]]))).toThrow()
  })
})

describe("tokens (VI-05, CR-01)", () => {
  const sources = [
    readFileSync("src/styles/tokens.css", "utf8"),
    readFileSync("src/styles/themes.css", "utf8"),
  ]
  const { report, problems } = buildTokenReport(...sources)

  it("aprova todos os pares obrigatórios nas 8 combinações", () => {
    expect(problems).toEqual([])
  })

  it("tem as quatro estações em dois modos e a primavera clara como padrão", () => {
    expect(report.seasons).toEqual(["primavera", "verao", "outono", "inverno"])
    expect(report.themes.map((t) => t.id)).toEqual([
      "primavera-claro",
      "primavera-escuro",
      "verao-claro",
      "verao-escuro",
      "outono-claro",
      "outono-escuro",
      "inverno-claro",
      "inverno-escuro",
    ])
    expect(report.defaultSeason).toBe("primavera")
    expect(report.defaultMode).toBe("claro")
  })

  it("mantém a escala do rosa na primavera clara", () => {
    const primavera = report.themes.find((t) => t.id === "primavera-claro")
    const hexes = primavera?.scales.primary?.map((s) => s.hex)
    // 300 é #F792BB: 50% de branco dá canais em ,5 e o navegador arredonda para cima.
    expect(hexes).toEqual([
      "#FEEDF4",
      "#FCDCE9",
      "#FAB9D3",
      "#F792BB",
      "#F25B98",
      "#EE2476",
      "#D12068",
      "#AB1A55",
      "#831441",
      "#5A0E2D",
      "#34081A",
    ])
  })

  it("dá ao verde do verão um passo 600 com 5,0:1 contra o branco", () => {
    const verao = report.themes.find((t) => t.id === "verao-claro")
    expect(verao?.scales.primary?.find((s) => s.step === 600)?.hex).toBe("#108045")
    const pair = verao?.pairs.find(
      (p) => p.fg === "on-primary" && p.bg === "primary-fill",
    )
    expect(pair?.ratio).toBeGreaterThanOrEqual(5)
  })

  it("afasta a matiz do sucesso da primária em todas as combinações", () => {
    for (const t of report.themes) {
      expect(`${t.id}: ${t.successHueDistance >= 25}`).toBe(`${t.id}: true`)
    }
  })

  it("garante tinta com pelo menos 12:1 sobre o papel em cada combinação", () => {
    for (const t of report.themes) {
      const pair = t.pairs.find((p) => p.fg === "ink" && p.bg === "surface-base")
      expect(pair?.ratio).toBeGreaterThanOrEqual(12)
    }
  })

  it("declara color-scheme coerente com o papel de cada modo", () => {
    const tokensCss = sources[0] ?? ""
    const themesCss = sources[1] ?? ""
    const base =
      /:root,\s*\[data-season\],\s*\[data-mode\]\s*\{[\s\S]*?color-scheme: (\w+);/.exec(
        tokensCss,
      )?.[1]
    const dark = /\[data-mode="escuro"\]\s*\{[^}]*?color-scheme: (\w+);/.exec(
      themesCss,
    )?.[1]
    expect(base).toBe("light")
    expect(dark).toBe("dark")
    for (const t of report.themes) {
      expect(`${t.id}: ${t.colorScheme}`).toBe(
        `${t.id}: ${t.mode === "escuro" ? "dark" : "light"}`,
      )
    }
  })

  it("tem o JSON gerado em dia com o CSS (rode pnpm tokens:build)", () => {
    const committed = readFileSync("src/styles/tokens.generated.json", "utf8")
    expect(JSON.parse(committed)).toEqual(JSON.parse(JSON.stringify(report)))
    const slim = JSON.parse(readFileSync("src/styles/themes.generated.json", "utf8")) as {
      defaultSeason: string
      defaultMode: string
      seasons: { id: string }[]
      themes: { id: string; themeColor: string }[]
    }
    expect(slim.defaultSeason).toBe(report.defaultSeason)
    expect(slim.defaultMode).toBe(report.defaultMode)
    expect(slim.seasons.map((x) => x.id)).toEqual(report.seasons)
    expect(slim.themes.map((t) => [t.id, t.themeColor])).toEqual(
      report.themes.map((t) => [t.id, t.themeColor]),
    )
  })
})
