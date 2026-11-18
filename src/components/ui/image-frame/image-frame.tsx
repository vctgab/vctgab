import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

const RATIO = {
  video: "aspect-video",
  wide: "aspect-3/2",
  square: "aspect-square",
} as const

type Content =
  | { src: string; alt: string; placeholder?: never }
  | {
      src?: never
      alt?: never
      /** Rótulo da pendência (`[a confirmar: …]`, de preferência por `Fact`). */
      placeholder: ReactNode
    }

export type ImageFrameProps = Content & {
  /** Proporção fixa: a altura existe antes da imagem (sem CLS). */
  ratio?: keyof typeof RATIO
  /** `sizes` do `next/image` (largura da moldura em cada tela). */
  sizes?: string
  /** Carrega com prioridade (só a imagem principal da página). */
  priority?: boolean
  className?: string
}

/**
 * Moldura de imagem com proporção fixa. Sem imagem, a hachura do sistema com
 * o rótulo da pendência: nunca espaço vazio nem imagem inventada.
 * Ficha: docs/specs/image-frame.md
 */
export function ImageFrame({
  src,
  alt,
  placeholder,
  ratio = "video",
  sizes = "(min-width: 768px) 576px, 100vw",
  priority = false,
  className,
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden forced-colors:border forced-colors:border-solid",
        RATIO[ratio],
        className,
      )}
    >
      {src ? (
        // `fill` dentro da moldura de proporção fixa: nada se desloca (D-1309).
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          className="object-cover object-top"
        />
      ) : (
        <div
          data-moldura-pendente=""
          className="grid size-full place-items-center p-3 text-center font-mono text-label text-ink-muted forced-colors:bg-none!"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--hatch-a) 0 8px, var(--hatch-b) 8px 16px)",
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  )
}
