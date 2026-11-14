import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Spinner } from "."

describe("Spinner", () => {
  it("CA-1: anuncia 'Carregando' por padrão", () => {
    render(<Spinner />)
    expect(screen.getByRole("status")).toHaveTextContent("Carregando")
  })

  it("CA-1: usa o rótulo visível quando informado", () => {
    render(<Spinner label="Enviando mensagem" />)
    expect(screen.getByRole("status")).toHaveTextContent("Enviando mensagem")
  })

  it("CA-2: decorativo não tem papel nem texto", () => {
    const { container } = render(<Spinner decorative />)
    expect(screen.queryByRole("status")).toBeNull()
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("CA-3: só gira com movimento permitido", () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector("svg")?.getAttribute("class")).toContain(
      "motion-safe:animate-girar",
    )
  })

  it("CA-5: sem violações", async () => {
    const { container } = render(<Spinner />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
