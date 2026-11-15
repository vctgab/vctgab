"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react"
import { prefersReducedMotion, useShapeMorph } from "@/lib/shapes/use-shape-morph"
import { useTheme } from "@/lib/theme/theme-provider"
import { buildComposition, type HeroShape } from "./composition"

function MorphPath({
  shape,
  observe,
}: {
  shape: HeroShape
  observe: RefObject<HTMLElement | null>
}) {
  const ref = useRef<SVGPathElement>(null)
  useShapeMorph(ref, shape.poses ?? [], {
    periodMs: shape.drift.duration * 400,
    fps: 24,
    observe,
  })
  return <path ref={ref} d={shape.path} />
}

/** Eventos que contam como primeira interação (o morph começa aqui). */
const FIRST_INTERACTION = [
  "pointermove",
  "pointerdown",
  "scroll",
  "keydown",
  "touchstart",
]

/**
 * Fundo do hero: formas em camadas, deriva lenta (CSS), morph em até três
 * blobs, paralaxe ao rolar e resposta leve ao ponteiro (desktop). Pausa fora
 * da tela e fica parado com movimento reduzido. Decorativo.
 * O morph começa na primeira interação (D-1027): até lá, a deriva em CSS já
 * dá vida ao fundo e a hidratação não disputa o processador com a troca de
 * caminhos a 24 fps.
 * Ficha: docs/specs/hero-footer.md
 */
export function HeroBackdrop({ seed, count }: { seed: string; count?: number }) {
  const { info } = useTheme()
  const shapes = useMemo(
    () => buildComposition(seed, { count, energy: info.energy }),
    [seed, count, info.energy],
  )
  const root = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const start = () => {
      setLive(true)
      for (const type of FIRST_INTERACTION) window.removeEventListener(type, start)
    }
    for (const type of FIRST_INTERACTION)
      window.addEventListener(type, start, { passive: true, once: true })
    return () => {
      for (const type of FIRST_INTERACTION) window.removeEventListener(type, start)
    }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    let visible = true
    let raf = 0
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    const finePointer = window.matchMedia("(pointer: fine)").matches

    const frame = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const progress =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height) - 0.5
      x += (targetX - x) * 0.12
      y += (targetY - y) * 0.12
      el.style.setProperty("--rolagem", (progress * 100).toFixed(2))
      el.style.setProperty("--px", x.toFixed(3))
      el.style.setProperty("--py", y.toFixed(3))
      if (Math.abs(targetX - x) > 0.002 || Math.abs(targetY - y) > 0.002) schedule()
    }
    const schedule = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const onPointer = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      schedule()
    }
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting)
      el.toggleAttribute("data-pausado", !visible)
      if (visible) schedule()
    })
    io.observe(el)
    window.addEventListener("scroll", schedule, { passive: true })
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true })
    schedule()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("pointermove", onPointer)
    }
  }, [])

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-hero-fundo=""
      className="pointer-events-none absolute inset-0 overflow-hidden forced-colors:hidden [&[data-pausado]_*]:[animation-play-state:paused]"
    >
      {shapes.map((shape) => {
        const outer: CSSProperties = {
          left: `${shape.left}%`,
          top: `${shape.top}%`,
          width: `${shape.width}%`,
          aspectRatio: String(shape.aspect),
          transform: `translate3d(calc(var(--px, 0) * ${shape.depth} * 16px), calc(var(--rolagem, 0) * ${shape.depth} * -1.2px + var(--py, 0) * ${shape.depth} * 10px), 0) rotate(${shape.rotation}deg)`,
        }
        const inner = {
          "--deriva-x": `${shape.drift.x}px`,
          "--deriva-y": `${shape.drift.y}px`,
          "--deriva-giro": `${shape.drift.turn}deg`,
          "--deriva-duracao": `${shape.drift.duration}s`,
          animationDelay: `${shape.drift.delay}s`,
          color: `var(--hero-shape-${shape.color})`,
        } as CSSProperties
        return (
          <div key={shape.id} data-forma-hero="" className="absolute" style={outer}>
            <svg
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              focusable="false"
              className="block size-full overflow-visible fill-current motion-safe:animate-deriva"
              style={inner}
            >
              {shape.poses && live ? (
                <MorphPath shape={shape} observe={root} />
              ) : (
                <path d={shape.path} />
              )}
            </svg>
          </div>
        )
      })}
    </div>
  )
}
