"use client"

import { useEffect, type RefObject } from "react"
import { morphPath } from "./morph"
import type { Point } from "./path"

export interface ShapeMorphOptions {
  /** Duração de cada transição entre poses, em milissegundos. */
  periodMs?: number
  /** Quadros por segundo, no máximo 30. */
  fps?: number
  closed?: boolean
  /** Elemento observado para pausar fora da tela (padrão: o próprio caminho). */
  observe?: RefObject<Element | null>
}

/** Verdadeiro se quem usa pediu menos movimento. */
export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

/**
 * Anima o atributo `d` de um `<path>` entre 2 ou 3 poses de mesma contagem.
 * Escreve direto no DOM (sem re-render), limita a 30 fps, pausa fora da tela
 * e com a aba oculta, e fica parado na pose inicial com movimento reduzido.
 * O caminho renderizado no servidor deve ser a pose 0.
 */
export function useShapeMorph(
  pathRef: RefObject<SVGPathElement | null>,
  poses: readonly (readonly Point[])[],
  { periodMs = 9000, fps = 24, closed = true, observe }: ShapeMorphOptions = {},
): void {
  useEffect(() => {
    const path = pathRef.current
    if (!path || poses.length < 2) return
    const frameMs = 1000 / Math.min(30, Math.max(1, fps))
    const cycleMs = periodMs * poses.length
    let raf = 0
    let last = 0
    let elapsed = 0
    let prev = 0
    let visible = true
    let reduced = prefersReducedMotion()

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (prev === 0) prev = now
      const dt = now - prev
      prev = now
      if (!visible || reduced || document.hidden) return
      elapsed += dt
      if (now - last < frameMs) return
      last = now
      path.setAttribute("d", morphPath(poses, elapsed / cycleMs, closed))
    }

    const target = observe?.current ?? path
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
    })
    io.observe(target)

    let media: MediaQueryList | null = null
    const onMotion = () => {
      reduced = prefersReducedMotion()
      if (reduced) path.setAttribute("d", morphPath(poses, 0, closed))
    }
    try {
      media = window.matchMedia("(prefers-reduced-motion: reduce)")
      media.addEventListener("change", onMotion)
    } catch {
      media = null
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      media?.removeEventListener("change", onMotion)
    }
  }, [pathRef, poses, periodMs, fps, closed, observe])
}
