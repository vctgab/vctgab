import Link from "next/link"
import type { Route } from "next"
import { Button } from "@/components/ui/button"
import { Polaroid } from "@/components/ui/polaroid"
import { Section } from "@/components/ui/section"
import { HOME } from "@/content/home"
import { isPending, pendingLabel } from "@/content/pending"

/** G. Sobre: fatos verificados e quatro polaroids. Ficha: docs/specs/pages/home.md */
export function About() {
  const { eyebrow, title, facts, photos, cta, ctaHref } = HOME.about
  return (
    <Section id="sobre" eyebrow={eyebrow} title={title}>
      <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="flex max-w-measure flex-col gap-4 text-body-lg text-ink-muted">
          {facts.map(([before, highlight, after]) => (
            <p key={highlight}>
              {before}
              <strong className="font-semibold text-ink">{highlight}</strong>
              {after}
            </p>
          ))}
          <div className="mt-4">
            <Button asChild variant="secondary" iconRight="seta" seed="home:sobre:cta">
              <Link href={ctaHref as Route}>{cta}</Link>
            </Button>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8" aria-label="Fotos">
          {photos.map((photo, i) => (
            <li key={i} className={i % 2 === 1 ? "mt-6" : undefined}>
              {isPending(photo) ? (
                <Polaroid seed={`home:foto:${i}`} placeholder={pendingLabel(photo)} />
              ) : (
                <Polaroid seed={`home:foto:${i}`} src={photo.src} alt={photo.alt} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
