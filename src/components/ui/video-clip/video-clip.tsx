"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Ficha } from "@/components/ui/card"
import { Fact } from "@/components/ui/fact"
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"
import { isPending, type Maybe } from "@/content/pending"

export interface VideoClipProps {
  title: string
  /** Arquivo do vídeo; pendente vira Ficha marcada; `null` é projeto sem vídeo. */
  src: Maybe<string> | null
  /** Legenda WebVTT em pt-BR (obrigatória quando há vídeo). */
  captions: Maybe<string>
  poster?: Maybe<string>
  description?: Maybe<string>
  seed: string
  className?: string
}

type Phase = "carregando" | "pronto" | "erro"

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return true
  }
}

/**
 * Vídeo curto de produto: sem som, com legenda e controles. Pendente, vira
 * uma Ficha marcada, nunca um player vazio. Ficha: docs/specs/video-clip.md
 */
export function VideoClip({
  title,
  src,
  captions,
  poster,
  description,
  seed,
  className,
}: VideoClipProps) {
  const id = useId()
  const video = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<Phase>("carregando")
  const ready = src !== null && !isPending(src) && !isPending(captions)

  // Reprodução automática em laço só com movimento permitido (ES-02).
  useEffect(() => {
    const el = video.current
    if (!el || !ready || prefersReducedMotion()) return
    el.play()?.catch(() => {
      // O navegador pode barrar; os controles continuam disponíveis.
    })
  }, [ready])

  const frame = (children: ReactNode) => (
    <Ficha
      title={title}
      titleAs="h3"
      seed={`video:${seed}`}
      rotate={false}
      className={className}
    >
      {children}
    </Ficha>
  )

  if (src === null) return frame(<p>Este projeto ainda não tem vídeo.</p>)

  if (!ready) {
    return frame(
      <div className="flex flex-col gap-2">
        <p>
          <Fact value={isPending(src) ? src : captions} />
        </p>
        {description ? (
          <p>
            <Fact value={description} />
          </p>
        ) : null}
      </div>,
    )
  }

  return frame(
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden bg-surface-sunken">
        <video
          ref={video}
          aria-label={title}
          aria-describedby={`${id}-estado`}
          src={src}
          poster={poster && !isPending(poster) ? poster : undefined}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setPhase("pronto")}
          onError={() => setPhase("erro")}
          className="size-full object-cover"
        >
          <track
            kind="captions"
            srcLang="pt-BR"
            label="Português"
            src={captions}
            default
          />
        </video>
      </div>
      <div id={`${id}-estado`}>
        {phase === "carregando" ? <Spinner size={16} label="Carregando vídeo" /> : null}
        {phase === "erro" ? (
          <p role="alert" className="flex items-start gap-2 text-danger-text">
            <Icon name="alerta" size={20} decorative className="mt-0.5" />
            <span>
              <span className="font-medium">Não foi possível carregar o vídeo.</span>{" "}
              Verifique a conexão e recarregue a página. Nada do que você fez nesta página
              se perdeu.
            </span>
          </p>
        ) : null}
        {description && phase === "pronto" ? (
          <p>
            <Fact value={description} />
          </p>
        ) : null}
      </div>
    </div>,
  )
}
