import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { CaseToc } from "."

const ITEMS = [
  { id: "resumo", title: "Resumo" },
  { id: "contexto", title: "Contexto" },
  { id: "o-que-eu-fiz", title: "O que eu fiz" },
] as const

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void

/** Observador de mentira: guarda o callback e os alvos para o teste disparar. */
function stubObserver() {
  const observers: { callback: Callback; targets: Element[] }[] = []
  class Fake {
    targets: Element[] = []
    constructor(callback: Callback) {
      observers.push({ callback, targets: this.targets })
    }
    observe(el: Element) {
      this.targets.push(el)
    }
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal("IntersectionObserver", Fake)
  return observers
}

afterEach(() => vi.unstubAllGlobals())

describe("CaseToc", () => {
  it("CA-1: um link por item, com href para a âncora e o título da seção", () => {
    render(<CaseToc items={ITEMS} />)
    const desktop = screen.getByRole("navigation", { name: "Sumário" })
    const links = within(desktop).getAllByRole("link")
    expect(links.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["Resumo", "#resumo"],
      ["Contexto", "#contexto"],
      ["O que eu fiz", "#o-que-eu-fiz"],
    ])
  })

  it("CA-2: só o item atual tem aria-current=location", () => {
    render(<CaseToc items={ITEMS} current="contexto" />)
    const desktop = screen.getByRole("navigation", { name: "Sumário" })
    const current = within(desktop)
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "location")
    expect(current.map((l) => l.textContent)).toEqual(["Contexto"])
  })

  it("CA-2: rolar até uma seção marca o item dela (observador)", async () => {
    const observers = stubObserver()
    for (const { id } of ITEMS) {
      const el = document.createElement("section")
      el.id = id
      document.body.append(el)
    }
    render(<CaseToc items={ITEMS} />)
    const target = document.getElementById("o-que-eu-fiz") as HTMLElement
    await act(async () => {
      observers[0]?.callback([{ target, isIntersecting: true }])
    })
    const desktop = screen.getByRole("navigation", { name: "Sumário" })
    expect(within(desktop).getByRole("link", { name: "O que eu fiz" })).toHaveAttribute(
      "aria-current",
      "location",
    )
    for (const { id } of ITEMS) document.getElementById(id)?.remove()
  })

  it("CA-3: no celular, o bloco abre pelo botão Sumário e Esc fecha devolvendo o foco", async () => {
    const user = userEvent.setup()
    const { container } = render(<CaseToc items={ITEMS} />)
    const details = container.querySelector("details") as HTMLDetailsElement
    const summary = within(details).getByText("Sumário").closest("summary") as HTMLElement
    expect(details.open).toBe(false)
    await user.click(summary)
    expect(details.open).toBe(true)
    await user.keyboard("{Escape}")
    expect(details.open).toBe(false)
    expect(summary).toHaveFocus()
  })

  it("CA-3: escolher um link fecha o bloco", async () => {
    const user = userEvent.setup()
    const { container } = render(<CaseToc items={ITEMS} />)
    const details = container.querySelector("details") as HTMLDetailsElement
    details.open = true
    await user.click(within(details).getByRole("link", { name: "Contexto" }))
    expect(details.open).toBe(false)
  })

  it("CA-4: coluna fixa só a partir de lg; bloco recolhível só abaixo", () => {
    render(<CaseToc items={ITEMS} />)
    const desktop = screen.getByRole("navigation", { name: "Sumário" })
    const mobile = screen.getByRole("navigation", { name: "Sumário do caso" })
    expect(desktop.className).toMatch(/\bhidden\b/)
    expect(desktop.className).toMatch(/lg:sticky/)
    expect(desktop.className).toMatch(/lg:block/)
    expect(mobile.className).toMatch(/lg:hidden/)
  })

  it("CA-6: todo link tem alvo de 44 px ou mais (min-h-11) e o resumo também", () => {
    const { container } = render(<CaseToc items={ITEMS} />)
    for (const a of container.querySelectorAll("a"))
      expect(a.className).toMatch(/min-h-11/)
    expect(container.querySelector("summary")?.className).toMatch(/min-h-11/)
  })

  it("CA-7: sem violações de acessibilidade", async () => {
    const { container } = render(
      <main>
        <CaseToc items={ITEMS} current="resumo" />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
