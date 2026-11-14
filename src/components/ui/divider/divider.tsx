import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

export interface DividerProps {
  /** `wave`: traço ondulado tracejado; `solid`: traço à mão contínuo. */
  variant?: "wave" | "solid"
  seed?: string
  className?: string
}

/** Separador desenhado à mão. Ficha: docs/specs/p1-visuais.md */
export function Divider({ variant = "wave", seed = "divisor", className }: DividerProps) {
  const line = generateShape({
    kind: "handLine",
    seed,
    bucket: "xl",
    irregularity: variant === "wave" ? 0.25 : 0.4,
    waves: variant === "wave" ? 9 : undefined,
    points: variant === "wave" ? 48 : 14,
  })
  return (
    <div className={cn("relative h-3 w-full", className)}>
      <hr className="sr-only" />
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible text-border-strong"
      >
        <path
          d={line.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={variant === "wave" ? "10 8" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
