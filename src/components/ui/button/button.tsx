"use client"

import { Slot } from "radix-ui"
import { useId, type ComponentProps, type MouseEvent, type ReactNode } from "react"
import { Icon, type IconName } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/cn"
import { buttonVariants, type ButtonVariantProps } from "./button.variants"

type Native = Omit<
  ComponentProps<"button">,
  "disabled" | "children" | "aria-label" | "aria-disabled"
>

interface CommonProps extends Native {
  variant?: NonNullable<ButtonVariantProps["variant"]>
  size?: NonNullable<ButtonVariantProps["size"]>
  /** Seed da forma. Padrão: o rótulo (se for texto) ou um id estável. */
  seed?: string
  iconLeft?: IconName
  iconRight?: IconName
  /** Ação em andamento: mostra o Spinner, expõe aria-busy e ignora cliques. */
  loading?: boolean
  /** Rótulo durante o carregamento, no gerúndio ("Enviando mensagem"). */
  loadingLabel?: string
  /** Renderiza o filho (ex.: `<Link>`) com a aparência de botão. */
  asChild?: boolean
}

/** Desabilitado exige o motivo em texto visível (regra BT-05). */
type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

/** Só ícone exige nome acessível (regra AC-03). */
type ContentProps =
  | { iconOnly: IconName; "aria-label": string; children?: never }
  | { iconOnly?: never; "aria-label"?: string; children: ReactNode }

export type ButtonProps = CommonProps & DisabledProps & ContentProps

/**
 * Botão desenhado à mão. Padrão de estados do sistema: hover um passo mais
 * escuro, ativo dois, foco desenhado a 3:1, desabilitado com motivo.
 * Ficha: docs/specs/button.md
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    seed,
    iconLeft,
    iconRight,
    loading = false,
    loadingLabel,
    asChild = false,
    disabled = false,
    disabledReason,
    iconOnly,
    children,
    className,
    onClick,
    type = "button",
    style,
    "aria-describedby": describedBy,
    ...rest
  } = props
  const id = useId()
  const reasonId = `${id}-motivo`
  const label = typeof children === "string" ? children : undefined
  const shapeSeed = seed ?? `botao:${variant}:${label ?? iconOnly ?? id}`
  const inert = disabled || loading
  const host = shapeHostProps({
    seed: shapeSeed,
    kind: "wobblyRect",
    bucket: "sm",
    interactive: true,
  })

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (inert) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  const iconSize = size === "lg" ? 24 : 20
  const left = loading ? (
    <Spinner decorative size={iconSize} />
  ) : iconLeft ? (
    <Icon name={iconLeft} size={iconSize} decorative />
  ) : null
  const right = iconRight ? <Icon name={iconRight} size={iconSize} decorative /> : null

  const shape =
    variant === "link" ? (
      <span aria-hidden="true" className="absolute inset-x-1 bottom-1.5 h-2.5">
        <Shape
          seed={`${shapeSeed}:sublinhado`}
          kind="handLine"
          bucket="sm"
          fill="none"
          stroke="primary-decor"
          strokeWidth={2.5}
        />
      </span>
    ) : (
      <Shape
        seed={shapeSeed}
        kind="wobblyRect"
        bucket="sm"
        fill="surface-raised"
        stroke={variant === "ghost" ? "none" : "stroke"}
        shadow={variant === "primary" || variant === "secondary" ? "md" : "none"}
      />
    )

  const content = iconOnly ? (
    loading ? (
      left
    ) : (
      <Icon name={iconOnly} size={iconSize} decorative />
    )
  ) : (
    <>
      {left}
      {/* Alinhamento ótico: a Patrick Hand assenta alto; 1 px desce o rótulo. */}
      <span className="translate-y-px">
        {loading && loadingLabel ? loadingLabel : children}
      </span>
      {right}
    </>
  )

  const classes = cn(
    buttonVariants({ variant, size, iconOnly: Boolean(iconOnly) }),
    className,
  )
  const shared = {
    ...rest,
    ...host,
    style: { ...host.style, ...style },
    className: classes,
    "aria-disabled": disabled || undefined,
    "aria-busy": loading || undefined,
    "aria-describedby": cn(describedBy, disabled && reasonId) || undefined,
    "aria-label": props["aria-label"],
  }

  const element = asChild ? (
    <Slot.Slot {...shared} onClick={handleClick as unknown as Native["onClick"]}>
      <Slot.Slottable child={children}>
        {(child) => (
          <>
            {shape}
            {left}
            <span className="translate-y-px">{child}</span>
            {right}
          </>
        )}
      </Slot.Slottable>
    </Slot.Slot>
  ) : (
    <button {...shared} type={type} onClick={handleClick}>
      {shape}
      {content}
    </button>
  )

  if (!disabled) return element
  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      {element}
      <span id={reasonId} className="flex items-center gap-1.5 text-sm text-ink-muted">
        <Icon name="info" size={16} decorative />
        {disabledReason}
      </span>
    </span>
  )
}
