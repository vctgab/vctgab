import { pending, type Maybe } from "./pending.ts"

/**
 * Projetos do portfólio. Só fatos confirmados por Victor; o resto é
 * `pending(...)`. Nomes de clientes autorizados: Felicoop, Houer Tecnologia.
 */
export interface Project {
  slug: string
  /** Marco da faixa: "01" a "04". */
  marker: string
  name: string
  /** Para quem foi feito (cliente), quando houver. */
  client?: string
  /** Papel de Victor no projeto. */
  role?: Maybe<string>
  /** Tipo de projeto ("produto digital", "design system"...). */
  type: Maybe<string>
  /** O que foi entregue. */
  delivery?: Maybe<string>
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "nexuscoop",
    marker: "01",
    name: "Nexuscoop",
    client: "Felicoop",
    role: "Tech lead e desenvolvedor",
    type: pending("tipo do projeto Nexuscoop"),
  },
  {
    slug: "oia",
    marker: "02",
    name: "OIA",
    client: "Houer Tecnologia",
    type: pending("tipo do projeto OIA"),
    delivery: pending("entrega do OIA"),
  },
  {
    slug: "cinnatra",
    marker: "03",
    name: "Cinnatra",
    type: pending("tipo do projeto Cinnatra"),
    delivery: pending("entrega do Cinnatra"),
  },
  {
    slug: "kasb-health",
    marker: "04",
    name: "Kasb Health",
    role: "Fundador, atuando no código e na liderança de produto e engenharia",
    type: pending("tipo do projeto Kasb Health"),
  },
]

/** Rota da página de um projeto (ainda não existe; o release:check acusa). */
export function projectHref(project: Pick<Project, "slug">): string {
  return `/projetos/${project.slug}`
}
