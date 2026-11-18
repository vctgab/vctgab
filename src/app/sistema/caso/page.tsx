import type { Metadata } from "next"
import { Callout } from "@/components/ui/callout"
import { CaseFigure, CaseFigureGroup } from "@/components/ui/case-figure"
import { CaseFooter } from "@/components/ui/case-footer"
import { CaseHeader } from "@/components/ui/case-header"
import { CaseToc } from "@/components/ui/case-toc"
import { CodeBlock } from "@/components/ui/code-block"
import { Eyebrow } from "@/components/ui/eyebrow"
import { ReviewMark } from "@/components/ui/review-mark"
import { HOME } from "@/content/home"
import { pending, review } from "@/content/pending"
import { Demo, Row } from "../_showcase/demo"

export const metadata: Metadata = { title: "Caso" }

const CODE = `// Exemplo fictício da vitrine.
export function somar(a: number, b: number): number {
  const total = a + b;
  return total;
}`

const DESKTOP = {
  src: "/projetos/nexuscoop/dashboard-desktop.webp",
  width: 1920,
  height: 1200,
  alt: "Painel de um sistema fictício, com dados fictícios: valores do mês, um gráfico de barras e um anel de aceitação.",
}
const TALL = {
  src: "/projetos/nexuscoop/billing-accounts-desktop.webp",
  width: 1920,
  height: 4388,
  alt: "Painel de contas de um sistema fictício, com dados fictícios: indicadores, filtros e uma tabela longa de contas.",
}
const PHONE = {
  src: "/projetos/nexuscoop/dashboard-mobile.webp",
  width: 780,
  height: 1688,
  alt: "Painel de um sistema fictício no celular, com dados fictícios: saudação e valores do mês em uma coluna.",
}

const CTAS = HOME.ctas.map((c) => ({
  label: c.label,
  href: `/contato?aba=${c.tab}`,
  variant: c.variant,
}))

