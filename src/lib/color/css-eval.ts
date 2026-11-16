/**
 * Avaliador mínimo das variáveis de cor de `tokens.css` e `themes.css`.
 *
 * Lê os blocos de declaração, monta o mapa de variáveis de cada combinação de
 * estação e modo (bloco base + blocos que casam com a combinação, aplicados
 * por especificidade e depois por ordem, como o navegador) e resolve `var()`,
 * `color-mix(in srgb, …)`, hexadecimais, `white`, `black` e `transparent`.
 * Assim o contraste é calculado sobre o mesmo CSS que o navegador recebe.
 */
import { mixSrgb, parseHex, type Rgba } from "./color.ts"

export type Declarations = Map<string, string>

/** Bloco que vale para uma estação, um modo ou os dois ao mesmo tempo. */
export interface ThemeRule {
  /** Estação do seletor (`[data-season="x"]`) ou nulo se a regra vale para todas. */
  season: string | null
  /** Modo do seletor (`[data-mode="x"]`) ou nulo se a regra vale para todos. */
  mode: string | null
  /** Quantos atributos o seletor tem: define a especificidade. */
  attrs: number
  /** Ordem de aparição no CSS, que desempata a especificidade. */
  order: number
  decls: Declarations
}

export interface ParsedCss {
  /** Declarações que valem para todo elemento com tema (`:root, [data-season], [data-mode]`). */
  base: Declarations
  /** Blocos de estação, de modo e de combinação, na ordem em que aparecem. */
  rules: ThemeRule[]
  /** Estações declaradas (blocos só de estação), na ordem de aparição. */
  seasons: string[]
  /** Estação aplicada quando o `<html>` ainda não tem `data-season`. */
  defaultSeason: string | null
}

interface Rule {
  selector: string
  body: string
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "")
}

/** Extrai regras de primeiro nível; blocos `@media`/`@supports` são abertos recursivamente. */
function rules(css: string): Rule[] {
  const out: Rule[] = []
  let i = 0
  while (i < css.length) {
    const open = css.indexOf("{", i)
    if (open === -1) break
    const selector = css.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++
      else if (css[j] === "}") depth--
      j++
    }
    const body = css.slice(open + 1, j - 1)
    if (selector.startsWith("@media") || selector.startsWith("@supports")) {
      // Variações condicionais não entram no cálculo de tema.
    } else if (selector.startsWith("@")) {
      // @theme, @layer, @font-face etc.: ignorados.
    } else {
      out.push({ selector, body })
    }
    i = j
  }
  return out
}

function declarations(body: string): Declarations {
  const map: Declarations = new Map()
  // Divide por ";" fora de parênteses.
  let depth = 0
  let start = 0
  const parts: string[] = []
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === "(") depth++
    else if (ch === ")") depth--
    else if (ch === ";" && depth === 0) {
      parts.push(body.slice(start, i))
      start = i + 1
    }
  }
  parts.push(body.slice(start))
  for (const part of parts) {
    const idx = part.indexOf(":")
    if (idx === -1) continue
    const name = part.slice(0, idx).trim()
    if (!name.startsWith("--")) continue
    map.set(name, part.slice(idx + 1).trim())
  }
  return map
}

