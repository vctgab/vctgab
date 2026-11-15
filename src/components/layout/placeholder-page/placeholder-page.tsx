import { Fact } from "@/components/ui/fact"
import { LinkText } from "@/components/ui/link-text"
import { Section } from "@/components/ui/section"
import { PROVISIONAL_PAGES, type ProvisionalPageId } from "@/content/pages"

/**
 * Página ainda não montada: diz o que falta e oferece um caminho. O título e
 * a pendência vêm de src/content/pages.ts.
 */
export function PaginaProvisoria({ page }: { page: ProvisionalPageId }) {
  const { title, content } = PROVISIONAL_PAGES[page]
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
          Esta página entra na próxima fase do portfólio. <Fact value={content} />
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
