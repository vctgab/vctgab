import { Quote } from "@/components/ui/quote"
import { Section } from "@/components/ui/section"
import { HOME } from "@/content/home"
import { textOf } from "@/content/pending"

/** E. Depoimentos com troca entre depoentes. Ficha: docs/specs/pages/home.md */
export function Testimonials() {
  const { eyebrow, title, items } = HOME.testimonials
  return (
    <Section id="depoimentos" eyebrow={eyebrow} title={title}>
      <Quote
        items={items.map((t) => ({
          id: t.id,
          author: t.author,
          role: textOf(t.role),
          text: textOf(t.text),
        }))}
      />
    </Section>
  )
}
