"use client"

import { Popover as RadixPopover } from "radix-ui"
import type { ReactElement, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

export interface PopoverProps {
  trigger: ReactElement
  /** Título do painel; também é o nome acessível. */
  title: string
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

/** Conteúdo complementar ancorado num controle. Ficha: docs/specs/overlays.md */
export function Popover({
  trigger,
  title,
  children,
  side = "bottom",
  align = "start",
  open,
  onOpenChange,
  className,
}: PopoverProps) {
  const seed = `popover:${title}`
  const host = shapeHostProps({ seed, bucket: "lg" })
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          {...host}
          side={side}
          align={align}
          sideOffset={10}
          collisionPadding={16}
          aria-label={title}
          className={cn(
            "relative isolate z-(--z-popover) flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3 p-5 text-ink",
            "data-[state=closed]:animate-sumir data-[state=open]:motion-safe:animate-surgir",
            className,
          )}
        >
          <Shape seed={seed} bucket="lg" fill="surface-raised" shadow="md" />
          <div className="flex items-start justify-between gap-3">
            <p className="font-soft font-display text-h3">{title}</p>
            <RadixPopover.Close asChild>
              <Button
                iconOnly="fechar"
                aria-label="Fechar"
                variant="ghost"
                size="sm"
                className="-me-2 -mt-2"
              />
            </RadixPopover.Close>
          </div>
          <div className="text-body text-ink-muted">{children}</div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
