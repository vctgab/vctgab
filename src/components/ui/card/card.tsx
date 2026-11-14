import Link from "next/link"
import type { Route } from "next"
import type { CSSProperties, ReactNode } from "react"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { createRandom, generateShape, toClipPath } from "@/lib/shapes"

export interface FichaProps {
  title: ReactNode
  children?: ReactNode
  eyebrow?: ReactNode
  media?: ReactNode
  footer?: ReactNode
  /** Torna a ficha clicável: um link único no título, cobrindo o card. */
  href?: string
  /** `false` desliga a pré-busca (rota que ainda não existe: sem 404 no console). */
  prefetch?: boolean
  titleAs?: "h2" | "h3" | "h4"
  edge?: "wobbly" | "torn"
  tape?: false | "left" | "right"
  holes?: boolean
  padding?: "md" | "lg"
  rotate?: boolean
  seed?: string
  className?: string
}

/** Fita adesiva: polígono de papel rasgado do motor, em clip-path (sem SVG). */
function Tape({ seed, side }: { seed: string; side: "left" | "right" }) {
  const shape = generateShape({ kind: "tornEdge", seed: `${seed}:fita`, bucket: "sm" })
  const rand = createRandom(`${seed}:fita-pos`)
  const style: CSSProperties = {
    clipPath: toClipPath(shape.points),
    rotate: `${(side === "left" ? -1 : 1) * rand.range(2, 4.5)}deg`,
  }
  return (
    <span
      aria-hidden="true"
      data-fita=""
      style={style}
      className={cn(
        "pointer-events-none absolute -top-3.5 z-(--z-raised) h-7 w-24 bg-tape forced-colors:hidden",
        side === "left" ? "left-7" : "right-8",
      )}
    />
  )
}

/** Furos de caderno: gradientes radiais com posição e tamanho por seed (sem SVG). */
function Holes({ seed }: { seed: string }) {
  const rand = createRandom(`${seed}:furos`)
  const count = 7
  const layers = Array.from({ length: count }, (_, i) => {
    const y = 4 + (i * 92) / (count - 1) + rand.signed() * 1.5
    const x = 10 + rand.signed() * 2
    const r = 4.5 + rand.next() * 1.5
    return `radial-gradient(circle at ${x.toFixed(1)}px ${y.toFixed(1)}%, var(--hole) 0 ${r.toFixed(1)}px, var(--hole-rim) ${(r + 0.5).toFixed(1)}px ${(r + 1.5).toFixed(1)}px, transparent ${(r + 2).toFixed(1)}px)`
  })
  return (
    <span
      aria-hidden="true"
      data-furos=""
      style={{ backgroundImage: layers.join(", ") }}
      className="pointer-events-none absolute top-5 bottom-5 left-3 w-6 forced-colors:hidden"
    />
  )
}

/**
 * Ficha de papel com sombra dura suave, contorno desenhado, fita e furos
 * opcionais e rotação fixa por seed. Ficha: docs/specs/card.md
 */
export function Ficha({
  title,
  children,
  eyebrow,
  media,
  footer,
  href,
  prefetch,
  titleAs: Title = "h3",
  edge = "wobbly",
  tape = false,
  holes = false,
  padding = "md",
  rotate = true,
  seed,
  className,
}: FichaProps) {
  const shapeSeed = seed ?? `ficha:${typeof title === "string" ? title : "sem-titulo"}`
  const kind = edge === "torn" ? "tornEdge" : "wobblyRect"
  const host = shapeHostProps({ seed: shapeSeed, kind, bucket: "lg", rotate })

  return (
    <article
      {...host}
      className={cn(
        "group/ficha relative isolate flex flex-col gap-2 text-ink",
        padding === "md" ? "p-6" : "p-8 md:p-10",
        holes && (padding === "md" ? "pl-14" : "pl-16 md:pl-18"),
        href &&
          "transition-[translate] duration-(--duration-state) ease-hand hover:-translate-y-0.5 hover:[--shape-shadow-x:calc(var(--shadow-offset-lg)+2px)] hover:[--shape-shadow-y:calc(var(--shadow-offset-lg)+2px)] active:translate-y-0 motion-reduce:hover:translate-y-0",
        href &&
          "has-[a:focus-visible]:outline-[2.5px] has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-focus-ring has-[a:focus-visible]:outline-solid",
        className,
      )}
    >
      <Shape
        seed={shapeSeed}
        kind={kind}
        bucket="lg"
        fill="surface-raised"
        shadow="lg"
        shadowColor="shadow-soft"
        edges={edge === "torn" ? ["bottom"] : undefined}
      />
      {tape ? <Tape seed={shapeSeed} side={tape} /> : null}
      {holes ? <Holes seed={shapeSeed} /> : null}
      {media ? <div className="mb-3">{media}</div> : null}
      {eyebrow ? (
        <div className="font-mono text-sm text-primary-text">{eyebrow}</div>
      ) : null}
      <Title className="font-soft text-h3">
        {href ? (
          <Link
            href={href as Route}
            prefetch={prefetch}
            className="text-ink group-hover/ficha:text-primary-text-hover after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </Title>
      {children ? <div className="text-body text-ink-muted">{children}</div> : null}
      {footer ? <div className="relative mt-4">{footer}</div> : null}
    </article>
  )
}
