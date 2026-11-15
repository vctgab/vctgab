"use client"

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { getAchado, TOTAL_ACHADOS, type AchadoId } from "@/lib/finds/finds"
import {
  findAchado,
  getAchadosServerSnapshot,
  getAchadosSnapshot,
  resetAchados,
  subscribeAchados,
  type AchadosState,
} from "@/lib/finds/store"
import { formatCount } from "@/lib/format"
import dynamic from "next/dynamic"

/**
 * O caderno (Dialog) só é baixado e montado na primeira abertura (D-1028):
 * tira o código do diálogo do carregamento de toda página.
 */
const AchadosCard = dynamic(() => import("./finds-card").then((m) => m.AchadosCard), {
  ssr: false,
})

export interface AchadosContextValue {
  /** `null` enquanto o caderno não foi lido (servidor e hidratação). */
  state: AchadosState | null
  count: number
  total: number
  /** 7 de 7: página secreta liberada. */
  unlocked: boolean
  find: (id: AchadoId) => void
  reset: () => void
  /** Abre o caderno; `opener` recebe o foco de volta ao fechar. */
  openCard: (opener?: HTMLElement | null) => void
}

const AchadosContext = createContext<AchadosContextValue | null>(null)

/**
 * Estado dos achados, região de anúncio e o caderno (um só, aberto por
 * qualquer chip). Ficha: docs/specs/finds.md
 */
export function AchadosProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    subscribeAchados,
    getAchadosSnapshot,
    getAchadosServerSnapshot,
  )
  const [announcement, setAnnouncement] = useState("")
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  const opener = useRef<HTMLElement | null>(null)

  const find = useCallback((id: AchadoId) => {
    if (findAchado(id)) {
      const count = getAchadosSnapshot().found.length
      setAnnouncement(
        `Achado: ${getAchado(id).nome.toLowerCase()}. ${formatCount(count, TOTAL_ACHADOS)}.`,
      )
    }
  }, [])

  const openCard = useCallback((el?: HTMLElement | null) => {
    opener.current = el ?? null
    setEverOpened(true)
    setOpen(true)
  }, [])

  const count = state?.found.length ?? 0
  const value = useMemo<AchadosContextValue>(
    () => ({
      state,
      count,
      total: TOTAL_ACHADOS,
      unlocked: count === TOTAL_ACHADOS,
      find,
      reset: resetAchados,
      openCard,
    }),
    [state, count, find, openCard],
  )

  return (
    <AchadosContext value={value}>
      {children}
      <p role="status" aria-live="polite" className="sr-only" data-anuncio-achados="">
        {announcement}
      </p>
      {everOpened ? (
        <AchadosCard
          state={state}
          open={open}
          onOpenChange={setOpen}
          onCloseAutoFocus={(event) => {
            if (opener.current) {
              event.preventDefault()
              opener.current.focus()
            }
          }}
        />
      ) : null}
    </AchadosContext>
  )
}

export function useAchados(): AchadosContextValue {
  const value = use(AchadosContext)
  if (!value) throw new Error("useAchados precisa de um AchadosProvider acima na árvore.")
  return value
}
