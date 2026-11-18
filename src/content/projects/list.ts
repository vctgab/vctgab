import { pending, type Maybe } from "../pending.ts"

/**
 * Projetos em destaque (Home v2). Só o que Victor escreveu; a captura de cada
 * um é `pending(...)` até chegar (D-1216).
 */
export interface Project {
  slug: string
  name: string
  /** Linha de meta: cliente (quando houver) e papel ("Felicoop · código, liderança"). */
  meta: string
  status: "em andamento" | "no ar"
  description: string
  /** Captura do projeto. */
  image: Maybe<{ src: string; alt: string }>
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "nexuscoop",
    name: "Nexuscoop",
    meta: "Felicoop · código, liderança",
    status: "em andamento",
    description:
      "Lidero o time que constrói o portal de faturamento de uma cooperativa médica com mais de 500 médicos, com uma base de código só pra web, Android e iOS.",
    image: {
      src: "/projetos/nexuscoop/dashboard-desktop.webp",
      alt: "Painel do cooperado do Nexuscoop, com dados fictícios: produção do mês, gráfico de barras dos últimos 12 meses e o Glosômetro.",
    },
  },
  {
    slug: "kasb-health",
    name: "Kasb Health",
    meta: "liderança, design, código",
    status: "em andamento",
    description:
      "Uma healthtech que eu fundei e conduzo da ideia ao MVP, do Figma ao código.",
    image: pending("captura do Kasb Health"),
  },
  {
    slug: "suite-odin",
    name: "Suíte OdiN",
    meta: "OdiNetwork · design, liderança, código",
    status: "no ar",
    description:
      "Três sistemas SaaS B2B, um design system criado do zero e um time de design pra liderar.",
    image: pending("captura da Suíte OdiN"),
  },
  {
    slug: "lance",
    name: "Lance!",
    meta: "design",
    status: "no ar",
    description:
      "Home, Tempo Real e Bolão de um dos maiores portais esportivos do Brasil.",
    image: pending("captura do Lance!"),
  },
]

/** Rota da página de um projeto (ainda não existe; o release:check acusa). */
export function projectHref(project: Pick<Project, "slug">): string {
  return `/projetos/${project.slug}`
}
