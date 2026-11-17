import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { FooterScene, SCENES } from "@/components/footer-scene"
import { AchadosProvider } from "@/components/ui/finds"
import { isValidPath } from "@/lib/shapes"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { SEASONS } from "@/lib/theme/themes"
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
  it("CA-1 e CA-9: h1 do copy, selo, linha de local e os dois CTAs", () => {
    const { container } = renderHero()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Comecei desenhando as telas. Hoje eu coloco elas no ar.",
    )
    expect(screen.getByText("aberto a vagas e projetos")).toBeInTheDocument()
    expect(container.querySelector("[data-ponto=success]")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
    expect(screen.getByText("Teresina, PI")).toBeInTheDocument()
    expect(screen.getByText("provavelmente uns 30 °C")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "tenho uma vaga" })).toHaveAttribute(
      "href",
      "/contato?aba=vaga",
    )
    expect(screen.getByRole("link", { name: "tenho um projeto" })).toHaveAttribute(
      "href",
      "/contato?aba=projeto",
    )
    // Sublinhado de pincel sob "no ar", decorativo.
    const highlight = screen.getByText("no ar")
    expect(highlight.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("CA-10: esboço do rascunho ao ar, decorativo, escondido abaixo de lg", () => {
    const { container } = renderHero()
    const sketch = container.querySelector("[data-hero-esboco]")
    expect(sketch).toHaveAttribute("aria-hidden", "true")
    expect(sketch?.className).toMatch(/hidden lg:block/)
    expect(sketch?.className).toMatch(/forced-colors:hidden/)
    expect(sketch?.querySelectorAll('path[stroke-dasharray="4 3"]').length).toBe(7)
    expect(sketch?.querySelector("button, a, input")).toBeNull()
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

  it("tem uma cena para cada estação e mostra só a da estação ativa", () => {
    for (const s of SEASONS) expect(SCENES[s.id]).toBeDefined()
    const { container } = render(<FooterScene />)
    const css = container.querySelector("style")?.textContent ?? ""
    expect(css).toContain("[data-cena],[data-noite]{display:none}")
    for (const s of SEASONS)
      expect(css).toContain(`[data-season="${s.id}"] [data-cena="${s.id}"]`)
    expect(css).not.toMatch(/#[0-9a-f]{3,6}/i)
  })

  it("leva lua e estrelas no modo escuro e esconde o sol à noite (CA-9)", () => {
    const { container } = render(<FooterScene />)
    const css = container.querySelector("style")?.textContent ?? ""
    expect(css).toContain('[data-mode="escuro"] [data-noite]{display:inline}')
    expect(css).toContain('[data-mode="escuro"] [data-dia]{display:none}')
    const svg = container.querySelector("[data-cena-rodape]")
    // Uma só cena noturna para as quatro estações: o desenho não se duplica.
    expect(svg?.querySelectorAll("[data-noite]")).toHaveLength(1)
    expect(svg?.querySelectorAll("[data-noite] path").length).toBeGreaterThanOrEqual(2)
    expect(svg?.querySelectorAll('[data-cena="verao"] [data-dia]')).toHaveLength(1)
    expect(svg?.querySelectorAll('[data-cena="primavera"] [data-dia]')).toHaveLength(0)
  })
})
