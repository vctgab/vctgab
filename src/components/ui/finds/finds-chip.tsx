"use client"

import { useId } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { formatCount } from "@/lib/format"
import { useAchados } from "./finds-provider"

export interface AchadosChipProps {
  /**
   * `dock`: fixo no canto (barra inferior no mobile); `inline`: no fluxo;
   * `header`: botão discreto do cabeçalho, "achados: 3 de 7" em minúscula.
   */
  placement?: "dock" | "inline" | "header"
  className?: string
}

/** "Achados: 3 de 7". Abre o caderno. Ficha: docs/specs/finds.md */
export function AchadosChip({ placement = "dock", className }: AchadosChipProps) {
  const { state, count, total, openCard } = useAchados()
  const id = useId()
  const seed = `achados-chip:${placement}`
  const host = shapeHostProps({ seed, bucket: "sm", interactive: true })
  const number =
    state === null ? (
      <span className="invisible">{formatCount(0, total)}</span>
    ) : (
      formatCount(count, total)
    )

  if (placement === "header") {
    return (
      <Button
        variant="ghost"
        size="sm"
        seed={seed}
        aria-haspopup="dialog"
        aria-describedby={`${id}-acao`}
        iconLeft="busca"
        onClick={(e) => openCard(e.currentTarget)}
        className={cn("gap-1.5 px-3", className)}
      >
        {/* Larguras fixas: a troca de fonte e o número ao vivo não movem o
            cabeçalho (D-1009). */}
        <span className="inline-flex">
          <span className="inline-block w-17 text-start">achados:</span>{" "}
          <span className="inline-block w-12 text-start">{number}</span>
        </span>
        <span id={`${id}-acao`} className="sr-only">
          Abre o caderno de achados
        </span>
      </Button>
    )
  }

  const chip = (
    <button
      {...host}
      type="button"
      aria-haspopup="dialog"
      aria-describedby={`${id}-acao`}
      onClick={(e) => openCard(e.currentTarget)}
      className={cn(
        "relative isolate inline-flex min-h-12 w-56 cursor-pointer items-center justify-center gap-2.5 px-5 font-marker text-marker leading-none whitespace-nowrap text-ink",
        "transition-[translate] duration-(--duration-instant) ease-hand",
        "[--shape-fill:var(--surface-raised)] hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
        "active:translate-x-0.5 active:translate-y-0.5 active:[--shape-shadow-x:0px] active:[--shape-shadow-y:0px] motion-reduce:active:translate-0",
        className,
      )}
    >
      <Shape seed={seed} bucket="sm" fill="surface-raised" shadow="md" />
      <Icon name="busca" decorative />
      {/* Duas caixas de largura fixa, texto à esquerda: a troca do fallback pela
          Patrick Hand (que muda a largura de "Achados:") não move o ícone nem a
          contagem. Com o chip centralizado, isso mantém o CLS em 0 (D-1009). */}
      <span className="inline-flex translate-y-px">
        <span className="inline-block w-18 text-start">Achados:</span>{" "}
        <span className="inline-block w-12 text-start">{number}</span>
      </span>
      <span id={`${id}-acao`} className="sr-only">
        Abre o caderno de achados
      </span>
    </button>
  )

  if (placement === "inline") return chip
  return (
    <>
      {/* Reserva o espaço da barra no mobile para ela não cobrir o fim da página. */}
      {/* Espaço do chip fixo, na cor do rodapé: continua a faixa escura. */}
      <div aria-hidden="true" className="h-20 bg-footer-bg md:hidden" />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-(--z-dock) flex justify-center border-t-2 border-dashed border-border bg-surface-raised px-4 py-3",
          "md:inset-x-auto md:right-6 md:bottom-6 md:border-0 md:bg-transparent md:p-0",
        )}
      >
        {chip}
      </div>
    </>
  )
}

/**
 * Só a contagem, "3 de 7", ao vivo e em texto corrido (rodapé). Antes de ler
 * o caderno, o número fica oculto com a largura reservada.
 */
export function AchadosCount({ className }: { className?: string }) {
  const { state, count, total } = useAchados()
  return (
    <span className={cn("tabular inline-block", className)}>
      {state === null ? (
        <span className="invisible">{formatCount(0, total)}</span>
      ) : (
        formatCount(count, total)
      )}
    </span>
  )
}
