import { ACHADOS, isAchadoId, TOTAL_ACHADOS, type AchadoId } from "./achados"

/**
 * Store dos achados para `useSyncExternalStore`. Lê o armazenamento só no
 * cliente; sem `localStorage`, os achados valem na sessão e o estado avisa.
 */

export const ACHADOS_STORAGE_KEY = "vg-achados"
export const ACHADOS_COMPLETE_EVENT = "vg:achados-completos"

export interface AchadosState {
  /** Ids achados, na ordem do caderno. */
  found: readonly AchadoId[]
  /** `indisponivel` quando o navegador não deixa guardar. */
  storage: "ok" | "indisponivel"
}

type Listener = () => void
const listeners = new Set<Listener>()
let state: AchadosState | null = null

function sortFound(ids: Iterable<AchadoId>): AchadoId[] {
  const set = new Set(ids)
  return ACHADOS.map((a) => a.id).filter((id) => set.has(id))
}

function load(): AchadosState {
  try {
    const raw = window.localStorage.getItem(ACHADOS_STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    const ids = Array.isArray(parsed) ? parsed.filter(isAchadoId) : []
    // Testa a escrita: alguns navegadores leem mas não gravam.
    window.localStorage.setItem(ACHADOS_STORAGE_KEY, JSON.stringify(ids))
    return { found: sortFound(ids), storage: "ok" }
  } catch {
    return { found: [], storage: "indisponivel" }
  }
}

export function getAchadosSnapshot(): AchadosState {
  state ??= load()
  return state
}

/** No servidor o caderno ainda não foi lido. */
export function getAchadosServerSnapshot(): AchadosState | null {
  return null
}

export function subscribeAchados(listener: Listener): () => void {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === ACHADOS_STORAGE_KEY) {
      state = load()
      for (const l of listeners) l()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function commit(next: AchadosState): void {
  let storage = next.storage
  try {
    window.localStorage.setItem(ACHADOS_STORAGE_KEY, JSON.stringify(next.found))
  } catch {
    storage = "indisponivel"
  }
  state = { ...next, storage }
  for (const l of listeners) l()
}

/**
 * Marca um achado. Devolve `true` se era novo. Ao chegar a 7 de 7,
 * dispara `vg:achados-completos` no window.
 */
export function findAchado(id: AchadoId): boolean {
  const current = getAchadosSnapshot()
  if (current.found.includes(id)) return false
  const found = sortFound([...current.found, id])
  commit({ ...current, found })
  if (found.length === TOTAL_ACHADOS) {
    window.dispatchEvent(new CustomEvent(ACHADOS_COMPLETE_EVENT))
  }
  return true
}

/** Esvazia o caderno (vitrine e testes). */
export function resetAchados(): void {
  commit({ ...getAchadosSnapshot(), found: [] })
}

/** Só para testes: esquece o estado lido. */
export function __resetAchadosStore(): void {
  state = null
}
