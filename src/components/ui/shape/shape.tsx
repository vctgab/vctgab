import type { CSSProperties } from "react"
import {
  generateShapePair,
  type Seed,
  type ShapeBucket,
  type ShapeKind,
  type ShapeResult,
  type TornSide,
} from "@/lib/shapes"

/** Tokens de cor aceitos pelas camadas (nunca cor literal). */
export type ShapeColor =
  | "surface-base"
  | "surface-raised"
  | "surface-sunken"
  | "ink"
  | "stroke"
  | "border"
  | "border-strong"
  | "primary-fill"
  | "primary-soft"
  | "primary-decor"
  | "secondary-1-fill"
  | "secondary-1-soft"
  | "secondary-2-fill"
  | "secondary-2-soft"
  | "success-soft"
  | "warning-soft"
  | "danger-soft"
  | "danger-fill"
  | "shadow-ink"
  | "shadow-soft"
  | "tape"
  | "hole"
  | "footer-bg"
  | "hero-plate"

export type ShapeShadow = "none" | "sm" | "md" | "lg"

export interface ShapeProps {
  /** Seed da forma. Mesma seed, mesmo contorno, sempre. */
  seed: Seed
  kind?: ShapeKind
  bucket?: ShapeBucket
  /** 0 a 1. */
  irregularity?: number
  edges?: readonly TornSide[]
  /** Quantidade de pontos (padrão do bucket). */
  points?: number
  /** Só `handLine`: ondas regulares. */
  waves?: number
  /** Preenchimento padrão; o hospedeiro pode trocar por estado com `--shape-fill`. */
  fill?: ShapeColor | "none"
  /** Contorno padrão; o hospedeiro pode trocar com `--shape-stroke`. */
  stroke?: ShapeColor | "none"
  /** Espessura do traço em pixels (não escala com o elemento). */
  strokeWidth?: number
  /** Sombra dura deslocada, sem desfoque. */
  shadow?: ShapeShadow
  shadowColor?: Extract<ShapeColor, "shadow-ink" | "shadow-soft">
  /** Desalinha o preenchimento do contorno (1 a 3 px × energia do tema). */
  misalign?: boolean
}

const SHADOW_OFFSET: Record<Exclude<ShapeShadow, "none">, string> = {
  sm: "var(--shadow-offset-sm)",
  md: "var(--shadow-offset-md)",
  lg: "var(--shadow-offset-lg)",
}

const LAYER =
  "pointer-events-none absolute inset-0 z-(--z-below) block size-full overflow-visible select-none"

function Layer({
  shape,
  style,
  stroke,
  strokeWidth,
  name,
}: {
  shape: ShapeResult
  style: CSSProperties
  stroke?: boolean
  strokeWidth?: number
  name: string
}) {
  return (
    <svg
      data-shape-layer={name}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      shapeRendering="geometricPrecision"
      className={LAYER}
      style={style}
    >
      {stroke ? (
        <path
          d={shape.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <path d={shape.path} fill="currentColor" />
      )}
    </svg>
  )
}

/**
 * Desenha até três camadas SVG (sombra, preenchimento, contorno) atrás do
 * conteúdo de um hospedeiro com `position: relative` e `isolation: isolate`.
 * Puro e sem estado: funciona em Server Components.
 */
export function Shape({
  seed,
  kind = "wobblyRect",
  bucket = "md",
  irregularity,
  edges,
  points,
  waves,
  fill = "surface-raised",
  stroke = "stroke",
  strokeWidth = 2,
  shadow = "none",
  shadowColor = "shadow-ink",
  misalign = true,
}: ShapeProps) {
  const { fill: fillShape, outline } = generateShapePair({
    kind,
    seed,
    bucket,
    irregularity,
    edges,
    points,
    waves,
  })
  const open = !fillShape.closed

  const fillStyle: CSSProperties = {
    color: `var(--shape-fill, var(--${fill}))`,
    translate: misalign
      ? `round(calc(${fillShape.offset.x} * var(--shape-energy) * 1px), 1px) round(calc(${fillShape.offset.y} * var(--shape-energy) * 1px), 1px)`
      : undefined,
  }
  const shadowStyle: CSSProperties | null =
    shadow === "none"
      ? null
      : {
          color: `var(--shape-shadow-color, var(--${shadowColor}))`,
          translate: `var(--shape-shadow-x, ${SHADOW_OFFSET[shadow]}) var(--shape-shadow-y, ${SHADOW_OFFSET[shadow]})`,
          transition: "translate var(--duration-instant) var(--motion-ease-hand)",
        }

  return (
    <>
      {shadowStyle && !open ? (
        <Layer name="sombra" shape={fillShape} style={shadowStyle} />
      ) : null}
      {fill !== "none" && !open ? (
        <Layer name="preenchimento" shape={fillShape} style={fillStyle} />
      ) : null}
      {stroke !== "none" ? (
        <Layer
          name="contorno"
          shape={outline}
          stroke
          strokeWidth={strokeWidth}
          style={{ color: `var(--shape-stroke, var(--${stroke}))` }}
        />
      ) : null}
    </>
  )
}

export interface ShapeHostOptions {
  seed: Seed
  kind?: ShapeKind
  bucket?: ShapeBucket
  irregularity?: number
  /** Rotação máxima em graus; `false` desliga. */
  rotate?: boolean
  interactive?: boolean
}

/**
 * Props do hospedeiro de uma forma: marca para `forced-colors`, o
 * `border-radius` da mesma seed (o anel de foco segue o contorno) e a
 * rotação, multiplicada em CSS pela `--shape-rotation-max` do tema.
 */
export function shapeHostProps({
  seed,
  kind = "wobblyRect",
  bucket = "md",
  irregularity,
  rotate = false,
  interactive = false,
}: ShapeHostOptions): {
  "data-shape-host": ""
  "data-interactive"?: ""
  style: CSSProperties
} {
  const { fill } = generateShapePair({ kind, seed, bucket, irregularity })
  const style: CSSProperties = { borderRadius: fill.borderRadius }
  if (rotate && fill.rotation !== 0) {
    style.rotate = `calc(${fill.rotation} * var(--shape-rotation-max) * 1deg)`
  }
  return {
    "data-shape-host": "",
    ...(interactive ? { "data-interactive": "" as const } : {}),
    style,
  }
}
