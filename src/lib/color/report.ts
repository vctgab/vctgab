/**
 * Relatório de tokens: resolve cada tema, calcula escalas, mapeamento
 * semântico e matriz de contraste. Usado por `scripts/tokens-build.ts`
 * (que grava o JSON e falha o build) e pelos testes.
 */
import { contrastRatio, hue, hueDistance, quantize, toHex, type Rgba } from "./color.ts"
import { parseThemeCss, resolveColor, resolveRaw, themeDeclarations } from "./css-eval.ts"
import {
  MIN_DANGER_HUE_DISTANCE,
  MINIMUM,
  NEUTRAL_STEPS,
  PAIRS,
  SCALE_NAMES,
  SCALE_STEPS,
  SEMANTIC_TOKENS,
  STEP_MIX,
  type PairKind,
} from "./pairs.ts"

export interface ScaleStep {
  step: number
  token: string
  hex: string
  mix: string
  /** Contraste contra o papel (`surface-base`). */
  vsPaper: number
  /** Contraste contra a tinta (`ink`). */
  vsInk: number
}

export interface PairResult {
  fg: string
  bg: string
  kind: PairKind
  uso: string
  min: number
  ratio: number
  pass: boolean
}

export interface ThemeReport {
  id: string
  label: string
  description: string
  colorScheme: "light" | "dark"
  /** Cor do `<meta name="theme-color">`: o papel do tema. */
  themeColor: string
  energy: number
  rotationMax: number
  seeds: Record<string, string>
  scales: Record<string, ScaleStep[]>
  neutrals: ScaleStep[]
  semantic: Record<string, string>
  pairs: PairResult[]
  dangerHueDistance: number
}

export interface TokenReport {
  defaultTheme: string
  themes: ThemeReport[]
}

export interface TokenProblem {
  theme: string
  message: string
}

const round2 = (n: number) => Math.round(n * 100) / 100

function unquote(s: string | undefined): string {
  return (s ?? "").trim().replace(/^["']|["']$/g, "")
}

/** Gera o relatório e a lista de problemas a partir do CSS de tokens e temas. */
export function buildTokenReport(...cssSources: string[]): {
  report: TokenReport
  problems: TokenProblem[]
} {
  const parsed = parseThemeCss(...cssSources)
  const problems: TokenProblem[] = []
  const themes: ThemeReport[] = []

  if (!parsed.defaultTheme) {
    problems.push({ theme: "-", message: "Nenhum tema vale para :root sem data-theme." })
  }

  for (const id of parsed.themes.keys()) {
    const decls = themeDeclarations(parsed, id)
    const color = (token: string): Rgba => resolveColor(`var(--${token})`, decls)
    const hex = (token: string) => toHex(quantize(color(token)))
    const fail = (message: string) => problems.push({ theme: id, message })

    const semantic: Record<string, string> = {}
    for (const token of SEMANTIC_TOKENS) {
      try {
        semantic[token] = hex(token)
      } catch (error) {
        fail(`Token semântico sem valor: --${token} (${(error as Error).message})`)
      }
    }

    const paper = color("surface-base")
    const ink = color("ink")
    const step = (name: string, s: number, mix: string): ScaleStep => {
      const c = color(`${name}-${s}`)
      return {
        step: s,
        token: `${name}-${s}`,
        hex: toHex(quantize(c)),
        mix,
        vsPaper: round2(contrastRatio(c, paper)),
        vsInk: round2(contrastRatio(c, ink)),
      }
    }

    const scales: Record<string, ScaleStep[]> = {}
    for (const name of SCALE_NAMES) {
      scales[name] = SCALE_STEPS.map((s) => step(name, s, STEP_MIX[s]))
    }
    const neutrals = NEUTRAL_STEPS.map((s) => step("neutral", s, "cinza + primária"))

    const pairs: PairResult[] = PAIRS.map((p) => {
      const ratio = round2(contrastRatio(color(p.fg), color(p.bg)))
      const min = MINIMUM[p.kind]
      // Arredondado para 2 casas, mas aprovado só pelo valor exato.
      const exact = contrastRatio(color(p.fg), color(p.bg))
      return { ...p, min, ratio, pass: exact >= min }
    })
    for (const p of pairs) {
      if (!p.pass)
        fail(`Contraste ${p.ratio}:1 < ${p.min}:1 em ${p.fg} sobre ${p.bg} (${p.uso})`)
    }

    const dangerHueDistance = round2(
      hueDistance(hue(color("danger-fill")), hue(color("primary-fill"))),
    )
    if (dangerHueDistance < MIN_DANGER_HUE_DISTANCE) {
      fail(
        `Perigo e primária com matizes próximas demais (${dangerHueDistance}° < ${MIN_DANGER_HUE_DISTANCE}°)`,
      )
    }

    const energy = Number(resolveRaw("--shape-energy", decls))
    const rotationMax = Number(resolveRaw("--shape-rotation-max", decls))
    if (!(energy > 0 && energy <= 2)) fail(`--shape-energy fora de (0, 2]: ${energy}`)
    if (!(rotationMax >= 0 && rotationMax < 1.5)) {
      fail(`--shape-rotation-max precisa ficar abaixo de 1,5 grau: ${rotationMax}`)
    }

    // O esquema segue o papel; o `color-scheme` declarado no CSS precisa concordar (teste).
    const colorScheme = isDark(paper) ? "dark" : "light"

    const seeds: Record<string, string> = {}
    for (const name of ["primary", ...SCALE_NAMES.slice(1)]) {
      seeds[name] = hex(`seed-${name}`)
    }

    themes.push({
      id,
      label: unquote(resolveRaw("--theme-label", decls)) || id,
      description: unquote(resolveRaw("--theme-description", decls)),
      colorScheme,
      themeColor: semantic["surface-base"] ?? "",
      energy,
      rotationMax,
      seeds,
      scales,
      neutrals,
      semantic,
      pairs,
      dangerHueDistance,
    })
  }

  return {
    report: { defaultTheme: parsed.defaultTheme ?? "", themes },
    problems,
  }
}

function isDark(c: Rgba): boolean {
  return (c.r + c.g + c.b) / 3 < 128
}
