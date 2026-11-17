import { Fact } from "@/components/ui/fact"
import { Quote } from "@/components/ui/quote"
import { Container } from "@/components/ui/section"
import { Stat } from "@/components/ui/stat"
import { HOME } from "@/content/home"
import { isPending } from "@/content/pending"

/**
 * E. Depoimento e números. O copy não dá título visível: o `h2` é só para
 * leitores de tela (D-1211). Depoimento pendente, sem citação inventada
 * (D-1208). Ficha: docs/specs/pages/home.md
 */
export function Proof() {
  const { title, testimonial, figures } = HOME.proof
  return (
    <section aria-labelledby="home-prova" className="py-16 md:py-24">
      <Container>
        <h2 id="home-prova" className="sr-only">
          {title}
        </h2>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {isPending(testimonial.text) ? (
            <Quote
              items={[]}
              status="indisponivel"
              unavailableMessage={testimonial.unavailable}
              note={<Fact value={testimonial.text} />}
            />
          ) : null}
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {figures.map((figure) => (
              <li key={figure.id}>
                <Stat
                  size="md"
                  from={"from" in figure ? figure.from : undefined}
                  value={figure.value}
                  label={figure.label}
                  methodKind={figure.methodKind}
                  method={<Fact value={figure.method} />}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
