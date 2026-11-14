"use client"

import { Dialog as RadixDialog } from "radix-ui"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

interface BaseProps {
  title: ReactNode
  description?: ReactNode
  /** Elemento que abre o painel (ex.: um Button). */
  trigger?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Ações no pé do painel. */
  footer?: ReactNode
  children?: ReactNode
  seed?: string
  className?: string
  /** Nome do botão de fechar (padrão "Fechar"). */
  closeLabel?: string
}

export interface DialogProps extends BaseProps {
  size?: "sm" | "md" | "lg"
}

export interface DrawerProps extends BaseProps {
  side?: "right" | "left"
}

const SIZE = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const

function Header({
  title,
  description,
  closeLabel,
}: {
  title: ReactNode
  description?: ReactNode
  closeLabel: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <RadixDialog.Title className="text-h3">{title}</RadixDialog.Title>
        {description ? (
          <RadixDialog.Description className="text-body text-ink-muted">
            {description}
          </RadixDialog.Description>
        ) : null}
      </div>
      <RadixDialog.Close asChild>
        <Button
          iconOnly="fechar"
          aria-label={closeLabel}
          variant="ghost"
          size="sm"
          className="-me-2 -mt-1"
        />
      </RadixDialog.Close>
    </div>
  )
}

/**
 * Painel modal desenhado à mão. Foco preso, Esc fecha, foco volta ao
 * gatilho. Ficha: docs/specs/sobreposicoes.md
 */
export function Dialog({
  title,
  description,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  footer,
  children,
  size = "md",
  seed,
  className,
  closeLabel = "Fechar",
}: DialogProps) {
  const shapeSeed = seed ?? `dialogo:${typeof title === "string" ? title : "painel"}`
  const host = shapeHostProps({ seed: shapeSeed, bucket: "lg" })
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-(--z-overlay) bg-overlay data-[state=closed]:animate-sumir data-[state=open]:motion-safe:animate-esmaecer" />
        <div className="pointer-events-none fixed inset-0 z-(--z-dialog) grid place-items-center p-4">
          <RadixDialog.Content
            {...host}
            className={cn(
              "pointer-events-auto relative isolate flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-6 overflow-y-auto p-6 text-ink md:p-8",
              "data-[state=closed]:animate-sumir data-[state=open]:motion-safe:animate-surgir",
              SIZE[size],
              className,
            )}
          >
            <Shape seed={shapeSeed} bucket="lg" fill="surface-raised" shadow="lg" />
            <Header title={title} description={description} closeLabel={closeLabel} />
            {children ? <div className="flex flex-col gap-4">{children}</div> : null}
            {footer ? (
              <div className="flex flex-wrap justify-end gap-3">{footer}</div>
            ) : null}
          </RadixDialog.Content>
        </div>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

/** Painel lateral (menu mobile) com a borda de dentro rasgada. */
export function Drawer({
  title,
  description,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  footer,
  children,
  side = "right",
  seed,
  className,
  closeLabel = "Fechar",
}: DrawerProps) {
  const shapeSeed = seed ?? `gaveta:${typeof title === "string" ? title : "painel"}`
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-(--z-overlay) bg-overlay data-[state=closed]:animate-sumir data-[state=open]:motion-safe:animate-esmaecer" />
        <RadixDialog.Content
          data-shape-host=""
          className={cn(
            "fixed inset-y-0 isolate z-(--z-dialog) flex w-full max-w-sm flex-col gap-6 overflow-y-auto py-6 text-ink",
            side === "right" ? "right-0 ps-10 pe-6" : "left-0 ps-6 pe-10",
            "data-[state=closed]:animate-sumir",
            side === "right"
              ? "data-[state=open]:motion-safe:animate-deslizar-direita"
              : "data-[state=open]:motion-safe:animate-deslizar-esquerda",
            className,
          )}
        >
          <Shape
            seed={shapeSeed}
            kind="tornEdge"
            bucket="xl"
            edges={[side === "right" ? "left" : "right"]}
            fill="surface-raised"
            stroke="none"
            misalign={false}
          />
          <Header title={title} description={description} closeLabel={closeLabel} />
          {children ? <div className="flex flex-col gap-2">{children}</div> : null}
          {footer ? <div className="mt-auto flex flex-col gap-3">{footer}</div> : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

/** Fecha o Dialog/Drawer mais próximo (para ações do rodapé). */
export const DialogClose = RadixDialog.Close
