import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { generateShape } from "@/lib/shapes"
import tokens from "@/styles/tokens.generated.json"

/*
 * Peças comuns das imagens Open Graph (1200 × 630) na linguagem do site:
 * cores da primavera clara (a combinação padrão) vindas do build de tokens
 * (nada de cor solta), formas do motor com seed fixa e fontes em
 * subconjuntos TTF (o next/og não lê woff2): Basic Latin e Latin-1, em
 * src/assets/og; licença OFL em public/fonts. D-1318.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const

const base = tokens.themes.find((t) => t.id === "primavera-claro")?.semantic as Record<
  string,
  string
>

/** Cor semântica da primavera clara. */
export const ogColor = (name: string): string => base[name] ?? base.ink ?? "currentColor"

export const ogFonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/og/fraunces-og-v3.ttf")),
  readFile(join(process.cwd(), "src/assets/og/dm-sans-og-v3.ttf")),
]).then(([fraunces, dmSans]) => [
  { name: "Fraunces", data: fraunces, style: "normal" as const, weight: 700 as const },
  { name: "DM Sans", data: dmSans, style: "normal" as const, weight: 500 as const },
])

/** Forma do motor esticada numa caixa (viewBox 0–1, como no site). */
export function Blob({
  seed,
  fill,
  x,
  y,
  w,
  h,
}: {
  seed: string
  fill: string
  x: number
  y: number
  w: number
  h: number
}) {
  const shape = generateShape({ kind: "blob", seed, points: 9, irregularity: 0.45 })
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: x, top: y }}
    >
      <path d={shape.path} fill={fill} />
    </svg>
  )
}

/** Fundo comum: papel e as quatro formas do hero. */
export function OgBackdrop() {
  return (
    <>
      <Blob seed="og:1" fill={ogColor("hero-shape-1")} x={760} y={-120} w={560} h={480} />
      <Blob seed="og:2" fill={ogColor("hero-shape-2")} x={-140} y={360} w={460} h={400} />
      <Blob seed="og:3" fill={ogColor("hero-shape-3")} x={900} y={380} w={360} h={320} />
      <Blob seed="og:4" fill={ogColor("hero-shape-4")} x={60} y={-90} w={260} h={220} />
    </>
  )
}

/** Sombra e placa: o mesmo contorno, deslocado. */
export function OgPlate({ seed }: { seed: string }) {
  const plate = generateShape({ kind: "wobblyRect", seed, bucket: "xl" })
  return (
    <>
      <svg
        width={880}
        height={420}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 122, top: 122 }}
      >
        <path d={plate.path} fill={ogColor("shadow-soft")} />
      </svg>
      <svg
        width={880}
        height={420}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 110, top: 110 }}
      >
        <path d={plate.path} fill={ogColor("hero-plate")} />
      </svg>
    </>
  )
}

/** Traço de pincel sob uma palavra do título. */
export function OgUnderline({ seed, width }: { seed: string; width: number }) {
  const underline = generateShape({ kind: "handLine", seed, bucket: "lg" })
  return (
    <svg
      width={width}
      height={16}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, bottom: -8 }}
    >
      <path
        d={underline.path}
        fill="none"
        stroke={ogColor("primary-decor")}
        strokeWidth={0.32}
        strokeLinecap="round"
      />
    </svg>
  )
}
