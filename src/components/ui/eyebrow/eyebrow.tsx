import type { ReactNode } from "react"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

export interface EyebrowProps {
  children: ReactNode
  as?: "p" | "span" | "div"
  tone?: "primary" | "muted"
  className?: string
  id?: string
}

/** Rótulo mono que antecede títulos, com um traço à mão. Ficha: docs/specs/eyebrow.md */
export function Eyebrow({
  children,
  as: Tag = "p",
  tone = "primary",
  className,
  id,
}: EyebrowProps) {
  const seed = typeof children === "string" ? children : "eyebrow"
  return (
    <Tag
      id={id}
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-label font-medium",
        tone === "primary" ? "text-primary-text" : "text-ink-subtle",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="h-2 w-6 shrink-0 overflow-visible text-primary-decor"
      >
        <path
          d={
            generateShape({
              kind: "handLine",
              seed: `eyebrow:${seed}`,
              bucket: "sm",
              irregularity: 0.3,
            }).path
          }
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span>{children}</span>
    </Tag>
  )
}
