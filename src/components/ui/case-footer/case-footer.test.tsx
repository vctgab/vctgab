import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { HOME } from "@/content/home"
import { CaseFooter } from "."

const CTAS = HOME.ctas.map((c) => ({
  label: c.label,
  href: `/contato?aba=${c.tab}`,
  variant: c.variant,
}))

function footer() {
  return (
    <CaseFooter
      next={{ name: "Kasb Health", href: "/projetos/kasb-health" }}
      ctas={CTAS}
    />
  )
}

describe("CaseFooter", () => {
  it("CA-1: mostra 'Próximo projeto:' e o link para a rota do próximo projeto", () => {
    render(footer())
    const nav = screen.getByRole("navigation", { name: "Próximo projeto" })
    expect(nav).toHaveTextContent("Próximo projeto:")
    expect(screen.getByRole("link", { name: "Kasb Health" })).toHaveAttribute(
      "href",
      "/projetos/kasb-health",
    )
  })

  it("CA-2: os CTAs levam a /contato?aba=vaga e /contato?aba=projeto", () => {
    render(footer())
    expect(screen.getByRole("link", { name: "tenho uma vaga" })).toHaveAttribute(
      "href",
      "/contato?aba=vaga",
    )
    expect(screen.getByRole("link", { name: "tenho um projeto" })).toHaveAttribute(
      "href",
      "/contato?aba=projeto",
    )
  })

  it("CA-4: sem violações de acessibilidade", async () => {
    const { container } = render(<main>{footer()}</main>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
