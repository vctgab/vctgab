import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { pending } from "@/content/pending"
import { CaseFigure, CaseFigureGroup, type CaseFigureItem } from "."

const IMG = {
  src: "/projetos/nexuscoop/dashboard-desktop.webp",
  width: 1920,
  height: 1200,
  alt: "Painel fictício com a produção do mês e um gráfico de barras.",
}
const TALL = {
  src: "/projetos/nexuscoop/billing-accounts-desktop.webp",
  width: 1920,
  height: 4388,
  alt: "Painel fictício de contas, com uma tabela longa.",
}
const PHONE = {
  src: "/projetos/nexuscoop/dashboard-mobile.webp",
  width: 780,
  height: 1688,
  alt: "Painel fictício no celular.",
}

const item = (id: string, variant: CaseFigureItem["variant"], image = IMG) =>
  ({ id, variant, image }) satisfies CaseFigureItem

describe("CaseFigure", () => {
  it("CA-1: figure com img de alt descritivo, largura e altura declaradas e figcaption", () => {
    const { container } = render(
      <CaseFigure {...item("a", "browser")} caption="O painel do cooperado." />,
    )
    expect(container.querySelector("figure")).not.toBeNull()
    const img = screen.getByRole("img", { name: IMG.alt })
    expect(img).toHaveAttribute("width", "1920")
    expect(img).toHaveAttribute("height", "1200")
    expect(container.querySelector("figcaption")).toHaveTextContent(
      "O painel do cooperado.",
    )
  })

  it("CA-2: só a figura com priority é carregada com prioridade; as demais, de forma preguiçosa", () => {
    const { container } = render(
      <>
        <CaseFigure {...item("capa", "browser")} priority caption="Capa." />
        <CaseFigure {...item("b", "browser", TALL)} caption="Outra." />
      </>,
    )
    const imgs = [...container.querySelectorAll("img")]
    expect(imgs[0]?.getAttribute("loading")).not.toBe("lazy")
    expect(imgs[1]?.getAttribute("loading")).toBe("lazy")
  })

  it("CA-3: o botão tem o nome 'Ampliar imagem: <alt>' e a proporção está reservada", () => {
    const { container } = render(
      <CaseFigure {...item("a", "browser", TALL)} caption="x" />,
    )
    const button = screen.getByRole("button", { name: `Ampliar imagem: ${TALL.alt}` })
    expect(button.className).toMatch(/min-h-11/)
    // Print mais alto que a moldura: a proporção exibida é a mínima (16:10).
    const box = container.querySelector<HTMLElement>("[data-moldura] > div:last-child")
    expect(box?.getAttribute("style")).toMatch(/aspect-ratio:\s*1\.6/)
  })

  it("CA-4: Enter abre o diálogo com a imagem inteira; Esc fecha e devolve o foco", async () => {
    const user = userEvent.setup()
    render(<CaseFigure {...item("a", "browser", TALL)} caption="A esteira de contas." />)
    const button = screen.getByRole("button", { name: /^Ampliar imagem/ })
    button.focus()
    await user.keyboard("{Enter}")
    const dialog = await screen.findByRole("dialog", { name: "A esteira de contas." })
    expect(dialog).toHaveAccessibleDescription(/Imagem ampliada/)
    const zoom = within(dialog).getByRole("img", { name: TALL.alt })
    expect(zoom).toHaveAttribute("width", "1920")
    expect(zoom).toHaveAttribute("height", "4388")
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(button).toHaveFocus()
  })

  it("CA-6: sem imagem, hachura com [a confirmar: print: <arquivo>] e nenhuma img", () => {
    const { container } = render(
      <CaseFigure
        id="p"
        variant="browser"
        image={pending("print: 03-dashboard-cooperado-desktop")}
        caption="Legenda."
      />,
    )
    expect(
      screen.getByText("[a confirmar: print: 03-dashboard-cooperado-desktop]"),
    ).toBeInTheDocument()
    expect(container.querySelector("img")).toBeNull()
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("CA-7: no máximo 3 camadas SVG por moldura, aria-hidden e sem pointer-events", () => {
    for (const variant of ["browser", "phone"] as const) {
      const { container, unmount } = render(
        <CaseFigure {...item("a", variant)} caption="x" />,
      )
      const frame = container.querySelector("[data-moldura]") as HTMLElement
      const layers = frame.querySelectorAll(":scope > svg[data-shape-layer]")
      expect(layers.length).toBeGreaterThan(0)
      expect(layers.length).toBeLessThanOrEqual(3)
      for (const layer of layers) {
        expect(layer).toHaveAttribute("aria-hidden", "true")
        expect(layer.getAttribute("class")).toMatch(/pointer-events-none/)
      }
      unmount()
    }
  })

  it("CA-8: sem violações de acessibilidade", async () => {
    const { container } = render(
      <main>
        <CaseFigure {...item("a", "browser")} caption="Legenda do navegador." />
        <CaseFigure {...item("b", "phone", PHONE)} caption="Legenda do celular." />
        <CaseFigure
          id="c"
          variant="browser"
          image={pending("print: x")}
          caption="Legenda pendente."
        />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("CaseFigureGroup", () => {
  it("CA-5: mostra todas as figuras com uma legenda só e empilha no celular", () => {
    const { container } = render(
      <CaseFigureGroup
        caption="A mesma base de código, no app."
        figures={[item("a", "phone", PHONE), item("b", "phone", PHONE)]}
      />,
    )
    expect(container.querySelectorAll("figure")).toHaveLength(1)
    expect(container.querySelectorAll("figcaption")).toHaveLength(1)
    expect(container.querySelectorAll("img")).toHaveLength(2)
    expect(screen.getAllByRole("button", { name: /^Ampliar imagem/ })).toHaveLength(2)
    const row = container.querySelector("figure > div") as HTMLElement
    expect(row.className).toMatch(/\bflex-col\b/)
    expect(row.className).toMatch(/md:flex-row/)
  })

  it("jest-axe sem violações no grupo, com desktop e celular", async () => {
    const { container } = render(
      <main>
        <CaseFigureGroup
          caption="Desktop e celular."
          figures={[item("a", "browser"), item("b", "phone", PHONE)]}
        />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
