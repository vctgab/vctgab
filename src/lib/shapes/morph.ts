import { catmullRomPath, lerpPoints, type Point } from "./path"

/** Suavização simétrica (entra e sai devagar). */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) * (-2 * t + 2)) / 2
}

/**
 * Pontos de uma animação em laço entre poses de mesma contagem.
 * `progress` vai de 0 a 1 ao longo do laço inteiro (pose 0 → 1 → … → 0).
 */
export function morphPoints(
  poses: readonly (readonly Point[])[],
  progress: number,
): Point[] {
  const n = poses.length
  const first = poses[0]
  if (!first) return []
  if (n === 1) return [...first]
  const u = (((progress % 1) + 1) % 1) * n
  const i = Math.floor(u)
  const a = poses[i % n] as readonly Point[]
  const b = poses[(i + 1) % n] as readonly Point[]
  return lerpPoints(a, b, easeInOut(u - i))
}

/** Caminho fechado de uma animação em laço. */
export function morphPath(
  poses: readonly (readonly Point[])[],
  progress: number,
  closed = true,
): string {
  return catmullRomPath(morphPoints(poses, progress), closed)
}
