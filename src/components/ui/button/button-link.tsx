import Link from "next/link"
import type { Route } from "next"
import { Icon, type IconName } from "@/components/ui/icon"
import { shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { ButtonShape } from "./button-shape"
import { buttonVariants, type ButtonVariantProps } from "./button.variants"

export interface ButtonLinkProps {
  href: string
  children: string
  variant?: Exclude<NonNullable<ButtonVariantProps["variant"]>, "link">
  size?: NonNullable<ButtonVariantProps["size"]>
  iconLeft?: IconName
  iconRight?: IconName
  /** `false` desliga a pré-busca do Next. */
  prefetch?: boolean
  seed?: string
  className?: string
}

/**
 * Link de navegação com cara de botão, renderizado no servidor (D-1220): as
 * formas chegam prontas e nada é hidratado além do `Link` do Next. Mesmas
 * variantes, tamanhos e estados do `Button`. Para ação (clique, carregando,
 * desabilitado), use o `Button`. Ficha: docs/specs/button.md
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  prefetch,
  seed,
  className,
}: ButtonLinkProps) {
  const shapeSeed = seed ?? `botao:${variant}:${children}`
  const host = shapeHostProps({
    seed: shapeSeed,
    kind: "wobblyRect",
    bucket: "sm",
    interactive: true,
  })
  const iconSize = size === "lg" ? 24 : 20
  return (
    <Link
      href={href as Route}
      prefetch={prefetch}
      {...host}
      className={cn(buttonVariants({ variant, size, iconOnly: false }), className)}
    >
      <ButtonShape seed={shapeSeed} variant={variant} />
      {iconLeft ? <Icon name={iconLeft} size={iconSize} decorative /> : null}
      {/* Alinhamento ótico: a Patrick Hand assenta alto; 1 px desce o rótulo. */}
      <span className="translate-y-px">{children}</span>
      {iconRight ? <Icon name={iconRight} size={iconSize} decorative /> : null}
    </Link>
  )
}
