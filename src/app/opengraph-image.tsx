import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { HOME } from "@/content/home"
import { SITE } from "@/content/site"
import { generateShape } from "@/lib/shapes"
import tokens from "@/styles/tokens.generated.json"

/*
 * Imagem Open Graph (1200 × 630) na linguagem do site: papel, formas do
 * motor com seed fixa e placa com o título em Fraunces. Cores da primavera
 * clara (a combinação padrão) vindas do build de tokens (nada de cor solta). Fontes: subconjuntos TTF
 * com só os caracteres usados (o next/og não lê woff2), em src/assets/og;
 * licença OFL em public/fonts. Gerada no build, sem rede.
 */

export const alt = `${SITE.name}, ${SITE.role.toLowerCase()}: ${HOME.hero.titleStart} ${HOME.hero.titleHighlight}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const base = tokens.themes.find((t) => t.id === "primavera-claro")?.semantic as Record<
  string,
  string
>
const color = (name: string): string => base[name] ?? base.ink ?? "currentColor"

const fonts = Promise.all([
  readFile(join(process.cwd(), "src/assets/og/fraunces-og-v1.ttf")),
  readFile(join(process.cwd(), "src/assets/og/dm-sans-og-v1.ttf")),
])

/** Forma do motor esticada numa caixa (viewBox 0–1, como no site). */
function Blob({
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

export default async function Image() {
  const [fraunces, dmSans] = await fonts
  const plate = generateShape({ kind: "wobblyRect", seed: "og:placa", bucket: "xl" })
  const underline = generateShape({
    kind: "handLine",
    seed: "og:sublinhado",
    bucket: "lg",
  })

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: color("surface-base"),
        fontFamily: "DM Sans",
      }}
    >
      <Blob seed="og:1" fill={color("hero-shape-1")} x={760} y={-120} w={560} h={480} />
      <Blob seed="og:2" fill={color("hero-shape-2")} x={-140} y={360} w={460} h={400} />
      <Blob seed="og:3" fill={color("hero-shape-3")} x={900} y={380} w={360} h={320} />
      <Blob seed="og:4" fill={color("hero-shape-4")} x={60} y={-90} w={260} h={220} />

      {/* Sombra e placa: o mesmo contorno, deslocado. */}
      <svg
        width={880}
        height={420}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 122, top: 122 }}
      >
        <path d={plate.path} fill={color("shadow-soft")} />
      </svg>
      <svg
        width={880}
        height={420}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 110, top: 110 }}
      >
        <path d={plate.path} fill={color("hero-plate")} />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 170,
          top: 160,
          width: 760,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: color("primary-text") }}>
          {`${HOME.hero.eyebrows[0]} · ${HOME.hero.eyebrows[1]}`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Fraunces",
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            color: color("ink"),
          }}
        >
          <span>{HOME.hero.titleStart}</span>
          <span style={{ display: "flex", position: "relative" }}>
            {HOME.hero.titleHighlight}
            <svg
              width={500}
              height={18}
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              style={{ position: "absolute", left: 0, bottom: -10 }}
            >
              <path
                d={underline.path}
                fill="none"
                stroke={color("primary-decor")}
                strokeWidth={0.32}
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: color("ink-muted"),
          }}
        >
          {`${SITE.name} · ${HOME.hero.location}`}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 700 },
        { name: "DM Sans", data: dmSans, style: "normal", weight: 500 },
      ],
    },
  )
}
