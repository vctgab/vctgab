import { Fact } from "@/components/ui/fact"
import { Achavel } from "@/components/ui/finds"
import { Pena } from "@/components/ui/finds/drawings"
import { LinkText } from "@/components/ui/link-text"
import { Polaroid } from "@/components/ui/polaroid"
import { Section } from "@/components/ui/section"
import { HOME } from "@/content/home"
import { isPending } from "@/content/pending"

/**
 * F. Sobre: dois parágrafos de Victor, a polaroid e o link. Achado
 * escondido: a pena de escrever. Ficha: docs/specs/pages/home.md
 */
export function About() {
  const { title, paragraphs, photo, link, linkHref } = HOME.about
  return (
    <Section id="sobre" title={title}>
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="flex max-w-measure flex-col gap-5 text-body-lg text-ink-muted">
          {paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
          <p className="mt-2">
            <LinkText href={linkHref} size="marker">
              {link}
            </LinkText>
          </p>
        </div>
        <div className="relative max-w-xs justify-self-center lg:justify-self-end">
          {isPending(photo) ? (
            <Polaroid seed="home:foto" placeholder={<Fact value={photo} />} />
          ) : (
            <Polaroid seed="home:foto" src={photo.src} alt={photo.alt} />
          )}
          <div className="absolute -bottom-6 -left-8">
            <Achavel id="pena" label="Algo para escrever perto da foto">
              <Pena className="-rotate-12" />
            </Achavel>
          </div>
        </div>
      </div>
    </Section>
  )
}
