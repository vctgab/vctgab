import { render, screen, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { Ficha } from "."

describe("Ficha", () => {
  it("CA-1: preenche os slots", () => {
    render(
      <Ficha
        title="Projeto fictício A"
        eyebrow="01"
        media={<span>mídia</span>}
        footer={<span>rodapé</span>}
      >
        Projeto para [a confirmar: cliente]
      </Ficha>,
    )
    const article = screen.getByRole("article")
    expect(within(article).getByRole("heading", { level: 3 })).toHaveTextContent(
      "Projeto fictício A",
    )
    for (const text of ["01", "mídia", "rodapé", "Projeto para [a confirmar: cliente]"]) {
      expect(within(article).getByText(text)).toBeInTheDocument()
    }
  })

  it("CA-2: clicável tem um único link com o nome do título", () => {
    render(
      <Ficha title="Projeto fictício B" href="/projetos/ficticio-b" tape="left" holes>
        Descrição curta
      </Ficha>,
    )
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAccessibleName("Projeto fictício B")
  })

  it("CA-3: até 3 SVGs; fita e furos sem SVG", () => {
    const { container } = render(
      <Ficha title="Projeto fictício C" tape="right" holes edge="torn">
        Texto
      </Ficha>,
    )
    expect(container.querySelectorAll("svg").length).toBeLessThanOrEqual(3)
    expect(container.querySelector("[data-fita]")?.tagName).toBe("SPAN")
    expect(container.querySelector("[data-furos]")?.tagName).toBe("SPAN")
    expect(
      (container.querySelector("[data-fita]") as HTMLElement).style.clipPath,
    ).toMatch(/^polygon\(/)
  })

  it.each(["s1", "s2", "s3"])(
    "CA-4: padding seguro com título longo (seed %s)",
    (seed) => {
      const { container } = render(
        <Ficha
          seed={seed}
          holes
          title="Design que o código aguenta: ação, ênfase e coração"
        >
          Texto
        </Ficha>,
      )
      const cls = container.firstElementChild?.className ?? ""
      // p-6 (24 px) e pl-14 (56 px) superam a amplitude máxima do bucket lg (5,6 px) + traço.
      expect(cls).toContain("p-6")
      expect(cls).toContain("pl-14")
    },
  )

  it("CA-5: mesma seed, mesma rotação e contorno", () => {
    const html = () => render(<Ficha seed="fixa" title="Igual" />).container.innerHTML
    expect(html()).toBe(html())
  })

  it("CA-6: sem violações", async () => {
    const { container } = render(
      <div>
        <Ficha title="Projeto fictício D" href="/projetos/d" tape="left">
          Texto
        </Ficha>
        <Ficha title="Serviço fictício" holes eyebrow="02">
          Texto
        </Ficha>
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
