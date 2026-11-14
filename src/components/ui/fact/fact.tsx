import { isPending, pendingLabel, type Maybe } from "@/content/pending"
import { cn } from "@/lib/cn"

export interface FactProps {
  value: Maybe<string>
  as?: "span" | "strong"
  className?: string
}

/**
 * Valor do conteúdo ou a marca `[a confirmar: …]` destacada (DD-01).
 * O sublinhado tracejado é o segundo indicador além da cor.
 * Ficha: docs/specs/fact.md
 */
export function Fact({ value, as: Tag = "span", className }: FactProps) {
  if (!isPending(value)) return <Tag className={className}>{value}</Tag>
  return (
    <Tag
      data-pendente=""
      className={cn(
        "bg-primary-soft px-1 underline decoration-primary-decor decoration-dashed underline-offset-4",
        className,
      )}
    >
      {pendingLabel(value)}
    </Tag>
  )
}
