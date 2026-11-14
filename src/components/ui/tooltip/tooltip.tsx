"use client"

import { Tooltip as RadixTooltip } from "radix-ui"
import type { ReactElement, ReactNode } from "react"
import { Shape } from "@/components/ui/shape"

export interface TooltipProps {
  /** Texto curto. Nunca informação essencial nem motivo de desabilitado. */
  content: ReactNode
  children: ReactElement
  side?: "top" | "right" | "bottom" | "left"
  delayDuration?: number
}

/** Nome curto de um controle, no foco e no hover. Ficha: docs/specs/overlays.md */
export function Tooltip({
  content,
  children,
  side = "top",
  delayDuration = 300,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={8}
            className="relative isolate z-(--z-popover) px-3 py-1.5 text-sm text-ink data-[state=closed]:animate-sumir data-[state=delayed-open]:motion-safe:animate-surgir"
          >
            <Shape
              seed={`dica:${typeof content === "string" ? content : "conteudo"}`}
              kind="pill"
              bucket="sm"
              fill="surface-raised"
              strokeWidth={1.5}
              misalign={false}
              shadow="sm"
            />
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
