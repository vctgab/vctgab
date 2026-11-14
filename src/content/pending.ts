/**
 * Dado que ainda falta (DD-01). Fica no conteúdo como um valor tipado, não
 * como texto solto: a tela mostra `[a confirmar: o que falta]` e o
 * `pnpm release:check` lista cada um e bloqueia a publicação.
 *
 * Objeto simples (não classe) para atravessar a fronteira entre Server e
 * Client Components do React.
 */
export interface Pending {
  readonly pending: true
  /** O que falta, em minúsculas: "número do WhatsApp". */
  readonly what: string
}

/** Um valor que pode estar pendente. */
export type Maybe<T> = T | Pending

export function pending(what: string): Pending {
  return { pending: true, what }
}

export function isPending(value: unknown): value is Pending {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { pending?: unknown }).pending === true &&
    typeof (value as { what?: unknown }).what === "string"
  )
}

/** Texto exato da marca de pendência (DD-01). */
export function pendingLabel(value: Pending): string {
  return `[a confirmar: ${value.what}]`
}

/** O valor pronto ou a marca de pendência. */
export function textOf(value: Maybe<string>): string {
  return isPending(value) ? pendingLabel(value) : value
}
