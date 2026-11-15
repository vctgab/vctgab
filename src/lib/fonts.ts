import { Caveat, JetBrains_Mono, Patrick_Hand } from "next/font/google"

/*
 * Fraunces (títulos do hero) e DM Sans (corpo) são as fontes da primeira
 * dobra: vêm de public/fonts com @font-face próprio (src/styles/fonts.css)
 * e pré-carga no HTML (D-1010). As demais chegam depois da primeira pintura,
 * sem pré-carga, com fallback de métricas ajustadas para não haver salto
 * de layout (D-1009).
 */

/** Arquivos pré-carregados no <head> do layout. */
export const PRELOADED_FONTS = [
  "/fonts/fraunces-soft100-latin-v1.woff2",
  "/fonts/dm-sans-latin-v1.woff2",
] as const

/**
 * JetBrains Mono: rótulos, eyebrows, metadados e terminal. Fallback próprio
 * (D-1009): Courier New tem o mesmo avanço (0,6 em), então a troca não muda
 * nenhuma largura; o automático (Arial a 134,59%) errava até 11 px por frase.
 * As métricas ficam em src/styles/fonts.css ("JetBrains Mono Ajuste").
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["JetBrains Mono Ajuste", "ui-monospace", "monospace"],
  variable: "--font-jetbrains-mono",
})

/** Caveat: só anotações e dicas curtas, mínimo 20 px. */
export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Caveat Ajuste", "cursive"],
  variable: "--font-caveat",
})

/**
 * Patrick Hand: botões e etiquetas manuscritas. Fallback com as métricas
 * que o next/font calcula (Arial a 81,43%, erra menos de 1 px em "Vamos
 * conversar"), mas em face própria que também aceita Liberation Sans e
 * Arimo: sem elas, no Linux, a troca caía num cursivo qualquer e deslocava
 * o layout (D-1032). O chip de achados tem caixas de largura fixa (D-1009).
 */
export const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Patrick Hand Ajuste", "cursive"],
  variable: "--font-patrick-hand",
})

export const fontVariables = [jetbrainsMono, caveat, patrickHand]
  .map((f) => f.variable)
  .join(" ")
