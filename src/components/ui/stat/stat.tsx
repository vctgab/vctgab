import type { ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/cn"

export interface StatProps {
  /** Valor já formatado por @/lib/format (ex.: formatPercent(89)). */
  value: string
  /** Valor anterior, para "de → para". */
  from?: string
  /**
   * Como o número foi medido. Obrigatório: número sem método não compila.
   * Se faltar, escreva `[a confirmar: método]`.
   */
  method: ReactNode
  className?: string
}

/** Número grande com a legenda do método. Ficha: docs/specs/p1-visuals.md */
export function Stat({ value, from, method, className }: StatProps) {
  const sentence = from ? `De ${from} para ${value}` : value
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <p
        className="flex flex-wrap items-center gap-x-4 gap-y-2"
        aria-label={sentence}
        role="img"
      >
        {from ? (
          <>
            <span
              aria-hidden="true"
              className="font-soft font-display text-h1 text-ink-muted"
            >
              {from}
            </span>
            <Icon name="seta" size={24} decorative className="text-ink" />
          </>
        ) : null}
        <span
          aria-hidden="true"
          className="font-soft font-display text-display text-primary-decor"
        >
          {value}
        </span>
      </p>
      <div className="flex max-w-measure flex-col gap-1.5">
        <span className="font-mono text-label text-primary-text">Método</span>
        <p className="text-body-lg text-ink">{method}</p>
      </div>
    </div>
  )
}
