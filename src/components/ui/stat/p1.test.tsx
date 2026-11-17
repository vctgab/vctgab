import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Accordion } from "@/components/ui/accordion"
import { Divider } from "@/components/ui/divider"
import { LiveClock } from "@/components/ui/live-clock"
import { Marquee } from "@/components/ui/marquee"
import { Polaroid } from "@/components/ui/polaroid"
import { ProgressHatch } from "@/components/ui/progress-hatch"
import { Quote, type QuoteItem } from "@/components/ui/quote"
import { Reveal } from "@/components/ui/reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { TerminalShell } from "@/components/ui/terminal-shell"
import { formatPercent } from "@/lib/format"
import { Stat } from "."

const DEPOENTES: QuoteItem[] = [
  {
    id: "a",
    author: "Pessoa fictícia A",
    role: "[a confirmar: cargo e empresa]",
    text: "[a confirmar: texto do depoimento]",
  },
  {
    id: "b",
    author: "Pessoa fictícia B",
    role: "Cargo fictício",
    text: "Texto fictício de depoimento para a vitrine.",
  },
]

describe("P1 visuais", () => {
  it("CA-1: Divider é um separador com traço decorativo", () => {
    const { container } = render(<Divider />)
    expect(container.querySelector("hr")).not.toBeNull()
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("CA-2 e CA-5: ProgressHatch expõe o valor pelo formatador", () => {
    render(<ProgressHatch value={3} max={7} label="Progresso dos achados" />)
    const bar = screen.getByRole("progressbar", { name: "Progresso dos achados" })
    expect(bar).toHaveAttribute("aria-valuenow", "3")
    expect(bar).toHaveAttribute("aria-valuemax", "7")
    expect(bar).toHaveAttribute("aria-valuetext", "3 de 7")
  })

  it("CA-3: Polaroid sem foto mostra o marcador a confirmar", () => {
    render(
      <Polaroid seed="p1" placeholder="[a confirmar: foto 1]" caption="Teresina, 2026" />,
    )
    expect(screen.getByText("[a confirmar: foto 1]")).toBeInTheDocument()
    expect(screen.getByRole("figure")).toHaveTextContent("Teresina, 2026")
    // @ts-expect-error foto sem alt não compila
    const semAlt = <Polaroid seed="p2" src="/foto.jpg" />
    expect(semAlt).toBeTruthy()
  })

  it("CA-4: Stat exige método e lê o de/para como frase", () => {
    render(
      <Stat
        from={formatPercent(34)}
        value={formatPercent(89)}
        method="Teste de árvore com participantes fictícios (exemplo da vitrine)."
      />,
    )
    expect(screen.getByRole("img", { name: "De 34% para 89%" })).toBeInTheDocument()
    expect(screen.getByText("Método")).toBeInTheDocument()
    // @ts-expect-error número sem método não compila
    const semMetodo = <Stat value="89%" />
    expect(semMetodo).toBeTruthy()
  })

  it("CA-7: Stat mostra o rótulo e o método ou a fonte", () => {
    const { rerender } = render(
      <Stat value="5+" label="anos fictícios" method="desde 2000" methodKind="fonte" />,
    )
    expect(screen.getByText("anos fictícios")).toBeInTheDocument()
    expect(screen.getByText("Fonte")).toBeInTheDocument()
    expect(screen.queryByText("Método")).toBeNull()
    rerender(<Stat from="8s" value="quase instantâneo" method="[a confirmar: método]" />)
    expect(
      screen.getByRole("img", { name: "De 8s para quase instantâneo" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Método")).toBeInTheDocument()
  })

  it("CA-8: Stat md usa text-h1 no valor; lg, text-display", () => {
    const { container, rerender } = render(<Stat value="400+" method="x" size="md" />)
    const value = () =>
      container.querySelector('[role="img"] > span:last-child') as HTMLElement
    expect(value().className).toContain("text-h1")
    rerender(<Stat value="400+" method="x" />)
    expect(value().className).toContain("text-display")
  })

  it("Skeleton é decorativo", () => {
    const { container } = render(<Skeleton shape="linha" lines={3} />)
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true")
  })
})

describe("Quote", () => {
  it("CA-1: cinco estados com os textos previstos", () => {
    const { rerender } = render(<Quote items={DEPOENTES} status="carregando" />)
    expect(screen.getByText("Carregando depoimentos")).toBeInTheDocument()
    rerender(<Quote items={[]} status="vazio" />)
    expect(screen.getByText("Ainda não há depoimentos publicados.")).toBeInTheDocument()
    const retry = vi.fn()
    rerender(<Quote items={[]} status="erro" onRetry={retry} />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os depoimentos.",
    )
    expect(
      screen.getByRole("button", { name: "Tentar carregar de novo" }),
    ).toBeInTheDocument()
    rerender(<Quote items={[]} status="indisponivel" />)
    expect(
      screen.getByText(
        "Os depoimentos voltam quando cada pessoa autorizar a publicação.",
      ),
    ).toBeInTheDocument()
    rerender(<Quote items={DEPOENTES} />)
    expect(
      screen.getByRole("radiogroup", { name: "Escolher quem fala" }),
    ).toBeInTheDocument()
  })

  it("CA-5: indisponível com pendência fica na ficha de papel, sem citação", async () => {
    const { container } = render(
      <Quote
        items={[]}
        status="indisponivel"
        unavailableMessage="O depoimento entra quando a pessoa autorizar a publicação."
        note="[a confirmar: depoimento fictício]"
      />,
    )
    const box = screen.getByRole("status")
    expect(box).toHaveTextContent(
      "O depoimento entra quando a pessoa autorizar a publicação.",
    )
    expect(box).toHaveTextContent("[a confirmar: depoimento fictício]")
    expect(container.querySelector("blockquote")).toBeNull()
    expect(container.querySelector("[data-shape-layer]")).not.toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("CA-2: escolher um depoente troca a ficha", async () => {
    const user = userEvent.setup()
    render(<Quote items={DEPOENTES} />)
    await user.click(screen.getByRole("radio", { name: "Pessoa fictícia B" }))
    expect(
      screen.getByText("Texto fictício de depoimento para a vitrine."),
    ).toBeInTheDocument()
  })

  it("CA-3: troca automática tem botão de pausa", async () => {
    const user = userEvent.setup()
    render(<Quote items={DEPOENTES} autoAdvanceMs={6000} />)
    const pause = screen.getByRole("button", { name: "Pausar troca automática" })
    await user.click(pause)
    expect(
      screen.getByRole("button", { name: "Retomar troca automática" }),
    ).toBeInTheDocument()
  })
})

describe("movimento", () => {
  it("CA-1: Marquee tem região nomeada e cópia inerte", () => {
    const { container } = render(
      <Marquee label="Projetos em destaque">
        <a href="/projetos/a">Projeto fictício A</a>
      </Marquee>,
    )
    expect(
      screen.getByRole("region", { name: "Projetos em destaque" }),
    ).toBeInTheDocument()
    const copy = container.querySelector("[data-copia]")
    expect(copy).toHaveAttribute("aria-hidden", "true")
    expect(copy).toHaveAttribute("inert")
    expect(screen.getAllByRole("link")).toHaveLength(1)
  })

  it("CA-2: Reveal marca o bloco para entrar", () => {
    const { container } = render(<Reveal>Conteúdo</Reveal>)
    expect(container.firstElementChild).toHaveAttribute("data-reveal")
  })

  it("CA-3: LiveClock mostra a hora de Teresina pelo formatador", () => {
    vi.useFakeTimers()
    vi.setSystemTime(Date.UTC(2026, 10, 14, 20, 25, 7))
    render(<LiveClock />)
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(screen.getByText("17:25:07")).toHaveAttribute(
      "aria-label",
      "Horário em Teresina: 17:25",
    )
    vi.useRealTimers()
  })
})

describe("Accordion e TerminalShell", () => {
  it("CA-1: Accordion alterna pelo teclado", async () => {
    const user = userEvent.setup()
    render(
      <Accordion
        items={[
          {
            value: "prazo",
            title: "Qual é o prazo de um projeto?",
            content: "[a confirmar: prazos]",
          },
          {
            value: "stack",
            title: "Quais tecnologias você usa?",
            content: "React, Next.js e TypeScript.",
          },
        ]}
      />,
    )
    const trigger = screen.getByRole("button", { name: "Qual é o prazo de um projeto?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    trigger.focus()
    await user.keyboard("{Enter}")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  it("CA-2 e CA-3: terminal foca, ecoa e responde no log", async () => {
    const user = userEvent.setup()
    render(<TerminalShell focusOnMount />)
    const input = screen.getByLabelText("Comando")
    expect(input).toHaveFocus()
    await user.type(input, "ajuda{Enter}")
    const log = screen.getByRole("log", { name: "Saída do terminal" })
    expect(log).toHaveTextContent("ajuda")
    expect(log).toHaveTextContent("Volte em breve.")
  })

  it("CA-5: sem violações", async () => {
    const { container } = render(
      <div>
        <TerminalShell />
        <Accordion items={[{ value: "a", title: "Pergunta", content: "Resposta" }]} />
        <Stat value="89%" method="[a confirmar: método]" />
        <Polaroid seed="x" placeholder="[a confirmar: foto 1]" />
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
