// Só a lista enxuta de estações e cores de tema (D-1029): o tokens.generated.json
// inteiro (com a matriz de contraste das 8 combinações) iria para o JavaScript
// de toda página.
import tokens from "@/styles/themes.generated.json"

/**
 * Estações disponíveis, derivadas de `src/styles/themes.css` pelo
 * `pnpm tokens:build`. Não há lista manual: um bloco novo no CSS vira uma
 * estação nova aqui.
 */
export interface SeasonInfo {
  id: string
  label: string
  description: string
  /** Energia da irregularidade (multiplica deslocamentos do motor). */
  energy: number
  /** Rotação máxima em graus para fichas, polaroids e fitas. */
  rotationMax: number
}

export interface ModeInfo {
  id: string
  label: string
  /** `color-scheme` do modo. */
  colorScheme: "light" | "dark"
}

export const SEASONS: readonly SeasonInfo[] = tokens.seasons

export const MODES: readonly ModeInfo[] = tokens.modes.map((id) => ({
  id,
  label: id === "escuro" ? "Escuro" : "Claro",
  colorScheme: id === "escuro" ? "dark" : "light",
}))

export const DEFAULT_SEASON: string = tokens.defaultSeason
export const DEFAULT_MODE: string = tokens.defaultMode
/** Modo usado quando o sistema pede escuro e não há escolha salva. */
export const DARK_MODE: string =
  MODES.find((m) => m.colorScheme === "dark")?.id ?? DEFAULT_MODE

/** Chaves de `localStorage` (D-1105): estação e modo se guardam separados. */
export const SEASON_STORAGE_KEY = "vg-estacao"
export const MODE_STORAGE_KEY = "vg-modo"
/** Chave do modelo antigo (um tema só); migrada e apagada na primeira visita. */
export const LEGACY_THEME_STORAGE_KEY = "vg-tema"

/** Migração do tema antigo: cada valor vira uma estação e um modo salvos. */
export const LEGACY_THEME_MAP: Readonly<
  Record<string, { season: string; mode: string }>
> = {
  ipe: { season: "primavera", mode: "claro" },
  noturno: { season: "primavera", mode: "escuro" },
  outono: { season: "outono", mode: "claro" },
  inverno: { season: "inverno", mode: "claro" },
}

export function isSeasonId(value: unknown): value is string {
  return typeof value === "string" && SEASONS.some((s) => s.id === value)
}

export function isModeId(value: unknown): value is string {
  return typeof value === "string" && MODES.some((m) => m.id === value)
}

export function getSeasonInfo(id: string): SeasonInfo {
  return SEASONS.find((s) => s.id === id) ?? (SEASONS[0] as SeasonInfo)
}

export function getModeInfo(id: string): ModeInfo {
  return MODES.find((m) => m.id === id) ?? (MODES[0] as ModeInfo)
}

/** Cor do `<meta name="theme-color">` (o papel) de uma combinação. */
export function getThemeColor(season: string, mode: string): string {
  const color = tokens.themes.find((t) => t.id === `${season}-${mode}`)?.themeColor
  return color ?? tokens.themes[0]?.themeColor ?? ""
}

/** Todas as combinações (`estacao-modo`), na ordem do CSS. */
export const THEME_COMBOS: readonly { id: string; season: string; mode: string }[] =
  tokens.themes.map((t) => ({ id: t.id, season: t.season, mode: t.mode }))