export default function CasoPage() {
  return (
    <main id="conteudo">
      <div className="py-12">
        <Eyebrow>Vitrine</Eyebrow>
        <h1 className="mt-4 text-h1">Caso</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
          Componentes da página de caso: cabeçalho, figuras, código, destaque, sumário,
          rodapé e a marca de revisão. Os dados são fictícios; os prints são de um sistema
          com dados inventados.
        </p>

        <Demo
          id="review-mark"
          title="ReviewMark"
          description="Marca visível de item que ainda precisa de validação. Dentro de um parágrafo, em bloco ou só a marca (conteúdo retido). O release:check lista cada um."
        >
          <Row label="Inline, bloco e só a marca" className="flex-col gap-4">
            <p className="max-w-measure text-body-lg">
              Uma frase comum,{" "}
              <ReviewMark what="se pode contar o incidente (fictício)">
                uma frase em revisão
              </ReviewMark>{" "}
              e o resto do parágrafo.
            </p>
            <ReviewMark what="parágrafo fictício em revisão" as="div">
              Um parágrafo inteiro em revisão.
            </ReviewMark>
            <ReviewMark what="conteúdo retido (fictício)" as="div" />
          </Row>
        </Demo>

        <Demo
          id="callout"
          title="Callout"
          description="Destaque de uma regra dentro de um texto longo. role note, sem título inventado: o nome acessível vem de label."
        >
          <div className="grid max-w-3xl gap-8">
            <Callout label="Regra de exemplo" seed="vitrine:callout">
              Uma regra que parece detalhe, mas é a mais importante:{" "}
              <strong>nunca devolva uma lista vazia quando a checagem falhar</strong>,
              porque lista vazia quer dizer tudo certo (texto fictício).
            </Callout>
            <Callout
              label="Observação de exemplo"
              tone="neutral"
              seed="vitrine:callout-2"
            >
              Tom neutro, para uma observação de apoio (texto fictício).
            </Callout>
          </div>
        </Demo>

        <Demo
          id="code-block"
          title="CodeBlock"
          description="Realce de sintaxe feito no servidor, com legenda e botão de copiar. Com review e withhold, só a legenda e a marca: o código não chega ao navegador."
        >
          <div className="grid max-w-3xl gap-8">
            <CodeBlock
              code={CODE}
              caption="Realçado no servidor, com variáveis de cor ligadas aos tokens."
              seed="vitrine:codigo"
            />
            <CodeBlock
              code={review("permissão para mostrar o trecho (fictício)", CODE, {
                withhold: true,
              })}
              caption="Trecho retido até a liberação."
              seed="vitrine:codigo-retido"
            />
          </div>
        </Demo>

        <Demo
          id="case-figure"
          title="CaseFigure e CaseFigureGroup"
          description="Print numa moldura de navegador ou de celular, com legenda e ampliação num diálogo. Prints altos são cortados na moldura e aparecem inteiros no diálogo. Sem print, a hachura com a pendência."
        >
          <div className="grid max-w-4xl gap-12">
            <CaseFigure
              id="vitrine-navegador"
              variant="browser"
              image={DESKTOP}
              caption="Variante navegador, com a proporção do print."
            />
            <CaseFigure
              id="vitrine-alto"
              variant="browser"
              image={TALL}
              caption="Print mais alto que a moldura: cortado na moldura, inteiro no diálogo."
            />
            <CaseFigureGroup
              caption="Três figuras de um grupo, com uma legenda só."
              figures={[
                { id: "vitrine-grupo-a", variant: "phone", image: PHONE },
                { id: "vitrine-grupo-b", variant: "phone", image: PHONE },
                { id: "vitrine-grupo-c", variant: "phone", image: PHONE },
              ]}
            />
            <CaseFigureGroup
              caption="Desktop e celular lado a lado."
              figures={[
                { id: "vitrine-par-a", variant: "browser", image: DESKTOP },
                { id: "vitrine-par-b", variant: "phone", image: PHONE },
              ]}
            />
            <CaseFigure
              id="vitrine-pendente"
              variant="browser"
              image={pending("print: arquivo-de-exemplo")}
              caption="Print pendente."
            />
          </div>
        </Demo>

        <Demo
          id="case-toc"
          title="CaseToc"
          description="Sumário do caso. Abaixo de lg é um bloco recolhível; a partir de lg, uma coluna fixa. A seção atual leva aria-current. Aqui, com a seção Contexto marcada."
        >
          <div className="max-w-sm">
            <CaseToc
              current="contexto"
              items={[
                { id: "resumo", title: "Resumo" },
                { id: "contexto", title: "Contexto" },
                { id: "o-que-eu-fiz", title: "O que eu fiz" },
                { id: "resultado", title: "Resultado" },
              ]}
            />
          </div>
        </Demo>

        <Demo
          id="case-header"
          title="CaseHeader"
          description="Áreas, título, o que é e a ficha técnica numa Ficha com fita. O time em revisão e o período pendente mostram as marcas."
        >
          <CaseHeader
            name="Projeto fictício A"
            areas={["código", "liderança"]}
            about="Portal fictício de faturamento de uma cooperativa fictícia, em uma cidade fictícia"
            seed="vitrine:caso"
            facts={{
              project: "Projeto fictício A",
              role: "tech lead e dev full stack (fictício)",
              company: "Empresa fictícia, para um cliente fictício",
              period: pending("período do projeto fictício"),
              team: review("papéis do time (fictício)", "5 pessoas"),
              status: "em andamento",
              stack: [
                "React 19",
                "TypeScript",
                "Supabase (PostgreSQL, Auth, Edge Functions em Deno)",
              ],
            }}
          />
        </Demo>

        <Demo
          id="case-footer"
          title="CaseFooter"
          description="Próximo projeto e os dois CTAs. O link não pré-busca a rota, que pode ainda não existir."
        >
          <CaseFooter
            next={{ name: "Projeto fictício B", href: "/sistema/caso" }}
            ctas={CTAS}
            seed="vitrine:rodape"
          />
        </Demo>
      </div>
    </main>
  )
}
