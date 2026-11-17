import type { ReactNode } from "react"
import { ButtonLink } from "@/components/ui/button"
import { Fact } from "@/components/ui/fact"
import { Achavel } from "@/components/ui/finds"
import { Coruja } from "@/components/ui/finds/drawings"
import { Icon, type IconName } from "@/components/ui/icon"
import { LinkText } from "@/components/ui/link-text"
import { Section } from "@/components/ui/section"
import { HOME } from "@/content/home"
import { isPending } from "@/content/pending"
import { SITE } from "@/content/site"
import { contactHref, mailtoHref } from "@/lib/contact"

/** Um canal direto com ícone e rótulo. Também usado no /contato. */
export function Channel({
  icon,
  label,
  children,
}: {
  icon: IconName
  label: string
  children: ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon name={icon} decorative className="mt-3 text-ink-muted" />
      <div className="flex flex-col">
        <span className="font-mono text-label text-ink-subtle">{label}</span>
        {children}
      </div>
    </li>
  )
}

/** LinkedIn ou a pendência, nunca um link quebrado. */
export function LinkedInChannel({ label }: { label: string }) {
  return (
    <Channel icon="linkedin" label={label}>
      {isPending(SITE.linkedin) ? (
        <span className="inline-flex min-h-11 items-center text-ink">
          <Fact value={SITE.linkedin} />
        </span>
      ) : (
        <LinkText href={SITE.linkedin}>
          {SITE.linkedin.replace(/^https:\/\/(www\.)?/, "")}
        </LinkText>
      )}
    </Channel>
  )
}

/**
 * G. Contato: os mesmos CTAs do hero e os canais diretos. Sem formulário.
 * Achado escondido: a coruja do correio. Ficha: docs/specs/pages/home.md
 */
export function Contact() {
  const { id, title, lead, labels } = HOME.contact
  return (
    <Section id={id} title={title} intro={lead} spacing="lg">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-wrap gap-3">
          {HOME.ctas.map((cta) => (
            <ButtonLink
              key={cta.tab}
              href={contactHref(cta.tab)}
              prefetch={false}
              size="lg"
              variant={cta.variant}
              iconRight="seta"
              seed={`home:contato:cta:${cta.tab}`}
            >
              {cta.label}
            </ButtonLink>
          ))}
        </div>
        <div className="flex items-end gap-6">
          <ul className="flex flex-col gap-3">
            <Channel icon="mail" label={labels.email}>
              <LinkText href={mailtoHref()}>{SITE.email}</LinkText>
            </Channel>
            <LinkedInChannel label={labels.linkedin} />
          </ul>
          <Achavel id="coruja" label="Algo pousado perto do correio" className="mb-1">
            <Coruja className="-rotate-6" />
          </Achavel>
        </div>
      </div>
    </Section>
  )
}
