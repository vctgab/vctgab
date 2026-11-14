"use client"

import { RadioGroup as RadixRadio } from "radix-ui"
import { useId, type ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

export interface RadioOption {
  value: string
  label: ReactNode
  description?: ReactNode
}

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type RadioGroupProps = DisabledProps & {
  legend: ReactNode
  options: readonly RadioOption[]
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: "vertical" | "horizontal"
  required?: boolean
  error?: ReactNode
  className?: string
}

const DOT = { w: 24, h: 24 }

/** Escolha única com círculos desenhados. Ficha: docs/specs/controles.md */
export function RadioGroup({
  legend,
  options,
  name,
  value,
  defaultValue,
  onValueChange,
  orientation = "vertical",
  required,
  error,
  disabled = false,
  disabledReason,
  className,
}: RadioGroupProps) {
  const id = useId()
  const legendId = `${id}-legenda`
  const describedBy =
    [error ? `${id}-erro` : null, disabled ? `${id}-motivo` : null]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend id={legendId} className="mb-1 text-body font-medium text-ink">
        {legend}
      </legend>
      <RadixRadio.Root
        aria-labelledby={legendId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        orientation={orientation}
        required={required}
        disabled={disabled}
        className={cn(
          "flex gap-x-6",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {options.map((option) => {
          const seed = `radio:${name ?? "grupo"}:${option.value}`
          const host = shapeHostProps({
            seed,
            kind: "hole",
            bucket: "sm",
            nominal: DOT,
            interactive: true,
          })
          const optionId = `${id}-${option.value}`
          return (
            <div
              key={option.value}
              className={cn(
                "group/radio flex min-h-11 items-start gap-3 py-2.5",
                disabled && "cursor-not-allowed",
              )}
            >
              <RadixRadio.Item
                {...host}
                id={optionId}
                value={option.value}
                aria-describedby={option.description ? `${optionId}-desc` : undefined}
                className={cn(
                  "relative isolate mt-px grid size-6 shrink-0 cursor-pointer place-items-center text-primary-fill",
                  "[--shape-fill:var(--surface-raised)] group-hover/radio:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
                  "data-[state=checked]:[--shape-stroke:var(--primary-fill)]",
                  "disabled:cursor-not-allowed disabled:[--shape-dash:3_3] disabled:[--shape-fill:var(--surface-sunken)]",
                )}
              >
                <Shape
                  seed={seed}
                  kind="hole"
                  bucket="sm"
                  nominal={DOT}
                  fill="surface-raised"
                  misalign={false}
                />
                <RadixRadio.Indicator asChild>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 1 1"
                    className="size-3 overflow-visible"
                  >
                    <path
                      d={
                        generateShape({
                          kind: "blob",
                          seed: `${seed}:miolo`,
                          points: 7,
                          irregularity: 0.35,
                        }).path
                      }
                      fill="currentColor"
                    />
                  </svg>
                </RadixRadio.Indicator>
              </RadixRadio.Item>
              <span className="flex flex-col gap-0.5">
                <label
                  htmlFor={optionId}
                  className={cn(
                    "cursor-pointer text-body text-ink",
                    disabled && "cursor-not-allowed text-ink-disabled",
                  )}
                >
                  {option.label}
                </label>
                {option.description ? (
                  <span id={`${optionId}-desc`} className="text-sm text-ink-muted">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </div>
          )
        })}
      </RadixRadio.Root>
      {disabled ? (
        <p id={`${id}-motivo`} className="text-sm text-ink-muted">
          {disabledReason}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-erro`}
          className="flex items-start gap-1.5 text-sm font-medium text-danger-text"
        >
          <Icon name="alerta" size={16} decorative className="mt-0.5" />
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
