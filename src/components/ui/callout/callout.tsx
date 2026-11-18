import type { ReactNode } from "react"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

export interface CalloutProps {
  /** Nome acessível do destaque (não é um título visível). */
  label: string
  children: ReactNode
  tone?: "primary" | "neutral"
  seed?: string
  className?: string
}

const FILL = { primary: "primary-soft", neutral: "surface-sunken" } as const

/**
 * Destaque de uma regra ou ideia dentro de um texto longo. `role="note"` (e não
 * `<aside>`, D-1306). Ficha: docs/specs/callout.md
 */
export function Callout({
  label,
  children,
  tone = "primary",
  seed = "callout",
  className,
}: CalloutProps) {
  const host = shapeHostProps({ seed, kind: "wobblyRect", bucket: "md" })
  const bar = shapeHostProps({ seed: `${seed}:barra`, kind: "wobblyRect", bucket: "sm" })
  return (
    <div
      {...host}
      role="note"
      aria-label={label}
      className={cn(
        "relative isolate py-6 ps-10 pe-6 text-body-lg text-ink md:ps-12 md:pe-8",
        "forced-colors:border forced-colors:border-solid",
        className,
      )}
    >
      <Shape
        seed={seed}
        bucket="md"
        fill={FILL[tone]}
        stroke="stroke"
        strokeWidth={1.5}
      />
      <span
        {...bar}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-4 start-4 isolate w-1.5 forced-colors:hidden"
      >
        <Shape
          seed={`${seed}:barra`}
          bucket="sm"
          fill="primary-decor"
          stroke="none"
          misalign={false}
        />
      </span>
      <div className="[&_strong]:font-semibold">{children}</div>
    </div>
  )
}
