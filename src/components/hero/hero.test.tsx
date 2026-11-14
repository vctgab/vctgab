import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { FooterScene, SCENES } from "@/components/footer-scene"
import { AchadosProvider } from "@/components/ui/finds"
import { isValidPath } from "@/lib/shapes"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { THEMES } from "@/lib/theme/themes"
import { buildComposition, Hero } from "."

vi.mock("next/navigation", () => ({ usePathname: () => "/sistema/hero" }))

function renderHero() {
  return render(
    <ThemeProvider>
      <AchadosProvider>
        <Hero seed="teste" />
      </AchadosProvider>
    </ThemeProvider>,
  )
}

describe("Hero", () => {
  it("CA-1: um h1, o CTA e a linha de status com o relógio", () => {
    renderHero()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Front-end com visão de produto.",
    )
    expect(screen.getByRole("link", { name: "Vamos conversar" })).toHaveAttribute(
      "href",
      "/contato",
    )
    expect(screen.getByText("[a confirmar: mês]")).toBeInTheDocument()
    expect(screen.getByText("Teresina • Brasil")).toBeInTheDocument()
  })

  it("CA-2: composição de 5 a 9 formas, decorativa e determinística", () => {
    for (const seed of ["a", "b", "home", "sistema"]) {
      const shapes = buildComposition(seed)
      expect(shapes.length).toBeGreaterThanOrEqual(5)
      expect(shapes.length).toBeLessThanOrEqual(9)
      expect(buildComposition(seed)).toEqual(shapes)
      for (const s of shapes) {
        expect(isValidPath(s.path)).toBe(true)
        expect(Math.abs(s.rotation)).toBeLessThan(1.5)
        expect(Math.abs(s.drift.turn)).toBeLessThan(1.5)
      }
      expect(shapes.filter((s) => s.poses).length).toBeLessThanOrEqual(3)
    }
    const { container } = renderHero()
    const backdrop = container.querySelector("[data-hero-fundo]")
    expect(backdrop).toHaveAttribute("aria-hidden", "true")
    expect(backdrop?.querySelectorAll("[data-forma-hero]").length).toBe(
      buildComposition("teste").length,
    )
    expect(backdrop?.querySelector("button, a, input")).toBeNull()
  })

  it("muda a composição com a energia do tema", () => {
    expect(buildComposition("x", { energy: 1.25 })).not.toEqual(
      buildComposition("x", { energy: 0.7 }),
    )
  })

  it("tem o Achavel da pinha fora do fundo decorativo", () => {
    renderHero()
    expect(
      screen.getByRole("button", { name: "Algo entre as formas do hero" }),
    ).toBeInTheDocument()
  })

  it("sem violações", async () => {
    const { container } = renderHero()
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("FooterScene (CA-5)", () => {
  it("tem três planos de árvores, decorativa", () => {
    const { container } = render(<FooterScene />)
    const svg = container.querySelector("[data-cena-rodape]")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(
      svg?.querySelectorAll('path[class*="footer-tree"]').length,
    ).toBeGreaterThanOrEqual(3)
  })

  it("tem uma cena para cada tema e mostra só a do tema ativo", () => {
    for (const t of THEMES) expect(SCENES[t.id]).toBeDefined()
    const { container } = render(<FooterScene />)
    const css = container.querySelector("style")?.textContent ?? ""
    expect(css).toContain("[data-cena]{display:none}")
    for (const t of THEMES)
      expect(css).toContain(`[data-theme="${t.id}"] [data-cena="${t.id}"]`)
    expect(css).not.toMatch(/#[0-9a-f]{3,6}/i)
  })
})
