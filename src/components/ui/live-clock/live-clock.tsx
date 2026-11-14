"use client"

import { useSyncExternalStore } from "react"
import { cn } from "@/lib/cn"
import { formatTime, formatTimeWithSeconds, toIsoString } from "@/lib/format"

function subscribe(onChange: () => void): () => void {
  const timer = setInterval(onChange, 1000)
  return () => clearInterval(timer)
}

/** Segundo atual (estável dentro do mesmo segundo). */
const getSnapshot = () => Math.floor(Date.now() / 1000)
/** No servidor não há relógio: a hora só aparece depois de montar. */
const getServerSnapshot = () => null

export interface LiveClockProps {
  /** Mostra os segundos (padrão). */
  seconds?: boolean
  /** Prefixo do nome acessível. */
  label?: string
  className?: string
}

/**
 * Hora de Teresina, atualizada a cada segundo. Reserva a largura no
 * servidor para não haver salto nem erro de hidratação.
 * Ficha: docs/specs/motion.md
 */
export function LiveClock({
  seconds = true,
  label = "Horário em Teresina",
  className,
}: LiveClockProps) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const placeholder = seconds ? "00:00:00" : "00:00"

  if (now === null) {
    return (
      <span className={cn("tabular inline-grid font-mono", className)} aria-hidden="true">
        <span className="invisible">{placeholder}</span>
      </span>
    )
  }
  const date = new Date(now * 1000)
  return (
    <time
      dateTime={toIsoString(date)}
      aria-label={`${label}: ${formatTime(date)}`}
      className={cn("tabular inline-grid font-mono", className)}
    >
      {seconds ? formatTimeWithSeconds(date) : formatTime(date)}
    </time>
  )
}
