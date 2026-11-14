import {
  DARK_THEME,
  DEFAULT_THEME,
  getThemeInfo,
  isThemeId,
  THEME_STORAGE_KEY,
} from "./themes"

/**
 * Estado do tema no cliente. A fonte da verdade é o atributo `data-theme`
 * do `<html>`, definido antes da pintura pelo script do `<head>`. Este store
 * só lê, grava e avisa quem assina (via `useSyncExternalStore`).
 */

type Listener = () => void
const listeners = new Set<Listener>()

function readStored(): string | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemeId(value) ? value : null
  } catch {
    return null
  }
}

function systemTheme(): string {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_THEME
      : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

/** Tema que deveria estar aplicado: escolha salva ou preferência do sistema. */
export function resolveTheme(): string {
  return readStored() ?? systemTheme()
}

export function getTheme(): string {
  const attr = document.documentElement.getAttribute("data-theme")
  return isThemeId(attr) ? attr : resolveTheme()
}

/** O servidor não conhece o tema: devolve nulo e a interface mostra estado neutro. */
export function getServerTheme(): string | null {
  return null
}

/** Escolha explícita salva? Sem ela, o tema acompanha o sistema. */
export function hasStoredTheme(): boolean {
  return readStored() !== null
}

function applyAttribute(id: string): void {
  const root = document.documentElement
  root.setAttribute("data-theme", id)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", getThemeInfo(id).themeColor)
}

function notify(): void {
  for (const listener of listeners) listener()
}

let transitionTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Aplica e salva um tema. A transição de cores (até 300 ms) só acontece
 * durante a troca e nunca com `prefers-reduced-motion`.
 */
export function setTheme(id: string): void {
  if (!isThemeId(id)) return
  const root = document.documentElement
  let reduce = false
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    reduce = false
  }
  if (!reduce) {
    root.setAttribute("data-theme-transition", "")
    clearTimeout(transitionTimer)
    transitionTimer = setTimeout(() => root.removeAttribute("data-theme-transition"), 320)
  }
  applyAttribute(id)
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch {
    // Sem armazenamento: o tema vale até sair da página.
  }
  notify()
}

/** Reaplica o tema se o atributo sumiu (remontagem do Strict Mode em desenvolvimento). */
export function ensureThemeAttribute(): void {
  const attr = document.documentElement.getAttribute("data-theme")
  if (!isThemeId(attr)) applyAttribute(resolveTheme())
}

export function subscribeTheme(listener: Listener): () => void {
  listeners.add(listener)
  let media: MediaQueryList | null = null
  const onSystemChange = () => {
    if (!hasStoredTheme()) {
      applyAttribute(systemTheme())
      notify()
    }
  }
  try {
    media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", onSystemChange)
  } catch {
    media = null
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY && isThemeId(event.newValue)) {
      applyAttribute(event.newValue)
      notify()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    media?.removeEventListener("change", onSystemChange)
    window.removeEventListener("storage", onStorage)
  }
}
