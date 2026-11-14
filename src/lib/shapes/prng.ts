/**
 * Aleatoriedade determinística. Única fonte de variação do sistema
 * (Math.random é proibido pela regra SH-01).
 */

export type Seed = string | number

/** Hash de string para inteiro de 32 bits (cyrb53 truncado). */
export function hashSeed(seed: Seed): number {
  const str = typeof seed === "number" ? `n:${seed}` : seed
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (h1 ^ h2) >>> 0
}

/** PRNG mulberry32: devolve uma função que gera números em [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Gerador com utilidades de faixa, a partir de uma seed qualquer. */
export interface Random {
  next(): number
  /** Número em [min, max). */
  range(min: number, max: number): number
  /** Número em [−1, 1). */
  signed(): number
  /** Inteiro em [min, max]. */
  int(min: number, max: number): number
}

export function createRandom(seed: Seed): Random {
  const next = mulberry32(hashSeed(seed))
  return {
    next,
    range: (min, max) => min + (max - min) * next(),
    signed: () => next() * 2 - 1,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
  }
}
