"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

export interface CaseTocItem {
  /** Id da seção (âncora). */
  id: string
  title: string
}

export interface CaseTocProps {
  items: readonly CaseTocItem[]
  /** Seção atual inicial; depois o observador assume. */
  current?: string
  className?: string
}

/**
 * Observa as seções e devolve o id da que está na faixa de leitura (do alto da
 * tela até 40% dela), a primeira em ordem de documento.
 */
function useCurrentSection(ids: readonly string[], initial: string | null) {
  const [current, setCurrent] = useState<string | null>(initial)

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const first = ids.find((id) => visible.has(id))
        // Sem seção na faixa de leitura (topo da página): nenhuma marcada.
        setCurrent(first ?? null)
      },
      { rootMargin: "-96px 0px -60% 0px" },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return [current, setCurrent] as const
}

function Links({
  items,
  current,
  onSelect,
}: {
  items: readonly CaseTocItem[]
  current: string | null
  onSelect: (id: string) => void
}) {
  return (
    <ol className="flex flex-col">
      {items.map((item) => {
        const isCurrent = item.id === current
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isCurrent ? "location" : undefined}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group/toc flex min-h-11 items-center gap-2 py-2 text-body text-ink-muted",
                "transition-colors duration-(--duration-state) ease-hand",
                "hover:text-primary-text-hover active:text-primary-text-hover",
                "aria-[current=location]:font-medium aria-[current=location]:text-primary-text",
                "forced-colors:aria-[current=location]:underline",
                "focus-visible:outline-[2.5px] focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:outline-solid",
              )}
            >
              <span aria-hidden="true" className="inline-flex size-4 shrink-0">
                {isCurrent ? (
                  <Icon name="seta" size={16} decorative className="text-primary-decor" />
                ) : null}
              </span>
              <span>{item.title}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Sumário do caso: coluna fixa no desktop (`lg`), bloco recolhível no topo no
 * celular (`<details>`, que funciona sem JavaScript). Marca a seção atual com
 * `aria-current="location"`. Ficha: docs/specs/case-toc.md
 */
export function CaseToc({ items, current: initial, className }: CaseTocProps) {
  const ids = useMemo(() => items.map((i) => i.id), [items])
  const [current, setCurrent] = useCurrentSection(ids, initial ?? null)
  const details = useRef<HTMLDetailsElement>(null)
  const summary = useRef<HTMLElement>(null)
  const host = shapeHostProps({ seed: "caso:sumario", kind: "wobblyRect", bucket: "md" })

  // Esc fecha o bloco aberto e devolve o foco ao botão (ouvinte no DOM, não no JSX).
  useEffect(() => {
    const el = details.current
    if (!el) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && el.open) {
        el.open = false
        summary.current?.focus()
      }
    }
    el.addEventListener("keydown", onKeyDown)
    return () => el.removeEventListener("keydown", onKeyDown)
  }, [])

  function select(id: string) {
    setCurrent(id)
    if (details.current) details.current.open = false
  }

  return (
    <div className={className}>
      <nav aria-label="Sumário do caso" className="lg:hidden">
        <details
          ref={details}
          {...host}
          className="group/sumario relative isolate px-6 text-ink"
        >
          <Shape
            seed="caso:sumario"
            bucket="md"
            fill="surface-raised"
            shadow="sm"
            shadowColor="shadow-soft"
            strokeWidth={1.5}
          />
          <summary
            ref={summary}
            className={cn(
              "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 font-medium marker:hidden [&::-webkit-details-marker]:hidden",
              "focus-visible:outline-[2.5px] focus-visible:outline-offset-4 focus-visible:outline-focus-ring focus-visible:outline-solid",
            )}
          >
            <span>Sumário</span>
            <Icon
              name="seletor"
              size={20}
              decorative
              className="transition-[rotate] duration-(--duration-state) ease-hand group-open/sumario:rotate-180"
            />
          </summary>
          <div className="pb-3">
            <Links items={items} current={current} onSelect={select} />
          </div>
        </details>
      </nav>
      <nav aria-label="Sumário" className="hidden lg:sticky lg:top-24 lg:block">
        <p aria-hidden="true" className="mb-2 font-mono text-label text-ink-subtle">
          Sumário
        </p>
        <Links items={items} current={current} onSelect={setCurrent} />
      </nav>
    </div>
  )
}
