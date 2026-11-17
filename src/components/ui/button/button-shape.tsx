import { Shape } from "@/components/ui/shape"
import type { ButtonVariantProps } from "./button.variants"

/**
 * Camadas do botão, compartilhadas pelo `Button` (cliente) e pelo
 * `ButtonLink` (servidor): o sublinhado de pincel no `link` e o retângulo
 * torto nas demais variantes.
 */
export function ButtonShape({
  seed,
  variant,
}: {
  seed: string
  variant: NonNullable<ButtonVariantProps["variant"]>
}) {
  if (variant === "link")
    return (
      <span aria-hidden="true" className="absolute inset-x-1 bottom-1.5 h-2.5">
        <Shape
          seed={`${seed}:sublinhado`}
          kind="handLine"
          bucket="sm"
          fill="none"
          stroke="primary-decor"
          strokeWidth={2.5}
        />
      </span>
    )
  return (
    <Shape
      seed={seed}
      kind="wobblyRect"
      bucket="sm"
      fill="surface-raised"
      stroke={variant === "ghost" ? "none" : "stroke"}
      shadow={variant === "primary" || variant === "secondary" ? "md" : "none"}
    />
  )
}
