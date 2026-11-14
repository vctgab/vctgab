import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ACAO_ICONE, Icon, ICON_NAMES } from "."

describe("Icon", () => {
  it.each(ICON_NAMES)(
    "CA-1: %s usa grade 24, traço 1,75 e pontas arredondadas",
    (name) => {
      const { container } = render(<Icon name={name} decorative />)
      const svg = container.querySelector("svg")
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24")
      expect(svg).toHaveAttribute("stroke-width", "1.75")
      expect(svg).toHaveAttribute("stroke-linecap", "round")
      expect(svg?.querySelector("path")).not.toBeNull()
    },
  )

  it("CA-2: decorativo some para leitores de tela", () => {
    const { container } = render(<Icon name="seta" decorative />)
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("CA-2: com rótulo vira imagem nomeada", () => {
    render(<Icon name="fechar" label="Fechar" />)
    expect(screen.getByRole("img", { name: "Fechar" })).toBeInTheDocument()
  })

  it("CA-3: exige decorative ou label", () => {
    // @ts-expect-error falta decorative ou label (AC-03)
    const semNome = <Icon name="seta" />
    // @ts-expect-error não pode ser decorativo e nomeado ao mesmo tempo
    const ambos = <Icon name="seta" decorative label="Seta" />
    expect(semNome && ambos).toBeTruthy()
  })

  it("CA-4: um significado, um ícone", () => {
    const icones = ACAO_ICONE.map((a) => a.icone)
    expect(new Set(icones).size).toBe(icones.length)
    expect([...icones].sort()).toEqual([...ICON_NAMES].sort())
  })

  it("CA-5: sem violações de acessibilidade", async () => {
    const { container } = render(
      <p>
        <Icon name="alerta" label="Erro" /> Texto <Icon name="seta" decorative />
      </p>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
