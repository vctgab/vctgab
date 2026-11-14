"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/dialog"
import { Logo } from "@/components/ui/logo"
import { Popover } from "@/components/ui/popover"
import { Container } from "@/components/ui/section"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"
import { TerminalDialog } from "../terminal"
import { NAV_LINKS } from "./nav-links"

export interface HeaderProps {
  /** Destino do CTA "Vamos conversar". */
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
 * Cabeçalho global: pular para o conteúdo, logo, navegação, terminal, tema
 * e CTA. No mobile, menu em Drawer. Ficha: docs/specs/header-footer.md
 */
export function Header({ ctaHref = "/contato", className }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const cmd = (
    <Button
      variant="secondary"
      size="sm"
      iconLeft="terminal"
      seed="cabecalho:cmd"
      className="font-mono text-sm"
    >
      cmd
    </Button>
  )

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
          <TerminalDialog trigger={cmd} />
          <Popover
            title="Tema"
            align="end"
            trigger={
              <Button variant="ghost" size="sm" seed="cabecalho:tema">
                Escolher tema
              </Button>
            }
          >
            <ThemeSwitcher layout="compact" className="mt-1" />
          </Popover>
          <Button asChild size="sm" iconRight="seta" seed="cabecalho:cta">
            <Link href={ctaHref as Route}>Vamos conversar</Link>
          </Button>
        </div>

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
            footer={
              <>
                <Button asChild iconRight="seta" seed="menu:cta">
                  <Link href={ctaHref as Route} onClick={() => setMenuOpen(false)}>
                    Vamos conversar
                  </Link>
                </Button>
                <TerminalDialog trigger={cmd} />
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
                      onClick={() => setMenuOpen(false)}
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
