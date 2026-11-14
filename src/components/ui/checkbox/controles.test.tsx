import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { RadioGroup } from "@/components/ui/radio-group"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "."

const TIPOS = [
  { value: "site", label: "Site institucional" },
  {
    value: "produto",
    label: "Produto digital",
    description: "Interface com login e dados.",
  },
  { value: "ds", label: "Design system" },
]

describe("Checkbox (CA-1)", () => {
  it("alterna com Espaço e clique no rótulo", async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Receber resposta por WhatsApp" name="whatsapp" />)
    const box = screen.getByRole("checkbox", { name: "Receber resposta por WhatsApp" })
    expect(box).not.toBeChecked()
    box.focus()
    await user.keyboard(" ")
    expect(box).toBeChecked()
    await user.click(screen.getByText("Receber resposta por WhatsApp"))
    expect(box).not.toBeChecked()
  })

  it("expõe mixed no indeterminado", () => {
    render(<Checkbox label="Todas as tecnologias" checked="indeterminate" />)
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed")
  })
})

describe("RadioGroup (CA-2)", () => {
  it("é nomeado pela legenda e marca com as setas", async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup
        legend="Tipo de projeto"
        name="tipo"
        options={TIPOS}
        defaultValue="site"
      />,
    )
    expect(
      screen.getByRole("radiogroup", { name: "Tipo de projeto" }),
    ).toBeInTheDocument()
    const first = screen.getByRole("radio", { name: "Site institucional" })
    first.focus()
    await user.keyboard("{ArrowDown}")
    const produto = screen.getByRole("radio", { name: "Produto digital" })
    // A marcação automática pelas setas depende do foco real (verificada no e2e).
    expect(produto).toHaveFocus()
    await user.keyboard(" ")
    expect(produto).toBeChecked()
    expect(
      screen.getByRole("radio", { name: "Produto digital" }),
    ).toHaveAccessibleDescription("Interface com login e dados.")
  })
})

describe("Switch (CA-3)", () => {
  it("alterna com Espaço e mostra o ícone quando ligado", async () => {
    const user = userEvent.setup()
    const { container } = render(<Switch label="Animações do hero" showState />)
    const sw = screen.getByRole("switch", { name: "Animações do hero" })
    expect(container.querySelector("[data-icon=check]")).toBeNull()
    sw.focus()
    await user.keyboard(" ")
    expect(sw).toBeChecked()
    expect(container.querySelector("[data-icon=check]")).not.toBeNull()
  })
})

describe("SegmentedControl (CA-4)", () => {
  it("escolhe pelo teclado e move o indicador pelo índice", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <SegmentedControl
        label="Visualização dos projetos"
        options={[
          { value: "lista", label: "Lista" },
          { value: "grade", label: "Grade" },
        ]}
      />,
    )
    const indicator = container.querySelector("[data-indicador]") as HTMLElement
    expect(indicator).toHaveAttribute("data-indice", "0")
    const grade = screen.getByRole("radio", { name: "Grade" })
    await user.click(grade)
    expect(grade).toHaveAttribute("aria-checked", "true")
    expect(indicator).toHaveAttribute("data-indice", "1")
    // Não deixa desmarcar a visão atual.
    await user.click(grade)
    expect(grade).toHaveAttribute("aria-checked", "true")
  })
})

describe("controles: desabilitado e alvo (CA-5, CA-6)", () => {
  it("exigem motivo e o exibem", () => {
    render(
      <>
        <Checkbox
          label="Aceitar contato"
          disabled
          disabledReason="Disponível depois de informar o e-mail."
        />
        <Switch label="Som" disabled disabledReason="O site não tem som nesta versão." />
      </>,
    )
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(
      "Disponível depois de informar o e-mail.",
    )
    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "O site não tem som nesta versão.",
    )
    // @ts-expect-error desabilitado sem motivo
    const semMotivo = <Switch label="Som" disabled />
    expect(semMotivo).toBeTruthy()
  })

  it("linhas de 44 px", () => {
    const { container } = render(<Checkbox label="Aceitar" />)
    expect(container.querySelector('[class*="group/check"]')?.className).toContain(
      "min-h-11",
    )
  })
})

describe("controles: acessibilidade (CA-7)", () => {
  it("sem violações", async () => {
    const { container } = render(
      <form>
        <Checkbox
          label="Receber resposta por WhatsApp"
          description="Uso só para este projeto."
        />
        <Checkbox label="Todas" checked="indeterminate" />
        <RadioGroup
          legend="Tipo de projeto"
          options={TIPOS}
          error="Escolha um tipo de projeto."
        />
        <Switch label="Animações do hero" defaultChecked />
        <SegmentedControl
          label="Visualização"
          options={[
            { value: "lista", label: "Lista" },
            { value: "grade", label: "Grade" },
          ]}
        />
      </form>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
