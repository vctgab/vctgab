import type { Metadata } from "next"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Icon } from "@/components/ui/icon"
import { formatNumber } from "@/lib/format"
import tokens from "@/styles/tokens.generated.json"
import { ScrollRegion } from "../_showcase/scroll-region"
import { ThemeOnly, ThemeOnlyStyle } from "../_showcase/theme-only"

export const metadata: Metadata = { title: "Cores" }

const SCALE_LABEL: Record<string, string> = {
  primary: "Primária",
  "secondary-1": "Secundária 1",
  "secondary-2": "Secundária 2",
  success: "Sucesso",
  warning: "Atenção",
  danger: "Perigo",
}

const ratio = (n: number) => `${formatNumber(n, { decimals: true })}:1`

interface Step {
  step: number
  token: string
  hex: string
  mix: string
  vsPaper: number
  vsInk: number
}

function Scale({ name, steps }: { name: string; steps: Step[] }) {
  return (
    <section aria-labelledby={`escala-${name}`} className="flex flex-col gap-3">
      <h3 id={`escala-${name}`} className="text-h3">
        {SCALE_LABEL[name] ?? name}
      </h3>
      <ol className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
        {steps.map((s) => (
          <li key={s.token} className="flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="block h-12 w-full border border-border forced-colors:border-[CanvasText]"
              style={{ backgroundColor: `var(--${s.token})` }}
            />
            <span className="font-mono text-label text-ink">{s.step}</span>
            <span className="font-mono text-label text-ink-muted">{s.hex}</span>
            <span className="text-sm text-ink-subtle">{s.mix}</span>
            <span className="font-mono text-label text-ink-subtle">
              papel {ratio(s.vsPaper)}
            </span>
            <span className="font-mono text-label text-ink-subtle">
              tinta {ratio(s.vsInk)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function CoresPage() {
  return (
    <main id="conteudo" className="py-12">
      <ThemeOnlyStyle />
      <Eyebrow>Fundamentos</Eyebrow>
      <h1 className="mt-4 text-h1">Cores</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Uma semente por escala; os 11 passos saem de branco ou preto misturados em sRGB.
        As amostras usam os próprios tokens e mudam com o tema. Hex e contrastes foram
        calculados no build por{" "}
        <code className="font-mono text-sm">pnpm tokens:build</code>.
      </p>

      {tokens.themes.map((theme) => (
        <ThemeOnly key={theme.id} id={theme.id}>
          <div className="mt-12 flex flex-col gap-14">
            <p className="font-mono text-label text-ink-subtle">
              Tema {theme.label}: {theme.description}
            </p>

            <section
              aria-labelledby={`escalas-${theme.id}`}
              className="flex flex-col gap-10"
            >
              <h2 id={`escalas-${theme.id}`} className="text-h2">
                Escalas
              </h2>
              {Object.entries(theme.scales).map(([name, steps]) => (
                <Scale key={name} name={name} steps={steps} />
              ))}
              <section
                aria-labelledby={`neutros-${theme.id}`}
                className="flex flex-col gap-3"
              >
                <h3 id={`neutros-${theme.id}`} className="text-h3">
                  Neutros
                </h3>
                <ol className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
                  {theme.neutrals.map((s) => (
                    <li key={s.token} className="flex flex-col gap-1.5">
                      <span
                        aria-hidden="true"
                        className="block h-12 w-full border border-border"
                        style={{ backgroundColor: `var(--${s.token})` }}
                      />
                      <span className="font-mono text-label text-ink">{s.step}</span>
                      <span className="font-mono text-label text-ink-muted">{s.hex}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </section>

            <section
              aria-labelledby={`semantica-${theme.id}`}
              className="flex flex-col gap-4"
            >
              <h2 id={`semantica-${theme.id}`} className="text-h2">
                Tokens semânticos
              </h2>
              <p className="max-w-measure text-body text-ink-muted">
                Componentes só usam estes nomes. Nenhum componente usa um passo cru.
              </p>
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
                {Object.entries(theme.semantic).map(([token, hex]) => (
                  <li key={token} className="flex min-h-9 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="block size-6 shrink-0 border border-border-strong"
                      style={{ backgroundColor: `var(--${token})` }}
                    />
                    <span className="font-mono text-sm text-ink">{token}</span>
                    <span className="ms-auto font-mono text-label text-ink-subtle">
                      {hex}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby={`matriz-${theme.id}`}
              className="flex flex-col gap-4"
            >
              <h2 id={`matriz-${theme.id}`} className="text-h2">
                Matriz de contraste
              </h2>
              <ScrollRegion label={`Matriz de contraste do tema ${theme.label}`}>
                <table className="w-full min-w-xl border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Pares obrigatórios de contraste do tema {theme.label}
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-border font-mono text-label text-ink-subtle">
                      <th scope="col" className="py-2 pe-4">
                        Par
                      </th>
                      <th scope="col" className="py-2 pe-4">
                        Uso
                      </th>
                      <th scope="col" className="py-2 pe-4">
                        Mínimo
                      </th>
                      <th scope="col" className="py-2 pe-4">
                        Razão
                      </th>
                      <th scope="col" className="py-2">
                        Resultado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {theme.pairs.map((p) => (
                      <tr key={`${p.fg}-${p.bg}`} className="border-b border-border">
                        <td className="py-2 pe-4 font-mono">
                          {p.fg} sobre {p.bg}
                        </td>
                        <td className="py-2 pe-4 text-ink-muted">{p.uso}</td>
                        <td className="py-2 pe-4 font-mono">{ratio(p.min)}</td>
                        <td className="py-2 pe-4 font-mono">{ratio(p.ratio)}</td>
                        <td className="py-2">
                          <span
                            className={
                              p.pass
                                ? "inline-flex items-center gap-1.5 text-success-text"
                                : "inline-flex items-center gap-1.5 text-danger-text"
                            }
                          >
                            <Icon
                              name={p.pass ? "check" : "alerta"}
                              size={16}
                              decorative
                            />
                            {p.pass ? "aprovado" : "reprovado"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollRegion>
            </section>
          </div>
        </ThemeOnly>
      ))}
    </main>
  )
}
