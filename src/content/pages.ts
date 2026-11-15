import { pending, type Maybe } from "./pending.ts"

/**
 * Páginas que ainda não têm conteúdo próprio. Ficam aqui, e não escritas no
 * código dos componentes, para todo dado pendente estar em src/content e no
 * `pnpm release:check` (D-1035).
 */
export interface ProvisionalPage {
  title: string
  /** O que falta para a página existir. */
  content: Maybe<string>
}

export const PROVISIONAL_PAGES = {
  projetos: { title: "Projetos", content: pending("conteúdo da página projetos") },
  sobre: { title: "Sobre", content: pending("conteúdo da página sobre") },
  contato: { title: "Contato", content: pending("conteúdo da página contato") },
} as const satisfies Record<string, ProvisionalPage>

export type ProvisionalPageId = keyof typeof PROVISIONAL_PAGES

/** Página liberada ao chegar a 7 de 7 achados (camada de mistério). */
export const SECRET_PAGE: { href: Maybe<string> } = {
  href: pending("página secreta"),
}
