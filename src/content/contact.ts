import type { ContactTab } from "./home.ts"

/**
 * Página /contato mínima (ficha: docs/specs/pages/contact.md, D-1212). Sem
 * formulário: cada aba leva a um canal direto com o assunto pronto.
 */
export interface ContactTabContent {
  value: ContactTab
  /** Rótulo da opção, em minúscula como os CTAs. */
  label: string
  /** Título do painel. */
  title: string
  text: string
  /** Assunto do e-mail. */
  subject: string
}

export const CONTACT_PAGE = {
  title: "contato",
  lead: "Escolha o assunto e fale direto comigo. Costumo responder em até um dia útil.",
  /** Nome acessível do controle. */
  tabsLabel: "Assunto",
  /** Aba sem `?aba=` ou com valor desconhecido. */
  defaultTab: "vaga" as ContactTab,
  tabs: [
    {
      value: "vaga",
      label: "vaga",
      title: "Vaga",
      text: "Mande a descrição da vaga e como é o processo. Se tiver, inclua o modelo de trabalho e a faixa salarial.",
      subject: "Vaga",
    },
    {
      value: "projeto",
      label: "projeto",
      title: "Projeto",
      text: "Conte o que você quer construir, para quando e se já existe algo desenhado.",
      subject: "Projeto",
    },
  ] satisfies readonly ContactTabContent[],
  labels: { email: "E-mail", linkedin: "LinkedIn" },
  finds: { label: "Algo em cima da mesa" },
} as const

export function isContactTab(value: unknown): value is ContactTab {
  return value === "vaga" || value === "projeto"
}
