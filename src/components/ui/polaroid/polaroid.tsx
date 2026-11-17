import type { ReactNode } from "react"
import { ImageFrame } from "@/components/ui/image-frame"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { createRandom, generateShape, toClipPath } from "@/lib/shapes"

type Photo =
  | { src: string; alt: string; placeholder?: never }
  | {
      src?: never
      alt?: never
      /** Pendência: `[a confirmar: foto N]`, de preferência por `Fact`. */
      placeholder: ReactNode
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
      {src ? (
        <ImageFrame ratio="square" src={src} alt={alt} />
      ) : (
        <ImageFrame ratio="square" placeholder={placeholder} />
      )}
      {caption ? (
        <figcaption className="min-h-7 px-1 font-hand text-hand font-medium text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
