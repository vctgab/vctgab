import Link from "next/link"
import type { Route } from "next"
import { Achavel } from "@/components/ui/finds"
import { Pinha } from "@/components/ui/finds/drawings"
import { Button } from "@/components/ui/button"
import { LiveClock } from "@/components/ui/live-clock"
import { Container } from "@/components/ui/section"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { Tag } from "@/components/ui/tag"
import { generateShape } from "@/lib/shapes"
import { HeroBackdrop } from "./hero-backdrop"

export interface HeroProps {
  /** Seed da página: muda a composição de fundo. */
  seed: string
  ctaHref?: string
  /** Nível do título (h1 na página que o usa como abertura). */
  titleAs?: "h1" | "h2"
}

/**
 * Hero com o conteúdo da home sobre uma composição de formas que deriva.
 * O texto fica numa placa de apoio com contraste calculado (CR-02).
 * Ficha: docs/specs/hero-footer.md
 */
export function Hero({ seed, ctaHref = "/contato", titleAs: Title = "h1" }: HeroProps) {
  const plateSeed = `hero:${seed}:placa`
  const underline = generateShape({
    kind: "handLine",
    seed: `hero:${seed}:sublinhado`,
    bucket: "lg",
    irregularity: 0.35,
  })
  const dot = generateShape({
    kind: "blob",
    seed: "hero:agenda",
    points: 7,
    irregularity: 0.3,
  })

  return (
    <section
      aria-labelledby={`hero-${seed}-titulo`}
      className="relative isolate overflow-hidden py-16 md:py-24"
    >
      <HeroBackdrop seed={seed} />
      <Container className="relative">
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
          <p
            aria-hidden="true"
            className="pointer-events-none absolute top-6 right-8 hidden max-w-44 -rotate-3 font-hand text-hand font-bold text-primary-text lg:block"
          >
            design que o código aguenta
          </p>
          <ul className="flex flex-wrap gap-2.5" aria-label="Especialidades">
            <Tag as="li">Desenvolvedor front-end</Tag>
            <Tag as="li">React e Next.js</Tag>
          </ul>
          <Title id={`hero-${seed}-titulo`} className="font-soft mt-6 text-display">
            Front-end com{" "}
            <span className="relative inline-block whitespace-nowrap">
              visão de produto.
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
                  strokeWidth={5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </Title>
          <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
            Desenvolvo interfaces em React e Next.js para fundadores e equipes que
            precisam de produto no ar, com design que o código aguenta.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" iconRight="seta" seed={`hero:${seed}:cta`}>
              <Link href={ctaHref as Route}>Vamos conversar</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-ink-muted">
            <li className="flex items-center gap-2.5">
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 1 1"
                className="size-3.5 overflow-visible"
              >
                <path
                  d={dot.path}
                  className="fill-success-fill stroke-ink"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              Agenda de{" "}
              <span className="bg-primary-soft px-1 underline decoration-primary-decor decoration-dashed underline-offset-4">
                [a confirmar: mês]
              </span>{" "}
              aberta
            </li>
            <li>Teresina • Brasil</li>
            <li>
              <LiveClock className="text-ink" />
            </li>
          </ul>
        </div>
      </Container>
      <div className="absolute right-6 bottom-6 z-(--z-raised) md:right-20">
        <Achavel id="pinha" label="Algo entre as formas do hero">
          <Pinha className="rotate-12" />
        </Achavel>
      </div>
    </section>
  )
}
