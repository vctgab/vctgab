import { render, screen, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { pending, review } from "@/content/pending"
import { CaseHeader } from "."

const FACTS = {
  project: "Projeto fictício A",
  role: "tech lead e dev full stack",
  company: "Empresa fictícia, para o cliente fictício",
  period: "mai/2026 – atual",
  team: review("papéis do time, se quiser detalhar", "5 pessoas"),
  status: "em andamento",
  stack: [
    "React 19",
    "TypeScript",
    "Supabase (PostgreSQL, Auth, Edge Functions em Deno)",
  ],
} as const

const ABOUT =
  "Portal fictício de faturamento, glosas, repasse e credenciamento de uma cooperativa fictícia, em uma cidade fictícia"

function header(seed?: string, facts: Parameters<typeof CaseHeader>[0]["facts"] = FACTS) {
  return (
    <CaseHeader
      name="Projeto fictício A"
      areas={["código", "liderança"]}
      about={ABOUT}
      facts={facts}
      seed={seed}
    />
  )
}

describe("CaseHeader", () => {
  it("CA-1: h1, 'o que é' e a ficha como dl com os sete rótulos na ordem", () => {
    const { container } = render(header())
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Projeto fictício A",
    )
    expect(screen.getByText(ABOUT)).toBeInTheDocument()
    const labels = [...container.querySelectorAll("dl dt")].map((dt) => dt.textContent)
    expect(labels).toEqual([
      "Projeto",
      "Meu papel",
      "Empresa",
      "Período",
      "Time",
      "Status",
      "Stack",
    ])
    expect(container.querySelectorAll("dl dd")).toHaveLength(7)
  })

  it("CA-2: status é uma Tag com ponto e texto; a stack é uma lista de Tag", () => {
    const { container } = render(header())
    const status = container.querySelector("[data-ponto]")?.closest("span")
    expect(status).toHaveTextContent("em andamento")
    expect(container.querySelector('[data-ponto="warning"]')).not.toBeNull()
    const stack = screen.getByRole("list", { name: "Stack" })
    expect(
      within(stack)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "React 19",
      "TypeScript",
      "Supabase (PostgreSQL, Auth, Edge Functions em Deno)",
    ])
    expect(screen.getByRole("list", { name: "Áreas" })).toHaveTextContent(
      "códigoliderança",
    )
  })

  it("CA-3: campo em revisão mostra [validar: …]; campo pendente mostra [a confirmar: …]", () => {
    render(header("x", { ...FACTS, period: pending("período exato") }))
    expect(screen.getByText("5 pessoas")).toBeInTheDocument()
    expect(
      screen.getByText("[validar: papéis do time, se quiser detalhar]"),
    ).toBeInTheDocument()
    expect(screen.getByText("[a confirmar: período exato]")).toBeInTheDocument()
  })

  it("CA-5: texto longo com 3 seeds fica dentro da ficha (quebra em linhas)", () => {
    for (const seed of ["a", "b", "c"]) {
      const { container, unmount } = render(header(seed))
      const ficha = container.querySelector("article") as HTMLElement
      expect(ficha.className).toMatch(/p-6/)
      expect(ficha.querySelector("ul[aria-label='Stack']")?.className).toMatch(
        /flex-wrap/,
      )
      unmount()
    }
  })

  it("CA-4: sem violações de acessibilidade", async () => {
    const { container } = render(<main>{header()}</main>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
