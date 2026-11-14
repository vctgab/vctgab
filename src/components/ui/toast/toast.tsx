"use client"

import { Toast as RadixToast } from "radix-ui"
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"

/**
 * Toast só confirma sucesso ou informa (regra MS-03). Erro nunca vira toast:
 * aparece inline, no lugar onde ocorreu. O tipo não aceita outro tom.
 */
export type ToastTone = "sucesso" | "informacao"

export interface ToastInput {
  tone: ToastTone
  /** Frase curta, sem exclamação ("Código copiado."). */
  title: string
  description?: string
  /** Em milissegundos; padrão 5000. */
  duration?: number
}

interface ToastItem extends ToastInput {
  id: number
  open: boolean
}

const ToastContext = createContext<((input: ToastInput) => void) | null>(null)

/** Provedor e região dos avisos. Fica no layout raiz. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const next = useRef(0)

  const push = useCallback((input: ToastInput) => {
    next.current += 1
    const id = next.current
    setItems((list) => [...list.slice(-2), { ...input, id, open: true }])
  }, [])

  const close = (id: number) =>
    setItems((list) => list.map((t) => (t.id === id ? { ...t, open: false } : t)))
  const remove = (id: number) => setItems((list) => list.filter((t) => t.id !== id))

  const value = useMemo(() => push, [push])

  return (
    <ToastContext value={value}>
      <RadixToast.Provider swipeDirection="right" label="Avisos">
        {children}
        {items.map((t) => (
          <RadixToast.Root
            key={t.id}
            open={t.open}
            duration={t.duration ?? 5000}
            onOpenChange={(open) => {
              if (!open) {
                close(t.id)
                setTimeout(() => remove(t.id), 200)
              }
            }}
            className="relative isolate flex items-start gap-3 py-3 ps-4 pe-2 text-ink data-[state=closed]:animate-sumir data-[state=open]:motion-safe:animate-surgir"
          >
            <Shape
              seed={`aviso:${t.title}`}
              bucket="md"
              fill="surface-raised"
              shadow="md"
            />
            <Icon
              name={t.tone === "sucesso" ? "check" : "info"}
              decorative
              className={
                t.tone === "sucesso"
                  ? "mt-0.5 text-success-text"
                  : "mt-0.5 text-primary-text"
              }
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <RadixToast.Title className="text-body font-medium">
                {t.title}
              </RadixToast.Title>
              {t.description ? (
                <RadixToast.Description className="text-sm text-ink-muted">
                  {t.description}
                </RadixToast.Description>
              ) : null}
            </div>
            <RadixToast.Close asChild>
              <Button
                iconOnly="fechar"
                aria-label="Fechar aviso"
                variant="ghost"
                size="sm"
              />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed inset-x-4 bottom-24 z-(--z-toast) flex flex-col gap-3 outline-none sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96" />
      </RadixToast.Provider>
    </ToastContext>
  )
}

/** Dispara um aviso de sucesso ou informação. */
export function useToast(): (input: ToastInput) => void {
  const push = use(ToastContext)
  if (!push) throw new Error("useToast precisa de um ToastProvider acima na árvore.")
  return push
}
