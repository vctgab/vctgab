import { ButtonLink } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { LinkText } from "@/components/ui/link-text"

export interface CaseFooterProps {
  /** Próximo projeto: nome e rota (pode ainda não existir; o release:check acusa). */
  next: { name: string; href: string }
  /** Os mesmos CTAs da Home ("tenho uma vaga", "tenho um projeto"). */
  ctas: readonly {
    label: string
    href: string
    variant: "primary" | "secondary"
  }[]
  seed?: string
}

/**
 * Fecha um caso: próximo projeto e os dois CTAs. Ficha: docs/specs/case-footer.md
 */
export function CaseFooter({ next, ctas, seed = "caso" }: CaseFooterProps) {
  return (
    <footer className="mt-16 flex flex-col gap-8 pb-8 md:mt-24">
      <Divider seed={`${seed}:rodape`} />
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Próximo projeto" className="flex flex-wrap items-center gap-x-3">
          <span className="text-body-lg text-ink-muted">Próximo projeto:</span>
          {/* A rota ainda pode não existir: sem pré-busca, sem 404 no console. */}
          <LinkText href={next.href} size="marker" prefetch={false}>
            {next.name}
          </LinkText>
          <Icon name="seta" size={20} decorative className="text-primary-text" />
        </nav>
        <div className="flex flex-wrap gap-4">
          {ctas.map((cta) => (
            <ButtonLink
              key={cta.href}
              href={cta.href}
              variant={cta.variant}
              prefetch={false}
              seed={`${seed}:cta:${cta.href}`}
            >
              {cta.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </footer>
  )
}
