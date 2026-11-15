"use client"
// camada: mistério. Dicas e subtítulo com humor leve; estados e erros em voz de sistema.

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Fact } from "@/components/ui/fact"
import { Icon } from "@/components/ui/icon"
import { ProgressHatch } from "@/components/ui/progress-hatch"
import { Skeleton } from "@/components/ui/skeleton"
import { SECRET_PAGE } from "@/content/pages"
import { ACHADOS, TOTAL_ACHADOS } from "@/lib/finds/finds"
import { resetAchados, type AchadosState } from "@/lib/finds/store"

export interface AchadosCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
  /** `null` enquanto o caderno não foi lido. */
  state: AchadosState | null
}

/**
 * Corpo do caderno de achados nos estados carregando, vazio, erro e com
 * dados (o indisponível é o `AvisoPaginaSecreta`). Ficha: docs/specs/finds.md
 */
export function AchadosCardBody({ state }: { state: AchadosState | null }) {
  if (state === null) {
    return (
      <div aria-busy="true" className="flex flex-col gap-4">
        <p role="status" className="text-body text-ink-muted">
          Lendo o caderno
        </p>
        <Skeleton shape="linha" lines={5} seed="caderno:carregando" />
      </div>
    )
  }
  const count = state.found.length
  return (
    <div className="flex flex-col gap-4">
      <ProgressHatch value={count} max={TOTAL_ACHADOS} label="Progresso dos achados" />
      {state.storage === "indisponivel" ? (
        <p role="alert" className="flex items-start gap-2 text-sm text-danger-text">
          <Icon name="alerta" size={16} decorative className="mt-0.5" />
          <span>
            Não foi possível guardar os achados neste navegador. Eles valem até você
            fechar esta página.
          </span>
        </p>
      ) : null}
      {count === 0 ? (
        <p className="text-body text-ink-muted">
          Nenhum achado ainda. As dicas abaixo ajudam a começar.
        </p>
      ) : null}
      <ol className="flex flex-col">
        {ACHADOS.map((achado, i) => {
          const found = state.found.includes(achado.id)
          return (
            <li
              key={achado.id}
              className="flex min-h-11 items-start gap-3 border-b-2 border-dashed border-border py-2.5"
            >
              <span className="w-5 shrink-0 pt-1 font-mono text-label text-ink-subtle">
                {i + 1}
              </span>
              {found ? (
                <span className="flex flex-1 items-start justify-between gap-2 font-marker text-marker">
                  <span>
                    <s className="decoration-primary-decor decoration-2">{achado.nome}</s>
                    <span className="sr-only"> (achado)</span>
                  </span>
                  <Icon name="check" decorative className="mt-0.5 text-primary-text" />
                </span>
              ) : (
                <span className="flex-1 font-hand text-hand text-ink-muted">
                  <span className="sr-only">Ainda não achado: </span>
                  {achado.dica}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {count === TOTAL_ACHADOS ? (
        <p className="font-marker text-marker text-ink">
          Sete de sete. Página secreta liberada: <Fact value={SECRET_PAGE.href} />
        </p>
      ) : null}
    </div>
  )
}

/** O caderno como diálogo. Fica no AchadosProvider. */
export function AchadosCard({
  open,
  onOpenChange,
  onCloseAutoFocus,
  state,
}: AchadosCardProps) {
  return (
    <Dialog
      title="Caderno de achados"
      description={
        <span className="font-hand text-hand">Sete coisas escondidas pelo site.</span>
      }
      open={open}
      onOpenChange={onOpenChange}
      onCloseAutoFocus={onCloseAutoFocus}
      closeLabel="Fechar o caderno"
      seed="caderno-de-achados"
      size="sm"
      footer={
        state && state.found.length > 0 ? (
          <Button variant="link" size="sm" onClick={resetAchados}>
            Recomeçar os achados
          </Button>
        ) : null
      }
    >
      <AchadosCardBody state={state} />
    </Dialog>
  )
}
