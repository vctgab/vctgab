import type { ReactNode } from "react"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { createRandom, generateShape, toClipPath } from "@/lib/shapes"

type Photo =
  | { src: string; alt: string; placeholder?: never }
  | {
      src?: never
      alt?: never
      /** Texto exato `[a confirmar: foto N]`. */ placeholder: string
    }

export type PolaroidProps = Photo & {
  caption?: ReactNode
  tape?: boolean
  seed: string
  className?: string
}

/** Moldura de foto torta com legenda em Caveat. Ficha: docs/specs/p1-visuals.md */
export function Polaroid({
  src,
  alt,
  placeholder,
  caption,
  tape = true,
  seed,
  className,
}: PolaroidProps) {
  const host = shapeHostProps({
    seed,
    bucket: "lg",
    nominal: { w: 260, h: 300 },
    rotate: true,
  })
  const tapeShape = generateShape({
    kind: "tornEdge",
    seed: `${seed}:fita`,
    bucket: "sm",
  })
  const rand = createRandom(`${seed}:fita-pos`)
  return (
    <figure
      {...host}
      className={cn("relative isolate flex flex-col gap-3 p-3 pb-4", className)}
    >
      <Shape
        seed={seed}
        bucket="lg"
        nominal={{ w: 260, h: 300 }}
        irregularity={0.35}
        fill="surface-raised"
        shadow="md"
        shadowColor="shadow-soft"
      />
      {tape ? (
        <span
          aria-hidden="true"
          style={{
            clipPath: toClipPath(tapeShape.points),
            rotate: `${rand.range(-5, 5).toFixed(1)}deg`,
            left: `${rand.range(25, 45).toFixed(0)}%`,
          }}
          className="pointer-events-none absolute -top-3 z-(--z-raised) h-6 w-20 bg-tape forced-colors:hidden"
        />
      ) : null}
      <div className="aspect-square w-full overflow-hidden">
        {src ? (
          // Fotos do portfólio serão estáticas e pequenas; next/image entra com as páginas reais.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" loading="lazy" />
        ) : (
          <div
            className="grid size-full place-items-center p-3 text-center font-mono text-label text-ink-muted"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--hatch-a) 0 8px, var(--hatch-b) 8px 16px)",
            }}
          >
            {placeholder}
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="min-h-7 px-1 font-hand text-hand font-medium text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
