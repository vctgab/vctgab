import { Caveat, DM_Sans, Fraunces, JetBrains_Mono, Patrick_Hand } from "next/font/google"

/** Fraunces variável: títulos. SOFT alto acolhe; WONK só em destaques. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
})

/** DM Sans: corpo e interface. */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-dm-sans",
})

/** JetBrains Mono: rótulos, eyebrows, metadados e terminal. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

/** Caveat: só anotações e dicas curtas, mínimo 20 px. */
export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-caveat",
})

/** Patrick Hand: etiquetas manuscritas pontuais. */
export const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  preload: false,
  variable: "--font-patrick-hand",
})

export const fontVariables = [fraunces, dmSans, jetbrainsMono, caveat, patrickHand]
  .map((f) => f.variable)
  .join(" ")
