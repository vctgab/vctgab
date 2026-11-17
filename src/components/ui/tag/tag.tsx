import type { ReactNode } from "react"
import { Shape, shapeHostProps, type ShapeColor } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

const TONE: Record<NonNullable<TagProps["tone"]>, ShapeColor> = {
  neutral: "surface-sunken",
  primary: "primary-soft",
  "secondary-1": "secondary-1-soft",
  "secondary-2": "secondary-2-soft",
}

const DOT = {
  success: "fill-success-fill",
  warning: "fill-warning-fill",
} as const

export interface TagProps {
  children: ReactNode
  tone?: "neutral" | "primary" | "secondary-1" | "secondary-2"
  /**
   * Ponto de status antes do texto ("no ar", "em andamento"). Decorativo: o
   * texto continua sendo o portador do significado (VI-06).
   */
  dot?: keyof typeof DOT
  as?: "span" | "li"
  seed?: string
  className?: string
}

/** Etiqueta estática (tecnologia, categoria, status). Não é clicável. Ficha: docs/specs/tag-chip.md */
export function Tag({
  children,
  tone = "neutral",
  dot,
  as: Root = "span",
  seed,
  className,
}: TagProps) {
  const shapeSeed = seed ?? `tag:${typeof children === "string" ? children : tone}`
  const host = shapeHostProps({
    seed: shapeSeed,
    kind: "pill",
    bucket: "sm",
    irregularity: 0.4,
  })
  const dotShape = dot
    ? generateShape({
        kind: "blob",
        seed: `${shapeSeed}:ponto`,
        points: 7,
        irregularity: 0.3,
      })
    : null
  return (
    <Root
      {...host}
      className={cn(
        "relative isolate inline-flex min-h-8 items-center gap-2 px-3.5 font-mono text-sm leading-none text-ink",
        className,
      )}
    >
      <Shape
        seed={shapeSeed}
        kind="pill"
        bucket="sm"
        irregularity={0.4}
        fill={TONE[tone]}
        strokeWidth={1.5}
      />
      {dot && dotShape ? (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1 1"
          data-ponto={dot}
          className="size-2.5 shrink-0 overflow-visible"
        >
          <path
            d={dotShape.path}
            className={cn(DOT[dot], "stroke-ink")}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
      {children}
    </Root>
  )
}
