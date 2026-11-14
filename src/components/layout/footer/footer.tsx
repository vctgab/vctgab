import Link from "next/link"
import type { Route } from "next"
import type { ReactNode } from "react"
import { NAV_LINKS } from "@/components/layout/header/nav-links"
import { Logo } from "@/components/ui/logo"
import { Container } from "@/components/ui/section"
import { cn } from "@/lib/cn"
import { generateShape, toClipPath } from "@/lib/shapes"

export interface FooterProps {
  /** Chip "Achados: x de 7" (etapa 4). */
  achados?: ReactNode
  /** Cena de árvores do tema (etapa 5), desenhada atrás e abaixo dos links. */
  scene?: ReactNode
  className?: string
}

/**
 * Rodapé: faixa escura com a borda de cima rasgada, logo, direitos, links,
 * chip de achados e a cena de árvores. Ficha: docs/specs/header-footer.md
 */
export function Footer({ achados, scene, className }: FooterProps) {
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
      <Container className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
        <div className="flex flex-col gap-2">
          <Logo tone="inverse" label="Victor Gabriel, voltar ao início" />
          <p className="font-mono text-label text-footer-ink">Victor Gabriel © 2026</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as Route}
                  className="inline-flex min-h-11 items-center px-1 font-medium text-footer-link underline decoration-dashed decoration-1 underline-offset-6 hover:decoration-solid hover:decoration-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {achados ? <div>{achados}</div> : null}
      </Container>
    </footer>
  )
}
