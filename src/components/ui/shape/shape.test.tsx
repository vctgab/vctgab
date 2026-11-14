import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import { Shape, shapeHostProps } from "."

function Host({ seed = "teste" }: { seed?: string }) {
  return (
    <div {...shapeHostProps({ seed })} className="relative isolate p-4">
      <Shape seed={seed} shadow="md" />
      <p>Texto acima das camadas</p>
    </div>
  )
}

describe("Shape (CA-8)", () => {
  it("desenha no máximo 3 camadas SVG, todas decorativas e sem filtro", () => {
    const { container } = render(<Host />)
    const layers = container.querySelectorAll("svg[data-shape-layer]")
    expect(layers.length).toBeLessThanOrEqual(3)
    expect(layers).toHaveLength(3)
    for (const svg of layers) {
      expect(svg).toHaveAttribute("aria-hidden", "true")
      expect(svg).toHaveAttribute("focusable", "false")
      expect(svg.getAttribute("class")).toContain("pointer-events-none")
    }
    expect(container.querySelector("filter, feTurbulence, feDisplacementMap")).toBeNull()
  })

  it("é determinística: mesma seed, mesmo markup", () => {
    const a = render(<Host seed="igual" />).container.innerHTML
    const b = render(<Host seed="igual" />).container.innerHTML
    expect(a).toBe(b)
  })

  it("muda o contorno com a seed", () => {
    const a = render(<Host seed="um" />)
      .container.querySelector("path")
      ?.getAttribute("d")
    const b = render(<Host seed="dois" />)
      .container.querySelector("path")
      ?.getAttribute("d")
    expect(a).not.toBe(b)
  })

  it("omite camadas pedidas como none", () => {
    const { container } = render(
      <div className="relative">
        <Shape seed="s" fill="none" shadow="none" />
      </div>,
    )
    expect(container.querySelectorAll("svg")).toHaveLength(1)
  })

  it("linhas abertas só têm contorno", () => {
    const { container } = render(<Shape seed="linha" kind="handLine" shadow="md" />)
    expect(container.querySelectorAll("svg")).toHaveLength(1)
  })

  it("marca o hospedeiro para forced-colors e dá o border-radius da mesma seed", () => {
    const props = shapeHostProps({ seed: "host", interactive: true, rotate: true })
    expect(props["data-shape-host"]).toBe("")
    expect(props["data-interactive"]).toBe("")
    expect(String(props.style.borderRadius)).toMatch(/px .* \/ /)
    expect(String(props.style.rotate)).toContain("--shape-rotation-max")
  })

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<Host />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
