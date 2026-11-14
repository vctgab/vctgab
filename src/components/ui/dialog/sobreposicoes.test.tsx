import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Button } from "@/components/ui/button"
import { Popover } from "@/components/ui/popover"
import { ToastProvider, useToast, type ToastInput } from "@/components/ui/toast"
import { Tooltip } from "@/components/ui/tooltip"
import { Dialog, Drawer } from "."

describe("Dialog", () => {
  it("CA-1 e CA-2: nomeado, Esc fecha e devolve o foco ao gatilho", async () => {
    const user = userEvent.setup()
    render(
      <Dialog
        title="Caderno de achados"
        description="Sete coisas escondidas pelo site."
        trigger={<Button>Abrir o caderno</Button>}
      >
        <p>Conteúdo</p>
      </Dialog>,
    )
    const trigger = screen.getByRole("button", { name: "Abrir o caderno" })
    await user.click(trigger)
    const dialog = await screen.findByRole("dialog", { name: "Caderno de achados" })
    expect(dialog).toHaveAccessibleDescription("Sete coisas escondidas pelo site.")
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(trigger).toHaveFocus()
  })

  it("CA-7: sem violações aberto", async () => {
    render(
      <Dialog
        title="Confirmar envio"
        defaultOpen
        footer={<Button>Enviar mensagem</Button>}
      />,
    )
    const dialog = await screen.findByRole("dialog")
    expect(await axe(dialog)).toHaveNoViolations()
  })
})

describe("Drawer (CA-3)", () => {
  it("abre do lado escolhido e fecha com Esc", async () => {
    const user = userEvent.setup()
    render(
      <Drawer
        title="Menu"
        side="right"
        trigger={<Button iconOnly="menu" aria-label="Abrir menu" />}
      >
        <a href="/projetos">Projetos</a>
      </Drawer>,
    )
    await user.click(screen.getByRole("button", { name: "Abrir menu" }))
    const drawer = await screen.findByRole("dialog", { name: "Menu" })
    expect(drawer.className).toContain("right-0")
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

describe("Tooltip (CA-4)", () => {
  it("aparece no foco do gatilho", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Abrir o terminal" delayDuration={0}>
        <Button iconOnly="terminal" aria-label="Abrir o terminal" variant="ghost" />
      </Tooltip>,
    )
    await user.tab()
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Abrir o terminal")
  })
})

describe("Popover (CA-5)", () => {
  it("abre pelo gatilho e fecha com Esc", async () => {
    const user = userEvent.setup()
    render(
      <Popover
        title="Token primary-fill"
        trigger={<Button variant="secondary">Ver detalhes</Button>}
      >
        Passo 600 da primária.
      </Popover>,
    )
    await user.click(screen.getByRole("button", { name: "Ver detalhes" }))
    expect(
      await screen.findByRole("dialog", { name: "Token primary-fill" }),
    ).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

describe("Toast (CA-6)", () => {
  function Disparo(props: ToastInput) {
    const toast = useToast()
    return <Button onClick={() => toast(props)}>Copiar código de uso</Button>
  }

  it("só aceita sucesso e informação e anuncia o texto", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <Disparo tone="sucesso" title="Código copiado." />
      </ToastProvider>,
    )
    await user.click(screen.getByRole("button", { name: "Copiar código de uso" }))
    expect((await screen.findAllByText("Código copiado.")).length).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "Fechar aviso" })).toBeInTheDocument()
    // @ts-expect-error erro nunca vira toast (MS-03)
    const erro: ToastInput = { tone: "erro", title: "x" }
    expect(erro).toBeTruthy()
  })
})
