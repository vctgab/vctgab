import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { pending } from "@/content/pending"
import { Fact } from "."

describe("Fact", () => {
  it("CA-1: valor pronto sai como texto comum", () => {
    const { container } = render(<Fact value="dezembro" />)
    expect(container).toHaveTextContent("dezembro")
    expect(container.querySelector("[data-pendente]")).toBeNull()
  })

  it("CA-2 e CA-3: pendência sai exata e destacada, sem violação", async () => {
    const { container } = render(
      <p>
        Agenda de <Fact value={pending("mês da agenda aberta")} /> aberta
      </p>,
    )
    const mark = screen.getByText("[a confirmar: mês da agenda aberta]")
    expect(mark).toHaveAttribute("data-pendente")
    expect(mark.className).toContain("decoration-dashed")
    expect(await axe(container)).toHaveNoViolations()
  })
})
