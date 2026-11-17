import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Fact } from "@/components/ui/fact"
import { Polaroid } from "@/components/ui/polaroid"
import { pending } from "@/content/pending"
import { ImageFrame } from "."

describe("ImageFrame", () => {
  it("CA-1: com imagem, <img> com alt e carga preguiçosa", () => {
    render(<ImageFrame src="/ficticia.jpg" alt="Tela do projeto fictício A" />)
    const img = screen.getByRole("img", { name: "Tela do projeto fictício A" })
    expect(img).toHaveAttribute("loading", "lazy")
    // @ts-expect-error imagem sem alt não compila
    const semAlt = <ImageFrame src="/ficticia.jpg" />
    expect(semAlt).toBeTruthy()
  })

  it("CA-2: sem imagem, hachura com o rótulo da pendência e nenhuma <img>", () => {
    const { container } = render(
      <ImageFrame
        placeholder={<Fact value={pending("captura do projeto fictício A")} />}
      />,
    )
    expect(
      screen.getByText("[a confirmar: captura do projeto fictício A]"),
    ).toBeInTheDocument()
    expect(container.querySelector("img")).toBeNull()
    const hatch = container.querySelector<HTMLElement>("[data-moldura-pendente]")
    expect(hatch?.style.backgroundImage).toContain("repeating-linear-gradient")
  })

  it("CA-3: a proporção vem do ratio, com ou sem imagem", () => {
    const { container: a } = render(<ImageFrame ratio="wide" placeholder="x" />)
    expect(a.firstElementChild?.className).toMatch(/aspect-3\/2/)
    const { container: b } = render(<ImageFrame ratio="square" src="/a.jpg" alt="A" />)
    expect(b.firstElementChild?.className).toMatch(/aspect-square/)
    const { container: c } = render(<ImageFrame placeholder="x" />)
    expect(c.firstElementChild?.className).toMatch(/aspect-video/)
  })

  it("CA-4: sem violações nos dois estados", async () => {
    const { container } = render(
      <div>
        <ImageFrame src="/ficticia.jpg" alt="Tela fictícia" />
        <ImageFrame placeholder="[a confirmar: captura fictícia]" />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("CA-5: Polaroid sem foto mostra o rótulo pela moldura", () => {
    const { container } = render(
      <Polaroid seed="p" placeholder={<Fact value={pending("foto fictícia")} />} />,
    )
    expect(container.querySelector("[data-moldura-pendente]")).toHaveTextContent(
      "[a confirmar: foto fictícia]",
    )
  })
})
