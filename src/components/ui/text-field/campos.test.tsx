import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TextField } from "."

const TIPOS = [
  { value: "site", label: "Site institucional" },
  { value: "produto", label: "Produto digital" },
  { value: "design-system", label: "Design system" },
]

describe("TextField", () => {
  it("CA-1: rótulo ligado e ajuda descrita", () => {
    render(
      <TextField
        label="E-mail"
        name="email"
        type="email"
        hint="Respondo por este e-mail."
      />,
    )
    const input = screen.getByLabelText("E-mail")
    expect(input).toHaveAccessibleDescription("Respondo por este e-mail.")
    expect(input).toBeRequired()
  })

  it("CA-2: erro com ícone, texto e aria-invalid", () => {
    const { container } = render(
      <TextField label="E-mail" name="email" error="Informe um e-mail com @." />,
    )
    const input = screen.getByLabelText("E-mail")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAccessibleDescription("Informe um e-mail com @.")
    expect(container.querySelector("[data-icon=alerta]")).not.toBeNull()
  })

  it("CA-3: desabilitado exige motivo e o exibe", () => {
    render(
      <TextField
        label="Telefone"
        name="telefone"
        disabled
        disabledReason="O contato por telefone abre depois que o e-mail for confirmado."
      />,
    )
    expect(screen.getByLabelText("Telefone")).toBeDisabled()
    expect(screen.getByLabelText("Telefone")).toHaveAccessibleDescription(
      "O contato por telefone abre depois que o e-mail for confirmado.",
    )
    // @ts-expect-error desabilitado sem motivo
    const semMotivo = <TextField label="Telefone" disabled />
    expect(semMotivo).toBeTruthy()
  })

  it("CA-4: contador pelo formatador", async () => {
    render(<TextField label="Assunto" name="assunto" maxLength={80} showCounter />)
    expect(screen.getByText("0 de 80 caracteres")).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText("Assunto"), "Olá, ação")
    expect(screen.getByText("9 de 80 caracteres")).toBeInTheDocument()
  })

  it("CA-5: opcional marcado no rótulo", () => {
    render(<TextField label="Empresa" name="empresa" optional />)
    expect(screen.getByLabelText("Empresa (opcional)")).not.toBeRequired()
  })
})

describe("Textarea", () => {
  it("liga rótulo, erro e contador", () => {
    render(
      <Textarea
        label="Mensagem"
        name="mensagem"
        maxLength={600}
        showCounter
        error="Escreva a mensagem com pelo menos 20 caracteres."
      />,
    )
    const area = screen.getByLabelText("Mensagem")
    expect(area.tagName).toBe("TEXTAREA")
    expect(area).toHaveAccessibleDescription(
      "Escreva a mensagem com pelo menos 20 caracteres. 0 de 600 caracteres",
    )
  })
})

describe("Select", () => {
  it("CA-6: abre pelo teclado e mostra a escolha", async () => {
    const user = userEvent.setup()
    render(<Select label="Tipo de projeto" name="tipo" options={TIPOS} />)
    const trigger = screen.getByRole("combobox", { name: "Tipo de projeto" })
    trigger.focus()
    await user.keyboard("{Enter}")
    await user.click(await screen.findByRole("option", { name: "Design system" }))
    expect(trigger).toHaveTextContent("Design system")
  })

  it("mostra os estados carregando, vazio e falha", () => {
    const { rerender } = render(<Select label="Tipo" options={[]} loading />)
    expect(screen.getByText("Carregando opções")).toBeInTheDocument()
    rerender(<Select label="Tipo" options={[]} />)
    expect(
      screen.getByText("Nenhuma opção disponível. Escreva o que precisa na mensagem."),
    ).toBeInTheDocument()
    rerender(
      <Select
        label="Tipo"
        options={[]}
        loadError="Não foi possível carregar as opções. Escreva o tipo de projeto na mensagem."
      />,
    )
    expect(screen.getByText(/Não foi possível carregar as opções/)).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeDisabled()
  })
})

describe("campos: acessibilidade (CA-7)", () => {
  it("sem violações, com e sem erro", async () => {
    const { container } = render(
      <form>
        <TextField label="Nome" name="nome" />
        <TextField label="E-mail" name="email" error="Informe um e-mail com @." />
        <Textarea
          label="Mensagem"
          name="mensagem"
          hint="Conte o que precisa colocar no ar."
        />
        <Select
          label="Tipo de projeto"
          name="tipo"
          options={TIPOS}
          error="Escolha o tipo de projeto."
        />
      </form>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
