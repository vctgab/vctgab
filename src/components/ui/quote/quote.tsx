"use client"

import { RadioGroup } from "radix-ui"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/cn"

export interface QuoteItem {
  id: string
  author: string
  /** Cargo e empresa; se faltar, `[a confirmar: cargo e empresa]`. */
  role: string
  /** Texto do depoimento; se faltar, `[a confirmar: texto do depoimento]`. */
  text: string
}

export type QuoteStatus = "carregando" | "vazio" | "erro" | "indisponivel" | "pronto"

export interface QuoteProps {
  items: readonly QuoteItem[]
  status?: QuoteStatus
  /** Troca automática (mínimo 6000 ms). Desligada por padrão. */
  autoAdvanceMs?: number
  /** Ação do estado de erro ("Tentar carregar de novo"). */
  onRetry?: () => void
  className?: string
}

const isPending = (text: string) => text.startsWith("[a confirmar")

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

/** Depoimentos com troca entre depoentes. Ficha: docs/specs/quote.md */
export function Quote({
  items,
  status = "pronto",
  autoAdvanceMs,
  onRetry,
  className,
}: QuoteProps) {
  const id = useId()
  const [current, setCurrent] = useState(items[0]?.id ?? "")
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [userChose, setUserChose] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const auto = autoAdvanceMs ? Math.max(6000, autoAdvanceMs) : 0

  useEffect(() => {
    if (!auto || paused || interacting || items.length < 2 || prefersReducedMotion())
      return
    const timer = setInterval(() => {
      setUserChose(false)
      setCurrent((c) => {
        const i = items.findIndex((it) => it.id === c)
        return items[(i + 1) % items.length]?.id ?? c
      })
    }, auto)
    return () => clearInterval(timer)
  }, [auto, paused, interacting, items])

  if (status !== "pronto" || items.length === 0) {
    const messages: Record<Exclude<QuoteStatus, "pronto">, ReactNode> = {
      carregando: null,
      vazio: "Ainda não há depoimentos publicados.",
      erro: (
        <>
          <span className="font-medium">Não foi possível carregar os depoimentos.</span>{" "}
          Recarregue a página ou tente de novo agora.
        </>
      ),
      indisponivel: "Os depoimentos voltam quando cada pessoa autorizar a publicação.",
    }
    const state = status === "pronto" ? "vazio" : status
    return (
      <div
        className={cn("flex flex-col gap-4", className)}
        aria-busy={state === "carregando" || undefined}
      >
        {state === "carregando" ? (
          <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
            <Skeleton shape="linha" lines={4} seed="quote:lista" />
            <Skeleton heightClass="h-56" seed="quote:ficha" />
            <p className="sr-only" role="status">
              Carregando depoimentos
            </p>
          </div>
        ) : (
          <div
            role={state === "erro" ? "alert" : "status"}
            className={cn(
              "text-body",
              state === "erro" ? "text-danger-text" : "text-ink-muted",
            )}
          >
            <p>{messages[state]}</p>
            {state === "erro" && onRetry ? (
              <Button variant="secondary" className="mt-4" onClick={onRetry}>
                Tentar carregar de novo
              </Button>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  const item = items.find((it) => it.id === current) ?? (items[0] as QuoteItem)
  const host = shapeHostProps({ seed: `quote:${item.id}`, bucket: "lg" })

  return (
    <div
      ref={root}
      className={cn(
        "grid items-start gap-8 md:grid-cols-[16rem_1fr] md:gap-12",
        className,
      )}
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setInteracting(false)
      }}
    >
      <div className="flex flex-col gap-3">
        <RadioGroup.Root
          aria-label="Escolher quem fala"
          value={item.id}
          onValueChange={(v) => {
            setUserChose(true)
            setCurrent(v)
          }}
          {...shapeHostProps({ seed: "quote:lista", bucket: "md" })}
          className="relative isolate flex flex-col gap-1 p-2.5"
        >
          <Shape
            seed="quote:lista"
            bucket="md"
            fill="surface-raised"
            shadow="md"
            shadowColor="shadow-soft"
          />
          {items.map((it) => (
            <RadioGroup.Item
              key={it.id}
              value={it.id}
              className={cn(
                "group/depoente relative flex min-h-11 cursor-pointer items-center gap-2 px-3 text-left font-semibold text-ink",
                "hover:bg-surface-hover data-[state=checked]:bg-ink data-[state=checked]:text-surface-base",
              )}
            >
              <Icon
                name="check"
                size={16}
                decorative
                className="opacity-0 group-data-[state=checked]/depoente:opacity-100"
              />
              {it.author}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
        {auto ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPaused((p) => !p)}
            className="self-start"
          >
            {paused ? "Retomar troca automática" : "Pausar troca automática"}
          </Button>
        ) : null}
      </div>

      <figure
        {...host}
        aria-live={userChose ? "polite" : "off"}
        aria-labelledby={`${id}-autor`}
        className="relative isolate flex min-h-72 flex-col justify-between gap-8 p-8 ps-16 md:p-10 md:ps-18"
      >
        <Shape
          seed={`quote:${item.id}`}
          bucket="lg"
          fill="surface-raised"
          shadow="lg"
          shadowColor="shadow-soft"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 bottom-6 left-4 w-6"
          style={{
            backgroundImage: Array.from(
              { length: 6 },
              (_, i) =>
                `radial-gradient(circle at 12px ${(6 + i * 17.6).toFixed(1)}%, var(--hole) 0 5px, var(--hole-rim) 5.5px 6.5px, transparent 7px)`,
            ).join(", "),
          }}
        />
        <blockquote
          key={item.id}
          className="font-soft font-display text-h2 font-medium motion-safe:animate-esmaecer"
        >
          <span aria-hidden="true">“</span>
          <span
            className={
              isPending(item.text)
                ? "bg-primary-soft underline decoration-primary-decor decoration-dashed underline-offset-4"
                : undefined
            }
          >
            {item.text}
          </span>
          <span aria-hidden="true">”</span>
        </blockquote>
        <figcaption className="flex flex-col gap-1.5">
          <strong id={`${id}-autor`} className="font-soft font-display text-body-lg">
            {item.author}
          </strong>
          <span className="text-sm text-ink-muted">{item.role}</span>
        </figcaption>
      </figure>
    </div>
  )
}
