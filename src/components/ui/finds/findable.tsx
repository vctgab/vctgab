"use client"

import type { ReactNode } from "react"
import { getAchado, type AchadoId } from "@/lib/finds/finds"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"
import { useAchados } from "./finds-provider"

export interface AchavelProps {
  id: AchadoId
  /** Nome acessível antes de achar ("Algo entre as formas do hero"). */
  label: string
  /** O desenho do achado (decorativo). */
  children: ReactNode
  className?: string
}

/**
 * Torna um elemento descobrível. Botão com alvo de 44 px ou mais; ao achar,
 * dá um pulo curto, ganha a marca tracejada e o provider anuncia.
 * Ficha: docs/specs/finds.md
 */
export function Achavel({ id, label, children, className }: AchavelProps) {
  const { state, find } = useAchados()
  const found = state?.found.includes(id) ?? false
  const ring = generateShape({ kind: "hole", seed: `achavel:${id}`, bucket: "sm" })

  return (
    <button
      type="button"
      aria-pressed={found}
      aria-label={found ? `${getAchado(id).nome}, achado` : label}
      data-achado={found ? "" : undefined}
      onClick={() => find(id)}
      style={{ borderRadius: ring.borderRadius }}
      className={cn(
        "group/achavel relative inline-grid min-h-11 min-w-11 cursor-pointer place-items-center p-1",
        "[&>*]:transition-[rotate,scale] [&>*]:duration-(--duration-state) [&>*]:ease-hand",
        "hover:[&>*]:-rotate-6 motion-reduce:hover:[&>*]:rotate-0",
        "data-achado:motion-safe:[&>*]:animate-pulo",
        className,
      )}
    >
      <span aria-hidden="true" className="contents">
        {children}
      </span>
      {found ? (
        <span
          aria-hidden="true"
          style={{ borderRadius: ring.borderRadius }}
          className="pointer-events-none absolute inset-0 border-2 border-dashed border-primary-decor"
        />
      ) : null}
    </button>
  )
}
