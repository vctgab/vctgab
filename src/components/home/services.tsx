import { Divider } from "@/components/ui/divider"
import { Section } from "@/components/ui/section"
import { Tag } from "@/components/ui/tag"
import { HOME } from "@/content/home"

/** D. Serviços: dois itens numerados com tags. Ficha: docs/specs/pages/home.md */
export function Services() {
  const { eyebrow, title, items } = HOME.services
  return (
    <Section id="servicos" eyebrow={eyebrow} title={title}>
      <ol className="grid gap-12 md:grid-cols-2 md:gap-10">
        {items.map((item) => (
          <li key={item.marker} className="flex flex-col gap-4">
            <Divider seed={`home:servico:${item.marker}`} />
            <span aria-hidden="true" className="font-mono text-label text-primary-text">
              {item.marker}
            </span>
            <h3 className="font-soft text-h3">{item.title}</h3>
            <p className="max-w-measure text-body-lg text-ink-muted">
              {item.description}
            </p>
            <ul
              className="flex flex-wrap gap-2"
              aria-label={`Ferramentas: ${item.title}`}
            >
              {item.tags.map((tag) => (
                <Tag as="li" key={tag}>
                  {tag}
                </Tag>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
