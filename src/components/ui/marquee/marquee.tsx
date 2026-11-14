import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/cn"

export interface MarqueeProps {
  /** Nome da região ("Projetos em destaque"). */
  label: string
  children: ReactNode
  /** Duração de uma volta, em segundos (decorativo; padrão 52). */
  durationS?: number
  className?: string
}

/**
 * Faixa em laço horizontal, só CSS. Pausa com hover, foco ou toque; com
 * movimento reduzido vira rolagem manual e a cópia some. A cópia é
 * `aria-hidden` e `inert`. Ficha: docs/specs/movimento.md
 */
export function Marquee({ label, children, durationS = 52, className }: MarqueeProps) {
  const style = { "--faixa-duracao": `${durationS}s` } as CSSProperties
  return (
    <section
      aria-label={label}
      style={style}
      className={cn(
        "group/faixa relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]",
        "motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]",
        className,
      )}
    >
      <div
        data-faixa=""
        className={cn(
          "flex w-max motion-safe:animate-faixa",
          "group-focus-within/faixa:[animation-play-state:paused] group-hover/faixa:[animation-play-state:paused] group-active/faixa:[animation-play-state:paused]",
        )}
      >
        <div className="flex shrink-0 items-start gap-8 py-8 pe-8">{children}</div>
        <div
          aria-hidden="true"
          inert
          className="flex shrink-0 items-start gap-8 py-8 pe-8 motion-reduce:hidden"
          data-copia=""
        >
          {children}
        </div>
      </div>
    </section>
  )
}
