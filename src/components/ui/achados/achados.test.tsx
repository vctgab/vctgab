import { act, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { ACHADOS } from "@/lib/achados/achados"
import {
  __resetAchadosStore,
  ACHADOS_COMPLETE_EVENT,
  ACHADOS_STORAGE_KEY,
} from "@/lib/achados/store"
import {
  AchadosCardBody,
  AchadosChip,
  AchadosProvider,
  Achavel,
  AvisoPaginaSecreta,
  useAchados,
} from "."

function Pagina() {
  return (
    <AchadosProvider>
      <Achavel id="pinha" label="Algo entre as formas do hero">
        <svg width="24" height="24" />
      </Achavel>
      <AchadosChip placement="inline" />
      <AvisoPaginaSecreta />
    </AchadosProvider>
  )
}

beforeEach(() => {
  __resetAchadosStore()
})

describe("Achados", () => {
  it("CA-1: achar atualiza a contagem, persiste e anuncia", async () => {
    const user = userEvent.setup()
    render(<Pagina />)
    expect(screen.getByRole("button", { name: /Achados: 0 de 7/ })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Algo entre as formas do hero" }))
    expect(screen.getByRole("button", { name: /Achados: 1 de 7/ })).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(ACHADOS_STORAGE_KEY) ?? "[]")).toEqual([
      "pinha",
    ])
    expect(document.querySelector("[data-anuncio-achados]")).toHaveTextContent(
      "Achado: pinha escondida. 1 de 7.",
    )
  })

  it("CA-6: Achavel tem alvo de 44 px, nome e aria-pressed", async () => {
    const user = userEvent.setup()
    render(<Pagina />)
    const achavel = screen.getByRole("button", { name: "Algo entre as formas do hero" })
    expect(achavel.className).toMatch(/min-h-11/)
    expect(achavel).toHaveAttribute("aria-pressed", "false")
    await user.click(achavel)
    const achado = screen.getByRole("button", { name: "Pinha escondida, achado" })
    expect(achado).toHaveAttribute("aria-pressed", "true")
  })

  it("CA-2: sem armazenamento, funciona na sessão e avisa no caderno", async () => {
    const user = userEvent.setup()
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado")
    })
    render(<Pagina />)
    await user.click(screen.getByRole("button", { name: "Algo entre as formas do hero" }))
    expect(screen.getByRole("button", { name: /Achados: 1 de 7/ })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /Achados: 1 de 7/ }))
    const dialog = await screen.findByRole("dialog", { name: "Caderno de achados" })
    expect(within(dialog).getByRole("alert")).toHaveTextContent(
      "Não foi possível guardar os achados neste navegador.",
    )
    setItem.mockRestore()
  })

  it("CA-3: em 7 de 7 dispara o evento e libera a página secreta", () => {
    const onComplete = vi.fn()
    window.addEventListener(ACHADOS_COMPLETE_EVENT, onComplete)
    function AcharTodos() {
      const { find, unlocked } = useAchados()
      return (
        <>
          <button type="button" onClick={() => ACHADOS.forEach((a) => find(a.id))}>
            Achar todos (teste)
          </button>
          <p>{unlocked ? "liberada" : "bloqueada"}</p>
        </>
      )
    }
    render(
      <AchadosProvider>
        <AcharTodos />
        <AvisoPaginaSecreta />
      </AchadosProvider>,
    )
    expect(
      screen.getByText("Esta página abre com 7 achados. Você tem 0."),
    ).toBeInTheDocument()
    act(() => {
      screen.getByRole("button", { name: "Achar todos (teste)" }).click()
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText("liberada")).toBeInTheDocument()
    expect(screen.getByText(/Página secreta liberada/)).toBeInTheDocument()
    window.removeEventListener(ACHADOS_COMPLETE_EVENT, onComplete)
  })

  it("CA-4: o chip abre o caderno e o Esc devolve o foco", async () => {
    const user = userEvent.setup()
    render(<Pagina />)
    const chip = screen.getByRole("button", { name: /Achados: 0 de 7/ })
    await user.click(chip)
    expect(
      await screen.findByRole("dialog", { name: "Caderno de achados" }),
    ).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(chip).toHaveFocus()
  })

  it("CA-5: estados carregando, vazio e com dados no caderno", () => {
    const { rerender } = render(<AchadosCardBody state={null} />)
    expect(screen.getByRole("status")).toHaveTextContent("Lendo o caderno")
    rerender(<AchadosCardBody state={{ found: [], storage: "ok" }} />)
    expect(
      screen.getByText("Nenhum achado ainda. As dicas abaixo ajudam a começar."),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Ainda não achado:/)).toHaveLength(7)
    rerender(<AchadosCardBody state={{ found: ["pinha", "coruja"], storage: "ok" }} />)
    expect(screen.getByText("Pinha escondida")).toBeInTheDocument()
    expect(
      screen.getByRole("progressbar", { name: "Progresso dos achados" }),
    ).toHaveAttribute("aria-valuetext", "2 de 7")
  })

  it("CA-7: sem violações", async () => {
    const { container } = render(<Pagina />)
    expect(await axe(container)).toHaveNoViolations()
    const card = render(
      <AchadosCardBody state={{ found: ["mesa"], storage: "indisponivel" }} />,
    )
    expect(await axe(card.container)).toHaveNoViolations()
  })
})
