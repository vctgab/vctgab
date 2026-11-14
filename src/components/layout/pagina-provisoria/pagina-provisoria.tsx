import { LinkText } from "@/components/ui/link-text"
import { Section } from "@/components/ui/section"

/** Página ainda não montada: diz o que falta e oferece um caminho. */
export function PaginaProvisoria({ title }: { title: string }) {
  return (
    <main id="conteudo">
      <Section
        titleAs="h1"
        titleSize="h1"
        eyebrow="Em montagem"
        title={title}
        spacing="lg"
      >
        <p className="max-w-measure text-body-lg text-ink-muted">
          Esta página entra na próxima fase do portfólio. [a confirmar: conteúdo da página{" "}
          {title.toLowerCase()}]
        </p>
        <p className="mt-6">
          <LinkText href="/sistema">
            Ver a vitrine do sistema que vai desenhar esta página
          </LinkText>
        </p>
      </Section>
    </main>
  )
}
