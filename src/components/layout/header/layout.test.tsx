import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Footer } from "@/components/layout/footer"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { Header } from "."

vi.mock("next/navigation", () => ({ usePathname: () => "/sobre" }))

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
      <main id="conteudo">Conteúdo</main>
    </ThemeProvider>,
  )
}

describe("Header", () => {
  it("CA-1: pular para o conteúdo é o primeiro focável", async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.tab()
    const skip = screen.getByRole("link", { name: "Pular para o conteúdo" })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute("href", "#conteudo")
  })

  it("CA-2: navegação principal com a página atual marcada", () => {
    renderHeader()
    const nav = screen.getByRole("navigation", { name: "Principal" })
    const links = within(nav).getAllByRole("link")
    expect(links.map((l) => l.textContent)).toEqual(["Projetos", "Sobre", "Contato"])
    expect(within(nav).getByRole("link", { name: "Sobre" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("CA-3: o menu mobile abre o Drawer com os mesmos links e fecha com Esc", async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole("button", { name: "Abrir menu" }))
    const drawer = await screen.findByRole("dialog", { name: "Menu" })
    expect(
      within(drawer).getAllByRole("link", { name: /Projetos|Sobre|Contato/ }),
    ).toHaveLength(3)
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("CA-6: sem violações", async () => {
    const { container } = renderHeader()
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("ThemeSwitcher (CA-8)", () => {
  it("tem o radiogroup 'Estação' e o grupo 'Modo', e grava cada escolha à parte", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeSwitcher layout="grid" />
      </ThemeProvider>,
    )
    const group = screen.getByRole("radiogroup", { name: "Estação" })
    const radios = within(group).getAllByRole("radio")
    // Quatro estações; a do calendário já vem marcada, sem opção "Automática".
    expect(radios).toHaveLength(4)
    expect(within(group).queryByRole("radio", { name: /Automática/ })).toBeNull()
    expect(group.querySelectorAll('[role="radio"][aria-checked="true"]')).toHaveLength(1)

    await user.click(within(group).getByRole("radio", { name: /Verão/ }))
    expect(document.documentElement.getAttribute("data-season")).toBe("verao")
    expect(window.localStorage.getItem("vg-estacao")).toBe("verao")
    expect(window.localStorage.getItem("vg-modo")).toBeNull()
    expect(within(group).getByRole("radio", { name: /Verão/ })).toBeChecked()

    const mode = screen.getByRole("radiogroup", { name: "Modo" })
    expect(within(mode).getAllByRole("radio")).toHaveLength(2)
    expect(within(mode).queryByRole("radio", { name: "Do sistema" })).toBeNull()
    expect(within(mode).getByRole("radio", { name: "Claro" })).toBeChecked()
    await user.click(within(mode).getByRole("radio", { name: "Escuro" }))
    expect(document.documentElement.getAttribute("data-mode")).toBe("escuro")
    expect(document.documentElement.getAttribute("data-season")).toBe("verao")
    expect(window.localStorage.getItem("vg-modo")).toBe("escuro")
    expect(within(mode).getByRole("radio", { name: "Escuro" })).toBeChecked()
  })

  it("cada estação e cada modo têm o seu ícone (D-1117)", () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher layout="compact" />
      </ThemeProvider>,
    )
    const icons = (group: HTMLElement) =>
      within(group)
        .getAllByRole("radio")
        .map((r) =>
          r
            .querySelector("svg[data-icon]:not([data-icon=check])")
            ?.getAttribute("data-icon"),
        )
    expect(icons(screen.getByRole("radiogroup", { name: "Estação" }))).toEqual([
      "flor",
      "sol",
      "folha",
      "floco",
    ])
    expect(icons(screen.getByRole("radiogroup", { name: "Modo" }))).toEqual([
      "lampada",
      "lua",
    ])
  })

  it("sem escolha salva, marca a estação do calendário e o modo do sistema (CA-4)", () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher layout="compact" />
      </ThemeProvider>,
    )
    const group = screen.getByRole("radiogroup", { name: "Estação" })
    expect(group.querySelectorAll('[role="radio"][aria-checked="true"]')).toHaveLength(1)
    expect(window.localStorage.getItem("vg-estacao")).toBeNull()
    expect(window.localStorage.getItem("vg-modo")).toBeNull()
  })

  it("é operável só pelo teclado (setas e espaço)", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeSwitcher layout="compact" />
      </ThemeProvider>,
    )
    const group = screen.getByRole("radiogroup", { name: "Estação" })
    const first = within(group).getAllByRole("radio")[0] as HTMLElement
    first.focus()
    // O Radix só marca depois que o foco chega, e só se a seta ainda estiver
    // pressionada (D-707): segura a tecla um instante.
    await user.keyboard("{ArrowRight>}")
    await new Promise((resolve) => setTimeout(resolve, 80))
    await user.keyboard("{/ArrowRight}")
    expect(within(group).getByRole("radio", { name: /Verão/ })).toBeChecked()
    expect(window.localStorage.getItem("vg-estacao")).toBe("verao")
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSwitcher layout="grid" />
      </ThemeProvider>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("Footer (CA-5)", () => {
  it("tem navegação de rodapé, direitos e slots", async () => {
    const { container } = render(
      <Footer achados={<button type="button">Achados: 0 de 7</button>} />,
    )
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Rodapé" })).toBeInTheDocument()
    expect(screen.getByText("Victor Gabriel © 2026")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Achados: 0 de 7" })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
