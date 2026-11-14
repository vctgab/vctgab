/**
 * Motor de formas irregulares. Puro, determinístico e memoizado.
 * Ficha: docs/specs/motor-de-formas.md
 */
import { createRandom, type Random, type Seed } from "./prng"
import { catmullRomPath, clamp, polygonPath, r4, type Point } from "./path"
import { dcos, dsin, TAU } from "./trig"

export type ShapeKind = "blob" | "wobblyRect" | "pill" | "tornEdge" | "handLine" | "hole"
export type ShapeBucket = "sm" | "md" | "lg" | "xl"
export type TornSide = "top" | "right" | "bottom" | "left"

export const SHAPE_KINDS: readonly ShapeKind[] = [
  "blob",
  "wobblyRect",
  "pill",
  "tornEdge",
  "handLine",
  "hole",
]
export const SHAPE_BUCKETS: readonly ShapeBucket[] = ["sm", "md", "lg", "xl"]

export interface ShapeOptions {
  kind: ShapeKind
  seed: Seed
  /** Tamanho aproximado do elemento; define pontos e amplitude. Padrão `md`. */
  bucket?: ShapeBucket
  /** 0 (quase reto) a 1 (bem torto). Padrão 0,5. */
  irregularity?: number
  /** Quantidade de pontos; padrão vem do bucket. */
  points?: number
  /** `false` desliga a rotação; um número define a rotação máxima em graus (padrão 1,2). */
  rotation?: boolean | number
  /** Variante de ruído: `f` (preenchimento) ou `o` (contorno). Mesmos raios, ruído diferente. */
  variant?: "f" | "o"
  /** Só `tornEdge`: lados rasgados. */
  edges?: readonly TornSide[]
  /** Só `handLine`: número de ondas regulares (divisor ondulado). */
  waves?: number
}

export interface ShapeResult {
  kind: ShapeKind
  /** Atributo `d` normalizado de 0 a 1. */
  path: string
  /** Pontos de controle normalizados (para morph e testes). */
  points: Point[]
  closed: boolean
  /** 8 valores de `border-radius` para o hospedeiro (foco e alto contraste). */
  borderRadius: string
  /** Rotação de −1 a 1; o CSS multiplica por `--shape-rotation-max`. */
  rotation: number
  /** Rotação em graus com o máximo padrão ou o pedido. */
  rotationDeg: number
  /** Desalinhamento do preenchimento em pixels inteiros (multiplicado pela energia do tema). */
  offset: { x: number; y: number }
}

interface BucketSpec {
  w: number
  h: number
  points: number
  amp: number
  rMin: number
  rMax: number
  knots: number
}

/** Tamanhos nominais: convertem pixels em unidades normalizadas sem medir o elemento. */
export const BUCKETS: Record<ShapeBucket, BucketSpec> = {
  sm: { w: 140, h: 44, points: 16, amp: 1.4, rMin: 6, rMax: 11, knots: 5 },
  md: { w: 320, h: 56, points: 22, amp: 2, rMin: 7, rMax: 13, knots: 7 },
  lg: { w: 360, h: 240, points: 30, amp: 2.8, rMin: 9, rMax: 18, knots: 8 },
  xl: { w: 960, h: 420, points: 44, amp: 4, rMin: 12, rMax: 24, knots: 11 },
}

/** Amplitude máxima em pixels de cada bucket (o padding de segurança precisa superá-la). */
export function maxAmplitude(bucket: ShapeBucket): number {
  return BUCKETS[bucket].amp * 2
}

/** Ruído 1D suave e periódico em [−1, 1], só com aritmética básica. */
function periodicNoise(rand: Random, knots: number): (t: number) => number {
  const values = Array.from({ length: knots }, () => rand.signed())
  return (t: number) => {
    const u = (((t % 1) + 1) % 1) * knots
    const i = Math.floor(u)
    const f = u - i
    const a = values[i % knots] as number
    const b = values[(i + 1) % knots] as number
    const s = f * f * (3 - 2 * f)
    return a + (b - a) * s
  }
}

/** Ruído 1D suave não periódico (linhas abertas). */
function openNoise(rand: Random, knots: number): (t: number) => number {
  const values = Array.from({ length: knots + 1 }, () => rand.signed())
  return (t: number) => {
    const u = clamp(t, 0, 1) * knots
    const i = Math.min(knots - 1, Math.floor(u))
    const f = u - i
    const a = values[i] as number
    const b = values[i + 1] as number
    const s = f * f * (3 - 2 * f)
    return a + (b - a) * s
  }
}

