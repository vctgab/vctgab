import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Callout } from "."

const LONG =
  "E uma regra que parece detalhe, mas é a mais importante: se o validador falhar, ele não pode devolver uma lista vazia de erros, porque lista vazia quer dizer tudo certo. Ele tem que reclamar alto."

describe("Callout", () => {
  it("CA-1: tem role note com o nome de label e mostra o conteúdo", () => {
    render(
      <Callout label="A regra mais importante">
        <strong>se o validador falhar</strong> ele reclama.
      </Callout>,
    )
    const note = screen.getByRole("note", { name: "A regra mais importante" })
    expect(note).toHaveTextContent("se o validador falhar ele reclama.")
    expect(note.tagName).toBe("DIV")
  })

  it("CA-2: no máximo 3 camadas SVG, todas aria-hidden e sem pointer-events", () => {
    const { container } = render(<Callout label="Regra">{LONG}</Callout>)
    const layers = container.querySelectorAll("svg[data-shape-layer]")
    expect(layers.length).toBeGreaterThan(0)
    expect(layers.length).toBeLessThanOrEqual(3)
    for (const layer of layers) {
      expect(layer).toHaveAttribute("aria-hidden", "true")
      expect(layer.getAttribute("class")).toMatch(/pointer-events-none/)
    }
  })

  it("CA-3: sem violações de acessibilidade nos dois tons", async () => {
    const { container } = render(
      <main>
        <Callout label="Regra primária">{LONG}</Callout>
        <Callout label="Observação" tone="neutral">
          Apoio.
        </Callout>
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("CA-5: texto longo com 3 seeds fica dentro do corpo (conteúdo em fluxo normal)", () => {
    for (const seed of ["a", "b", "c"]) {
      const { container, unmount } = render(
        <Callout label="Regra" seed={seed}>
          {LONG}
        </Callout>,
      )
      const note = container.firstElementChild as HTMLElement
      expect(note.className).toMatch(/ps-10/)
      expect(note.className).toMatch(/pe-6/)
      expect(note.textContent).toContain("reclamar alto")
      unmount()
    }
  })
})
