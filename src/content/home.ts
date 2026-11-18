import { pending, type Maybe } from "./pending.ts"

/**
 * Textos da Home v2 (ficha: docs/specs/pages/home.md), inclusive cabeçalho e
 * rodapé. O copy é de Victor e é literal (D-1201): não reescreva. Itens a
 * validar ou pendentes são `pending(...)` e entram no `pnpm release:check`.
 * Brincadeira dos achados fica em src/lib/finds.
 */

/** Item de "o que eu faço". */
export interface Skill {
  marker: string
  title: string
  description: string
  chips: readonly string[]
}

/**
 * Número com o que ele conta e o método ou a fonte (D-1207). O "8s → quase
 * instantâneo" fica reservado para a otimização de imagens deste portfólio,
 * quando for medida (pendência futura, D-1320): não entra no site antes.
 */
export interface Figure {
  id: string
  /** Valor anterior, para "de → para". */
  from?: string
  value: string
  label: string
  methodKind: "metodo" | "fonte"
  method: Maybe<string>
}

/** Destino dos CTAs "tenho uma vaga" e "tenho um projeto". */
export type ContactTab = "vaga" | "projeto"

export const HOME = {
  meta: {
    title: "Victor Gabriel, dev front-end e tech lead",
    description:
      "Victor Gabriel, dev front-end e tech lead em Teresina, PI. Cinco anos desenhando interfaces antes do código; hoje constrói em React e TypeScript, da ideia ao deploy.",
  },

  header: {
    /** Rótulos da navegação em minúscula, como no copy. */
    nav: [
      { href: "/projetos", label: "projetos" },
      { href: "/sobre", label: "sobre" },
      { href: "/contato", label: "contato" },
    ],
    /** "estação: primavera" (o nome vem da estação ativa). */
    seasonLabel: "estação:",
  },

  hero: {
    badge: "aberto a vagas e projetos",
    place: "Teresina, PI",
    /** Camada de personalidade: fixo, não é medição. */
    weather: "provavelmente uns 30 °C",
    title: {
      before: "Comecei desenhando as telas. Hoje eu coloco elas ",
      highlight: "no ar",
      after: ".",
    },
    lead: "Sou o Victor, dev front-end e tech lead. Passei cinco anos desenhando interfaces e conferindo se o que chegava em produção era o que tinha sido desenhado. Hoje eu mesmo construo, em React e TypeScript, e o caminho entre a ideia e o deploy ficou bem mais curto.",
  },

  /** CTAs do hero e do contato. */
  ctas: [
    { tab: "vaga", label: "tenho uma vaga", variant: "primary" },
    { tab: "projeto", label: "tenho um projeto", variant: "secondary" },
  ] as const satisfies readonly {
    tab: ContactTab
    label: string
    variant: "primary" | "secondary"
  }[],

  projects: {
    title: "o que eu ando construindo",
    allLabel: "ver todos os projetos",
    allHref: "/projetos",
  },

  skills: {
    title: "do layout ao deploy",
    lead: "quatro coisas que eu faço bem, de preferência juntas.",
    items: [
      {
        marker: "01",
        title: "Front-end",
        description:
          "Interfaces em React e Next.js que respeitam o design, carregam rápido e funcionam em qualquer tela.",
        chips: ["React", "Next.js", "TypeScript", "Tailwind CSS", "acessibilidade"],
      },
      {
        marker: "02",
        title: "Produto completo",
        description:
          "Pra quando o projeto precisa de mais que uma interface: banco, autenticação, API e app mobile, com testes e CI pra nada quebrar em silêncio.",
        chips: [
          "Supabase",
          "Node",
          "React Native",
          "Vitest",
          "Playwright",
          "GitHub Actions",
        ],
      },
      {
        marker: "03",
        title: "Design de produto",
        description:
          "Foram cinco anos de UX antes do primeiro commit. Pesquiso, desenho e monto design systems que o time de dev usa de verdade, não só admira no Figma.",
        chips: ["Figma", "design systems", "design tokens", "pesquisa", "protótipos"],
      },
      {
        marker: "04",
        title: "Liderança técnica",
        description:
          "Conduzo o time e a conversa com o cliente: organizo o trabalho, reviso código e transformo pedido vago em tarefa que dá pra entregar.",
        chips: ["tech lead", "code review", "Scrum", "Kanban"],
      },
    ] satisfies readonly Skill[],
  },

  proof: {
    /** Título só para leitores de tela (D-1211). */
    title: "depoimento e números",
    testimonial: {
      unavailable: "O depoimento entra quando a pessoa autorizar a publicação.",
      text: pending(
        "depoimento voltado a dev, de preferência sobre a atuação como tech lead",
      ),
    },
    figures: [
      {
        id: "anos",
        value: "5+",
        label: "anos em produto digital",
        methodKind: "fonte",
        method: "desde 2021",
      },
      {
        id: "plataformas",
        value: "1 base de código, 3 plataformas",
        label: "web, Android e iOS",
        methodKind: "fonte",
        method: "React + Capacitor",
      },
      {
        id: "testes",
        value: "6.500+",
        label: "testes automatizados no projeto atual",
        methodKind: "fonte",
        method: "testes unitários no Vitest, todos passando",
      },
      {
        id: "edge-functions",
        value: "44",
        label: "Edge Functions no back end do projeto atual",
        methodKind: "fonte",
        method: "Supabase, em Deno",
      },
    ] satisfies readonly Figure[],
  },

  about: {
    title: "prazer, Victor",
    paragraphs: [
      "Comecei no design em 2021, desenhando produtos pra agências, startups e empresas de vários tamanhos. No caminho virei líder de design, passei a revisar cada entrega antes de ela ir pra produção e, quando vi, já estava mexendo no código. Hoje sou dev e tech lead na Entrega Contínua. O olhar de designer continua aqui, só trocou de ferramenta.",
      "Fora do trabalho, leio mistério e horror (Poe, Lovecraft e qualquer coisa com um enigma no meio) e ouço rock nacional alto demais. Se você reparar bem, esse site também guarda alguns segredos.",
    ],
    photo: pending("foto do Victor") as Maybe<{ src: string; alt: string }>,
    link: "mais sobre mim",
    linkHref: "/sobre",
  },

  contact: {
    id: "contato",
    title: "bora conversar?",
    lead: "Pode ser uma vaga, um projeto ou só uma ideia ainda meio solta. Costumo responder em até um dia útil.",
    labels: { email: "E-mail", linkedin: "LinkedIn" },
  },

  footer: {
    credit: "Desenhado e codado por mim, em Teresina.",
    finds: { before: "Achados:", after: ". Tem coisa escondida por aqui." },
    links: { github: "GitHub", linkedin: "LinkedIn", cv: "baixar CV" },
    signature: "© 2026 Victor Barros",
    signatureCheck: pending("confirmar o sobrenome usado no site"),
  },
} as const
