"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/dialog"
import { AchadosChip } from "@/components/ui/finds"
import { Icon } from "@/components/ui/icon"
import { Logo } from "@/components/ui/logo"
import { Popover } from "@/components/ui/popover"
import { Container } from "@/components/ui/section"
import { SEASON_ICON, ThemeSwitcher } from "@/components/ui/theme-switcher"
import { HOME } from "@/content/home"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"
import { DEFAULT_SEASON, SEASONS } from "@/lib/theme/themes"
import { NAV_LINKS } from "./nav-links"

export interface HeaderProps {
  className?: string
}

/**
 * Só o nome da estação de `html[data-season]` aparece (D-1203). A regra vem de
 * SEASONS: uma estação nova não pede CSS à mão. Sem o atributo (sem
 * JavaScript), vale a estação padrão.
 */
const SEASON_ONLY_CSS = [
  "[data-season-only]{display:none}",
  ...SEASONS.map(
    (s) =>
      `html[data-season="${s.id}"] [data-season-only="${s.id}"]{display:inline-flex}`,
  ),
  `html:not([data-season]) [data-season-only="${DEFAULT_SEASON}"]{display:inline-flex}`,
].join("")

function NavLink({
  href,
  label,
  current,
}: {
  href: string
  label: string
  current: boolean
}) {
  const line = generateShape({
    kind: "handLine",
    seed: `nav:${href}`,
    bucket: "sm",
    irregularity: 0.4,
  })
  return (
    <Link
      href={href as Route}
      aria-current={current ? "page" : undefined}
      className="group/nav relative inline-flex min-h-11 items-center px-3 font-medium whitespace-nowrap text-ink hover:text-primary-text-hover aria-[current=page]:text-primary-text"
    >
      {label}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-2.5 bottom-2 h-1.5 overflow-visible text-primary-decor opacity-0 group-hover/nav:opacity-100 group-aria-[current=page]/nav:opacity-100"
      >
        <path
          d={line.path}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Link>
  )
}

/**
 * "estação: primavera". O nome certo já na primeira pintura, sem estado no
 * servidor: um `span` por estação e a regra de exibição sobre `data-season`.
 * Abaixo de `lg`, só o ícone aparece; o nome fica para leitores de tela.
 */
function SeasonButton() {
  return (
    <>
      <style href="vg-season-only" precedence="default">
        {SEASON_ONLY_CSS}
      </style>
      <Popover
        title="Tema"
        align="end"
        trigger={
          <Button variant="ghost" size="sm" seed="cabecalho:estacao" className="px-3">
            {SEASONS.map((s) => (
              <span
                key={s.id}
                data-season-only={s.id}
                className="items-center gap-1.5 whitespace-nowrap"
              >
                <Icon name={SEASON_ICON[s.id] ?? "tema"} decorative />
                {/* Largura fixa no desktop: a troca da Patrick Hand e a da estação
                    não movem o resto do cabeçalho (como o CTA da D-1034). */}
                <span className="max-lg:sr-only lg:inline-block lg:w-36 lg:text-start">
                  {HOME.header.seasonLabel} {s.label.toLowerCase()}
                </span>
              </span>
            ))}
          </Button>
        }
      >
        <ThemeSwitcher layout="compact" className="mt-1" />
      </Popover>
    </>
  )
}

/**
 * Cabeçalho global: pular para o conteúdo, logo, navegação, contador de
 * achados e estação (D-1203). No mobile, os links vão para o Drawer; contador
 * e estação ficam no cabeçalho. Ficha: docs/specs/header-footer.md
 */
export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={cn("relative z-(--z-header)", className)}>
      <a
        href="#conteudo"
        className="sr-only-focusable fixed top-3 left-3 z-(--z-skip) inline-flex min-h-11 items-center bg-ink px-5 font-medium text-surface-base"
      >
        Pular para o conteúdo
      </a>
      <Container className="flex min-h-19 items-center justify-between gap-2">
        <Logo compact />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} current={pathname === link.href} />
          ))}
        </nav>

        <div className="flex items-center gap-1 lg:gap-2">
          <AchadosChip placement="header" />
          <SeasonButton />
          <div className="lg:hidden">
            <Drawer
              title="Menu"
              open={menuOpen}
              onOpenChange={setMenuOpen}
              closeLabel="Fechar menu"
              trigger={
                <Button
                  iconOnly="menu"
                  aria-label="Abrir menu"
                  variant="secondary"
                  size="sm"
                />
              }
            >
              <nav aria-label="Principal no menu">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href as Route}
                        aria-current={pathname === link.href ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className="font-soft flex min-h-12 items-center font-display text-h3 text-ink aria-[current=page]:text-primary-text"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Drawer>
          </div>
        </div>
      </Container>
    </header>
  )
}
