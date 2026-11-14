"use client"

import { useId, useState, type ComponentProps, type ReactNode } from "react"
import {
  controlClasses,
  describedBy,
  FieldFrame,
  FieldShell,
  fieldIds,
} from "@/components/ui/field"
import { Icon, type IconName } from "@/components/ui/icon"
import { formatCount } from "@/lib/format"

type Native = Omit<
  ComponentProps<"input">,
  "disabled" | "id" | "aria-invalid" | "aria-describedby"
>

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type TextFieldProps = Native &
  DisabledProps & {
    label: ReactNode
    hint?: ReactNode
    /** Texto que diz o que informar ("Informe um e-mail com @"). */
    error?: ReactNode
    /** Campo não obrigatório: o rótulo ganha "(opcional)". */
    optional?: boolean
    /** Mostra "x de y caracteres" (exige `maxLength`). */
    showCounter?: boolean
    iconLeft?: IconName
    id?: string
  }

/** Campo de texto com contorno desenhado. Ficha: docs/specs/fields.md */
export function TextField({
  label,
  hint,
  error,
  optional = false,
  showCounter = false,
  iconLeft,
  disabled = false,
  disabledReason,
  id,
  name,
  maxLength,
  value,
  defaultValue,
  onChange,
  type = "text",
  ...rest
}: TextFieldProps) {
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
        invalid={Boolean(error)}
        disabled={disabled}
      >
        {iconLeft ? (
          <Icon name={iconLeft} decorative className="ms-3.5 text-ink-subtle" />
        ) : null}
        <input
          {...rest}
          id={ids.control}
          name={name}
          type={type}
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
          className={`${controlClasses} min-h-12 ${iconLeft ? "ps-2" : ""}`}
        />
      </FieldShell>
    </FieldFrame>
  )
}
