import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { LinkText } from "."

describe("LinkText", () => {
  it("CA-1: interno tem href e sublinhado com pathLength 1", () => {
    const { container } = render(
      <LinkText href="/projetos">Ver todos os projetos</LinkText>,
    )
    expect(screen.getByRole("link", { name: "Ver todos os projetos" })).toHaveAttribute(
      "href",
      "/projetos",
    )
    expect(container.querySelector("[data-sublinhado]")).toHaveAttribute(
      "pathLength",
      "1",
    )
  })

  it("CA-2: externo abre em nova aba e diz isso no nome acessível", () => {
    const { container } = render(
      <LinkText href="https://exemplo.com/perfil">Abrir o GitHub de Victor</LinkText>,
    )
    const link = screen.getByRole("link", {
      name: "Abrir o GitHub de Victor (abre em nova aba)",
    })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(container.querySelector("[data-icon=externo]")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("CA-3: inline usa sublinhado nativo e nenhum SVG de traço", () => {
    const { container } = render(
      <p>
        Veja{" "}
        <LinkText href="/sobre" variant="inline">
          a página sobre Victor
        </LinkText>
        .
      </p>,
    )
    expect(container.querySelector("[data-sublinhado]")).toBeNull()
    expect(screen.getByRole("link").className).toContain("underline")
  })

  it("CA-4: o redesenho só roda com movimento permitido", () => {
    const { container } = render(<LinkText href="/sobre">Ler sobre Victor</LinkText>)
    const cls = container.querySelector("[data-sublinhado]")?.getAttribute("class") ?? ""
    expect(cls).toContain("motion-safe:animate-redesenhar")
    expect(cls).not.toMatch(/(^|\s)group-hover\/link:animate/)
  })

  it("CA-5: sem violações", async () => {
    const { container } = render(
      <div>
        <LinkText href="/projetos">Ver todos os projetos</LinkText>
        <LinkText href="https://exemplo.com">Abrir site de exemplo</LinkText>
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("LinkText com mailto", () => {
  it("fase 2: mailto sai como link simples, sem nova aba nem ícone de externo", () => {
    render(<LinkText href="mailto:nome@exemplo.com">nome@exemplo.com</LinkText>)
    const link = screen.getByRole("link", { name: "nome@exemplo.com" })
    expect(link).toHaveAttribute("href", "mailto:nome@exemplo.com")
    expect(link).not.toHaveAttribute("target")
    expect(link.querySelector("[data-icon='externo']")).toBeNull()
  })
})
