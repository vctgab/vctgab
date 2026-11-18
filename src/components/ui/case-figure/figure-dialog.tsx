"use client"

import type { ReactNode } from "react"
import { Dialog } from "@/components/ui/dialog"

/**
 * Gatilho e painel de ampliação (cliente). O botão e a imagem ampliada chegam
 * prontos do servidor; aqui só mora o estado do diálogo.
 */
export function FigureDialog({
  title,
  size,
  trigger,
  seed,
  children,
}: {
  title: ReactNode
  size: "md" | "xl"
  trigger: ReactNode
  seed: string
  children: ReactNode
}) {
  return (
    <Dialog
      title={title}
      description="Imagem ampliada. Role para ver a tela inteira. Esc fecha."
      size={size}
      seed={seed}
      trigger={trigger}
    >
      {children}
    </Dialog>
  )
}
