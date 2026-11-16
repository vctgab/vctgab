import { seasonForDate } from "./season"
import {
  DARK_MODE,
  DEFAULT_MODE,
  getThemeColor,
  isModeId,
  isSeasonId,
  LEGACY_THEME_MAP,
  LEGACY_THEME_STORAGE_KEY,
  MODE_STORAGE_KEY,
  SEASON_STORAGE_KEY,
} from "./themes"

/**
 * Estado do tema no cliente. A fonte da verdade é o par de atributos
 * `data-season` e `data-mode` do `<html>`, definido antes da pintura pelo
 * script do `<head>`. Este store lê, grava e avisa quem assina (via
 * `useSyncExternalStore`). Estação e modo são independentes (D-1101): cada um
 * tem a própria escolha salva e, sem ela, um automático (calendário e sistema).
 */

export interface ThemeState {
  /** Estação aplicada. */
  season: string
  /** Modo aplicado. */
  mode: string
  /** Estação escolhida à mão, ou nulo quando segue o calendário. */
  seasonPref: string | null
  /** Modo escolhido à mão, ou nulo quando segue o sistema. */
  modePref: string | null
  /** Estação que o calendário indica hoje (o que "Automática" daria). */
  autoSeason: string
}

type Listener = () => void
const listeners = new Set<Listener>()

function readKey(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeKey(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // Sem armazenamento: a escolha vale até sair da página.
  }
}

/** Migra `vg-tema` (modelo antigo) para as duas chaves novas e apaga a antiga. */
export function migrateLegacyTheme(): void {
  const old = readKey(LEGACY_THEME_STORAGE_KEY)
  if (old === null) return
  const mapped = Object.hasOwn(LEGACY_THEME_MAP, old) ? LEGACY_THEME_MAP[old] : undefined
  if (
    mapped &&
    readKey(SEASON_STORAGE_KEY) === null &&
    readKey(MODE_STORAGE_KEY) === null
  ) {
    writeKey(SEASON_STORAGE_KEY, mapped.season)
    writeKey(MODE_STORAGE_KEY, mapped.mode)
  }
  writeKey(LEGACY_THEME_STORAGE_KEY, null)
}

function storedSeason(): string | null {
  const value = readKey(SEASON_STORAGE_KEY)
  return isSeasonId(value) ? value : null
}

function storedMode(): string | null {
  const value = readKey(MODE_STORAGE_KEY)
  return isModeId(value) ? value : null
}

function systemMode(): string {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_MODE
      : DEFAULT_MODE
  } catch {
    return DEFAULT_MODE
  }
}

/** Estação que deveria estar aplicada: escolha salva ou calendário. */
export function resolveSeason(): string {
  return storedSeason() ?? seasonForDate(new Date())
}

/** Modo que deveria estar aplicado: escolha salva ou preferência do sistema. */
export function resolveMode(): string {
  return storedMode() ?? systemMode()
}

let cached: ThemeState | null = null

/**
 * Estado atual. Devolve a mesma referência enquanto nada muda, como o
 * `useSyncExternalStore` exige.
 */
export function getThemeState(): ThemeState {
  const root = document.documentElement
  const seasonAttr = root.getAttribute("data-season")
  const modeAttr = root.getAttribute("data-mode")
  const next: ThemeState = {
    season: isSeasonId(seasonAttr) ? seasonAttr : resolveSeason(),
    mode: isModeId(modeAttr) ? modeAttr : resolveMode(),
    seasonPref: storedSeason(),
    modePref: storedMode(),
    autoSeason: seasonForDate(new Date()),
  }
  if (
    cached &&
    cached.season === next.season &&
    cached.mode === next.mode &&
    cached.seasonPref === next.seasonPref &&
    cached.modePref === next.modePref &&
    cached.autoSeason === next.autoSeason
  ) {
    return cached
  }
  cached = next
  return next
}

/** O servidor não conhece o tema: devolve nulo e a interface mostra estado neutro. */
export function getServerThemeState(): ThemeState | null {
  return null
}

function applyAttributes(season: string, mode: string): void {
  const root = document.documentElement
  root.setAttribute("data-season", season)
  root.setAttribute("data-mode", mode)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", getThemeColor(season, mode))
}

function notify(): void {
  for (const listener of listeners) listener()
}

let transitionTimer: ReturnType<typeof setTimeout> | undefined

/** Liga a transição de cores (até 300 ms), nunca com `prefers-reduced-motion`. */
function startTransition(): void {
  let reduce = false
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    reduce = false
  }
  if (reduce) return
  const root = document.documentElement
  root.setAttribute("data-theme-transition", "")
  clearTimeout(transitionTimer)
  transitionTimer = setTimeout(() => root.removeAttribute("data-theme-transition"), 320)
}

/**
 * Escolhe a estação e salva. `null` é "Automática": apaga a escolha e volta a
 * seguir o calendário.
 */
export function setSeason(pref: string | null): void {
  if (pref !== null && !isSeasonId(pref)) return
  startTransition()
  writeKey(SEASON_STORAGE_KEY, pref)
  applyAttributes(
    pref ?? resolveSeason(),
    document.documentElement.getAttribute("data-mode") ?? resolveMode(),
  )
  notify()
}

/**
 * Escolhe o modo e salva. `null` é "Do sistema": apaga a escolha e volta a
 * seguir `prefers-color-scheme`.
 */
export function setMode(pref: string | null): void {
  if (pref !== null && !isModeId(pref)) return
  startTransition()
  writeKey(MODE_STORAGE_KEY, pref)
  applyAttributes(
    document.documentElement.getAttribute("data-season") ?? resolveSeason(),
    pref ?? resolveMode(),
  )
  notify()
}

/** Reaplica o tema se os atributos sumiram (remontagem do Strict Mode em desenvolvimento). */
export function ensureThemeAttributes(): void {
  const root = document.documentElement
  root.setAttribute("data-js", "")
  migrateLegacyTheme()
  const season = root.getAttribute("data-season")
  const mode = root.getAttribute("data-mode")
  if (!isSeasonId(season) || !isModeId(mode)) {
    applyAttributes(
      isSeasonId(season) ? season : resolveSeason(),
      isModeId(mode) ? mode : resolveMode(),
    )
  }
}

export function subscribeTheme(listener: Listener): () => void {
  listeners.add(listener)
  let media: MediaQueryList | null = null
  const onSystemChange = () => {
    if (storedMode() === null) {
      applyAttributes(
        document.documentElement.getAttribute("data-season") ?? resolveSeason(),
        systemMode(),
      )
      notify()
    }
  }
  try {
    media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", onSystemChange)
  } catch {
    media = null
  }
  // Outra aba mudou a escolha: acompanha.
  const onStorage = (event: StorageEvent) => {
    if (event.key === SEASON_STORAGE_KEY || event.key === MODE_STORAGE_KEY) {
      applyAttributes(resolveSeason(), resolveMode())
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
