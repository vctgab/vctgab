import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ReviewMark } from "."

describe("ReviewMark", () => {
  it("CA-2: mostra o conteúdo e a marca [validar: …] com data-review", () => {
    const { container } = render(
      <p>
        <ReviewMark what="se pode contar o incidente">Texto em revisão.</ReviewMark>
      </p>,
    )
    expect(screen.getByText("Texto em revisão.")).toBeInTheDocument()
    expect(screen.getByText("[validar: se pode contar o incidente]")).toBeInTheDocument()
    expect(container.querySelector("[data-review]")).not.toBeNull()
  })

  it("CA-3: sem conteúdo, mostra só a marca", () => {
    const { container } = render(<ReviewMark what="permissão para mostrar o código" />)
    expect(container.textContent).toBe("[validar: permissão para mostrar o código]")
  })

  it("CA-4: sem violações de acessibilidade, inline e em bloco", async () => {
    const { container } = render(
      <main>
        <p>
          <ReviewMark what="a">Frase.</ReviewMark>
        </p>
        <ReviewMark what="b" as="div">
          Parágrafo inteiro.
        </ReviewMark>
        <ReviewMark what="c" as="div" />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
