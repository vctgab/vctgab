"use client"

import { Fact } from "@/components/ui/fact"
import { SECRET_PAGE } from "@/content/pages"
import { formatNumber } from "@/lib/format"
import { useAchados } from "./finds-provider"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Estado indisponível da página secreta: diz o que falta, de forma factual.
 * Ficha: docs/specs/finds.md
 */
export function AvisoPaginaSecreta({ className }: { className?: string }) {
  const { state, count, total, unlocked, openCard } = useAchados()
  if (state === null)
    return <Skeleton shape="linha" lines={2} seed="aviso-secreto" className={className} />
  if (unlocked) {
    return (
      <p role="status" className={className}>
        Página secreta liberada. <Fact value={SECRET_PAGE.href} />
      </p>
    )
  }
  return (
    <div role="status" className={className}>
      <p className="text-body-lg">
        Esta página abre com {formatNumber(total)} achados. Você tem {formatNumber(count)}
        .
      </p>
      <button
        type="button"
        onClick={(e) => openCard(e.currentTarget)}
        className="mt-3 inline-flex min-h-11 cursor-pointer items-center font-medium text-primary-text underline decoration-(--primary-decor) decoration-2 underline-offset-4 hover:text-primary-text-hover"
      >
        Abrir o caderno de achados
      </button>
    </div>
  )
}
