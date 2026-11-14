"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"

export interface RevealProps {
  children: ReactNode
  /** Atraso em passos de 80 ms. */
  delay?: 0 | 1 | 2
  as?: "div" | "section" | "li"
  className?: string
}

const DELAY = [
  "",
  "[transition-delay:var(--delay-step)]",
  "[transition-delay:calc(var(--delay-step)*2)]",
] as const

/**
 * Entrada suave ao rolar. Só esconde quando há JavaScript (`[data-js]` no
 * <html>) e movimento permitido; sem isso, o conteúdo já nasce visível.
 * Ficha: docs/specs/movimento.md
 */
export function Reveal({ children, delay = 0, as: Tag = "div", className }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute("data-visivel", "")
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node
      }}
      data-reveal=""
      className={cn(
        "transition-[opacity,translate,rotate] duration-(--duration-slow) ease-out",
        DELAY[delay],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
