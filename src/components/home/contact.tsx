import { Button } from "@/components/ui/button"
import { Fact } from "@/components/ui/fact"
import { Achavel } from "@/components/ui/finds"
import { Coruja } from "@/components/ui/finds/drawings"
import { Icon, type IconName } from "@/components/ui/icon"
import { LinkText } from "@/components/ui/link-text"
import { Section } from "@/components/ui/section"
import { HOME } from "@/content/home"
import { isPending } from "@/content/pending"
import { SITE } from "@/content/site"
import { mailtoHref, quoteHref } from "@/lib/contact"
import type { ReactNode } from "react"

function Channel({
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

/**
 * H. Contato: chamada para orçamento e canais. Sem formulário nesta fase.
 * Achado escondido: a coruja do correio. Ficha: docs/specs/pages/home.md
 */
export function Contact() {
  const { id, title, lead, cta, ctaMessage, emailSubject, labels } = HOME.contact
  const github = SITE.github.url.replace(/^https:\/\//, "")
  return (
    <Section id={id} title={title} intro={lead} spacing="lg">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Button asChild size="lg" iconRight="seta" seed="home:contato:cta">
            <a href={quoteHref(ctaMessage, emailSubject)}>{cta}</a>
          </Button>
        </div>
        <div className="flex items-end gap-6">
          <ul className="flex flex-col gap-3">
            <Channel icon="mail" label={labels.email}>
              <LinkText href={mailtoHref()}>{SITE.email}</LinkText>
            </Channel>
            <Channel icon="github" label={labels.github}>
              <LinkText href={SITE.github.url}>{github}</LinkText>
            </Channel>
            <Channel icon="linkedin" label={labels.linkedin}>
              {isPending(SITE.linkedin) ? (
                <span className="inline-flex min-h-11 items-center text-ink">
                  <Fact value={SITE.linkedin} />
                </span>
              ) : (
                <LinkText href={SITE.linkedin}>
                  {SITE.linkedin.replace(/^https:\/\//, "")}
                </LinkText>
              )}
            </Channel>
          </ul>
          <Achavel id="coruja" label="Algo pousado perto do correio" className="mb-1">
            <Coruja className="-rotate-6" />
          </Achavel>
        </div>
      </div>
    </Section>
  )
}
