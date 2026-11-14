"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/dialog"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"
import { SECTION_GROUPS, SECTIONS } from "./sections"

function Links({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex flex-col gap-6">
      {SECTION_GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <p className="font-mono text-label text-ink-subtle">{group}</p>
          <ul className="flex flex-col">
            {SECTIONS.filter((s) => s.group === group).map((s) => {
              const current = pathname === s.href
              const line = generateShape({
                kind: "handLine",
                seed: `nav-sistema:${s.href}`,
                bucket: "sm",
                irregularity: 0.4,
              })
              return (
                <li key={s.href}>
                  <Link
                    href={s.href as Route}
                    aria-current={current ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "group/secao relative flex min-h-11 items-center px-2 text-body text-ink-muted hover:text-ink",
                      "aria-[current=page]:font-medium aria-[current=page]:text-primary-text",
                    )}
                  >
                    {s.label}
                    {current ? (
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 1 1"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute bottom-2 left-2 h-1.5 w-16 overflow-visible text-primary-decor"
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
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** Navegação da vitrine: lateral no desktop, Drawer "Seções" no mobile. */
export function SystemNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav aria-label="Seções do sistema" className="hidden lg:block">
        <Links />
      </nav>
      <div className="lg:hidden">
        <Drawer
          title="Seções do sistema"
          side="left"
          open={open}
          onOpenChange={setOpen}
          closeLabel="Fechar as seções"
          trigger={
            <Button variant="secondary" size="sm" iconLeft="menu" seed="sistema:secoes">
              Seções
            </Button>
          }
        >
          <nav aria-label="Seções do sistema no menu">
            <Links onNavigate={() => setOpen(false)} />
          </nav>
        </Drawer>
      </div>
    </>
  )
}
