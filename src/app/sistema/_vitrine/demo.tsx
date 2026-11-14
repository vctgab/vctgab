import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

/** Bloco da vitrine: título, descrição e um palco com o componente. */
export function Demo({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string
  title: string
  description?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section aria-labelledby={`${id}-titulo`} id={id} className="scroll-mt-24 py-12">
      <h2 id={`${id}-titulo`} className="text-h2">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-measure text-body text-ink-muted">{description}</p>
      ) : null}
      <div className={cn("mt-8 flex flex-col gap-10", className)}>{children}</div>
    </section>
  )
}

/** Linha de exemplos com um rótulo mono. */
export function Row({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-label text-ink-subtle">{label}</p>
      <div className={cn("flex flex-wrap items-start gap-6", className)}>{children}</div>
    </div>
  )
}
