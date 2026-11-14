import {
  clearShapeCache,
  generateShape,
  generateShapePair,
  hashSeed,
  isValidPath,
  morphPoints,
  mulberry32,
  SHAPE_BUCKETS,
  SHAPE_KINDS,
  dcos,
  dsin,
} from "."

const SEEDS = ["botao:enviar", "ficha-01", 42, "hero/ipe", "ç-ã-é acentos"]

describe("prng", () => {
  it("gera a mesma sequência para a mesma seed", () => {
    const a = mulberry32(hashSeed("x"))
    const b = mulberry32(hashSeed("x"))
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it("distingue seeds parecidas e números de strings", () => {
    expect(hashSeed("a")).not.toBe(hashSeed("b"))
    expect(hashSeed(1)).not.toBe(hashSeed("1"))
  })
})

describe("trig determinística (CA-7)", () => {
  it("acompanha Math.sin e Math.cos com erro abaixo de 1e-9", () => {
    for (let x = -20; x <= 20; x += 0.0137) {
      expect(Math.abs(dsin(x) - Math.sin(x))).toBeLessThan(1e-9)
      expect(Math.abs(dcos(x) - Math.cos(x))).toBeLessThan(1e-9)
    }
  })
})

describe.each(SHAPE_KINDS)("generateShape: %s", (kind) => {
  it("CA-1: mesma seed, mesmo caminho", () => {
    for (const bucket of SHAPE_BUCKETS) {
      const a = generateShape({ kind, seed: "igual", bucket })
      // Recalcula do zero: o resultado não pode depender da memoização.
      clearShapeCache()
      const b = generateShape({ kind, seed: "igual", bucket })
      expect(b.path).toBe(a.path)
      expect(b.borderRadius).toBe(a.borderRadius)
    }
  })

  it("CA-2: seeds diferentes, caminhos diferentes", () => {
    const paths = new Set(SEEDS.map((seed) => generateShape({ kind, seed }).path))
    expect(paths.size).toBe(SEEDS.length)
  })

  it("CA-3 e CA-4: sem NaN e com todos os pontos no viewBox", () => {
    for (const bucket of SHAPE_BUCKETS) {
      for (const irregularity of [0, 0.5, 1]) {
        for (const seed of SEEDS) {
          const s = generateShape({ kind, seed, bucket, irregularity })
          expect(s.path).not.toMatch(/NaN|Infinity/)
          for (const p of s.points) {
            expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true)
            expect(p.x).toBeGreaterThanOrEqual(-1e-6)
            expect(p.x).toBeLessThanOrEqual(1 + 1e-6)
            expect(p.y).toBeGreaterThanOrEqual(-1e-6)
            expect(p.y).toBeLessThanOrEqual(1 + 1e-6)
          }
        }
      }
    }
  })

  it("CA-6: o caminho é válido", () => {
    for (const seed of SEEDS) {
      expect(isValidPath(generateShape({ kind, seed }).path)).toBe(true)
    }
  })

  it("CA-9: border-radius em formato CSS válido", () => {
    const { borderRadius } = generateShape({ kind, seed: "raio" })
    expect(borderRadius).toMatch(
      /^(0|((\d+(\.\d+)?(px|%) ?){4}\/ ((\d+(\.\d+)?(px|%) ?){4}))|((\d+px ?){4}\/ (\d+px ?){4}))$/,
    )
  })

  it("mantém rotação abaixo de 1,5 grau e desalinhamento inteiro de até 3 px", () => {
    for (const seed of SEEDS) {
      const s = generateShape({ kind, seed, rotation: 1.49 })
      expect(Math.abs(s.rotationDeg)).toBeLessThan(1.5)
      expect(Number.isInteger(s.offset.x) && Number.isInteger(s.offset.y)).toBe(true)
      expect(Math.abs(s.offset.x)).toBeLessThanOrEqual(3)
      expect(s.offset.x).not.toBe(0)
    }
  })

  it("CA-5: snapshot de 5 seeds", () => {
    expect(SEEDS.map((seed) => generateShape({ kind, seed }).path)).toMatchSnapshot()
  })
})

describe("variantes e opções", () => {
  it("preenchimento e contorno compartilham raios mas diferem no ruído", () => {
    const { fill, outline } = generateShapePair({ kind: "wobblyRect", seed: "par" })
    expect(fill.path).not.toBe(outline.path)
    expect(fill.borderRadius).toBe(outline.borderRadius)
    expect(fill.rotation).toBe(outline.rotation)
  })

  it("rotation: false zera a rotação", () => {
    expect(
      generateShape({ kind: "wobblyRect", seed: "r", rotation: false }).rotationDeg,
    ).toBe(0)
  })

  it("respeita a quantidade de pontos pedida no blob", () => {
    expect(generateShape({ kind: "blob", seed: "p", points: 12 }).points).toHaveLength(12)
  })

  it("rasga só os lados pedidos", () => {
    const top = generateShape({ kind: "tornEdge", seed: "t", edges: ["top"] })
    const bottom = generateShape({ kind: "tornEdge", seed: "t", edges: ["bottom"] })
    expect(top.path).not.toBe(bottom.path)
  })
})

describe("morph (CA-10)", () => {
  it("começa e termina o laço na pose inicial", () => {
    const a = generateShape({ kind: "blob", seed: "m1", points: 10 }).points
    const b = generateShape({ kind: "blob", seed: "m2", points: 10 }).points
    expect(morphPoints([a, b], 0)).toEqual(a)
    const end = morphPoints([a, b], 0.9999999)
    expect(end[0]?.x).toBeCloseTo(a[0]?.x ?? 0, 4)
  })
})
