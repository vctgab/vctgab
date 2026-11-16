"use client"

import { ToggleGroup } from "radix-ui"
import { useId, useState, type CSSProperties, type ReactNode } from "react"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

export interface SegmentOption {
  value: string
  label: ReactNode
}

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type SegmentedControlProps = DisabledProps & {
  /** Nome do grupo para leitores de tela ("Visualização dos projetos"). */
  label: string
  options: readonly SegmentOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  seed?: string
  /** Ocupa a largura toda do contêiner (por exemplo, dentro de um Popover). */
  block?: boolean
  className?: string
}

/**
 * Alterna entre 2 a 4 visões equivalentes. Segmentos de largura igual, então
 * o indicador desliza por `translate` calculado pelo índice, sem medir nada.
 * Ficha: docs/specs/controls.md
 */
export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  disabledReason,
  seed,
  block = false,
  className,
}: SegmentedControlProps) {
  const id = useId()
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value ?? "")
  const current = value ?? inner
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === current),
  )
  // Valor fora das opções (estado neutro antes da hidratação): sem indicador.
  const hasValue = options.some((o) => o.value === current)
  const count = Math.max(1, options.length)
  const shapeSeed = seed ?? `segmentado:${label}`
  const host = shapeHostProps({ seed: shapeSeed, bucket: "sm" })

  const indicatorStyle: CSSProperties = {
    width: `calc((100% - 0.5rem) / ${count})`,
    translate: `calc(${index} * 100%) 0`,
  }

  return (
    <div
      className={cn(
        "flex max-w-full flex-col gap-1",
        block ? "w-full" : "inline-flex",
        className,
      )}
    >
      <ToggleGroup.Root
        {...host}
        type="single"
        aria-label={label}
        aria-describedby={disabled ? `${id}-motivo` : undefined}
        value={current}
        disabled={disabled}
        onValueChange={(next) => {
          // Sempre uma visão escolhida: ignorar a tentativa de desmarcar.
          if (!next) return
          if (value === undefined) setInner(next)
          onValueChange?.(next)
        }}
        style={{ ...host.style, gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        className={cn("relative isolate grid p-1", block && "w-full")}
      >
        <Shape
          seed={shapeSeed}
          bucket="sm"
          fill="surface-sunken"
          misalign={false}
          strokeWidth={1.75}
        />
        <span
          aria-hidden="true"
          data-indicador=""
          data-indice={index}
          style={indicatorStyle}
          className={cn(
            "pointer-events-none absolute inset-y-1 left-1 transition-[translate] duration-(--duration-state) ease-hand motion-reduce:transition-none",
            !hasValue && "hidden",
          )}
        >
          <span className="absolute inset-0 isolate">
            <Shape
              seed={`${shapeSeed}:indicador`}
              kind="pill"
              bucket="sm"
              fill="primary-soft"
              strokeWidth={2.5}
              misalign={false}
            />
          </span>
        </span>
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            className={cn(
              "relative min-h-11 cursor-pointer text-body text-ink-muted outline-offset-1 select-none",
              block ? "px-1 text-sm whitespace-nowrap" : "px-4",
              "hover:text-ink data-[state=on]:font-medium data-[state=on]:text-ink",
              "disabled:cursor-not-allowed disabled:text-ink-disabled",
            )}
          >
            {/* O texto marcado fica em negrito e mais largo: uma cópia invisível
                em negrito reserva a largura, e o controle não se mexe ao marcar
                (nem na hidratação). */}
            <span className="grid justify-items-center">
              <span className="col-start-1 row-start-1">{option.label}</span>
              <span
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 font-medium"
              >
                {option.label}
              </span>
            </span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      {disabled ? (
        <p id={`${id}-motivo`} className="text-sm text-ink-muted">
          {disabledReason}
        </p>
      ) : null}
    </div>
  )
}
