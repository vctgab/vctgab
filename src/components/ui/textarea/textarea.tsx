"use client"

import { useId, useState, type ComponentProps, type ReactNode } from "react"
import {
  controlClasses,
  describedBy,
  FieldFrame,
  FieldShell,
  fieldIds,
} from "@/components/ui/field"
import { formatCount } from "@/lib/format"

type Native = Omit<
  ComponentProps<"textarea">,
  "disabled" | "id" | "aria-invalid" | "aria-describedby"
>

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type TextareaProps = Native &
  DisabledProps & {
    label: ReactNode
    hint?: ReactNode
    error?: ReactNode
    optional?: boolean
    showCounter?: boolean
    id?: string
  }

/** Área de texto com contorno desenhado. Ficha: docs/specs/fields.md */
export function Textarea({
  label,
  hint,
  error,
  optional = false,
  showCounter = false,
  disabled = false,
  disabledReason,
  id,
  name,
  maxLength,
  value,
  defaultValue,
  onChange,
  rows = 5,
  ...rest
}: TextareaProps) {
  const auto = useId()
  const ids = fieldIds(id ?? auto)
  const [length, setLength] = useState(String(value ?? defaultValue ?? "").length)
  const count = value !== undefined ? String(value).length : length
  const counter =
    showCounter && maxLength ? `${formatCount(count, maxLength)} caracteres` : undefined

  return (
    <FieldFrame
      ids={ids}
      label={label}
      optional={optional}
      hint={hint}
      error={error}
      disabledReason={disabled ? disabledReason : undefined}
      counter={counter}
    >
      <FieldShell
        seed={`campo:${name ?? String(label)}`}
        bucket="lg"
        invalid={Boolean(error)}
        disabled={disabled}
      >
        <textarea
          {...rest}
          id={ids.control}
          name={name}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={!optional}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, {
            hint: Boolean(hint || disabled),
            error: Boolean(error),
            counter: Boolean(counter),
          })}
          onChange={(event) => {
            setLength(event.target.value.length)
            onChange?.(event)
          }}
          className={`${controlClasses} resize-y py-3`}
        />
      </FieldShell>
    </FieldFrame>
  )
}
