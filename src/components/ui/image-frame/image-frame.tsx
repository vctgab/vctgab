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
  className,
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden forced-colors:border forced-colors:border-solid",
        RATIO[ratio],
        className,
      )}
    >
      {src ? (
        // Imagens estáticas e pequenas do próprio site; next/image entra com as páginas reais.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" loading="lazy" />
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
