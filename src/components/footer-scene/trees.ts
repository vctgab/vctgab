/**
 * Geometria da cena do rodapé, num viewBox fixo de 1200 × 200 (base em
 * y = 200). Tudo determinístico pela seed: pinheiros de camadas
 * irregulares, copas `blob`, lua, estrelas, folhas e flocos.
 */
import { catmullRomPath, createRandom, generateShape, type Point } from "@/lib/shapes"

export const SCENE_W = 1200
export const SCENE_H = 200

const n = (v: number) => Math.round(v * 10) / 10

export interface Pine {
  x: number
  height: number
  width: number
}

export interface PlaneGeometry {
  /** Caminho de todos os pinheiros do plano. */
  pines: string
  /** Neve no topo de cada pinheiro. */
  snow: string
  /** Pinheiros (para ancorar extras). */
  list: Pine[]
}

const PLANES = [
  { count: 15, hMin: 70, hMax: 110, wRatio: 0.5 },
  { count: 12, hMin: 95, hMax: 140, wRatio: 0.55 },
  { count: 9, hMin: 120, hMax: 175, wRatio: 0.6 },
] as const

/** Pinheiro: 3 ou 4 camadas de triângulos com vértices deslocados, mais o tronco. */
function pinePath(p: Pine, seed: string): { body: string; snow: string } {
  const rand = createRandom(seed)
  const tiers = rand.int(3, 4)
  const top = SCENE_H - p.height
  const trunkH = p.height * 0.12
  const crownH = p.height - trunkH
  const tierH = (crownH / tiers) * 1.45
  let body = ""
  let snow = ""
  for (let i = 0; i < tiers; i++) {
    const apexY = top + (i * crownH) / tiers - (i === 0 ? 0 : tierH * 0.18)
    const baseY = Math.min(SCENE_H - trunkH, apexY + tierH)
    const half = (p.width / 2) * (0.55 + (0.45 * (i + 1)) / tiers)
    const j = () => rand.signed() * 2.5
    const ax = p.x + j()
    body += `M${n(ax)} ${n(apexY + j() * 0.4)}L${n(p.x + half + j())} ${n(baseY + j())}L${n(p.x + half * 0.3 + j())} ${n(baseY - 2 + j())}L${n(p.x - half * 0.35 + j())} ${n(baseY - 1 + j())}L${n(p.x - half + j())} ${n(baseY + j())}Z`
    if (i === 0) {
      const sy = apexY + tierH * 0.3
      const sh = half * 0.36
      snow = `M${n(ax)} ${n(apexY)}L${n(p.x + sh)} ${n(sy)}L${n(p.x + sh * 0.2)} ${n(sy - 3)}L${n(p.x - sh * 0.4)} ${n(sy + 1)}L${n(p.x - sh)} ${n(sy - 1)}Z`
    }
  }
  const tw = Math.max(4, p.width * 0.09)
  body += `M${n(p.x - tw / 2)} ${SCENE_H}L${n(p.x - tw / 2)} ${n(SCENE_H - trunkH - 2)}L${n(p.x + tw / 2)} ${n(SCENE_H - trunkH - 2)}L${n(p.x + tw / 2)} ${SCENE_H}Z`
  return { body, snow }
}

/** Três planos de pinheiros; o 0 é o do fundo. */
export function planes(seed: string): PlaneGeometry[] {
  return PLANES.map((spec, plane) => {
    const rand = createRandom(`${seed}:plano-${plane}`)
    const gap = SCENE_W / spec.count
    const list: Pine[] = Array.from({ length: spec.count }, (_, i) => {
      const height = rand.range(spec.hMin, spec.hMax)
      return {
        x: gap * (i + 0.5) + rand.signed() * gap * 0.35,
        height,
        width: height * spec.wRatio * rand.range(0.85, 1.1),
      }
    })
    let pines = ""
    let snow = ""
    list.forEach((p, i) => {
      const path = pinePath(p, `${seed}:pinheiro-${plane}-${i}`)
      pines += path.body
      snow += path.snow
    })
    return { pines, snow, list }
  })
}

/** Copa redonda: blob do motor posicionado no viewBox da cena. */
export function canopy(seed: string, cx: number, cy: number, r: number): string {
  const blob = generateShape({ kind: "blob", seed, points: 9, irregularity: 0.45 })
  const pts: Point[] = blob.points.map((p) => ({
    x: cx + (p.x - 0.5) * 2 * r,
    y: cy + (p.y - 0.5) * 2 * r * 0.85,
  }))
  return catmullRomPath(pts, true)
}

