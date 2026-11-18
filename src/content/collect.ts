import { isPending, isReview, reviewLabel, type Pending, type Review } from "./pending.ts"

/**
 * Coletores do `pnpm release:check`: percorrem o conteúdo e listam cada
 * pendência (`pending`) e cada item em revisão (`review`) com o caminho.
 * Ficam em `src/content` para o teste de unidade usar os mesmos.
 */
export interface Found {
  where: string
  what: string
}

export function collectPending(value: unknown, path: string, out: Found[]): void {
  if (isPending(value)) {
    out.push({ where: path, what: (value as Pending).what })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectPending(v, `${path}[${i}]`, out))
    return
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectPending(v, `${path}.${k}`, out)
  }
}

export function collectReviews(value: unknown, path: string, out: Found[]): void {
  if (isReview(value)) {
    out.push({ where: path, what: reviewLabel(value as Review<unknown>) })
    collectReviews((value as Review<unknown>).content, `${path}.content`, out)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectReviews(v, `${path}[${i}]`, out))
    return
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectReviews(v, `${path}.${k}`, out)
  }
}
