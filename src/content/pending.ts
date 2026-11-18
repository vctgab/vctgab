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

/**
 * Item que existe, mas ainda precisa da validação de Victor (`[validar: …]`
 * no copy). Diferente de `pending()`, que é o dado que falta por inteiro:
 * aqui o conteúdo está presente e aparece com uma marca visível de revisão.
 * O `pnpm release:check` lista cada um e bloqueia a publicação (D-1304).
 *
 * Com `withhold`, o conteúdo não é renderizado (código de cliente sem
 * permissão): só a marca aparece.
 */
export interface Review<T> {
  readonly review: true
  /** O que validar, em minúsculas: "permissão para mostrar trechos do código do cliente". */
  readonly what: string
  readonly content: T
  readonly withhold: boolean
}

/** Um valor que pode estar em revisão. */
export type Reviewable<T> = T | Review<T>

export function review<T>(
  what: string,
  content: T,
  options: { withhold?: boolean } = {},
): Review<T> {
  return { review: true, what, content, withhold: options.withhold ?? false }
}

export function isReview(value: unknown): value is Review<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { review?: unknown }).review === true &&
    typeof (value as { what?: unknown }).what === "string" &&
    "content" in value
  )
}

/** Texto exato da marca de revisão. */
export function reviewLabel(value: Pick<Review<unknown>, "what">): string {
  return `[validar: ${value.what}]`
}

/** O conteúdo, com ou sem a marca de revisão em volta. */
export function unreview<T>(value: Reviewable<T>): T {
  return isReview(value) ? (value.content as T) : (value as T)
}