function irregularityOf(o: ShapeOptions): number {
  return clamp(o.irregularity ?? 0.5, 0, 1)
}

/* ---------- retângulo torto e cápsula ---------- */

interface PerimeterSample {
  p: Point
  n: Point
}

function roundedRectSamples(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  radii: readonly [number, number, number, number],
  total: number,
): PerimeterSample[] {
  const [rTL, rTR, rBR, rBL] = radii
  const cornerPts = total < 20 ? 2 : 3
  const edgeBudget = Math.max(4, total - cornerPts * 4)
  const edges = [
    {
      len: x1 - rTR - (x0 + rTL),
      from: { x: x0 + rTL, y: y0 },
      dir: { x: 1, y: 0 },
      n: { x: 0, y: -1 },
    },
    {
      len: y1 - rBR - (y0 + rTR),
      from: { x: x1, y: y0 + rTR },
      dir: { x: 0, y: 1 },
      n: { x: 1, y: 0 },
    },
    {
      len: x1 - rBR - (x0 + rBL),
      from: { x: x1 - rBR, y: y1 },
      dir: { x: -1, y: 0 },
      n: { x: 0, y: 1 },
    },
    {
      len: y1 - rBL - (y0 + rTL),
      from: { x: x0, y: y1 - rBL },
      dir: { x: 0, y: -1 },
      n: { x: -1, y: 0 },
    },
  ]
  const totalLen = edges.reduce((s, e) => s + Math.max(0, e.len), 0) || 1
  const corners = [
    { cx: x1 - rTR, cy: y0 + rTR, r: rTR, a0: -TAU / 4 },
    { cx: x1 - rBR, cy: y1 - rBR, r: rBR, a0: 0 },
    { cx: x0 + rBL, cy: y1 - rBL, r: rBL, a0: TAU / 4 },
    { cx: x0 + rTL, cy: y0 + rTL, r: rTL, a0: TAU / 2 },
  ]
  const out: PerimeterSample[] = []
  edges.forEach((edge, i) => {
    const len = Math.max(0, edge.len)
    const count = Math.max(1, Math.round((edgeBudget * len) / totalLen))
    for (let k = 0; k < count; k++) {
      const t = (k / count) * len
      out.push({
        p: { x: edge.from.x + edge.dir.x * t, y: edge.from.y + edge.dir.y * t },
        n: edge.n,
      })
    }
    const c = corners[i] as (typeof corners)[number]
    for (let k = 0; k < cornerPts; k++) {
      const a = c.a0 + ((k + 0.5) / cornerPts) * (TAU / 4)
      const nx = dcos(a)
      const ny = dsin(a)
      out.push({ p: { x: c.cx + nx * c.r, y: c.cy + ny * c.r }, n: { x: nx, y: ny } })
    }
  })
  return out
}

function rectLike(
  o: ShapeOptions,
  pill: boolean,
): Omit<ShapeResult, "rotation" | "rotationDeg" | "offset"> {
  const spec = BUCKETS[o.bucket ?? "md"]
  const irr = irregularityOf(o)
  const amp = spec.amp * irr * 2 * (pill ? 0.7 : 1)
  const inset = amp * 1.25 + 0.75
  const { w, h } = spec
  const x0 = inset
  const y0 = inset
  const x1 = w - inset
  const y1 = h - inset
  const maxR = Math.min((x1 - x0) / 2, (y1 - y0) / 2)
  const radiusRand = createRandom(`${o.seed}:r`)
  const radius = () =>
    pill
      ? maxR * radiusRand.range(0.92, 1)
      : Math.min(maxR, radiusRand.range(spec.rMin, spec.rMax))
  const radii = [radius(), radius(), radius(), radius()] as const

  const rand = createRandom(`${o.seed}:${o.variant ?? "f"}`)
  const noise = periodicNoise(rand, spec.knots)
  const total = clamp(Math.round(o.points ?? spec.points), 8, 120)
  const samples = roundedRectSamples(x0, y0, x1, y1, radii, total)
  const points = samples.map((s, i) => {
    const t = i / samples.length
    const d = amp * (noise(t) * 0.85 + rand.signed() * 0.15)
    return {
      x: clamp(s.p.x + s.n.x * d, 0, w) / w,
      y: clamp(s.p.y + s.n.y * d, 0, h) / h,
    }
  })

  // border-radius com leve assimetria horizontal/vertical, como traço à mão.
  const v = radii.map((r) => r4(r * radiusRand.range(0.8, 1.2)))
  const hr = radii.map((r) => r4(pill ? r * radiusRand.range(1.1, 1.6) : r))
  const borderRadius = `${hr.map((x) => `${x}px`).join(" ")} / ${v.map((x) => `${x}px`).join(" ")}`

  return {
    kind: pill ? "pill" : "wobblyRect",
    path: catmullRomPath(points, true, 1, { x: w, y: h }),
    points,
    closed: true,
    borderRadius,
  }
}

