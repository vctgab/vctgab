/**
 * Matemática de cor do design system. Sem dependências: usada pelo script
 * `tokens:build`, pelos testes e pela vitrine.
 *
 * Toda mistura é feita em sRGB codificado em gama, exatamente como
 * `color-mix(in srgb, …)` do CSS, para que o valor calculado aqui seja o
 * mesmo que o navegador pinta.
 */

/** Cor RGBA com canais de 0 a 255 e alfa de 0 a 1. */
export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

/** Converte `#rgb`, `#rgba`, `#rrggbb` ou `#rrggbbaa` em RGBA. */
export function parseHex(hex: string): Rgba {
  const match = HEX.exec(hex.trim())
  if (!match?.[1]) throw new Error(`Cor hexadecimal inválida: ${hex}`)
  let body = match[1]
  if (body.length <= 4) body = [...body].map((c) => c + c).join("")
  const n = (i: number) => parseInt(body.slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: body.length === 8 ? n(6) / 255 : 1 }
}

/** Converte RGBA em `#RRGGBB` (ou `#RRGGBBAA` se houver transparência). */
export function toHex({ r, g, b, a }: Rgba): string {
  const h = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, "0")
  const alpha = a < 1 ? h(a * 255) : ""
  return `#${h(r)}${h(g)}${h(b)}${alpha}`.toUpperCase()
}

/**
 * Mistura duas cores como `color-mix(in srgb, a pa%, b pb%)`.
 * Segue CSS Color 5: percentuais normalizados e interpolação pré-multiplicada
 * pelo alfa. O resultado não é arredondado.
 */
export function mixSrgb(a: Rgba, pa: number, b: Rgba, pb: number): Rgba {
  let p1 = pa
  let p2 = pb
  const sum = p1 + p2
  if (sum <= 0) throw new Error("color-mix sem percentuais válidos")
  let alphaMultiplier = 1
  if (sum < 100) alphaMultiplier = sum / 100
  p1 /= sum
  p2 /= sum
  const alpha = a.a * p1 + b.a * p2
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 }
  const ch = (x: number, y: number) => (x * a.a * p1 + y * b.a * p2) / alpha
  return { r: ch(a.r, b.r), g: ch(a.g, b.g), b: ch(a.b, b.b), a: alpha * alphaMultiplier }
}

/** Arredonda os canais para inteiros, como o navegador faz ao pintar. */
export function quantize(c: Rgba): Rgba {
  return { r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b), a: c.a }
}

/** Compõe uma cor com transparência sobre um fundo opaco. */
export function composite(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a
  return {
    r: top.r * a + bottom.r * (1 - a),
    g: top.g * a + bottom.g * (1 - a),
    b: top.b * a + bottom.b * (1 - a),
    a: 1,
  }
}

function linear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Luminância relativa WCAG 2.x. */
export function relativeLuminance(c: Rgba): number {
  return 0.2126 * linear(c.r) + 0.7152 * linear(c.g) + 0.0722 * linear(c.b)
}

/**
 * Razão de contraste WCAG 2.x entre duas cores. Se o primeiro plano tiver
 * transparência, é composto sobre o fundo antes do cálculo.
 */
export function contrastRatio(foreground: Rgba, background: Rgba): number {
  const bg =
    background.a < 1
      ? composite(background, { r: 255, g: 255, b: 255, a: 1 })
      : background
  const fg = foreground.a < 1 ? composite(foreground, bg) : foreground
  const l1 = relativeLuminance(quantize(fg))
  const l2 = relativeLuminance(quantize(bg))
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

/** Matiz HSL em graus (0 a 360), usada para checar a distância entre perigo e primária. */
export function hue({ r, g, b }: Rgba): number {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  if (d === 0) return 0
  let h: number
  if (max === rn) h = ((gn - bn) / d) % 6
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  h *= 60
  return h < 0 ? h + 360 : h
}

/** Distância angular entre duas matizes, de 0 a 180 graus. */
export function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}
