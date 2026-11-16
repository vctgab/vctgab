"use client"

import {
  createContext,
  use,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import {
  ensureThemeAttributes,
  getServerThemeState,
  getThemeState,
  setMode,
  setSeason,
  subscribeTheme,
  type ThemeState,
} from "./theme-store"
import { DEFAULT_SEASON, getSeasonInfo, SEASONS, type SeasonInfo } from "./themes"

export interface ThemeContextValue {
  /** Estado aplicado, ou `null` durante a renderização no servidor e a hidratação. */
  state: ThemeState | null
  /** Estação aplicada (ou `null`, como `state`). */
  season: string | null
  /** Modo aplicado (ou `null`, como `state`). */
  mode: string | null
  /** Estação escolhida à mão; `null` quando segue o calendário. */
  seasonPref: string | null
  /** Modo escolhido à mão; `null` quando segue o sistema. */
  modePref: string | null
  /** Estação que o calendário indica hoje. */
  autoSeason: string | null
  /** Dados da estação aplicada (ou da padrão, enquanto `season` for nulo). */
  info: SeasonInfo
  seasons: readonly SeasonInfo[]
  /** Escolhe a estação; `null` é "Automática" (volta ao calendário). */
  setSeason: (pref: string | null) => void
  /** Escolhe o modo; `null` é "Do sistema". */
  setMode: (pref: string | null) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Expõe a estação, o modo e as trocas para os componentes cliente. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribeTheme, getThemeState, getServerThemeState)

  // Em desenvolvimento o Strict Mode remonta o <html> e apaga os atributos
  // definidos pelo script do <head>; reaplica antes da pintura.
  useLayoutEffect(() => {
    ensureThemeAttributes()
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      state,
      season: state?.season ?? null,
      mode: state?.mode ?? null,
      seasonPref: state?.seasonPref ?? null,
      modePref: state?.modePref ?? null,
      autoSeason: state?.autoSeason ?? null,
      info: getSeasonInfo(state?.season ?? DEFAULT_SEASON),
      seasons: SEASONS,
      setSeason,
      setMode,
    }),
    [state],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

/** Lê o tema atual. Precisa estar dentro de `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const value = use(ThemeContext)
  if (!value) throw new Error("useTheme precisa de um ThemeProvider acima na árvore.")
  return value
}
