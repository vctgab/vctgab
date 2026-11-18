import { render, screen, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { AchadosProvider } from "@/components/ui/finds"
import { NEXUSCOOP } from "@/content/projects"
import { CasePage } from "."

/**
 * O CodeBlock é um Server Component assíncrono (realce no servidor); no jsdom
 * o teste usa a vista dele no estado retido, que é o do caso hoje (D-1305).
 * O realce e a cópia têm teste próprio em ui/code-block.
 */
vi.mock("@/components/ui/code-block", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/code-block")>()
  return {
    ...actual,
    CodeBlock: ({
      code,
      caption,
      seed = "codigo",
    }: {
      code: { what?: string }
      caption: React.ReactNode
      seed?: string
    }) => actual.CodeBlockView({ language: "ts", caption, review: code.what, seed }),
  }
})

function page() {
  return (
    <AchadosProvider>
      <CasePage project={NEXUSCOOP} />
    </AchadosProvider>
  )
}

/** O CodeBlock é assíncrono (servidor): aqui só o caso retido, que não realça. */
describe("CasePage (molde)", () => {
  it("CA-2: um h1, um h2 por seção na ordem do copy, cada seção nomeada pelo h2", async () => {
    const { container } = render(page())
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    const h2 = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)
    expect(h2).toEqual(["Ficha técnica", ...NEXUSCOOP.sections.map((s) => s.title)])
    for (const s of NEXUSCOOP.sections) {
      const section = container.querySelector(`section#${s.id}`)
      expect(section).toHaveAccessibleName(s.title)
    }
  })

  it("o sumário tem um link por seção", () => {
    render(page())
    const nav = screen.getByRole("navigation", { name: "Sumário" })
    expect(
      within(nav)
        .getAllByRole("link")
        .map((l) => l.textContent),
    ).toEqual(NEXUSCOOP.sections.map((s) => s.title))
  })

  it("CA-4: as marcas de revisão aparecem e o código do cliente não", () => {
    const { container } = render(page())
    const marks = [...container.querySelectorAll("[data-review-label]")].map(
      (m) => m.textContent,
    )
    expect(marks).toEqual([
      "[validar: papéis do time, se quiser detalhar]",
      "[validar: permissão para mostrar trechos do código do cliente]",
      "[validar: se pode contar o incidente]",
      "[validar: se as regras de UI e linguagem foram escritas por você]",
      "[validar: o que eu faria diferente]",
    ])
    expect(container.textContent).not.toContain("isNativePlatform")
  })

  it("CA-3: só a imagem principal é preload; as demais são preguiçosas; todas têm alt", () => {
    const { container } = render(page())
    const imgs = [...container.querySelectorAll("img")]
    expect(imgs.length).toBe(14)
    expect(imgs.filter((i) => i.getAttribute("loading") !== "lazy")).toHaveLength(1)
    for (const img of imgs) {
      expect(img.getAttribute("alt")?.length).toBeGreaterThan(40)
      expect(img).toHaveAttribute("width")
      expect(img).toHaveAttribute("height")
    }
  })

  it("o achado da chave fica no parágrafo 'Nada some sem deixar rastro'", () => {
    render(page())
    const key = screen.getByRole("button", {
      name: "Algo que abre uma porta, perto do rastro",
    })
    const block = key.closest("div.relative")
    expect(block).toHaveTextContent("Nada some sem deixar rastro.")
  })

  it("o rodapé aponta para o próximo projeto e traz os dois CTAs", () => {
    render(page())
    expect(screen.getByRole("link", { name: "Kasb Health" })).toHaveAttribute(
      "href",
      "/projetos/kasb-health",
    )
    expect(screen.getByRole("link", { name: "tenho uma vaga" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "tenho um projeto" })).toBeInTheDocument()
  })

  it("o destaque do validador, a lista do problema e os cinco números estão lá", () => {
    const { container } = render(page())
    expect(
      screen.getByRole("note", { name: "A regra mais importante do validador" }),
    ).toHaveTextContent(
      "se o validador falhar, ele não pode devolver uma lista vazia de erros",
    )
    expect(container.querySelectorAll("section#problema ul li")).toHaveLength(4)
    expect(container.querySelectorAll("section#resultado [role='img']")).toHaveLength(5)
    expect(
      container.querySelectorAll("section#resultado dt, section#resultado .font-mono"),
    ).not.toHaveLength(0)
  })

  it("jest-axe sem violações", async () => {
    const { container } = render(page())
    expect(await axe(container)).toHaveNoViolations()
  })
})
