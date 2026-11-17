import Link from "next/link"
import type { Route } from "next"
import type { ReactNode } from "react"
import { NAV_LINKS } from "@/components/layout/header/nav-links"
import { Fact } from "@/components/ui/fact"
import { AchadosCount } from "@/components/ui/finds"
import { Icon } from "@/components/ui/icon"
import { Logo } from "@/components/ui/logo"
import { Container } from "@/components/ui/section"
import { HOME } from "@/content/home"
import { isPending, type Maybe } from "@/content/pending"
import { SITE } from "@/content/site"
import { cn } from "@/lib/cn"
import { generateShape, toClipPath } from "@/lib/shapes"

export interface FooterProps {
  /** Cena de árvores da estação, desenhada atrás e abaixo dos links. */
  scene?: ReactNode
  className?: string
}

const LINK =
  "inline-flex min-h-11 items-center gap-1.5 px-1 font-medium text-footer-link underline decoration-dashed decoration-1 underline-offset-6 hover:decoration-solid hover:decoration-2"

/** Link do rodapé que pode estar pendente: sem destino, vira texto com a marca (D-1213). */
function MaybeLink({
  label,
  href,
  kind,
}: {
  label: string
  href: Maybe<string>
  kind: "external" | "download"
}) {
  if (isPending(href)) {
    return (
      <span className="inline-flex min-h-11 flex-wrap items-center gap-x-2 px-1 font-medium text-footer-ink">
        {label} <Fact value={href} className="text-ink" />
      </span>
    )
  }
  return kind === "external" ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
      {label}
      <Icon name="externo" size={16} decorative />
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  ) : (
    <a href={href} download className={LINK}>
      {label}
    </a>
  )
}

/**
 * Rodapé: faixa escura com a borda de cima rasgada, crédito, contagem de
 * achados ao vivo, links e assinatura, com a cena da estação atrás.
 * Ficha: docs/specs/header-footer.md
 */
export function Footer({ scene, className }: FooterProps) {
  const { credit, finds, links, signature, signatureCheck } = HOME.footer
  const edge = generateShape({
    kind: "tornEdge",
    seed: "rodape:borda",
    bucket: "xl",
    edges: ["top"],
    irregularity: 0.6,
  })
  return (
    <footer
      style={{ clipPath: toClipPath(edge.points) }}
      className={cn(
        "relative isolate overflow-hidden bg-footer-bg pt-16 text-footer-ink [--focus-ring:var(--footer-focus)]",
        scene ? "pb-44 md:pb-52" : "pb-12",
        className,
      )}
    >
      {scene ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-(--z-below) h-40 md:h-48"
        >
          {scene}
        </div>
      ) : null}
      <Container className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-8">
          <div className="flex max-w-sm flex-col gap-3">
            <Logo tone="inverse" label="Victor Gabriel, voltar ao início" />
            <p className="text-body text-footer-ink">{credit}</p>
            <p className="text-body text-footer-ink">
              {finds.before} <AchadosCount />
              {finds.after}
            </p>
          </div>
          <nav aria-label="Rodapé">
            <ul className="flex max-w-xl flex-wrap gap-x-5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href as Route} className={LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <MaybeLink label={links.github} href={SITE.github.url} kind="external" />
              </li>
              <li>
                <MaybeLink label={links.linkedin} href={SITE.linkedin} kind="external" />
              </li>
              <li>
                <MaybeLink label={links.cv} href={SITE.cv} kind="download" />
              </li>
            </ul>
          </nav>
        </div>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-label text-footer-ink">
          {signature} <Fact value={signatureCheck} className="text-ink" />
        </p>
      </Container>
    </footer>
  )
}
