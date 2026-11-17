import { Divider } from "@/components/ui/divider"
import { Section } from "@/components/ui/section"
import { Tag } from "@/components/ui/tag"
import { HOME } from "@/content/home"

/** D. O que eu faço: quatro itens numerados com chips. Ficha: docs/specs/pages/home.md */
export function Skills() {
  const { title, lead, items } = HOME.skills
  return (
    <Section id="o-que-eu-faco" title={title} intro={lead}>
      <ol className="grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
        {items.map((item) => (
          <li key={item.marker} className="flex flex-col gap-4">
            <Divider seed={`home:habilidade:${item.marker}`} />
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
              {item.chips.map((chip) => (
                <Tag as="li" key={chip}>
                  {chip}
                </Tag>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
