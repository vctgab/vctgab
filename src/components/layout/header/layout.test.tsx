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

describe("ThemeSwitcher (CA-4)", () => {
  it("é um radiogroup 'Tema' e grava a escolha", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeSwitcher layout="grid" />
      </ThemeProvider>,
    )
    const group = screen.getByRole("radiogroup", { name: "Tema" })
    const radios = within(group).getAllByRole("radio")
    expect(radios).toHaveLength(4)
    await user.click(within(group).getByRole("radio", { name: /Noturno/ }))
    expect(document.documentElement.getAttribute("data-theme")).toBe("noturno")
    expect(window.localStorage.getItem("vg-tema")).toBe("noturno")
    expect(within(group).getByRole("radio", { name: /Noturno/ })).toBeChecked()
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
