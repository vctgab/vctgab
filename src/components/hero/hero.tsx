import { Achavel } from "@/components/ui/finds"
import { Pinha } from "@/components/ui/finds/drawings"
import { ButtonLink } from "@/components/ui/button"
import { LiveClock } from "@/components/ui/live-clock"
import { Container } from "@/components/ui/section"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { Tag } from "@/components/ui/tag"
import { HOME } from "@/content/home"
import { contactHref } from "@/lib/contact"
import { generateShape } from "@/lib/shapes"
import { HeroBackdrop } from "./hero-backdrop"
import { HeroSketch } from "./hero-sketch"

export interface HeroProps {
  /** Seed da página: muda a composição de fundo e o esboço. */
  seed: string
  /** Nível do título (h1 na página que o usa como abertura). */
  titleAs?: "h1" | "h2"
}

/** Separador "·" da linha de local: visual, não lido. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-subtle">
      ·
    </span>
  )
}

/**
 * Hero com o conteúdo da Home sobre uma composição de formas que deriva e,
 * a partir de `lg`, o esboço "do rascunho ao ar". O texto fica numa placa de
 * apoio com contraste calculado (CR-02). Textos de src/content/home.ts.
 * Ficha: docs/specs/hero-footer.md
 */
export function Hero({ seed, titleAs: Title = "h1" }: HeroProps) {
  const text = HOME.hero
  const plateSeed = `hero:${seed}:placa`
  const underline = generateShape({
    kind: "handLine",
    seed: `hero:${seed}:sublinhado`,
    bucket: "md",
    irregularity: 0.35,
  })

  return (
    <section
      aria-labelledby={`hero-${seed}-titulo`}
      className="relative isolate overflow-hidden py-16 md:py-24"
    >
      <HeroBackdrop seed={seed} />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
        <div
          {...shapeHostProps({ seed: plateSeed, bucket: "xl" })}
          className="relative isolate max-w-2xl p-6 sm:p-10 md:p-12"
        >
          <Shape
            seed={plateSeed}
            bucket="xl"
            fill="hero-plate"
            shadow="lg"
            shadowColor="shadow-soft"
          />
          <div className="flex flex-col items-start gap-4">
            <Tag dot="success" seed={`hero:${seed}:selo`}>
              {text.badge}
            </Tag>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-ink-muted">
              <span>{text.place}</span>
              <Dot />
              <LiveClock seconds={false} className="text-ink" />
              <Dot />
              <span>{text.weather}</span>
            </p>
          </div>
          <Title
            id={`hero-${seed}-titulo`}
            className="font-soft mt-6 text-display lg:text-h1"
          >
            {text.title.before}
            <span className="relative inline-block whitespace-nowrap">
              {text.title.highlight}
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 -bottom-1 h-3 w-full overflow-visible text-primary-decor"
              >
                <path
                  d={underline.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={6}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
            {text.title.after}
          </Title>
          <p className="mt-6 max-w-xl text-body-lg text-ink-muted">{text.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {HOME.ctas.map((cta) => (
              <ButtonLink
                key={cta.tab}
                href={contactHref(cta.tab)}
                prefetch={false}
                size="lg"
                variant={cta.variant}
                iconRight="seta"
                seed={`hero:${seed}:cta:${cta.tab}`}
              >
                {cta.label}
              </ButtonLink>
            ))}
          </div>
        </div>
        <HeroSketch seed={seed} className="hidden lg:block" />
      </Container>
      <div className="absolute right-6 bottom-6 z-(--z-raised) md:right-20">
        <Achavel id="pinha" label="Algo entre as formas do hero">
          <Pinha className="rotate-12" />
        </Achavel>
      </div>
    </section>
  )
}
