import { cva, type VariantProps } from "class-variance-authority"

/**
 * Padrão único de estados (ES-01). Cores por variável de forma:
 * hover um passo mais escuro, ativo dois passos; pressionar desce 2 px e
 * colapsa a sombra dura; desabilitado fica tracejado e sem sombra.
 */
export const buttonVariants = cva(
  [
    "group/botao relative isolate inline-flex cursor-pointer items-center justify-center gap-2",
    "touch-manipulation font-marker leading-none whitespace-nowrap select-none",
    "transition-[translate,color] duration-(--duration-instant) ease-hand",
    "[&_[data-shape-layer=preenchimento]]:transition-[color] [&_[data-shape-layer=preenchimento]]:duration-(--duration-instant)",
    "active:translate-x-0.5 active:translate-y-0.5 active:[--shape-shadow-x:0px] active:[--shape-shadow-y:0px]",
    "motion-reduce:active:translate-x-0 motion-reduce:active:translate-y-0",
    "aria-disabled:cursor-not-allowed aria-disabled:text-ink-disabled",
    "aria-disabled:[--shape-fill:var(--surface-sunken)] aria-disabled:hover:[--shape-fill:var(--surface-sunken)]",
    "aria-disabled:[--shape-dash:6_5] aria-disabled:active:[--shape-fill:var(--surface-sunken)]",
    "aria-disabled:[--shape-shadow-x:0px] aria-disabled:[--shape-shadow-y:0px]",
    "aria-disabled:active:translate-x-0 aria-disabled:active:translate-y-0",
    "aria-busy:cursor-progress aria-busy:active:translate-x-0 aria-busy:active:translate-y-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "text-on-primary [--shape-fill:var(--primary-fill)]",
          "hover:[--shape-fill:var(--primary-fill-hover)] active:[--shape-fill:var(--primary-fill-active)]",
        ],
        secondary: [
          "text-ink [--shape-fill:var(--surface-raised)]",
          "hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
        ],
        ghost: [
          "text-ink [--shape-fill:transparent]",
          "hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
        ],
        link: [
          "text-primary-text hover:text-primary-text-hover active:translate-x-0 active:translate-y-0",
        ],
      },
      size: {
        sm: "min-h-11 px-4 text-marker-sm",
        md: "min-h-12 px-5 text-marker",
        lg: "min-h-14 px-7 text-marker-lg",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", className: "size-11" },
      { iconOnly: true, size: "md", className: "size-12" },
      { iconOnly: true, size: "lg", className: "size-14" },
      { variant: "link", className: "px-1" },
    ],
    defaultVariants: { variant: "primary", size: "md", iconOnly: false },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
