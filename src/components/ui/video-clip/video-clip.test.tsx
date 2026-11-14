import { fireEvent, render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { pending } from "@/content/pending"
import { VideoClip } from "."

// Vídeo e legenda fictícios: o arquivo não existe, só o atributo importa aqui.
const VIDEO = "/videos/ficticio.mp4"
const LEGENDA = "/videos/ficticio.vtt"

function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

describe("VideoClip", () => {
  let play: ReturnType<typeof vi.fn>
  beforeEach(() => {
    play = vi.fn(() => Promise.resolve())
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: play,
    })
    setReducedMotion(false)
  })

  it("CA-1: pendente vira Ficha marcada, sem <video>", async () => {
    const { container } = render(
      <VideoClip
        title="Projeto fictício em 30 segundos"
        seed="t1"
        src={pending("vídeo do projeto fictício")}
        captions={pending("legenda")}
      />,
    )
    expect(
      screen.getByText("[a confirmar: vídeo do projeto fictício]"),
    ).toBeInTheDocument()
    expect(container.querySelector("video")).toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("CA-2: sem vídeo, diz que o projeto ainda não tem", () => {
    render(<VideoClip title="Projeto fictício" seed="t2" src={null} captions="" />)
    expect(screen.getByText("Este projeto ainda não tem vídeo.")).toBeInTheDocument()
  })

  it("CA-3 e CA-5: carrega com controles, sem som, legenda pt-BR e nome", async () => {
    const { container } = render(
      <VideoClip title="Projeto fictício" seed="t3" src={VIDEO} captions={LEGENDA} />,
    )
    const video = container.querySelector("video") as HTMLVideoElement
    expect(screen.getByText("Carregando vídeo")).toBeInTheDocument()
    expect(video).toHaveAttribute("controls")
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute("playsinline")
    expect(video).toHaveAccessibleName("Projeto fictício")
    const track = container.querySelector("track")
    expect(track).toHaveAttribute("kind", "captions")
    expect(track).toHaveAttribute("srclang", "pt-BR")
    fireEvent(video, new Event("loadeddata"))
    expect(screen.queryByText("Carregando vídeo")).toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("CA-4 e CA-7: erro inline com 'Não foi possível', sem violação", async () => {
    const { container } = render(
      <VideoClip title="Projeto fictício" seed="t4" src={VIDEO} captions={LEGENDA} />,
    )
    fireEvent.error(container.querySelector("video") as HTMLVideoElement)
    expect(screen.getByRole("alert")).toHaveTextContent(
      /^Não foi possível carregar o vídeo\./,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("CA-6: movimento permitido reproduz; reduzido não", () => {
    render(<VideoClip title="A" seed="t5" src={VIDEO} captions={LEGENDA} />)
    expect(play).toHaveBeenCalledTimes(1)
    play.mockClear()
    setReducedMotion(true)
    render(<VideoClip title="B" seed="t6" src={VIDEO} captions={LEGENDA} />)
    expect(play).not.toHaveBeenCalled()
  })
})
