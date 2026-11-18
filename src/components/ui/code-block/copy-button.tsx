"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type State = "idle" | "copied" | "failed"

/**
 * Copia o código para a área de transferência. O rótulo muda para "Código
 * copiado" por 2 s (região viva); se o navegador não liberar a cópia, a
 * mensagem aparece inline, no padrão MS-02. Ficha: docs/specs/code-block.md
 */
export function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<State>("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(code)
      setState("copied")
      timer.current = setTimeout(() => setState("idle"), 2000)
    } catch {
      setState("failed")
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="secondary"
        size="sm"
        iconLeft={state === "copied" ? "check" : undefined}
        onClick={copy}
        seed="codigo:copiar"
      >
        {state === "copied" ? "Código copiado" : "Copiar código"}
      </Button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Código copiado" : ""}
      </span>
      {state === "failed" ? (
        <p role="alert" className="max-w-xs text-end text-sm text-danger-text">
          Não foi possível copiar o código. O navegador não liberou a área de
          transferência. Selecione o trecho e copie com o teclado; nada foi alterado.
        </p>
      ) : null}
    </div>
  )
}