/* ---------- blob e furo ---------- */

function blobLike(
  o: ShapeOptions,
  hole: boolean,
): Omit<ShapeResult, "rotation" | "rotationDeg" | "offset"> {
  const spec = BUCKETS[o.bucket ?? "md"]
  const irr = clamp(o.irregularity ?? (hole ? 0.25 : 0.5), 0, 1)
  const total = clamp(
    Math.round(o.points ?? (hole ? 8 : Math.max(8, Math.round(spec.points / 2)))),
    5,
    120,
  )
  const rand = createRandom(`${o.seed}:${o.variant ?? "f"}`)
  const noise = periodicNoise(rand, hole ? 3 : 5)
  const radii: number[] = []
  const angles: number[] = []
  for (let i = 0; i < total; i++) {
    const t = i / total
    angles.push(t * TAU + rand.signed() * (TAU / total) * 0.18)
    radii.push(1 + irr * 0.38 * noise(t) + irr * 0.06 * rand.signed())
  }
  const maxR = Math.max(...radii)
  const scale = 0.495 / maxR
  const points = radii.map((r, i) => ({
    x: 0.5 + dcos(angles[i] as number) * r * scale,
    y: 0.5 + dsin(angles[i] as number) * r * scale,
  }))
  const pct = () => Math.round(rand.range(38, 62))
  const borderRadius = `${pct()}% ${pct()}% ${pct()}% ${pct()}% / ${pct()}% ${pct()}% ${pct()}% ${pct()}%`
  return {
    kind: hole ? "hole" : "blob",
    path: catmullRomPath(points, true),
    points,
    closed: true,
    borderRadius,
  }
}

/* ---------- papel rasgado ---------- */

function tornEdge(
  o: ShapeOptions,
): Omit<ShapeResult, "rotation" | "rotationDeg" | "offset"> {
  const bucket = o.bucket ?? "md"
  const spec = BUCKETS[bucket]
  const irr = irregularityOf(o)
  const { w, h } = spec
  const edges = new Set<TornSide>(
    o.edges ?? (bucket === "sm" ? ["left", "right"] : ["bottom"]),
  )
  const rand = createRandom(`${o.seed}:${o.variant ?? "f"}`)
  const depthMax = 1.5 + 3 * irr * 2 * (bucket === "sm" ? 0.6 : 1)
  const wobble = 0.35

  const side = (from: Point, to: Point, torn: boolean, inward: Point): Point[] => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const pts: Point[] = []
    if (!torn) {
      const steps = Math.max(2, Math.round(len / 60))
      for (let k = 0; k < steps; k++) {
        const t = k / steps
        const j = rand.signed() * wobble
        pts.push({
          x: from.x + dx * t + inward.x * Math.abs(j),
          y: from.y + dy * t + inward.y * Math.abs(j),
        })
      }
      return pts
    }
    let t = 0
    let up = true
    while (t < len) {
      const depth = up ? rand.range(0.2, 0.5) * depthMax : rand.range(0.7, 1) * depthMax
      const micro = rand.signed() * 0.35
      const u = t / len
      pts.push({
        x: from.x + dx * u + inward.x * (depth + micro),
        y: from.y + dy * u + inward.y * (depth + micro),
      })
      t += rand.range(3, 7)
      up = !up
    }
    return pts
  }

  const raw = [
    ...side({ x: 0, y: 0 }, { x: w, y: 0 }, edges.has("top"), { x: 0, y: 1 }),
    ...side({ x: w, y: 0 }, { x: w, y: h }, edges.has("right"), { x: -1, y: 0 }),
    ...side({ x: w, y: h }, { x: 0, y: h }, edges.has("bottom"), { x: 0, y: -1 }),
    ...side({ x: 0, y: h }, { x: 0, y: 0 }, edges.has("left"), { x: 1, y: 0 }),
  ]
  const points = raw.map((p) => ({ x: clamp(p.x, 0, w) / w, y: clamp(p.y, 0, h) / h }))
  const borderRadius = "2px 3px 2px 3px / 3px 2px 3px 2px"
  return {
    kind: "tornEdge",
    path: polygonPath(points),
    points,
    closed: true,
    borderRadius,
  }
}