const SEASON_ATTR = /\[data-season=["']?([a-z0-9-]+)["']?\]/
const MODE_ATTR = /\[data-mode=["']?([a-z0-9-]+)["']?\]/
const BASE_PARTS = new Set([":root", "[data-season]", "[data-mode]"])

/** Lê o CSS de tokens e temas e separa o bloco base dos blocos de estação e modo. */
export function parseThemeCss(...sources: string[]): ParsedCss {
  const base: Declarations = new Map()
  const found: ThemeRule[] = []
  let defaultSeason: string | null = null
  let order = 0
  for (const source of sources) {
    for (const rule of rules(stripComments(source))) {
      const decls = declarations(rule.body)
      if (decls.size === 0) continue
      const parts = rule.selector.split(",").map((p) => p.trim())
      let named = false
      let isBase = false
      let firstSeason: string | null = null
      for (const part of parts) {
        const season = SEASON_ATTR.exec(part)?.[1] ?? null
        const mode = MODE_ATTR.exec(part)?.[1] ?? null
        if (season || mode) {
          named = true
          firstSeason ??= season
          found.push({
            season,
            mode,
            attrs: (season ? 1 : 0) + (mode ? 1 : 0),
            order: order++,
            decls,
          })
        } else if (BASE_PARTS.has(part)) {
          isBase = true
        }
      }
      if (named) {
        if (firstSeason && rule.selector.includes(":not([data-season])")) {
          defaultSeason ??= firstSeason
        }
      } else if (isBase) {
        for (const [k, v] of decls) base.set(k, v)
      }
    }
  }
  const seasons: string[] = []
  for (const r of found) {
    if (r.season && !r.mode && !seasons.includes(r.season)) seasons.push(r.season)
  }
  return { base, rules: found, seasons, defaultSeason }
}

/**
 * Mapa final de variáveis de uma combinação: o bloco base sobrescrito pelos
 * blocos que casam com a estação e o modo, do menos para o mais específico.
 */
export function themeDeclarations(
  parsed: ParsedCss,
  season: string,
  mode: string,
): Declarations {
  if (!parsed.seasons.includes(season)) {
    throw new Error(`Estação não encontrada no CSS: ${season}`)
  }
  const applicable = parsed.rules
    .filter(
      (r) =>
        (r.season === null || r.season === season) &&
        (r.mode === null || r.mode === mode),
    )
    .sort((a, b) => a.attrs - b.attrs || a.order - b.order)
  const out: Declarations = new Map(parsed.base)
  for (const r of applicable) for (const [k, v] of r.decls) out.set(k, v)
  return out
}

const NAMED: Record<string, Rgba> = {
  white: { r: 255, g: 255, b: 255, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  transparent: { r: 0, g: 0, b: 0, a: 0 },
}

/** Divide argumentos por vírgula de primeiro nível. */
function splitArgs(s: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === "(") depth++
    else if (ch === ")") depth--
    else if (ch === "," && depth === 0) {
      out.push(s.slice(start, i).trim())
      start = i + 1
    }
  }
  out.push(s.slice(start).trim())
  return out
}

/** Separa `cor 40%` em cor e percentual (ou nulo). */
function colorAndPercent(arg: string): [string, number | null] {
  const m = /^(.*?)\s+(-?[\d.]+)%$/.exec(arg)
  if (m?.[1] && m[2]) return [m[1].trim(), parseFloat(m[2])]
  const lead = /^(-?[\d.]+)%\s+(.*)$/.exec(arg)
  if (lead?.[1] && lead[2]) return [lead[2].trim(), parseFloat(lead[1])]
  return [arg.trim(), null]
}

/**
 * Resolve uma expressão de cor no contexto de um tema. Lança erro se a
 * expressão não for uma cor suportada ou se houver referência circular.
 */
export function resolveColor(
  expr: string,
  decls: Declarations,
  seen: Set<string> = new Set(),
): Rgba {
  const value = expr.trim()
  if (value.startsWith("#")) return parseHex(value)
  const named = NAMED[value.toLowerCase()]
  if (named) return named

  const varMatch = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec(value)
  if (varMatch?.[1]) {
    const name = varMatch[1]
    if (seen.has(name)) throw new Error(`Referência circular em ${name}`)
    const raw = decls.get(name)
    if (raw === undefined) {
      if (varMatch[2]) return resolveColor(varMatch[2], decls, seen)
      throw new Error(`Variável não definida: ${name}`)
    }
    return resolveColor(raw, decls, new Set([...seen, name]))
  }

  const mixMatch = /^color-mix\(\s*in\s+srgb\s*,(.*)\)$/s.exec(value)
  if (mixMatch?.[1] !== undefined) {
    const args = splitArgs(mixMatch[1])
    if (args.length !== 2)
      throw new Error(`color-mix com argumentos inesperados: ${value}`)
    const [c1, p1] = colorAndPercent(args[0] as string)
    const [c2, p2] = colorAndPercent(args[1] as string)
    let pa = p1
    let pb = p2
    if (pa === null && pb === null) pa = pb = 50
    else if (pa === null) pa = 100 - (pb as number)
    else if (pb === null) pb = 100 - pa
    return mixSrgb(
      resolveColor(c1, decls, seen),
      pa,
      resolveColor(c2, decls, seen),
      pb as number,
    )
  }

  throw new Error(`Expressão de cor não suportada: ${value}`)
}

/** Resolve uma variável que não é cor (número, string), seguindo `var()`. */
export function resolveRaw(
  name: string,
  decls: Declarations,
  depth = 0,
): string | undefined {
  const raw = decls.get(name)
  if (raw === undefined || depth > 20) return raw
  const m = /^var\(\s*(--[\w-]+)\s*\)$/.exec(raw.trim())
  return m?.[1] ? resolveRaw(m[1], decls, depth + 1) : raw
}
