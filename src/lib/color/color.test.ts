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
    :root, [data-theme] { --a-50: color-mix(in srgb, white 92%, var(--seed)); --x: var(--a-50); }
    :root:not([data-theme]), [data-theme="um"] { --seed: #EE2476; }
    [data-theme="dois"] { --seed: #3B7EA1; --x: var(--seed); }
    @media (min-width: 10px) { :root { --seed: #000000; } }
  `
  const parsed = parseThemeCss(css)

  it("separa o bloco base dos temas e acha o padrão", () => {
    expect([...parsed.themes.keys()]).toEqual(["um", "dois"])
    expect(parsed.defaultTheme).toBe("um")
  })

  it("resolve var() e color-mix por tema, ignorando @media", () => {
    expect(
      toHex(quantize(resolveColor("var(--x)", themeDeclarations(parsed, "um")))),
    ).toBe("#FEEDF4")
    expect(toHex(resolveColor("var(--x)", themeDeclarations(parsed, "dois")))).toBe(
      "#3B7EA1",
    )
  })

  it("acusa variável indefinida e ciclo", () => {
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

  it("aprova todos os pares obrigatórios em todos os temas", () => {
    expect(problems).toEqual([])
  })

  it("tem os quatro temas da v1 e o ipê como padrão", () => {
    expect(report.themes.map((t) => t.id)).toEqual([
      "ipe",
      "noturno",
      "outono",
      "inverno",
    ])
    expect(report.defaultTheme).toBe("ipe")
  })

  it("mantém a escala do rosa no tema padrão", () => {
    const ipe = report.themes.find((t) => t.id === "ipe")
    const hexes = ipe?.scales.primary?.map((s) => s.hex)
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

  it("garante tinta com pelo menos 12:1 sobre o papel em cada tema", () => {
    for (const t of report.themes) {
      const pair = t.pairs.find((p) => p.fg === "ink" && p.bg === "surface-base")
      expect(pair?.ratio).toBeGreaterThanOrEqual(12)
    }
  })

  it("declara color-scheme coerente com o papel de cada tema", () => {
    const themesCss = sources[1] ?? ""
    for (const t of report.themes) {
      const block = new RegExp(`\\[data-theme="${t.id}"\\][^{]*\\{([^}]*)\\}`).exec(
        themesCss,
      )?.[1]
      expect(`${t.id}: ${block}`).toContain(`color-scheme: ${t.colorScheme};`)
    }
  })

  it("tem o JSON gerado em dia com o CSS (rode pnpm tokens:build)", () => {
    const committed = readFileSync("src/styles/tokens.generated.json", "utf8")
    expect(JSON.parse(committed)).toEqual(JSON.parse(JSON.stringify(report)))
  })
})
