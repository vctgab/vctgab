import type { Metadata } from "next"
import { SCENES } from "@/components/footer-scene"
import { Button } from "@/components/ui/button"
import { Ficha } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Icon } from "@/components/ui/icon"
import { LinkText } from "@/components/ui/link-text"
import { Switch } from "@/components/ui/switch"
import { Tag } from "@/components/ui/tag"
import { TextField } from "@/components/ui/text-field"
import { formatNumber } from "@/lib/format"
import { MODES } from "@/lib/theme/themes"
import tokens from "@/styles/tokens.generated.json"
import { ScrollRegion } from "../_showcase/scroll-region"

export const metadata: Metadata = { title: "Temas" }

type Combo = (typeof tokens.themes)[number]

const KIND_LABEL: Record<string, string> = {
  texto: "Texto",
  "texto-grande": "Texto grande",
  componente: "Componente",
  foco: "Foco",
  desabilitado: "Desabilitado",
}

/** Matriz de contraste da combinação: cada par com o mínimo, a razão e o resultado. */
function ContrastMatrix({ theme }: { theme: Combo }) {
  const failed = theme.pairs.filter((p) => !p.pass).length
  return (
    <details className="group/matriz flex flex-col gap-3">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-body font-medium text-primary-text">
        Matriz de contraste: {formatNumber(theme.pairs.length)} pares,{" "}
        {failed === 0 ? "todos aprovados" : `${formatNumber(failed)} reprovados`}
      </summary>
      <ScrollRegion label={`Matriz de contraste de ${theme.label}`}>
        <table className="w-full min-w-md border-collapse text-left text-sm">
          <caption className="sr-only">Pares de contraste de {theme.label}</caption>
          <thead>
            <tr className="border-b-2 border-border font-mono text-label text-ink-subtle">
              <th scope="col" className="py-2 pe-3">
                Par
              </th>
              <th scope="col" className="py-2 pe-3">
                Tipo
              </th>
              <th scope="col" className="py-2 pe-3">
                Mínimo
              </th>
              <th scope="col" className="py-2 pe-3">
                Razão
              </th>
              <th scope="col" className="py-2">
                Resultado
              </th>
            </tr>
          </thead>
          <tbody>
            {theme.pairs.map((p) => (
              <tr key={`${p.fg}/${p.bg}`} className="border-b border-border">
                <th scope="row" className="py-2 pe-3 font-normal">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="grid size-5 shrink-0 place-items-center border border-border-strong"
                      style={{ backgroundColor: `var(--${p.bg})` }}
                    >
                      <span
                        className="block size-2.5"
                        style={{ backgroundColor: `var(--${p.fg})` }}
                      />
                    </span>
                    <span className="font-mono text-label">
                      {p.fg} sobre {p.bg}
                    </span>
                  </span>
                </th>
                <td className="py-2 pe-3">{KIND_LABEL[p.kind] ?? p.kind}</td>
                <td className="py-2 pe-3 font-mono">
                  {formatNumber(p.min, { decimals: true })}:1
                </td>
                <td className="py-2 pe-3 font-mono">
                  {formatNumber(p.ratio, { decimals: true })}:1
                </td>
                <td className="py-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon
                      name={p.pass ? "check" : "alerta"}
                      size={16}
                      label={p.pass ? "Aprovado" : "Reprovado"}
                      className={p.pass ? "text-success-text" : "text-danger-text"}
                    />
                    {p.pass ? "Aprovado" : "Reprovado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>
    </details>
  )
}

function ComboCard({ theme }: { theme: Combo }) {
  const id = theme.id
  return (
    <section
      data-season={theme.season}
      data-mode={theme.mode}
      aria-labelledby={`tema-${id}`}
      className="flex h-full flex-col gap-5 border-2 border-border bg-surface-base p-5 text-ink"
    >
      <div className="flex flex-col gap-1">
        <h3 id={`tema-${id}`} className="text-h3">
          {theme.label}
        </h3>
        <p className="text-sm text-ink-muted">{theme.description}</p>
        <p className="font-mono text-label text-ink-subtle">
          Rodapé: {SCENES[theme.season]?.descricao}
          {theme.mode === "escuro" ? " À noite, com lua e estrelas." : ""}
        </p>
        <p className="font-mono text-label text-ink-subtle">
          Energia {theme.energy}, rotação {theme.rotationMax}°.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="sm" seed={`tema:${id}:primario`}>
          Enviar mensagem
        </Button>
        <Button size="sm" variant="secondary" seed={`tema:${id}:secundario`}>
          Mais sobre mim
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>React</Tag>
        <Tag tone="primary">Design system</Tag>
        <Chip defaultPressed seed={`tema:${id}:chip`}>
          Next.js
        </Chip>
      </div>
      <TextField
        label="E-mail"
        name={`email-${id}`}
        id={`email-${id}`}
        error="Informe um e-mail com @."
        defaultValue="nome-exemplo.com"
      />
      <Switch label="Animações do hero" defaultChecked seed={`tema:${id}:switch`} />
      <Ficha
        title="Projeto fictício"
        eyebrow="01"
        seed={`tema:${id}:ficha`}
        rotate={false}
      >
        Projeto para [a confirmar: cliente]
      </Ficha>
      <LinkText href="/sistema/cores">Ver as escalas de cor</LinkText>
      <ContrastMatrix theme={theme} />
    </section>
  )
}

export default function TemasPage() {
  return (
    <main id="conteudo" className="py-12">
      <Eyebrow>Composições</Eyebrow>
      <h1 className="mt-4 text-h1">Temas</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Quatro estações, cada uma clara e escura: as 8 combinações lado a lado, com o
        mesmo conjunto de componentes e a matriz de contraste de cada uma. Cada coluna tem
        o próprio <code className="font-mono text-sm">data-season</code> e{" "}
        <code className="font-mono text-sm">data-mode</code>: as escalas e os tokens se
        recalculam a partir das sementes da estação, sem tocar nos componentes.
      </p>
      {MODES.map((mode) => (
        <section key={mode.id} aria-labelledby={`modo-${mode.id}`} className="mt-12">
          <h2 id={`modo-${mode.id}`} className="text-h2">
            Modo {mode.label.toLowerCase()}
          </h2>
          <ul className="mt-6 grid items-start gap-6 md:grid-cols-2 2xl:grid-cols-4">
            {tokens.themes
              .filter((t) => t.mode === mode.id)
              .map((t) => (
                <li key={t.id}>
                  <ComboCard theme={t} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
