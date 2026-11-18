import { ImageResponse } from "next/og"
import { NEXUSCOOP } from "@/content/projects"
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
 * Imagem Open Graph do caso Nexuscoop (1200 × 630), na linguagem do site e
 * sem print do cliente (D-1318): placa com o nome em Fraunces, sublinhado de
 * pincel e a linha curta do caso. Gerada no build, sem rede.
 */

export const alt = `Caso ${NEXUSCOOP.header.name}: ${NEXUSCOOP.meta.ogLine}`
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
      <OgPlate seed="og:caso:placa" />

      <div
        style={{
          position: "absolute",
          left: 170,
          top: 168,
          width: 760,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: ogColor("primary-text") }}>
          {`caso · ${NEXUSCOOP.header.areas.join(", ")}`}
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            alignSelf: "flex-start",
            fontFamily: "Fraunces",
            fontSize: 104,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: ogColor("ink"),
          }}
        >
          {NEXUSCOOP.header.name}
          <OgUnderline seed="og:caso:sublinhado" width={460} />
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 34,
            lineHeight: 1.25,
            color: ogColor("ink-muted"),
          }}
        >
          {NEXUSCOOP.meta.ogLine}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: ogColor("ink-muted") }}>
          {SITE.name}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  )
}
