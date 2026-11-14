import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Eyebrow } from "."

describe("Eyebrow", () => {
  it("CA-1: texto em mono com traço decorativo", () => {
    const { container } = render(<Eyebrow>Serviços</Eyebrow>)
    expect(screen.getByText("Serviços")).toBeInTheDocument()
    expect(container.firstElementChild?.className).toContain("font-mono")
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("CA-2: nunca em caixa-alta", () => {
    const { container } = render(<Eyebrow tone="muted">Depoimento</Eyebrow>)
    expect(container.innerHTML).not.toContain("uppercase")
  })

  it("CA-3: sem violações", async () => {
    const { container } = render(<Eyebrow>Sobre</Eyebrow>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
