"use client"

import { Switch as RadixSwitch } from "radix-ui"
import { useId, useState, type ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type SwitchProps = DisabledProps & {
  label: ReactNode
  description?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Mostra "Ligado"/"Desligado" ao lado (segundo indicador textual). */
  showState?: boolean
  name?: string
  seed?: string
  className?: string
}

const TRACK = { w: 48, h: 28 }

/**
 * Liga/desliga com efeito imediato. Ligado: trilho primário, botão à
 * direita e ícone de check (posição e ícone além da cor).
 * Ficha: docs/specs/controls.md
 */
export function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
  showState = false,
  name,
  disabled = false,
  disabledReason,
  seed,
  className,
}: SwitchProps) {
  const id = useId()
  const [inner, setInner] = useState(defaultChecked)
  const isOn = checked ?? inner
  const shapeSeed = seed ?? `switch:${name ?? String(label)}`
  const host = shapeHostProps({
    seed: shapeSeed,
    kind: "pill",
    bucket: "sm",
    nominal: TRACK,
    interactive: true,
  })
  const thumb = generateShape({
    kind: "blob",
    seed: `${shapeSeed}:botao`,
    points: 9,
    irregularity: 0.3,
  })
  const describedBy =
    [description ? `${id}-desc` : null, disabled ? `${id}-motivo` : null]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex min-h-11 items-center gap-3">
        <RadixSwitch.Root
          {...host}
          id={id}
          name={name}
          checked={isOn}
          onCheckedChange={(next) => {
            if (checked === undefined) setInner(next)
            onCheckedChange?.(next)
          }}
          disabled={disabled}
          aria-describedby={describedBy}
          className={cn(
            "group/switch relative isolate h-7 w-12 shrink-0 cursor-pointer",
            "[--shape-fill:var(--surface-sunken)] hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
            "data-[state=checked]:[--shape-fill:var(--primary-fill)] data-[state=checked]:hover:[--shape-fill:var(--primary-fill-hover)]",
            "disabled:cursor-not-allowed disabled:[--shape-dash:4_3]",
            // Alvo de 44 px sem mudar o desenho do trilho.
            "before:absolute before:-inset-x-1 before:-inset-y-2 before:content-['']",
          )}
        >
          <Shape
            seed={shapeSeed}
            kind="pill"
            bucket="sm"
            nominal={TRACK}
            fill="surface-sunken"
            misalign={false}
          />
          <RadixSwitch.Thumb
            className={cn(
              "absolute top-1 left-1 grid size-5 place-items-center text-primary-text",
              "transition-[translate] duration-(--duration-state) ease-hand motion-reduce:transition-none",
              "data-[state=checked]:translate-x-5",
            )}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 1 1"
              className="absolute inset-0 size-full overflow-visible"
            >
              <path
                d={thumb.path}
                className="fill-surface-raised stroke-stroke"
                strokeWidth={1.75}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {isOn ? (
              <Icon
                name="check"
                size={16}
                decorative
                className="relative [stroke-width:2.5]"
              />
            ) : null}
          </RadixSwitch.Thumb>
        </RadixSwitch.Root>
        <label htmlFor={id} className="flex cursor-pointer flex-col gap-0.5">
          <span className={cn("text-body text-ink", disabled && "text-ink-disabled")}>
            {label}
          </span>
          {description ? (
            <span id={`${id}-desc`} className="text-sm text-ink-muted">
              {description}
            </span>
          ) : null}
        </label>
        {showState ? (
          <span
            aria-hidden="true"
            className="ms-auto font-mono text-label text-ink-subtle"
          >
            {isOn ? "Ligado" : "Desligado"}
          </span>
        ) : null}
      </div>
      {disabled ? (
        <p id={`${id}-motivo`} className="text-sm text-ink-muted">
          {disabledReason}
        </p>
      ) : null}
    </div>
  )
}
