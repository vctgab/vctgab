import type { Metadata } from "next"
import { Eyebrow } from "@/components/ui/eyebrow"

export const metadata: Metadata = { title: "Tipografia" }

const PARAGRAFO =
  "Ação, coração e informação: a tipografia precisa aguentar acentos, cedilha e til sem perder o ritmo. Em Teresina, às três da tarde, o sol de outubro não perdoa nem o tipo mais robusto."

const ESCALA = [
  {
    classe: "text-display",
    nome: "Display",
    spec: "clamp(2,75rem, 1,6rem + 5,2vw, 5,5rem) · 1,02 · −0,02em",
    fonte: "font-display font-soft",
  },
  {
    classe: "text-h1",
    nome: "H1",
    spec: "clamp(2,25rem, 1,5rem + 3,2vw, 4rem) · 1,05",
    fonte: "font-display font-soft",
  },
  {
    classe: "text-h2",
    nome: "H2",
    spec: "clamp(1,75rem, 1,3rem + 1,9vw, 2,75rem) · 1,1",
    fonte: "font-display font-soft",
  },
  {
    classe: "text-h3",
    nome: "H3",
    spec: "clamp(1,375rem, 1,2rem + 0,8vw, 1,75rem) · 1,2",
    fonte: "font-display font-soft",
  },
  {
    classe: "text-body-lg",
    nome: "Corpo grande",
    spec: "1,1875rem · 1,6",
    fonte: "font-sans",
  },
  {
    classe: "text-body",
    nome: "Corpo",
    spec: "1rem · 1,65 (nunca menos de 16 px)",
    fonte: "font-sans",
  },
  { classe: "text-sm", nome: "Pequeno", spec: "0,875rem · 1,5", fonte: "font-sans" },
  {
    classe: "text-label",
    nome: "Rótulo mono",
    spec: "0,75rem · 1,3 · 0,04em",
    fonte: "font-mono",
  },
] as const

export default function TipografiaPage() {
  return (
    <main id="conteudo" className="py-12">
      <Eyebrow>Fundamentos</Eyebrow>
      <h1 className="mt-4 text-h1">Tipografia</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Cinco famílias, cada uma com um papel. Títulos com equilíbrio de linhas,
        parágrafos sem viúvas, largura máxima de leitura de 65 caracteres e hifenização
        automática no corpo.
      </p>

      <section aria-labelledby="familias" className="mt-12 flex flex-col gap-8">
        <h2 id="familias" className="text-h2">
          Famílias
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label text-ink-subtle">
              Fraunces · títulos (SOFT 100)
            </p>
            <p className="font-soft font-display text-h2">
              Front-end com visão de produto.
            </p>
            <p className="font-wonk font-display text-h3">Com WONK, só em destaques.</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label text-ink-subtle">
              DM Sans · corpo e interface
            </p>
            <p className="max-w-measure text-body">{PARAGRAFO}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label text-ink-subtle">
              JetBrains Mono · rótulos e terminal
            </p>
            <p className="font-mono text-sm">
              Teresina • Brasil · 17:25 · <span aria-hidden="true">&gt;_</span> cmd
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label text-ink-subtle">
              Caveat · anotações (mín. 20 px)
            </p>
            <p className="font-hand text-hand text-primary-text">
              design que o código aguenta
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label text-ink-subtle">
              Patrick Hand · etiquetas pontuais
            </p>
            <p className="font-marker text-marker">Vamos conversar</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="escala" className="mt-16 flex flex-col gap-8">
        <h2 id="escala" className="text-h2">
          Escala fluida
        </h2>
        <ul className="flex flex-col gap-8">
          {ESCALA.map((e) => (
            <li
              key={e.classe}
              className="flex flex-col gap-1 border-b-2 border-dashed border-border pb-6"
            >
              <p className="font-mono text-label text-ink-subtle">
                {e.nome} · {e.classe} · {e.spec}
              </p>
              <p className={`${e.classe} ${e.fonte}`}>
                Ação e informação na medida certa
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="regras-texto" className="mt-16 flex flex-col gap-4">
        <h2 id="regras-texto" className="text-h2">
          Regras
        </h2>
        <ul className="flex max-w-measure list-disc flex-col gap-2 ps-5 text-body text-ink-muted">
          <li>
            Só a primeira letra maiúscula em títulos, botões e rótulos, exceto siglas e
            nomes próprios.
          </li>
          <li>Nada de caixa-alta forçada em títulos.</li>
          <li>Caveat só em anotações e dicas curtas, nunca em parágrafos.</li>
          <li>
            Corpo nunca abaixo de 16 px; campos de formulário também, para não dar zoom no
            celular.
          </li>
        </ul>
      </section>
    </main>
  )
}
