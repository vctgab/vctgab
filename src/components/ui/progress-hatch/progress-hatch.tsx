import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { formatCount } from "@/lib/format"

export interface ProgressHatchProps {
  value: number
  max: number
  /** Nome acessível ("Progresso dos achados"). */
  label: string
  /** Mostra "3 de 7" abaixo da barra. */
  showValue?: boolean
  seed?: string
  className?: string
}

/**
 * Barra de progresso em hachura, com `role="progressbar"` e valor em texto.
 * Ficha: docs/specs/p1-visuais.md
 */
export function ProgressHatch({
  value,
  max,
  label,
  showValue = true,
  seed,
  className,
}: ProgressHatchProps) {
  const clamped = Math.min(max, Math.max(0, value))
  const ratio = max > 0 ? clamped / max : 0
  const text = formatCount(clamped, max)
  const shapeSeed = seed ?? `progresso:${label}`
  const done = clamped === max && max > 0

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        {...shapeHostProps({ seed: shapeSeed, bucket: "sm", nominal: { w: 320, h: 22 } })}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={text}
        className="relative isolate h-5.5 w-full p-1"
      >
        <Shape
          seed={shapeSeed}
          bucket="sm"
          nominal={{ w: 320, h: 22 }}
          fill="surface-raised"
          strokeWidth={1.75}
          misalign={false}
        />
        <div
          data-preenchimento=""
          style={{
            width: `${ratio * 100}%`,
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--secondary-1-fill) 0 3px, transparent 3px 7px)",
          }}
          className="h-full transition-[width] duration-(--duration-slow) ease-out motion-reduce:transition-none forced-colors:bg-[CanvasText]"
        />
      </div>
      {showValue ? (
        <p className="flex items-center gap-1.5 font-mono text-label text-ink-subtle">
          {done ? <Icon name="check" size={16} decorative /> : null}
          {text}
        </p>
      ) : null}
    </div>
  )
}
