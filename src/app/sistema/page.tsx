import type { Metadata } from "next"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Ficha } from "@/components/ui/card"
import { formatNumber } from "@/lib/format"
import tokens from "@/styles/tokens.generated.json"
import { SECTIONS } from "./_showcase/sections"

export const metadata: Metadata = { title: { absolute: "Sistema · Victor Gabriel" } }

const RESUMO: Record<string, string> = {
  "/sistema/cores": "Escalas de 11 passos, tokens semânticos e a matriz de contraste.",
  "/sistema/tipografia": "Cinco famílias e a escala fluida com texto real em português.",
  "/sistema/espaco": "Base de 4 px, sombras duras, durações e camadas.",
  "/sistema/formas": "O motor de formas: playground e 24 seeds por tipo.",
  "/sistema/componentes": "Componentes P0 com variantes, tamanhos e estados.",
  "/sistema/conteudo": "Componentes P1: depoimentos, faixa, polaroids, números e mais.",
  "/sistema/achados": "O sistema de encontráveis e os estados do caderno.",
  "/sistema/hero": "O hero dinâmico e as cenas do rodapé.",
  "/sistema/temas": "Os quatro temas lado a lado.",
  "/sistema/acessibilidade": "Relatório de contraste e comportamento de teclado.",
}

export default function SistemaPage() {
  const pares = tokens.themes.reduce((n, t) => n + t.pairs.length, 0)
  return (
    <main id="conteudo" className="py-12">
      <Eyebrow>Vitrine</Eyebrow>
      <h1 className="mt-4 text-h1">Sistema</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        O design system do portfólio: caderno de campo desenhado à mão, com a
        irregularidade sempre a serviço da leitura. Quatro estações, cada uma clara e
        escura ({formatNumber(tokens.themes.length)} combinações), {formatNumber(pares)}{" "}
        pares de contraste aprovados no build.
      </p>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.filter((s) => s.href !== "/sistema").map((s) => (
          <li key={s.href}>
            <Ficha
              title={s.label}
              eyebrow={s.group}
              href={s.href}
              seed={`sistema:${s.href}`}
              className="h-full"
            >
              {RESUMO[s.href]}
            </Ficha>
          </li>
        ))}
      </ul>
    </main>
  )
}
