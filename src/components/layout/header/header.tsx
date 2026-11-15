"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/dialog"
import { Logo } from "@/components/ui/logo"
import { Popover } from "@/components/ui/popover"
import { Container } from "@/components/ui/section"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { HOME } from "@/content/home"
import { cn } from "@/lib/cn"
import { talkHref } from "@/lib/contact"
import { generateShape } from "@/lib/shapes"
import { NAV_LINKS } from "./nav-links"

export interface HeaderProps {
  /**
   * Destino do CTA "Vamos conversar". Padrão: WhatsApp quando houver número;
   * senão, o contato da Home (D-1015).
   */
  ctaHref?: string
  className?: string
}

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
 * Cabeçalho global: pular para o conteúdo, logo, navegação, tema e CTA. No
 * mobile, menu em Drawer. O botão `cmd` volta quando o terminal existir.
 * Ficha: docs/specs/header-footer.md
 */
export function Header({ ctaHref, className }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  // Link do menu para uma âncora (#contato): o foco não volta ao botão do
  // menu, senão a página rolaria de volta ao topo.
  const toAnchor = useRef(false)
  const closeMenu = (href: string) => {
    toAnchor.current = href.includes("#")
    setMenuOpen(false)
  }
  const cta = ctaHref ?? talkHref(HOME.hero.ctaMessage, pathname === "/")

  return (
    <header className={cn("relative z-(--z-header)", className)}>
      <a
        href="#conteudo"
        className="sr-only-focusable fixed top-3 left-3 z-(--z-skip) inline-flex min-h-11 items-center bg-ink px-5 font-medium text-surface-base"
      >
        Pular para o conteúdo
      </a>
      <Container className="flex min-h-19 items-center justify-between gap-3">
        <Logo compact />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} current={pathname === link.href} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Popover
            title="Tema"
            align="end"
            trigger={
              <Button
                iconOnly="tema"
                aria-label="Escolher tema"
                variant="ghost"
                size="sm"
                seed="cabecalho:tema"
              />
            }
          >
            <ThemeSwitcher layout="compact" className="mt-1" />
          </Popover>
          {/* Largura fixa, texto no início e seta no fim: a troca de fonte não move
              o grupo alinhado à direita, em qualquer sistema (D-1034). */}
          <Button
            asChild
            size="sm"
            iconRight="seta"
            seed="cabecalho:cta"
            className="w-48 justify-between"
          >
            <Link href={cta as Route}>Vamos conversar</Link>
          </Button>
        </div>

        <div className="lg:hidden">
          <Drawer
            title="Menu"
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onCloseAutoFocus={(event) => {
              if (toAnchor.current) event.preventDefault()
              toAnchor.current = false
            }}
            closeLabel="Fechar menu"
            trigger={
              <Button
                iconOnly="menu"
                aria-label="Abrir menu"
                variant="secondary"
                size="sm"
              />
            }
            footer={
              <>
                <Button asChild iconRight="seta" seed="menu:cta">
                  <Link href={cta as Route} onClick={() => closeMenu(cta)}>
                    Vamos conversar
                  </Link>
                </Button>
              </>
            }
          >
            <nav aria-label="Principal no menu">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={() => closeMenu(link.href)}
                      className="font-soft flex min-h-12 items-center font-display text-h3 text-ink aria-[current=page]:text-primary-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <p className="font-mono text-label text-ink-subtle">Tema</p>
              <ThemeSwitcher layout="compact" />
            </div>
          </Drawer>
        </div>
      </Container>
    </header>
  )
}
