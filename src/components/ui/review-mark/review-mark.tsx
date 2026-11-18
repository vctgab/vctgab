import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export interface ReviewMarkProps {
  /** O que validar, em minúsculas: "se pode contar o incidente". */
  what: string
  /** Conteúdo em revisão. Sem ele, só a marca aparece (conteúdo retido). */
  children?: ReactNode
  /** `span` dentro de um parágrafo; `div` para um bloco inteiro. */
  as?: "span" | "div"
  className?: string
}

/**
 * Marca visível de item que ainda precisa da validação de Victor
 * (`[validar: …]`, D-1304). Sublinhado tracejado e o texto da marca são o
 * segundo indicador além da cor. Ficha: docs/specs/review-mark.md
 */
export function ReviewMark({
  what,
  children,
  as: Tag = "span",
  className,
}: ReviewMarkProps) {
  const mark = (
    <span
      data-review-label=""
      className="ms-1 font-mono text-label whitespace-normal text-warning-text"
    >
      [validar: {what}]
    </span>
  )
  if (!children) {
    return (
      <Tag
        data-review=""
        className={cn(
          "bg-warning-soft px-1 underline decoration-warning-text decoration-dashed underline-offset-4 forced-colors:bg-transparent",
          Tag === "div" && "block w-fit max-w-full py-1",
          className,
        )}
      >
        {mark}
      </Tag>
    )
  }
  return (
    <Tag
      data-review=""
      className={cn(
        "bg-warning-soft [box-decoration-break:clone] decoration-warning-text decoration-dashed underline-offset-4 forced-colors:bg-transparent",
        Tag === "div" && "block px-3 py-2",
        className,
      )}
    >
      <span className="underline decoration-warning-text decoration-dashed underline-offset-4">
        {children}
      </span>
      {mark}
    </Tag>
  )
}
