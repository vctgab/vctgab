import type { ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/cn"

const METHOD_LABEL = { metodo: "Método", fonte: "Fonte" } as const

const SIZE = {
  lg: { value: "text-display", from: "text-h1", arrow: 24 },
  md: { value: "text-h1", from: "text-h3", arrow: 20 },
} as const

export interface StatProps {
  /** Valor já formatado por @/lib/format (ex.: formatPercent(89)) ou texto do conteúdo. */
  value: string
  /** Valor anterior, para "de → para". */
  from?: string
  /** O que o número conta ("anos em produto digital"). */
  label?: ReactNode
  /**
   * Como o número foi medido ou de onde vem. Obrigatório: número sem método
   * ou fonte não compila. Se faltar, passe a pendência (`[a confirmar: …]`).
   */
  method: ReactNode
  /** Rótulo do `method`: "Método" (medição, padrão) ou "Fonte" (fato, contagem). */
  methodKind?: keyof typeof METHOD_LABEL
  /** `lg` (destaque único) ou `md` (grade de números). */
  size?: keyof typeof SIZE
  className?: string
}

/** Número grande com o rótulo e o método ou a fonte. Ficha: docs/specs/p1-visuals.md */
export function Stat({
  value,
  from,
  label,
  method,
  methodKind = "metodo",
  size = "lg",
  className,
}: StatProps) {
  const sentence = from ? `De ${from} para ${value}` : value
  const s = SIZE[size]
  return (
    <div className={cn("flex flex-col", size === "lg" ? "gap-5" : "gap-3", className)}>
      <div className="flex flex-col gap-1.5">
        <p
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
          aria-label={sentence}
          role="img"
        >
          {from ? (
            <>
              <span
                aria-hidden="true"
                className={cn("font-soft font-display text-ink-muted", s.from)}
              >
                {from}
              </span>
              <Icon name="seta" size={s.arrow} decorative className="text-ink" />
            </>
          ) : null}
          <span
            aria-hidden="true"
            className={cn("font-soft font-display text-primary-decor", s.value)}
          >
            {value}
          </span>
        </p>
        {label ? <p className="text-body-lg font-medium text-ink">{label}</p> : null}
      </div>
      <div className="flex max-w-measure flex-col gap-1">
        <span className="font-mono text-label text-primary-text">
          {METHOD_LABEL[methodKind]}
        </span>
        <p className={cn("text-ink", size === "lg" ? "text-body-lg" : "text-body")}>
          {method}
        </p>
      </div>
    </div>
  )
}
