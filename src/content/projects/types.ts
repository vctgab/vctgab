import type { Maybe, Review, Reviewable } from "../pending.ts"

/**
 * Esquema de um caso (ficha: docs/specs/pages/case.md). O conteúdo de cada
 * projeto é um `ProjectCase` tipado; a página só compõe os blocos. Kasb
 * Health, Suíte OdiN e Lance! entram só criando um arquivo de conteúdo.
 */

/** Trecho de texto corrido. `Review` marca o que ainda precisa de validação. */
export type Inline =
  | string
  | { readonly strong: string }
  | { readonly code: string }
  | { readonly em: string }
  | Review<readonly Inline[]>

export type Content = readonly Inline[]

/** Print do produto (D-1311). */
export interface CaseImage {
  /** Caminho em /public (WebP, nomes em inglês, D-1316). */
  src: string
  /** Largura e altura reais do arquivo (para o CLS ser 0). */
  width: number
  height: number
  /** O que a tela mostra, escrito à mão; nunca o nome do arquivo. */
  alt: string
  /** Nome do print original, para rastrear (ex.: "03-dashboard-cooperado-desktop"). */
  source: string
}

export interface CaseFigureData {
  /** Id curto e estável (seed da moldura). */
  id: string
  variant: "browser" | "phone"
  /** Sem imagem, a moldura mostra a pendência com o nome do arquivo. */
  image: Maybe<CaseImage>
  /** Legenda do copy. Em grupo, só a legenda do grupo vale (sem legenda própria). */
  caption?: string
  /** Só a imagem principal carrega com prioridade. */
  priority?: boolean
}

export interface StatItem {
  value: string
  label: string
  method: string
  methodKind: "metodo" | "fonte"
}

export interface ListItem {
  /** Rótulo (vira `dt`): "O problema", "O que eu fiz"… */
  label?: string
  content: Content
}

/** Os blocos reutilizáveis de uma seção. */
export type CaseBlock =
  | {
      type: "text"
      content: Content
      /** Achado escondido perto do parágrafo. */
      find?: { id: "chave"; label: string }
    }
  | { type: "subtitle"; text: string; level?: 3 | 4 }
  | {
      type: "code"
      language: "ts" | "tsx" | "json" | "bash"
      code: Reviewable<string>
      caption: Content
    }
  | { type: "figure"; figure: CaseFigureData }
  | { type: "figure-group"; figures: readonly CaseFigureData[]; caption: string }
  | { type: "stats"; items: readonly StatItem[] }
  | { type: "callout"; label: string; content: Content }
  | { type: "list"; ordered?: boolean; items: readonly ListItem[] }

export interface CaseSection {
  /** Âncora do sumário. */
  id: string
  /** Título visível (h2) e texto do sumário. */
  title: string
  blocks: readonly CaseBlock[]
}

export interface CaseHeaderData {
  name: string
  /** Áreas ("código", "liderança"). */
  areas: readonly string[]
  /** "O que é". */
  about: string
  facts: {
    project: string
    role: string
    company: string
    period: string
    team: Reviewable<string>
    status: "em andamento" | "no ar"
    stack: readonly string[]
  }
}

export interface ProjectCase {
  slug: string
  meta: {
    title: string
    description: string
    /** Linha curta da imagem Open Graph (sem print do cliente). */
    ogLine: string
  }
  header: CaseHeaderData
  /** Imagem principal (a única com prioridade). */
  cover: CaseFigureData
  sections: readonly CaseSection[]
  next: { name: string; href: string }
}
