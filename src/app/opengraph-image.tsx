import { ImageResponse } from "next/og"
import { HOME } from "@/content/home"
import { SITE } from "@/content/site"
import {
  OG_SIZE,
  OgBackdrop,
  OgPlate,
  OgUnderline,
  ogColor,
  ogFonts,
} from "@/lib/og/og-kit"

/*
 * Imagem Open Graph da Home (1200 × 630): papel, formas do motor com seed
 * fixa e placa com o título em Fraunces. As peças comuns moram em
 * src/lib/og/og-kit.tsx (D-1318). Gerada no build, sem rede.
 */

const TITLE = HOME.hero.title

export const alt = `${SITE.name}, ${SITE.role.toLowerCase()}: ${TITLE.before}${TITLE.highlight}${TITLE.after}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const fonts = await ogFonts
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: ogColor("surface-base"),
        fontFamily: "DM Sans",
      }}
    >
      <OgBackdrop />
      <OgPlate seed="og:placa" />

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
        <div style={{ display: "flex", fontSize: 26, color: ogColor("primary-text") }}>
          {`${SITE.role.toLowerCase()} · ${HOME.hero.badge}`}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            fontFamily: "Fraunces",
            fontSize: 60,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            color: ogColor("ink"),
          }}
        >
          {TITLE.before
            .trim()
            .split(" ")
            .map((word, i) => (
              <span key={i} style={{ marginRight: 16 }}>
                {word}
              </span>
            ))}
          <span style={{ display: "flex", position: "relative", marginRight: 2 }}>
            {TITLE.highlight}
            <OgUnderline seed="og:sublinhado" width={150} />
          </span>
          <span>{TITLE.after}</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: ogColor("ink-muted"),
          }}
        >
          {`${SITE.name} · ${HOME.hero.place}`}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  )
}
