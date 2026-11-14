"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Marca `data-pausado` quando o bloco sai da tela ou a aba fica oculta; o CSS
 * pausa as animações decorativas de dentro.
 */
export function PausaForaDaTela({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visible = true
    const apply = () => el.toggleAttribute("data-pausado", !visible || document.hidden)
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
      apply()
    })
    io.observe(el)
    document.addEventListener("visibilitychange", apply)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", apply)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("[&[data-pausado]_*]:[animation-play-state:paused]", className)}
    >
      {children}
    </div>
  )
}
