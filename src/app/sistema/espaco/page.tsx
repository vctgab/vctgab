import type { Metadata } from "next"
import { Eyebrow } from "@/components/ui/eyebrow"
import { formatNumber } from "@/lib/format"

export const metadata: Metadata = { title: "Espaço e movimento" }

/** Passos da escala de 4 px exibidos (classes estáticas para o Tailwind). */
const SPACING = [
  { passo: 1, classe: "w-1" },
  { passo: 2, classe: "w-2" },
  { passo: 3, classe: "w-3" },
  { passo: 4, classe: "w-4" },
  { passo: 6, classe: "w-6" },
  { passo: 8, classe: "w-8" },
  { passo: 10, classe: "w-10" },
  { passo: 12, classe: "w-12" },
  { passo: 16, classe: "w-16" },
  { passo: 24, classe: "w-24" },
  { passo: 32, classe: "w-32" },
] as const

const SHADOWS = [
  { nome: "sm", classe: "shadow-sm", px: 2 },
  { nome: "md", classe: "shadow-md", px: 4 },
  { nome: "lg", classe: "shadow-lg", px: 6 },
] as const

const DURATIONS = [
  {
    token: "--duration-instant",
    ms: 120,
    uso: "pressionar, hover",
    classe: "duration-(--duration-instant)",
  },
  {
    token: "--duration-state",
    ms: 200,
    uso: "mudança de estado (máximo)",
    classe: "duration-(--duration-state)",
  },
  {
    token: "--duration-slow",
    ms: 320,
    uso: "entradas decorativas",
    classe: "duration-(--duration-slow)",
  },
  {
    token: "--duration-scene",
    ms: 600,
    uso: "cenas",
    classe: "duration-(--duration-scene)",
  },
] as const

const LAYERS = [
  "--z-below",
  "--z-base",
  "--z-raised",
  "--z-sticky",
  "--z-header",
  "--z-dock",
  "--z-popover",
  "--z-overlay",
  "--z-dialog",
  "--z-toast",
  "--z-skip",
] as const

export default function EspacoPage() {
  return (
    <main id="conteudo" className="py-12">
      <Eyebrow>Fundamentos</Eyebrow>
      <h1 className="mt-4 text-h1">Espaço e movimento</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Espaçamento em base de 4 px, sombras duras sem desfoque, durações curtas para
        estados e uma escala nomeada de camadas. Não existe token de raio: o
        arredondamento vem do motor de formas.
      </p>

      <section aria-labelledby="espacamento" className="mt-12 flex flex-col gap-4">
        <h2 id="espacamento" className="text-h2">
          Espaçamento
        </h2>
        <ul className="flex flex-col gap-2">
          {SPACING.map((s) => (
            <li key={s.passo} className="flex items-center gap-4">
              <span className="w-24 shrink-0 font-mono text-label text-ink-subtle">
                {s.passo} · {formatNumber(s.passo * 4)} px
              </span>
              <span aria-hidden="true" className={`${s.classe} h-4 bg-primary-decor`} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sombras" className="mt-16 flex flex-col gap-4">
        <h2 id="sombras" className="text-h2">
          Sombras duras
        </h2>
        <ul className="flex flex-wrap gap-8">
          {SHADOWS.map((s) => (
            <li key={s.nome} className="flex flex-col items-start gap-3">
              <span
                aria-hidden="true"
                className={`${s.classe} block size-24 border-2 border-stroke bg-surface-raised`}
              />
              <span className="font-mono text-label text-ink-subtle">
                {s.nome} · {formatNumber(s.px)} px, sem desfoque
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="movimento" className="mt-16 flex flex-col gap-4">
        <h2 id="movimento" className="text-h2">
          Movimento
        </h2>
        <p className="max-w-measure text-body text-ink-muted">
          Passe o ponteiro ou o foco em cada linha. Estados mudam em até 200 ms com o
          easing <code className="font-mono text-sm">--motion-ease-hand</code> (leve
          overshoot). Com movimento reduzido, nada se desloca.
        </p>
        <ul className="flex flex-col gap-3">
          {DURATIONS.map((d) => (
            <li key={d.token}>
              <button
                type="button"
                className="group/dur flex min-h-12 w-full max-w-xl cursor-pointer items-center gap-4 border-b-2 border-dashed border-border text-left"
              >
                <span className="w-56 shrink-0 font-mono text-label text-ink-subtle">
                  {d.token} · {formatNumber(d.ms)} ms
                </span>
                <span className="text-sm text-ink-muted">{d.uso}</span>
                <span
                  aria-hidden="true"
                  className={`ms-auto block size-5 bg-primary-decor transition-[translate] ease-hand group-hover/dur:-translate-x-16 group-focus-visible/dur:-translate-x-16 motion-reduce:translate-x-0 ${d.classe}`}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="camadas" className="mt-16 flex flex-col gap-4">
        <h2 id="camadas" className="text-h2">
          Camadas
        </h2>
        <ol className="flex flex-wrap gap-2">
          {LAYERS.map((z) => (
            <li key={z} className="border-2 border-border px-3 py-1.5 font-mono text-sm">
              {z}
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
