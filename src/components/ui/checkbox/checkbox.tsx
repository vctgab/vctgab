"use client"

import { Checkbox as RadixCheckbox } from "radix-ui"
import { useId, type ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type CheckboxProps = DisabledProps & {
  label: ReactNode
  description?: ReactNode
  checked?: boolean | "indeterminate"
  defaultChecked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean | "indeterminate") => void
  name?: string
  value?: string
  required?: boolean
  error?: ReactNode
  seed?: string
  className?: string
}

const BOX = { w: 24, h: 24 }

/**
 * Caixa desenhada à mão. A linha inteira (rótulo incluso) é o alvo de toque.
 * Marcado: preenchimento primário e marca de check; indeterminado: traço.
 * Ficha: docs/specs/controles.md
 */
export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  name,
  value,
  required,
  error,
  disabled = false,
  disabledReason,
  seed,
  className,
}: CheckboxProps) {
  const id = useId()
  const shapeSeed = seed ?? `checkbox:${name ?? String(label)}`
  const host = shapeHostProps({
    seed: shapeSeed,
    bucket: "sm",
    irregularity: 0.35,
    nominal: BOX,
    interactive: true,
  })
  const extra = [
    description ? `${id}-desc` : null,
    error ? `${id}-erro` : null,
    disabled ? `${id}-motivo` : null,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "group/check flex min-h-11 items-start gap-3 py-2.5",
          disabled && "cursor-not-allowed",
        )}
      >
        <RadixCheckbox.Root
          {...host}
          id={id}
          name={name}
          value={value}
          required={required}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-describedby={extra || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            "relative isolate mt-px grid size-6 shrink-0 cursor-pointer place-items-center text-on-primary",
            "[--shape-fill:var(--surface-raised)] group-hover/check:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
            "data-[state=checked]:[--shape-fill:var(--primary-fill)] data-[state=checked]:group-hover/check:[--shape-fill:var(--primary-fill-hover)]",
            "data-[state=indeterminate]:[--shape-fill:var(--primary-fill)]",
            "aria-invalid:[--shape-stroke:var(--danger-fill)]",
            "disabled:cursor-not-allowed disabled:[--shape-dash:3_3] disabled:[--shape-fill:var(--surface-sunken)] disabled:group-hover/check:[--shape-fill:var(--surface-sunken)]",
          )}
        >
          <Shape
            seed={shapeSeed}
            bucket="sm"
            irregularity={0.35}
            nominal={BOX}
            fill="surface-raised"
            misalign={false}
            strokeWidth={1.75}
          />
          <RadixCheckbox.Indicator className="grid place-items-center">
            {checked === "indeterminate" ? (
              <Icon name="menos" size={16} decorative className="[stroke-width:2.75]" />
            ) : (
              <Icon name="check" size={16} decorative className="[stroke-width:2.75]" />
            )}
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        <span className="flex flex-col gap-0.5">
          <label
            htmlFor={id}
            className={cn(
              "cursor-pointer text-body text-ink",
              disabled && "cursor-not-allowed text-ink-disabled",
            )}
          >
            {label}
          </label>
          {description ? (
            <span id={`${id}-desc`} className="text-sm text-ink-muted">
              {description}
            </span>
          ) : null}
        </span>
      </div>
      {disabled ? (
        <p id={`${id}-motivo`} className="ps-9 text-sm text-ink-muted">
          {disabledReason}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-erro`}
          className="flex items-start gap-1.5 ps-9 text-sm font-medium text-danger-text"
        >
          <Icon name="alerta" size={16} decorative className="mt-0.5" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
