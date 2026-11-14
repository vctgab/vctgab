/** Pontos, curvas e serialização de caminhos SVG normalizados (0 a 1). */

export interface Point {
  x: number
  y: number
}

/** Arredonda para 4 casas (0,1 px num bucket xl): caminhos curtos e estáveis. */
export function r4(n: number): number {
  return Math.round(n * 10000) / 10000
}

const num = (n: number) => String(r4(n))

/**
 * Converte pontos em curvas Bézier cúbicas por uma spline cardinal com
 * tangentes proporcionais ao comprimento de cada trecho. Diferente do
 * Catmull-Rom uniforme, não faz laços nem dobras quando trechos longos
 * (bordas) encontram trechos curtos (cantos).
 *
 * `scale` converte as coordenadas normalizadas para pixels nominais antes
 * de medir distâncias, para que o aspecto do elemento não distorça as
 * tangentes. `tension` 1 é o padrão; menos que 1 deixa a curva mais tensa.
 */
export function catmullRomPath(
  points: readonly Point[],
  closed: boolean,
  tension = 1,
  scale: Point = { x: 1, y: 1 },
): string {
  const n = points.length
  if (n < 2) return ""
  const at = (i: number): Point => {
    if (closed) return points[((i % n) + n) % n] as Point
    return points[Math.max(0, Math.min(n - 1, i))] as Point
  }
  const dist = (a: Point, b: Point) => {
    const dx = (b.x - a.x) * scale.x
    const dy = (b.y - a.y) * scale.y
    return Math.sqrt(dx * dx + dy * dy)
  }
  const first = at(0)
  let d = `M${num(first.x)} ${num(first.y)}`
  const segments = closed ? n : n - 1
  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const d01 = dist(p0, p1)
    const d12 = dist(p1, p2)
    const d23 = dist(p2, p3)
    // Fator da tangente: comprimento do trecho atual sobre a soma dos vizinhos.
    const k1 = d01 + d12 > 0 ? ((d12 / (d01 + d12)) * tension) / 3 : 0
    const k2 = d12 + d23 > 0 ? ((d12 / (d12 + d23)) * tension) / 3 : 0
    const c1x = p1.x + (p2.x - p0.x) * k1
    const c1y = p1.y + (p2.y - p0.y) * k1
    const c2x = p2.x - (p3.x - p1.x) * k2
    const c2y = p2.y - (p3.y - p1.y) * k2
    d += `C${num(c1x)} ${num(c1y)} ${num(c2x)} ${num(c2y)} ${num(p2.x)} ${num(p2.y)}`
  }
  return closed ? `${d}Z` : d
}

/** Polígono de segmentos retos (papel rasgado). */
export function polygonPath(points: readonly Point[], closed = true): string {
  if (points.length === 0) return ""
  const [first, ...rest] = points as [Point, ...Point[]]
  let d = `M${num(first.x)} ${num(first.y)}`
  for (const p of rest) d += `L${num(p.x)} ${num(p.y)}`
  return closed ? `${d}Z` : d
}

/** Limita um valor a [min, max]. */
export function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n
}

/** Interpola linearmente dois conjuntos de pontos de mesma contagem. */
export function lerpPoints(a: readonly Point[], b: readonly Point[], t: number): Point[] {
  return a.map((p, i) => {
    const q = b[i] ?? p
    return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t }
  })
}

/**
 * Valida um caminho gerado pelo motor: só `M`, `C`, `L`, `Z` com a contagem
 * certa de números finitos. Usado nos testes.
 */
export function isValidPath(d: string): boolean {
  const tokens = d.match(/[MCLZ]|-?\d*\.?\d+(?:e-?\d+)?/g)
  if (!tokens || tokens[0] !== "M") return false
  const arity: Record<string, number> = { M: 2, L: 2, C: 6, Z: 0 }
  let i = 0
  while (i < tokens.length) {
    const cmd = tokens[i] as string
    const n = arity[cmd]
    if (n === undefined) return false
    i++
    for (let j = 0; j < n; j++, i++) {
      const v = Number(tokens[i])
      if (tokens[i] === undefined || !Number.isFinite(v)) return false
    }
  }
  return true
}
