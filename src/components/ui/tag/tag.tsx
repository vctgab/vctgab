import type { ReactNode } from "react"
import { Shape, shapeHostProps, type ShapeColor } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

const TONE: Record<NonNullable<TagProps["tone"]>, ShapeColor> = {
  neutral: "surface-sunken",
  primary: "primary-soft",
  "secondary-1": "secondary-1-soft",
  "secondary-2": "secondary-2-soft",
}

export interface TagProps {
  children: ReactNode
  tone?: "neutral" | "primary" | "secondary-1" | "secondary-2"
  as?: "span" | "li"
  seed?: string
  className?: string
}

/** Etiqueta estática (tecnologia, categoria). Não é clicável. Ficha: docs/specs/tag-chip.md */
export function Tag({
  children,
  tone = "neutral",
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
  return (
    <Root
      {...host}
      className={cn(
        "relative isolate inline-flex min-h-8 items-center px-3.5 font-mono text-sm leading-none text-ink",
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
      {children}
    </Root>
  )
}