/** Ipê: tronco torto e copa florida em três blobs. */
export function ipe(seed: string): { trunk: string; crown: string } {
  const x = 1010
  const trunk = `M${x - 5} 200L${x - 3} 150L${x - 14} 122L${x - 9} 120L${x + 1} 140L${x + 6} 112L${x + 11} 114L${x + 5} 150L${x + 7} 200Z`
  const crown = [
    canopy(`${seed}:ipe-a`, x - 22, 112, 34),
    canopy(`${seed}:ipe-b`, x + 18, 104, 38),
    canopy(`${seed}:ipe-c`, x - 2, 86, 30),
  ].join("")
  return { trunk, crown }
}

/** Árvores de copa redonda com tronco, na frente da cena (outono). */
export function autumnTrees(seed: string): { trunks: string; crowns: string } {
  const rand = createRandom(`${seed}:outono`)
  let trunks = ""
  let crowns = ""
  for (let i = 0; i < 6; i++) {
    const x = 90 + i * 200 + rand.signed() * 40
    const h = rand.range(70, 110)
    const r = rand.range(24, 34)
    const top = SCENE_H - h
    trunks += `M${n(x - 3)} ${SCENE_H}L${n(x - 2)} ${n(top + r)}L${n(x + 3)} ${n(top + r)}L${n(x + 4)} ${SCENE_H}Z`
    crowns += canopy(`${seed}:copa-${i}`, x, top + r * 0.6, r)
  }
  return { trunks, crowns }
}

/** Flores do ipê: pontos claros espalhados pela copa. */
export function ipeBlossoms(seed: string): string {
  const rand = createRandom(`${seed}:flores`)
  let d = ""
  for (let i = 0; i < 22; i++) {
    const x = 1010 + rand.signed() * 44
    const y = 100 + rand.signed() * 22
    const r = rand.range(1.6, 3)
    d += `M${n(x - r)} ${n(y)}a${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0Z`
  }
  return d
}

export interface Dot {
  x: number
  y: number
  r: number
  delay: number
  duration: number
}

/** Estrelas de quatro pontas espalhadas no céu. */
export function stars(seed: string): string {
  const rand = createRandom(`${seed}:estrelas`)
  let d = ""
  for (let i = 0; i < 26; i++) {
    const x = rand.range(20, SCENE_W - 20)
    const y = rand.range(8, 70)
    const s = rand.range(1.5, 3.5)
    d += `M${n(x)} ${n(y - s)}L${n(x + s * 0.3)} ${n(y - s * 0.3)}L${n(x + s)} ${n(y)}L${n(x + s * 0.3)} ${n(y + s * 0.3)}L${n(x)} ${n(y + s)}L${n(x - s * 0.3)} ${n(y + s * 0.3)}L${n(x - s)} ${n(y)}L${n(x - s * 0.3)} ${n(y - s * 0.3)}Z`
  }
  return d
}

/** Lua crescente: dois arcos. */
export function moon(): string {
  return "M1090 22a26 26 0 1 0 26 34a20 20 0 1 1 -26 -34Z"
}

/** Sol: disco e oito raios curtos, no canto onde a lua aparece à noite. */
export function sun(): string {
  return "M1068 50a22 22 0 1 0 44 0a22 22 0 1 0 -44 0ZM1118.0 58.2L1130.4 57.1L1119.1 51.9ZM1104.0 75.6L1113.5 83.6L1109.3 71.9ZM1081.8 78.0L1082.9 90.4L1088.1 79.1ZM1064.4 64.0L1056.4 73.5L1068.1 69.3ZM1062.0 41.8L1049.6 42.9L1060.9 48.1ZM1076.0 24.4L1066.5 16.4L1070.7 28.1ZM1098.2 22.0L1097.1 9.6L1091.9 20.9ZM1115.6 36.0L1123.6 26.5L1111.9 30.7Z"
}

/** Partículas que caem (folhas ou flocos), com atraso e duração por seed. */
export function particles(seed: string, count: number): Dot[] {
  const rand = createRandom(seed)
  return Array.from({ length: count }, () => ({
    x: rand.range(10, SCENE_W - 10),
    y: rand.range(-10, 60),
    r: rand.range(2, 4.5),
    delay: -rand.range(0, 14),
    duration: rand.range(9, 16),
  }))
}

/** Folha simples (gota) centrada na origem, para girar e cair. */
export const LEAF_PATH = "M0 -5C3 -3 4 1 0 5C-4 1 -3 -3 0 -5Z"
