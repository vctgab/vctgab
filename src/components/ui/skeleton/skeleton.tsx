import { Shape } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

export interface SkeletonProps {
  /** `bloco` (retângulo) ou `linha` (linhas de texto em cápsula). */
  shape?: "bloco" | "linha"
  /** Número de linhas para `linha`. */
  lines?: number
  /** Altura do bloco (classe de altura do Tailwind, ex.: "h-40"). */
  heightClass?: string
  seed?: string
  className?: string
}

/**
 * Reserva o espaço de um conteúdo que ainda vai chegar. Decorativo: a região
 * que carrega usa `aria-busy`. Ficha: docs/specs/spinner.md
 */
export function Skeleton({
  shape = "bloco",
  lines = 3,
  heightClass = "h-32",
  seed = "esqueleto",
  className,
}: SkeletonProps) {
  if (shape === "linha") {
    return (
      <div
        aria-hidden="true"
        data-skeleton=""
        className={cn("flex flex-col gap-3", className)}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={cn(
              "relative isolate block h-4",
              i === lines - 1 ? "w-3/5" : "w-full",
            )}
          >
            <Shape
              seed={`${seed}:${i}`}
              kind="pill"
              bucket="md"
              fill="surface-sunken"
              stroke="none"
              misalign={false}
            />
          </span>
        ))}
      </div>
    )
  }
  return (
    <div
      aria-hidden="true"
      data-skeleton=""
      className={cn("relative isolate w-full", heightClass, className)}
    >
      <Shape
        seed={seed}
        bucket="lg"
        fill="surface-sunken"
        stroke="none"
        misalign={false}
      />
    </div>
  )
}
