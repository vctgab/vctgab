import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { Fact } from "@/components/ui/fact"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { Tag } from "@/components/ui/tag"
import { isPending, type Maybe } from "@/content/pending"
import { cn } from "@/lib/cn"
import { FigureDialog } from "./figure-dialog"

export interface CaseFigureImageData {
  src: string
  /** Largura e altura reais do arquivo: a altura existe antes da imagem (CLS 0). */
  width: number
  height: number
  /** O que a tela mostra (nunca o nome do arquivo). */
  alt: string
}

export interface CaseFigureItem {
  /** Id estável: seed da moldura. */
  id: string
  variant: "browser" | "phone"
  /** Sem imagem, a moldura mostra `[a confirmar: print: <arquivo>]`. */
  image: Maybe<CaseFigureImageData>
  priority?: boolean
}

/** Proporção mínima exibida (largura ÷ altura): prints mais altos são cortados embaixo (D-1310). */
const MIN_RATIO = { browser: 16 / 10, phone: 390 / 844 } as const

const SIZES = {
  browser: "(min-width: 1024px) 896px, calc(100vw - 2rem)",
  phone: "(min-width: 768px) 256px, 224px",
} as const

/** Moldura de navegador (desktop) ou de celular, com o print dentro. */
function Frame({ item, sizes }: { item: CaseFigureItem; sizes?: string }) {
  const { id, variant, image, priority } = item
  const seed = `caso:${id}`
  const browser = variant === "browser"
  const ratio = Math.max(
    isPending(image) ? 0 : image.width / image.height,
    MIN_RATIO[variant],
  )
  const bucket = browser ? "lg" : "md"
  const irregularity = browser ? undefined : 0.2
  const host = shapeHostProps({ seed, kind: "wobblyRect", bucket, irregularity })
  return (
    <div
      {...host}
      data-moldura={variant}
      className={cn(
        "relative isolate flex flex-col text-ink",
        browser ? "p-2.5 pt-0" : "p-3 pt-6",
      )}
    >
      <Shape
        seed={seed}
        kind="wobblyRect"
        bucket={bucket}
        irregularity={irregularity}
        fill="surface-raised"
        shadow="md"
        shadowColor="shadow-soft"
        strokeWidth={2}
      />
      {browser ? (
        <div aria-hidden="true" className="flex h-9 items-center gap-1.5 px-2">
          {[0, 1, 2].map((n) => (
            <span
              key={n}
              {...shapeHostProps({
                seed: `${seed}:ponto:${n}`,
                kind: "blob",
                bucket: "sm",
              })}
              className="size-2.5 bg-border-strong"
            />
          ))}
          <span
            {...shapeHostProps({ seed: `${seed}:endereco`, kind: "pill", bucket: "sm" })}
            className="ms-3 h-4 flex-1 bg-surface-sunken"
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          {...shapeHostProps({
            seed: `${seed}:alto-falante`,
            kind: "pill",
            bucket: "sm",
          })}
          className="absolute start-1/2 top-2 h-1.5 w-12 -translate-x-1/2 bg-border-strong"
        />
      )}
      <div
        className="relative w-full overflow-hidden bg-surface-sunken forced-colors:border forced-colors:border-solid"
        style={{ aspectRatio: String(ratio) } satisfies CSSProperties}
      >
        {isPending(image) ? (
          <div
            data-moldura-pendente=""
            className="grid size-full place-items-center p-3 text-center font-mono text-label text-ink-muted"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--hatch-a) 0 8px, var(--hatch-b) 8px 16px)",
            }}
          >
            <Fact value={image} />
          </div>
        ) : (
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            sizes={sizes ?? SIZES[variant]}
            preload={priority}
            className="size-full object-cover object-top"
          />
        )}
      </div>
    </div>
  )
}

/**
 * Print numa moldura desenhada à mão que se amplia num diálogo, sem o
 * `figure` em volta: usado por `CaseFigure` e por `CaseFigureGroup`.
 */
export function CaseFigureImage({
  item,
  title,
  sizes,
  className,
}: {
  item: CaseFigureItem
  /** Título do diálogo (a legenda). */
  title: ReactNode
  sizes?: string
  className?: string
}) {
  const { image, variant } = item
  if (isPending(image)) {
    return (
      <div className={className}>
        <Frame item={item} sizes={sizes} />
      </div>
    )
  }
  return (
    <div className={className}>
      <FigureDialog
        title={title}
        size={variant === "browser" ? "xl" : "md"}
        seed={`caso:${item.id}:ampliar`}
        trigger={
          <button
            type="button"
            data-ampliar=""
            className={cn(
              "group/figura relative block min-h-11 w-full cursor-pointer text-start",
              "transition-[translate] duration-(--duration-state) ease-hand hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
              "focus-visible:outline-[2.5px] focus-visible:outline-offset-4 focus-visible:outline-focus-ring focus-visible:outline-solid",
            )}
          >
            <span className="sr-only">Ampliar imagem: </span>
            <Frame item={item} sizes={sizes} />
            <span aria-hidden="true" className="absolute end-5 bottom-5">
              <Tag tone="primary" seed={`caso:${item.id}:selo`}>
                ampliar
              </Tag>
            </span>
          </button>
        }
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes="(min-width: 1280px) 1100px, 100vw"
          className={cn("h-auto w-full", variant === "phone" && "mx-auto max-w-sm")}
        />
      </FigureDialog>
    </div>
  )
}

export interface CaseFigureProps extends CaseFigureItem {
  caption: ReactNode
  sizes?: string
  className?: string
}

/** Print com legenda e ampliação. Ficha: docs/specs/case-figure.md */
export function CaseFigure({ caption, sizes, className, ...item }: CaseFigureProps) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-4",
        item.variant === "phone" && "mx-auto w-full max-w-64",
        className,
      )}
    >
      <CaseFigureImage item={item} title={caption} sizes={sizes} />
      <figcaption className="text-body text-ink-muted">{caption}</figcaption>
    </figure>
  )
}

export interface CaseFigureGroupProps {
  figures: readonly CaseFigureItem[]
  /** Uma legenda para o grupo todo. */
  caption: ReactNode
  className?: string
}

/**
 * Várias figuras lado a lado (empilhadas no celular) com uma legenda só: desktop
 * e celular, três celulares ou dois desktops. Ficha: docs/specs/case-figure.md
 */
export function CaseFigureGroup({ figures, caption, className }: CaseFigureGroupProps) {
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-6">
        {figures.map((item) => (
          <CaseFigureImage
            key={item.id}
            item={item}
            title={caption}
            sizes={
              item.variant === "phone"
                ? SIZES.phone
                : "(min-width: 1024px) 400px, calc(100vw - 2rem)"
            }
            className={cn(
              "w-full",
              item.variant === "phone" ? "max-w-56 md:max-w-64" : "md:flex-1",
            )}
          />
        ))}
      </div>
      <figcaption className="text-body text-ink-muted">{caption}</figcaption>
    </figure>
  )
}
