/**
 * Composição do hero: 5 a 9 formas (blobs e papel rasgado) em camadas, com
 * profundidade para a paralaxe e parâmetros de deriva. Pura e
 * determinística: mesma seed e energia, mesma composição.
 */
import { createRandom, generateShape, type Point } from "@/lib/shapes"

export interface HeroShape {
  id: string
  kind: "blob" | "tornEdge"
  /** Índice do token `--hero-shape-N` (1 a 5). */
  color: 1 | 2 | 3 | 4 | 5
  /** Posição e largura em % do contêiner; altura pela proporção. */
  left: number
  top: number
  width: number
  aspect: number
  /** 0 (fundo) a 1 (frente): intensidade da paralaxe. */
  depth: number
  /** Rotação fixa em graus (abaixo de 1,5). */
  rotation: number
  /** Deriva lenta: deslocamento em px, giro em graus, duração e atraso em s. */
  drift: { x: number; y: number; turn: number; duration: number; delay: number }
  /** Caminho inicial (pose 0), renderizado no servidor. */
  path: string
  /** Poses para o morph (só nos blobs animados); a 0 é a inicial. */
  poses: Point[][] | null
}

const MORPH_POINTS = 12

export function buildComposition(
  seed: string,
  options: { count?: number; energy?: number } = {},
): HeroShape[] {
  const energy = Math.min(1.5, Math.max(0.5, options.energy ?? 1))
  const rand = createRandom(`hero:${seed}`)
  const count = Math.min(9, Math.max(5, options.count ?? rand.int(6, 8)))
  const irregularity = Math.min(1, 0.5 * energy)
  let morphing = 0

  return Array.from({ length: count }, (_, i): HeroShape => {
    const id = `hero:${seed}:${i}`
    const kind = i % 3 === 2 ? "tornEdge" : "blob"
    const depth = Math.round(rand.range(0.15, 1) * 100) / 100
    const width = kind === "blob" ? rand.range(20, 36) : rand.range(18, 28)
    const aspect = kind === "blob" ? rand.range(0.8, 1.2) : rand.range(1.5, 2.2)
    // Espalha pelas bordas e cantos; o centro-esquerdo fica com o texto (que tem placa própria).
    const column = i % 3
    const left =
      column === 0
        ? rand.range(-10, 18)
        : column === 1
          ? rand.range(35, 60)
          : rand.range(62, 88)
    const top = rand.range(-12, 78)
    const animate = kind === "blob" && morphing < 3
    if (animate) morphing++

    const pose = (variant: string) =>
      generateShape({
        kind: "blob",
        seed: `${id}:${variant}`,
        points: MORPH_POINTS,
        irregularity,
      }).points
    const poses = animate ? [pose("a"), pose("b"), pose("c")] : null
    const path =
      kind === "blob"
        ? generateShape({
            kind: "blob",
            seed: `${id}:a`,
            points: MORPH_POINTS,
            irregularity,
          }).path
        : generateShape({
            kind: "tornEdge",
            seed: id,
            bucket: "md",
            edges: ["top", "bottom"],
            irregularity,
          }).path

    return {
      id,
      kind,
      color: ((i % 5) + 1) as HeroShape["color"],
      left: Math.round(left * 10) / 10,
      top: Math.round(top * 10) / 10,
      width: Math.round(width * 10) / 10,
      aspect: Math.round(aspect * 100) / 100,
      depth,
      rotation: Math.round(rand.signed() * 1.4 * 100) / 100,
      drift: {
        x: Math.round(rand.signed() * 14 * energy),
        y: Math.round(rand.signed() * 10 * energy),
        turn:
          Math.round(Math.max(-1.4, Math.min(1.4, rand.signed() * 1.2 * energy)) * 10) /
          10,
        duration: Math.round(rand.range(18, 34)),
        delay: -Math.round(rand.range(0, 18)),
      },
      path,
      poses,
    }
  })
}
