import Link from "next/link"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

export interface LogoProps {
  /** `inverse` para fundos escuros (rodapé). */
  tone?: "default" | "inverse"
  /** Nome acessível do link. */
  label?: string
  href?: "/" | "/sistema"
  /** Esconde o nome no mobile, deixando só o selo. */
  compact?: boolean
  className?: string
}

/** Selo do pinheiro num círculo desenhado + nome em Fraunces. */
export function Logo({
  tone = "default",
  label = "Victor Gabriel, início",
  href = "/",
  compact = false,
  className,
}: LogoProps) {
  const ring = generateShape({
    kind: "blob",
    seed: "logo:selo",
    points: 10,
    irregularity: 0.25,
  })
  const inverse = tone === "inverse"
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "font-soft inline-flex min-h-11 items-center gap-2.5 font-display text-body-lg font-bold whitespace-nowrap",
        inverse ? "text-footer-ink" : "text-ink",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 36 36"
        className="size-9 shrink-0"
      >
        <svg
          viewBox="0 0 1 1"
          x="1.5"
          y="1.5"
          width="33"
          height="33"
          preserveAspectRatio="none"
        >
          <path
            d={ring.path}
            className={
              inverse
                ? "fill-footer-bg stroke-footer-ink"
                : "fill-surface-raised stroke-stroke"
            }
            strokeWidth={2.2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <path
          d="M18 7.6 12.3 17.2h3.3l-4.5 6.6h5.4v3.9h3.2v-3.9h5.4l-4.5-6.6h3.3Z"
          className={inverse ? "fill-footer-ink" : "fill-ink"}
        />
      </svg>
      <span className={cn(compact && "max-sm:sr-only")}>Victor Gabriel</span>
    </Link>
  )
}
