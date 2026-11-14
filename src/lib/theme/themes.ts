import tokens from "@/styles/tokens.generated.json"

/**
 * Temas disponíveis, derivados de `src/styles/themes.css` pelo
 * `pnpm tokens:build`. Não há lista manual: um bloco novo no CSS vira um
 * tema novo aqui.
 */
export interface ThemeInfo {
  id: string
  label: string
  description: string
  colorScheme: "light" | "dark"
  /** Cor do `<meta name="theme-color">`. */
  themeColor: string
  /** Energia da irregularidade (multiplica deslocamentos do motor). */
  energy: number
  /** Rotação máxima em graus para fichas, polaroids e fitas. */
  rotationMax: number
}

export const THEMES: readonly ThemeInfo[] = tokens.themes.map((t) => ({
  id: t.id,
  label: t.label,
  description: t.description,
  colorScheme: t.colorScheme === "dark" ? "dark" : "light",
  themeColor: t.themeColor,
  energy: t.energy,
  rotationMax: t.rotationMax,
}))

export const DEFAULT_THEME: string = tokens.defaultTheme

/** Tema usado quando o sistema pede modo escuro e não há escolha salva. */
export const DARK_THEME: string =
  THEMES.find((t) => t.colorScheme === "dark")?.id ?? DEFAULT_THEME

export const THEME_STORAGE_KEY = "vg-tema"

export function isThemeId(value: unknown): value is string {
  return typeof value === "string" && THEMES.some((t) => t.id === value)
}

export function getThemeInfo(id: string): ThemeInfo {
  return THEMES.find((t) => t.id === id) ?? (THEMES[0] as ThemeInfo)
}
