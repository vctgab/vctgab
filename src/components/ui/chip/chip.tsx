"use client"

import { useId, useState, type ComponentProps, type ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

type Native = Omit<
  ComponentProps<"button">,
  "children" | "disabled" | "aria-pressed" | "aria-disabled" | "onChange"
>

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type ChipProps = Native &
  DisabledProps & {
    children: ReactNode
    /** Controlado. */
    pressed?: boolean
    /** Não controlado. */
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    seed?: string
  }

/**
 * Filtro alternável com `aria-pressed`. Selecionado ganha fundo suave e o
 * ícone de check (segundo indicador além da cor). Ficha: docs/specs/tag-chip.md
 */
export function Chip({
  children,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  disabledReason,
  seed,
  className,
  onClick,
  "aria-describedby": describedBy,
  ...rest
}: ChipProps) {
  const [inner, setInner] = useState(defaultPressed)
  const isPressed = pressed ?? inner
  const id = useId()
  const reasonId = `${id}-motivo`
  const shapeSeed = seed ?? `chip:${typeof children === "string" ? children : id}`
  const host = shapeHostProps({
    seed: shapeSeed,
    kind: "pill",
    bucket: "sm",
    interactive: true,
  })

  const button = (
    <button
      {...rest}
      {...host}
      type="button"
      aria-pressed={isPressed}
      aria-disabled={disabled || undefined}
      aria-describedby={cn(describedBy, disabled && reasonId) || undefined}
      data-state={isPressed ? "on" : "off"}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        const next = !isPressed
        if (pressed === undefined) setInner(next)
        onPressedChange?.(next)
        onClick?.(event)
      }}
      className={cn(
        "relative isolate inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-4 text-body leading-none text-ink select-none",
        "transition-[translate] duration-(--duration-instant) ease-hand",
        "[--shape-fill:var(--surface-raised)] hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
        "active:translate-y-px motion-reduce:active:translate-y-0",
        "data-[state=on]:font-medium data-[state=on]:[--shape-fill:var(--primary-soft)] data-[state=on]:hover:[--shape-fill:var(--primary-soft-hover)]",
        "aria-disabled:cursor-not-allowed aria-disabled:text-ink-disabled aria-disabled:[--shape-dash:5_4]",
        "aria-disabled:[--shape-fill:var(--surface-sunken)] aria-disabled:hover:[--shape-fill:var(--surface-sunken)] aria-disabled:active:translate-y-0",
        className,
      )}
    >
      <Shape
        seed={shapeSeed}
        kind="pill"
        bucket="sm"
        fill="surface-raised"
        strokeWidth={isPressed ? 2.5 : 1.75}
      />
      {isPressed ? <Icon name="check" size={16} decorative /> : null}
      <span className="translate-y-px">{children}</span>
    </button>
  )

  if (!disabled) return button
  return (
    <span className="inline-flex flex-col items-start gap-1">
      {button}
      <span id={reasonId} className="text-sm text-ink-muted">
        {disabledReason}
      </span>
    </span>
  )
}