/* ---------- traço à mão ---------- */

function handLine(
  o: ShapeOptions,
): Omit<ShapeResult, "rotation" | "rotationDeg" | "offset"> {
  const spec = BUCKETS[o.bucket ?? "md"]
  const irr = irregularityOf(o)
  const total = clamp(
    Math.round(o.points ?? Math.max(6, Math.round(spec.points / 2))),
    3,
    120,
  )
  const rand = createRandom(`${o.seed}:${o.variant ?? "f"}`)
  const noise = openNoise(rand, 3 + Math.round(irr * 3))
  const waves = o.waves ?? 0
  const waveAmp = waves > 0 ? 0.18 : 0
  const amp = 0.08 + irr * 0.22
  const points: Point[] = []
  for (let i = 0; i < total; i++) {
    const t = i / (total - 1)
    const jitterX = i === 0 || i === total - 1 ? 0 : rand.signed() * (0.3 / total)
    const y = 0.5 + amp * noise(t) + (waves > 0 ? waveAmp * dsin(t * TAU * waves) : 0)
    points.push({ x: clamp(t + jitterX, 0, 1), y: clamp(y, 0.04, 0.96) })
  }
  return {
    kind: "handLine",
    path: catmullRomPath(points, false, 1, { x: spec.w, y: spec.h * 0.3 }),
    points,
    closed: false,
    borderRadius: "0",
  }
}

/* ---------- API pública ---------- */

const cache = new Map<string, ShapeResult>()
const CACHE_LIMIT = 800

function cacheKey(o: ShapeOptions): string {
  return JSON.stringify([
    o.kind,
    String(o.seed),
    o.bucket ?? "md",
    o.irregularity ?? null,
    o.points ?? null,
    o.rotation ?? true,
    o.variant ?? "f",
    o.edges ?? null,
    o.waves ?? null,
  ])
}

/**
 * Gera uma forma irregular determinística. Mesmas opções, mesmo resultado,
 * no servidor e no cliente.
 */
export function generateShape(options: ShapeOptions): ShapeResult {
  const key = cacheKey(options)
  const hit = cache.get(key)
  if (hit) return hit

  let base: Omit<ShapeResult, "rotation" | "rotationDeg" | "offset">
  switch (options.kind) {
    case "blob":
      base = blobLike(options, false)
      break
    case "hole":
      base = blobLike(options, true)
      break
    case "wobblyRect":
      base = rectLike(options, false)
      break
    case "pill":
      base = rectLike(options, true)
      break
    case "tornEdge":
      base = tornEdge(options)
      break
    case "handLine":
      base = handLine(options)
      break
  }

  const extras = createRandom(`${options.seed}:extra`)
  const rotation = options.rotation === false ? 0 : r4(extras.signed())
  const maxDeg =
    typeof options.rotation === "number" ? clamp(options.rotation, 0, 1.49) : 1.2
  const maxOffset = (options.bucket ?? "md") === "sm" ? 2 : 3
  const offsetAxis = () => (extras.next() < 0.5 ? -1 : 1) * extras.int(1, maxOffset)
  const result: ShapeResult = Object.freeze({
    ...base,
    rotation,
    rotationDeg: r4(rotation * maxDeg),
    offset: { x: offsetAxis(), y: offsetAxis() },
  })

  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
  cache.set(key, result)
  return result
}

/** Gera o par preenchimento + contorno da mesma seed (mesmos raios, ruídos diferentes). */
export function generateShapePair(options: Omit<ShapeOptions, "variant">): {
  fill: ShapeResult
  outline: ShapeResult
} {
  return {
    fill: generateShape({ ...options, variant: "f" }),
    outline: generateShape({ ...options, variant: "o" }),
  }
}

/** Esvazia o cache (testes de determinismo sem memoização). */
export function clearShapeCache(): void {
  cache.clear()
}
