"use client"

import type { ReactNode } from "react"
import { Dialog } from "@/components/ui/dialog"
import { TerminalShell } from "@/components/ui/terminal-shell"

/** O terminal `cmd` num diálogo. O gatilho vem de quem usa (botão do cabeçalho). */
export function TerminalDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog
      title="Terminal"
      description="Uma linha de comando escondida no caderno."
      size="lg"
      trigger={trigger}
      closeLabel="Fechar o terminal"
      seed="dialogo:terminal"
    >
      <TerminalShell focusOnMount />
    </Dialog>
  )
}
