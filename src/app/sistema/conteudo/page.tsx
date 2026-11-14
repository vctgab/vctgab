import type { Metadata } from "next"
import { Accordion } from "@/components/ui/accordion"
import { Divider } from "@/components/ui/divider"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Ficha } from "@/components/ui/card"
import { LiveClock } from "@/components/ui/live-clock"
import { Marquee } from "@/components/ui/marquee"
import { Polaroid } from "@/components/ui/polaroid"
import { ProgressHatch } from "@/components/ui/progress-hatch"
import { Reveal } from "@/components/ui/reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { Stat } from "@/components/ui/stat"
import { TerminalShell } from "@/components/ui/terminal-shell"
import { Fact } from "@/components/ui/fact"
import { VideoClip } from "@/components/ui/video-clip"
import { pending } from "@/content/pending"
import { formatNumber, formatPercent } from "@/lib/format"
import { Demo, Row } from "../_showcase/demo"
import { QuoteDemo } from "../_showcase/demos-client"

export const metadata: Metadata = { title: "Conteúdo e movimento" }

const FICHAS = ["A", "B", "C", "D"].map((letra, i) => ({
  letra,
  numero: `0${i + 1}`,
}))

export default function ConteudoPage() {
  return (
    <main id="conteudo">
      <div className="py-12">
        <Eyebrow>Vitrine</Eyebrow>
        <h1 className="mt-4 text-h1">Conteúdo e movimento</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
          Componentes P1: divisores, progresso, polaroids, números com método,
          depoimentos, faixa em laço, entrada ao rolar, relógio, perguntas e o terminal.
          Os dados são fictícios.
        </p>

        <Demo id="divider" title="Divider">
          <Divider />
          <Divider variant="solid" seed="divisor-solido" />
        </Demo>

        <Demo id="progress" title="ProgressHatch">
          <div className="grid max-w-md gap-6">
            <ProgressHatch value={0} max={7} label="Progresso de exemplo vazio" />
            <ProgressHatch value={3} max={7} label="Progresso de exemplo parcial" />
            <ProgressHatch value={7} max={7} label="Progresso de exemplo completo" />
          </div>
        </Demo>

        <Demo id="polaroid" title="Polaroid">
          <div className="grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-3">
            <Polaroid
              seed="polaroid-1"
              placeholder="[a confirmar: foto 1]"
              caption="Teresina, fim de tarde"
            />
            <Polaroid
              seed="polaroid-2"
              placeholder="[a confirmar: foto 2]"
              caption="Quadro de rascunhos"
            />
            <Polaroid
              seed="polaroid-3"
              placeholder="[a confirmar: foto 3]"
              tape={false}
            />
          </div>
        </Demo>

        <Demo
          id="stat"
          title="Stat"
          description="Número grande sempre com o método. Sem método, o componente não compila."
        >
          <Stat
            from={formatPercent(34)}
            value={formatPercent(89)}
            method="Taxa de acerto em teste de árvore, antes e depois da nova navegação (exemplo fictício da vitrine)."
          />
        </Demo>

        <Demo
          id="fact"
          title="Fact"
          description="Valor do conteúdo ou a pendência exata, destacada com fundo e sublinhado tracejado."
        >
          <div className="flex flex-col gap-2 text-body">
            <p>
              Agenda de <Fact value="dezembro" /> aberta (valor fictício confirmado).
            </p>
            <p>
              Agenda de <Fact value={pending("mês da agenda aberta")} /> aberta.
            </p>
          </div>
        </Demo>

        <Demo
          id="video-clip"
          title="VideoClip"
          description="Vídeo curto sem som, com legenda e controles. Pendente, vira Ficha marcada; nunca um player vazio. Não há vídeo real no repositório: os estados com vídeo, carregando e erro são cobertos pelo teste."
        >
          <div className="grid gap-8 md:grid-cols-2">
            <VideoClip
              title="Indisponível"
              seed="vitrine:pendente"
              src={pending("vídeo do projeto fictício")}
              captions={pending("legenda")}
            />
            <VideoClip title="Vazio" seed="vitrine:vazio" src={null} captions="" />
          </div>
        </Demo>

        <Demo
          id="quote"
          title="Quote"
          description="Depoimentos com troca entre depoentes e os cinco estados."
        >
          <QuoteDemo />
        </Demo>

        <Demo
          id="marquee"
          title="Marquee"
          description="Pausa com o ponteiro, o foco ou o toque. Com movimento reduzido, vira rolagem manual."
        >
          <Marquee label="Projetos em destaque (exemplo)">
            {FICHAS.map((f) => (
              <Ficha
                key={f.letra}
                seed={`faixa-${f.letra}`}
                title={`Projeto fictício ${f.letra}`}
                eyebrow={f.numero}
                href="/sistema/conteudo#marquee"
                tape={f.letra === "A" || f.letra === "C" ? "left" : "right"}
                className="w-72"
              >
                Projeto para [a confirmar: cliente]
              </Ficha>
            ))}
          </Marquee>
        </Demo>

        <Demo id="reveal" title="Reveal">
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((d) => (
              <Reveal key={d} delay={d as 0 | 1 | 2}>
                <Ficha seed={`reveal-${d}`} title={`Bloco ${d + 1}`} rotate={false}>
                  Entra ao rolar, com {formatNumber(d * 80)} ms de atraso.
                </Ficha>
              </Reveal>
            ))}
          </div>
        </Demo>

        <Demo id="live-clock" title="LiveClock">
          <p className="font-mono text-sm text-ink-muted">
            Teresina • Brasil <LiveClock className="ms-3 text-ink" />
          </p>
        </Demo>

        <Demo id="skeleton" title="Skeleton">
          <Row label="Bloco e linhas">
            <Skeleton heightClass="h-32" className="max-w-xs" seed="vitrine-bloco" />
            <Skeleton shape="linha" lines={3} className="w-64" seed="vitrine-linhas" />
          </Row>
        </Demo>

        <Demo id="accordion" title="Accordion">
          <Accordion
            className="max-w-2xl"
            items={[
              {
                value: "prazo",
                title: "Quanto tempo leva um projeto?",
                content: "[a confirmar: prazos médios por tipo de projeto]",
              },
              {
                value: "stack",
                title: "Quais tecnologias você usa?",
                content:
                  "React, Next.js, TypeScript e Tailwind CSS, com testes e um design system.",
              },
              {
                value: "design",
                title: "Você também desenha a interface?",
                content:
                  "Sim. Do protótipo ao componente, com tokens, handoff e QA visual.",
              },
            ]}
          />
        </Demo>

        <Demo
          id="terminal"
          title="TerminalShell"
          description="Só a moldura. Os comandos entram depois."
        >
          <TerminalShell className="max-w-2xl" />
        </Demo>
      </div>
    </main>
  )
}
