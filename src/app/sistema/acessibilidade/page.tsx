import type { Metadata } from "next"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Icon } from "@/components/ui/icon"
import { LinkText } from "@/components/ui/link-text"
import { formatNumber } from "@/lib/format"
import tokens from "@/styles/tokens.generated.json"
import { ScrollRegion } from "../_showcase/scroll-region"

export const metadata: Metadata = { title: "Acessibilidade" }

const KIND_LABEL: Record<string, string> = {
  texto: "Texto (4,5:1)",
  "texto-grande": "Texto grande (3:1)",
  componente: "Componentes (3:1)",
  foco: "Foco (3:1)",
  desabilitado: "Desabilitado (3:1)",
}

const TECLADO = [
  {
    componente: "Button, Chip",
    teclas:
      "Tab foca (inclusive desabilitado, para ler o motivo); Enter e Espaço acionam.",
  },
  { componente: "LinkText", teclas: "Tab foca; Enter navega." },
  {
    componente: "TextField, Textarea",
    teclas: "Tab foca; erro anunciado pelo aria-describedby.",
  },
  {
    componente: "Select",
    teclas: "Enter, Espaço ou setas abrem; setas navegam; Enter escolhe; Esc fecha.",
  },
  { componente: "Checkbox, Switch", teclas: "Espaço alterna." },
  {
    componente: "RadioGroup, SegmentedControl, ThemeSwitcher",
    teclas: "Tab entra no grupo; setas escolhem.",
  },
  {
    componente: "Dialog, Drawer, caderno de achados",
    teclas: "Foco preso dentro; Esc fecha e devolve o foco a quem abriu.",
  },
  { componente: "Tooltip, Popover", teclas: "Aparecem no foco do gatilho; Esc fecha." },
  {
    componente: "Accordion",
    teclas: "Tab entre gatilhos; Enter e Espaço abrem e fecham.",
  },
  {
    componente: "Marquee",
    teclas: "Os links do original recebem foco; a cópia é inerte; foco pausa a faixa.",
  },
  {
    componente: "Achavel",
    teclas: "Tab foca; Enter ou Espaço acha; o achado é anunciado.",
  },
  { componente: "Cabeçalho", teclas: 'Primeiro Tab mostra "Pular para o conteúdo".' },
] as const

export default function AcessibilidadePage() {
  return (
    <main id="conteudo" className="py-12">
      <Eyebrow>Qualidade</Eyebrow>
      <h1 className="mt-4 text-h1">Acessibilidade</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Contraste calculado no build para todos os pares obrigatórios em todos os temas,
        teclado completo em todo controle e axe sem violações em cada página desta
        vitrine.
      </p>

      <section aria-labelledby="contraste" className="mt-12 flex flex-col gap-4">
        <h2 id="contraste" className="text-h2">
          Relatório de contraste
        </h2>
        <p className="max-w-measure text-body text-ink-muted">
          Menor razão encontrada por tipo de par, em cada tema. A lista completa está em{" "}
          <LinkText href="/sistema/cores" variant="inline">
            Cores, na matriz de contraste
          </LinkText>
          .
        </p>
        <ScrollRegion label="Tabela de contraste por combinação de estação e modo">
          <table className="w-full min-w-xl border-collapse text-left text-sm">
            <caption className="sr-only">
              Menor contraste por tipo de par e combinação de estação e modo
            </caption>
            <thead>
              <tr className="border-b-2 border-border font-mono text-label text-ink-subtle">
                <th scope="col" className="py-2 pe-4">
                  Tipo
                </th>
                {tokens.themes.map((t) => (
                  <th key={t.id} scope="col" className="py-2 pe-4">
                    {t.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(KIND_LABEL).map((kind) => (
                <tr key={kind} className="border-b border-border">
                  <th scope="row" className="py-2 pe-4 font-medium">
                    {KIND_LABEL[kind]}
                  </th>
                  {tokens.themes.map((t) => {
                    const pairs = t.pairs.filter((p) => p.kind === kind)
                    const min = Math.min(...pairs.map((p) => p.ratio))
                    const ok = pairs.every((p) => p.pass)
                    return (
                      <td key={t.id} className="py-2 pe-4 font-mono">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon
                            name={ok ? "check" : "alerta"}
                            size={16}
                            label={ok ? "Todos aprovados" : "Há pares reprovados"}
                            className={ok ? "text-success-text" : "text-danger-text"}
                          />
                          {formatNumber(min, { decimals: true })}:1
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
        <p className="font-mono text-label text-ink-subtle">
          {formatNumber(tokens.themes.reduce((n, t) => n + t.pairs.length, 0))} pares
          calculados em {formatNumber(tokens.themes.length)} combinações de estação e
          modo.
        </p>
      </section>

      <section aria-labelledby="teclado" className="mt-16 flex flex-col gap-4">
        <h2 id="teclado" className="text-h2">
          Teclado
        </h2>
        <ScrollRegion label="Tabela de teclado por componente">
          <table className="w-full min-w-xl border-collapse text-left text-sm">
            <caption className="sr-only">Comportamento de teclado por componente</caption>
            <thead>
              <tr className="border-b-2 border-border font-mono text-label text-ink-subtle">
                <th scope="col" className="py-2 pe-4">
                  Componente
                </th>
                <th scope="col" className="py-2">
                  Teclas
                </th>
              </tr>
            </thead>
            <tbody>
              {TECLADO.map((row) => (
                <tr key={row.componente} className="border-b border-border">
                  <th scope="row" className="py-2.5 pe-4 align-top font-medium">
                    {row.componente}
                  </th>
                  <td className="py-2.5 text-ink-muted">{row.teclas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      </section>

      <section aria-labelledby="outras" className="mt-16 flex flex-col gap-4">
        <h2 id="outras" className="text-h2">
          Outras garantias
        </h2>
        <ul className="flex max-w-measure list-disc flex-col gap-2 ps-5 text-body text-ink-muted">
          <li>
            Alvo de toque de 44 px ou mais em todo controle; a área clicável é sempre o
            retângulo do elemento.
          </li>
          <li>
            Cor nunca é o único canal: erro tem ícone e texto, seleção tem marca, link tem
            sublinhado.
          </li>
          <li>
            Alto contraste do sistema: as camadas desenhadas somem e entram bordas reais.
          </li>
          <li>Movimento reduzido: tudo que se move tem equivalente parado.</li>
          <li>
            Ícones decorativos ficam ocultos; ícones com significado têm nome em
            português.
          </li>
        </ul>
      </section>
    </main>
  )
}
