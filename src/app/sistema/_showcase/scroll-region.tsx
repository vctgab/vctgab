import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Região com rolagem horizontal que recebe foco pelo teclado (WCAG 2.1.1):
 * sem isso, quem não usa mouse não consegue rolar tabelas e código largos.
 */
export function ScrollRegion({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn("overflow-x-auto", className)}
    >
      {children}
    </div>
  )
}
