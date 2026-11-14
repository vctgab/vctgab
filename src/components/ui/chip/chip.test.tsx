import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Tag } from "@/components/ui/tag"
import { Chip } from "."

describe("Tag", () => {
  it("CA-1: não é focável e tem 32 px", () => {
    const { container } = render(<Tag>React</Tag>)
    const tag = container.firstElementChild as HTMLElement
    expect(tag.tabIndex).toBe(-1)
    expect(tag.className).toContain("min-h-8")
    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("Chip", () => {
  it("CA-2: alterna com clique, Enter e Espaço", async () => {
    const user = userEvent.setup()
    render(<Chip>Next.js</Chip>)
    const chip = screen.getByRole("button", { name: "Next.js" })
    expect(chip).toHaveAttribute("aria-pressed", "false")
    await user.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
    await user.keyboard("{Enter}")
    expect(chip).toHaveAttribute("aria-pressed", "false")
    await user.keyboard(" ")
    expect(chip).toHaveAttribute("aria-pressed", "true")
  })

  it("CA-3: selecionado mostra o check", () => {
    const { container } = render(<Chip defaultPressed>TypeScript</Chip>)
    expect(container.querySelector("[data-icon=check]")).not.toBeNull()
  })

  it("CA-4: desabilitado exige motivo e não alterna", async () => {
    const onChange = vi.fn()
    render(
      <Chip
        disabled
        disabledReason="Nenhum projeto usa esta tecnologia."
        onPressedChange={onChange}
      >
        Vue
      </Chip>,
    )
    const chip = screen.getByRole("button", { name: "Vue" })
    await userEvent.click(chip)
    expect(onChange).not.toHaveBeenCalled()
    expect(chip).toHaveAccessibleDescription("Nenhum projeto usa esta tecnologia.")
    // @ts-expect-error desabilitado sem motivo (BT-05)
    const semMotivo = <Chip disabled>Vue</Chip>
    expect(semMotivo).toBeTruthy()
  })

  it("CA-5: alvo de 44 px", () => {
    render(<Chip>React</Chip>)
    expect(screen.getByRole("button").className).toContain("min-h-11")
  })

  it("CA-6: sem violações num grupo de filtros", async () => {
    const { container } = render(
      <div role="group" aria-label="Filtrar projetos por tecnologia">
        <Chip defaultPressed>React</Chip>
        <Chip>Next.js</Chip>
        <Tag>Design system</Tag>
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
