import Link from "next/link"
import type { Route } from "next"
import type { ComponentProps, ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

export interface LinkTextProps extends Omit<
  ComponentProps<"a">,
  "href" | "children" | "target" | "rel"
> {
  href: string
  children: ReactNode
  /** `standalone`: traço à mão que se redesenha; `inline`: sublinhado nativo dentro de parágrafos. */
  variant?: "standalone" | "inline"
  /** `marker` usa Patrick Hand (ex.: "Ver todos os projetos"). */
  size?: "body" | "marker"
  /** Força o tratamento de link externo (por padrão, qualquer `http(s)://`). */
  external?: boolean
  /** `false` desliga a pré-busca do Next (rota que ainda não existe: sem 404 no console). */
  prefetch?: boolean
  seed?: string
}

const isExternalHref = (href: string) => /^https?:\/\//.test(href)
/** mailto: e tel: abrem o app do sistema: link simples, sem nova aba. */
const isAppHref = (href: string) => /^(mailto|tel):/.test(href)

/**
 * Link com sublinhado de pincel. O traço é sempre visível (segundo
 * indicador além da cor) e se redesenha no hover e no foco.
 * Ficha: docs/specs/link-text.md
 */
export function LinkText({
  href,
  children,
  variant = "standalone",
  size = "body",
  external,
  prefetch,
  seed,
  className,
  ...rest
}: LinkTextProps) {
  const isExternal = external ?? isExternalHref(href)
  const label = typeof children === "string" ? children : ""
  const content = (
    <>
      {children}
      {isExternal ? (
        <>
          {" "}
          <span className="sr-only">(abre em nova aba)</span>
          <Icon name="externo" size={16} decorative className="inline-block" />
        </>
      ) : null}
    </>
  )

  const classes =
    variant === "inline"
      ? cn(
          "text-primary-text underline decoration-(--primary-decor) decoration-2 underline-offset-4",
          "hover:text-primary-text-hover hover:decoration-3 active:text-primary-text-hover",
          className,
        )
      : cn(
          "group/link relative inline-flex min-h-11 items-center pb-1 text-primary-text",
          "hover:text-primary-text-hover active:text-primary-text-hover forced-colors:underline",
          size === "marker" ? "font-marker text-marker" : "font-medium",
          className,
        )

  const underline =
    variant === "standalone" ? (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-1 h-2 w-full overflow-visible text-primary-decor forced-colors:hidden"
      >
        <path
          d={
            generateShape({
              kind: "handLine",
              seed: seed ?? `link:${href}:${label}`,
              bucket: "sm",
            }).path
          }
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          data-sublinhado=""
          className="[stroke-dasharray:1] group-active/link:[stroke-width:3.5] group-hover/link:motion-safe:animate-redesenhar group-focus-visible/link:motion-safe:animate-redesenhar"
        />
      </svg>
    ) : null

  if (isAppHref(href)) {
    return (
      <a {...rest} href={href} className={classes}>
        {children}
        {underline}
      </a>
    )
  }
  if (isExternal) {
    return (
      <a
        {...rest}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
        {underline}
      </a>
    )
  }
  return (
    <Link {...rest} href={href as Route} prefetch={prefetch} className={classes}>
      {content}
      {underline}
    </Link>
  )
}
