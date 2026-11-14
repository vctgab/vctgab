import { pending, type Maybe } from "./pending.ts"

/**
 * Textos da Home (ficha: docs/specs/pages/home.md). Tom sério e direto;
 * brincadeira só na camada de mistério (achados), que fica em
 * src/lib/finds. Fatos ausentes são `pending(...)`.
 */

export interface Testimonial {
  id: string
  author: string
  /** Cargo e empresa. */
  role: Maybe<string>
  text: Maybe<string>
}

export interface Service {
  marker: string
  title: string
  description: string
  tags: readonly string[]
}

export const HOME = {
  meta: {
    title: "Victor Gabriel, desenvolvedor front-end",
    description:
      "Desenvolvedor front-end em Teresina, vindo do design de produto. Interfaces em React e Next.js para fundadores e equipes que precisam de produto no ar.",
  },

  hero: {
    eyebrows: ["desenvolvedor front-end", "react e next.js"],
    titleStart: "Front-end com",
    titleHighlight: "visão de produto.",
    lead: "Desenvolvo interfaces em React e Next.js para fundadores e equipes que precisam de produto no ar, com design que o código aguenta.",
    cta: "Vamos conversar",
    /** Mensagem já escrita no WhatsApp. */
    ctaMessage: "Olá, Victor. Vim pelo portfólio e quero conversar sobre um projeto.",
    agenda: { before: "Agenda de", after: "aberta" },
    location: "Teresina • Brasil",
    annotation: "design que o código aguenta",
  },

  projects: {
    title: "Projetos em destaque",
    allLabel: "Ver todos os projetos",
    allHref: "/projetos",
    labels: { client: "para", role: "Papel", type: "Tipo", delivery: "Entrega" },
  },

  services: {
    eyebrow: "serviços",
    title: "O que eu faço",
    items: [
      {
        marker: "01",
        title: "Desenvolvimento front-end",
        description:
          "Interfaces rápidas e fáceis de manter, a partir de design system, com testes e padrões.",
        tags: ["react", "next.js", "typescript", "tailwind css"],
      },
      {
        marker: "02",
        title: "Design que o código aguenta",
        description:
          "Do protótipo ao componente, com tokens, biblioteca de componentes, handoff e QA visual.",
        tags: ["handoff", "design system", "qa visual"],
      },
    ] satisfies readonly Service[],
  },

  testimonials: {
    eyebrow: "depoimentos",
    title: "O que dizem sobre o trabalho",
    items: [
      {
        id: "natalia-oliveira",
        author: "Natália Oliveira",
        role: pending("cargo e empresa de Natália Oliveira"),
        text: pending("depoimento de Natália Oliveira"),
      },
      {
        id: "diogo-reis",
        author: "Diogo Reis",
        role: pending("cargo e empresa de Diogo Reis"),
        text: pending("depoimento de Diogo Reis"),
      },
      {
        id: "eduardo-silva",
        author: "Eduardo Silva",
        role: pending("cargo e empresa de Eduardo Silva"),
        text: pending("depoimento de Eduardo Silva"),
      },
      {
        id: "jecielly-mota",
        author: "Jecielly Mota",
        role: pending("cargo e empresa de Jecielly Mota"),
        text: pending("depoimento de Jecielly Mota"),
      },
    ] satisfies readonly Testimonial[],
  },

  proof: {
    eyebrow: "prova",
    title: "Resultado medido",
    stat: { from: 34, to: 89, method: "Teste de árvore no OdiN Docs." },
    video: {
      title: "Nexuscoop em 30 segundos",
      /** Arquivo em /public/videos; até 30 s, sem som. */
      src: pending("vídeo do Nexuscoop, até 30 s, sem som") as Maybe<string>,
      captions: pending("legenda do vídeo do Nexuscoop") as Maybe<string>,
      poster: pending("quadro de capa do vídeo do Nexuscoop") as Maybe<string>,
      description: pending("o que o vídeo do Nexuscoop mostra") as Maybe<string>,
    },
  },

  about: {
    eyebrow: "sobre",
    title: "Desenvolvedor que veio do design de produto",
    /** Cada frase em três partes: antes, destaque em negrito, depois. */
    facts: [
      ["Trabalho com ", "produto digital desde 2021", "."],
      ["Na OdiNetwork, ", "liderei três pessoas de design", "."],
      ["E ", "ensino quem trabalha comigo", "."],
    ] as const,
    photos: [
      pending("foto 1 de Victor"),
      pending("foto 2 de Victor"),
      pending("foto 3 de Victor"),
      pending("foto 4 de Victor"),
    ] as readonly Maybe<string>[],
    cta: "Mais sobre mim",
    ctaHref: "/sobre",
  },

  contact: {
    id: "contato",
    title: "Vamos trabalhar no seu projeto",
    lead: "Conte o que você precisa e para quando.",
    cta: "Solicitar orçamento",
    ctaMessage: "Olá, Victor. Quero pedir um orçamento para um projeto.",
    /** Assunto do e-mail quando o WhatsApp ainda não está confirmado. */
    emailSubject: "Orçamento",
    labels: { email: "E-mail", github: "GitHub", linkedin: "LinkedIn" },
  },
} as const
