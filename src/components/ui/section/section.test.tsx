import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Container, Section } from "."

describe("Section e Container", () => {
  it("CA-1: a seção é nomeada pelo título", () => {
    render(
      <Section
        eyebrow="Serviços"
        title="O que eu faço no seu produto"
        intro="Duas frentes."
      >
        <p>Conteúdo</p>
      </Section>,
    )
    expect(
      screen.getByRole("region", { name: "O que eu faço no seu produto" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("O que eu faço")
  })

  it("CA-2: sem título exige aria-label", () => {
    render(<Section aria-label="Projetos em destaque">Lista</Section>)
    expect(
      screen.getByRole("region", { name: "Projetos em destaque" }),
    ).toBeInTheDocument()
    // @ts-expect-error sem título e sem aria-label não compila
    const semNome = <Section>Lista</Section>
    expect(semNome).toBeTruthy()
  })

  it("CA-3: container limita a largura e usa o gutter do token", () => {
    const { container } = render(<Container>x</Container>)
    expect(container.firstElementChild?.className).toContain("max-w-page")
    expect(container.firstElementChild?.className).toContain("px-(--gutter)")
  })

  it("CA-4: sem violações", async () => {
    const { container } = render(
      <main>
        <Section title="Sobre" eyebrow="Sobre" titleAs="h2">
          <p>Texto</p>
        </Section>
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
