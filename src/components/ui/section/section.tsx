import { useId, type ComponentProps, type ReactNode } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/cn"

export interface ContainerProps extends ComponentProps<"div"> {
  /** `page` (1200 px, padrão) ou `measure` (65ch). */
  width?: "page" | "measure"
}

/** Largura máxima de 1200 px e gutter por token (16 px no mobile). */
export function Container({ width = "page", className, ...rest }: ContainerProps) {
  return (
    <div
      {...rest}
      className={cn(
        "mx-auto w-full px-(--gutter)",
        width === "page" ? "max-w-page" : "max-w-measure",
        className,
      )}
    />
  )
}

const TITLE_SIZE = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const

const SPACING = {
  none: "",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
} as const

type SectionBase = Omit<ComponentProps<"section">, "title" | "aria-label"> & {
  eyebrow?: ReactNode
  intro?: ReactNode
  titleAs?: "h1" | "h2" | "h3"
  titleSize?: keyof typeof TITLE_SIZE
  spacing?: keyof typeof SPACING
  width?: ContainerProps["width"]
  children?: ReactNode
}

/** Com título, a seção é nomeada por ele; sem título, `aria-label` é obrigatório. */
export type SectionProps = SectionBase &
  ({ title: ReactNode; "aria-label"?: never } | { title?: never; "aria-label": string })

/** Seção de página com cabeçalho padrão. Ficha: docs/specs/section.md */
export function Section({
  eyebrow,
  title,
  intro,
  titleAs: Title = "h2",
  titleSize = "h2",
  spacing = "md",
  width = "page",
  className,
  children,
  ...rest
}: SectionProps) {
  const titleId = useId()
  const hasHeader = Boolean(title || eyebrow || intro)
  return (
    <section
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={cn(SPACING[spacing], className)}
    >
      <Container width={width}>
        {hasHeader ? (
          <header className="flex max-w-measure flex-col gap-4">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <Title id={titleId} className={TITLE_SIZE[titleSize]}>
                {title}
              </Title>
            ) : null}
            {intro ? <p className="text-body-lg text-ink-muted">{intro}</p> : null}
          </header>
        ) : null}
        {children ? (
          <div className={hasHeader ? "mt-10" : undefined}>{children}</div>
        ) : null}
      </Container>
    </section>
  )
}
