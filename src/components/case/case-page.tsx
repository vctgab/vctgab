import { CaseFigure } from "@/components/ui/case-figure"
import { CaseFooter } from "@/components/ui/case-footer"
import { CaseHeader } from "@/components/ui/case-header"
import { CaseToc } from "@/components/ui/case-toc"
import { Container } from "@/components/ui/section"
import { HOME } from "@/content/home"
import type { ProjectCase } from "@/content/projects/types"
import { CaseBlockView } from "./case-blocks"

/**
 * Molde de um caso: compõe o cabeçalho, a imagem principal, o sumário, as
 * seções (blocos) e o rodapé a partir de um `ProjectCase`. Um caso novo é um
 * arquivo de conteúdo mais uma página de poucas linhas. Ficha: docs/specs/pages/case.md
 */
export function CasePage({ project }: { project: ProjectCase }) {
  const { header, cover, sections, next, slug } = project
  const ctas = HOME.ctas.map((c) => ({
    label: c.label,
    href: `/contato?aba=${c.tab}`,
    variant: c.variant,
  }))
  const toc = sections.map((s) => ({ id: s.id, title: s.title }))
  return (
    <main id="conteudo" className="py-12 md:py-16">
      <Container>
        <CaseHeader
          name={header.name}
          areas={header.areas}
          about={header.about}
          facts={header.facts}
          seed={`caso:${slug}`}
        />
      </Container>

      <Container className="mt-12 md:mt-16">
        <CaseFigure
          id={cover.id}
          variant={cover.variant}
          image={cover.image}
          priority
          sizes="(min-width: 1280px) 1168px, calc(100vw - 2rem)"
          caption={cover.caption}
        />
      </Container>

      <Container className="mt-12 grid gap-x-12 gap-y-8 md:mt-16 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <CaseToc items={toc} />
        <div className="flex min-w-0 flex-col gap-20">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-titulo`}
              className="flex flex-col gap-8"
            >
              <h2 id={`${section.id}-titulo`} className="max-w-measure text-h2">
                {section.title}
              </h2>
              {section.blocks.map((block, i) => (
                <CaseBlockView
                  key={i}
                  block={block}
                  seed={`caso:${slug}:${section.id}:${i}`}
                />
              ))}
            </section>
          ))}
        </div>
      </Container>

      <Container>
        <CaseFooter next={next} ctas={ctas} seed={`caso:${slug}`} />
      </Container>
    </main>
  )
}
