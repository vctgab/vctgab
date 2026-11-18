import { readFileSync } from "node:fs"
import { join } from "node:path"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { review } from "@/content/pending"
import { CodeBlock, CodeBlockView } from "."
import { highlight } from "./highlight"

const CODE = `// Comentário
const native = isNativePlatform();
export const x = { a: "b" };`

const DIR = join(process.cwd(), "src/components/ui/code-block")

async function view(props: { held?: boolean } = {}) {
  const html = props.held ? undefined : await highlight(CODE, "ts")
  return (
    <CodeBlockView
      html={html}
      source={CODE}
      language="ts"
      caption="Legenda do trecho."
      review={props.held ? "permissão para mostrar o código" : undefined}
      seed="teste"
    />
  )
}

describe("CodeBlock", () => {
  it("CA-1: realça no servidor (spans com variáveis) e o realce não vai ao cliente", async () => {
    const { container } = render(await view())
    expect(container.querySelector("pre code")).not.toBeNull()
    expect(container.querySelectorAll("pre code span").length).toBeGreaterThan(5)
    expect(container.innerHTML).toContain("var(--shiki-token-keyword)")
    for (const file of ["code-block.tsx", "highlight.ts"])
      expect(readFileSync(join(DIR, file), "utf8")).not.toMatch(/^["']use client["']/m)
    // O único arquivo de cliente não importa o shiki.
    expect(readFileSync(join(DIR, "copy-button.tsx"), "utf8")).not.toMatch(/shiki/)
  })

  it("CA-2: com review(withhold), o código não aparece; aparecem a legenda e a marca", async () => {
    const node = await CodeBlock({
      code: review("permissão para mostrar o código", CODE, { withhold: true }),
      caption: "Legenda do trecho.",
    })
    const { container } = render(node)
    expect(container.textContent).not.toContain("isNativePlatform")
    expect(container.querySelector("pre")).toBeNull()
    expect(screen.queryByRole("button", { name: "Copiar código" })).toBeNull()
    expect(screen.getByText("Legenda do trecho.")).toBeInTheDocument()
    expect(
      screen.getByText("[validar: permissão para mostrar o código]"),
    ).toBeInTheDocument()
  })

  it("review sem withhold mostra o código e a marca", async () => {
    const node = await CodeBlock({
      code: review("conferir o trecho", CODE),
      caption: "Legenda.",
    })
    const { container } = render(node)
    expect(container.textContent).toContain("isNativePlatform")
    expect(screen.getByText("[validar: conferir o trecho]")).toBeInTheDocument()
  })

  it("CA-3: Copiar código tem nome, copia exatamente o código, anuncia e volta ao rótulo", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(await view())
    await user.click(screen.getByRole("button", { name: "Copiar código" }))
    expect(await navigator.clipboard.readText()).toBe(CODE)
    expect(screen.getByRole("button", { name: "Código copiado" })).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Código copiado")
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100)
    })
    expect(screen.getByRole("button", { name: "Copiar código" })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it("CA-4: falha de cópia mostra a mensagem do padrão MS-02 e o botão segue utilizável", async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(new Error("negado"))
    render(await view())
    await user.click(screen.getByRole("button", { name: "Copiar código" }))
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent(/^Não foi possível copiar o código\./)
    expect(alert).toHaveTextContent("nada foi alterado")
    expect(alert).not.toHaveTextContent("negado")
    expect(screen.getByRole("button", { name: "Copiar código" })).toBeEnabled()
  })

  it("CA-5: a região de código é focável e tem nome", async () => {
    render(await view())
    const region = screen.getByRole("region", { name: "Código TypeScript" })
    expect(region).toHaveAttribute("tabindex", "0")
    expect(region.tagName).toBe("PRE")
  })

  it("CA-7: sem violações de acessibilidade, realçado e em revisão", async () => {
    const a = render(<main>{await view()}</main>)
    expect(await axe(a.container)).toHaveNoViolations()
    a.unmount()
    const b = render(<main>{await view({ held: true })}</main>)
    expect(await axe(b.container)).toHaveNoViolations()
  })
})
