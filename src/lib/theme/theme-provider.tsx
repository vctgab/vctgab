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
  ensureThemeAttribute,
  getServerTheme,
  getTheme,
  setTheme,
  subscribeTheme,
} from "./theme-store"
import { getThemeInfo, THEMES, type ThemeInfo } from "./themes"

export interface ThemeContextValue {
  /** Tema aplicado, ou `null` durante a renderização no servidor e a hidratação. */
  theme: string | null
  /** Dados do tema aplicado (ou do padrão, enquanto `theme` for nulo). */
  info: ThemeInfo
  themes: readonly ThemeInfo[]
  setTheme: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Expõe o tema atual e a troca de tema para os componentes cliente. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme)

  // Em desenvolvimento o Strict Mode remonta o <html> e apaga o atributo
  // definido pelo script do <head>; reaplica antes da pintura.
  useLayoutEffect(() => {
    ensureThemeAttribute()
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      info: getThemeInfo(theme ?? THEMES[0]?.id ?? ""),
      themes: THEMES,
      setTheme,
    }),
    [theme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

/** Lê o tema atual. Precisa estar dentro de `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const value = use(ThemeContext)
  if (!value) throw new Error("useTheme precisa de um ThemeProvider acima na árvore.")
  return value
}
