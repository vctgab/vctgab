import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Button } from "."

const VARIANTS = ["primary", "secondary", "ghost", "link"] as const
const SIZES = ["sm", "md", "lg"] as const

describe("Button", () => {
  it.each(VARIANTS.flatMap((v) => SIZES.map((s) => [v, s] as const)))(
    "CA-1: %s %s tem alvo de 44 px ou mais",
    (variant, size) => {
      render(
        <Button variant={variant} size={size}>
          Enviar mensagem
        </Button>,
      )
      const button = screen.getByRole("button", { name: "Enviar mensagem" })
      expect(button.className).toMatch(/min-h-(11|12|14)/)
      expect(button).toHaveAttribute("type", "button")
    },
  )

  it("CA-2: só ícone usa o aria-label como nome", () => {
    render(<Button iconOnly="fechar" aria-label="Fechar o caderno" variant="ghost" />)
    expect(screen.getByRole("button", { name: "Fechar o caderno" })).toBeInTheDocument()
    // @ts-expect-error só ícone sem aria-label não compila (AC-03)
    const semNome = <Button iconOnly="fechar" />
    expect(semNome).toBeTruthy()
  })

  it("CA-3: desabilitado mostra o motivo, liga por aria-describedby e não dispara", async () => {
    const onClick = vi.fn()
    render(
      <Button
        disabled
        disabledReason="Preencha nome e e-mail para enviar."
        onClick={onClick}
      >
        Enviar mensagem
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Enviar mensagem" })
    expect(button).toHaveAttribute("aria-disabled", "true")
    expect(button).toHaveAccessibleDescription("Preencha nome e e-mail para enviar.")
    expect(screen.getByText("Preencha nome e e-mail para enviar.")).toBeVisible()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
    // @ts-expect-error desabilitado sem motivo não compila (BT-05)
    const semMotivo = <Button disabled>Enviar mensagem</Button>
    expect(semMotivo).toBeTruthy()
  })

  it("CA-4: carregando expõe aria-busy, mostra o spinner e não dispara", async () => {
    const onClick = vi.fn()
    const { container } = render(
      <Button loading loadingLabel="Enviando mensagem" onClick={onClick}>
        Enviar mensagem
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Enviando mensagem" })
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(container.querySelector("[data-spinner]")).not.toBeNull()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("CA-5: asChild vira link com camadas e sem botão aninhado", () => {
    const { container } = render(
      <Button asChild iconRight="seta">
        <a href="/contato">Vamos conversar</a>
      </Button>,
    )
    const link = screen.getByRole("link", { name: "Vamos conversar" })
    expect(link).toHaveAttribute("href", "/contato")
    expect(link.querySelector("[data-shape-layer]")).not.toBeNull()
    expect(link.querySelector("[data-icon=seta]")).not.toBeNull()
    expect(container.querySelector("button")).toBeNull()
  })

  it("CA-6: mesma seed, mesmo contorno; rótulos diferentes, contornos diferentes", () => {
    const d = (label: string) =>
      render(<Button>{label}</Button>)
        .container.querySelector("[data-shape-layer=contorno] path")
        ?.getAttribute("d")
    expect(d("Abrir WhatsApp")).toBe(d("Abrir WhatsApp"))
    expect(d("Abrir WhatsApp")).not.toBe(d("Enviar mensagem"))
  })

  it("CA-7: Enter e Espaço acionam; Tab alcança o desabilitado", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <>
        <Button onClick={onClick}>Copiar código de uso</Button>
        <Button disabled disabledReason="Escolha um tema para aplicar.">
          Aplicar tema
        </Button>
      </>,
    )
    await user.tab()
    expect(screen.getByRole("button", { name: "Copiar código de uso" })).toHaveFocus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onClick).toHaveBeenCalledTimes(2)
    await user.tab()
    expect(screen.getByRole("button", { name: "Aplicar tema" })).toHaveFocus()
  })

  it("CA-9: sem violações em todas as variantes e estados", async () => {
    const { container } = render(
      <div>
        {VARIANTS.map((v) => (
          <Button key={v} variant={v} iconLeft="seta">
            {`Ação ${v}`}
          </Button>
        ))}
        <Button iconOnly="menu" aria-label="Abrir menu" />
        <Button loading>Enviar mensagem</Button>
        <Button disabled disabledReason="Preencha o e-mail para enviar.">
          Enviar e-mail
        </Button>
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
