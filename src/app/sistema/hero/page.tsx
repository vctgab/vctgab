import type { Metadata } from "next"
import { Hero } from "@/components/hero"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SCENES } from "@/components/footer-scene"
import { THEMES } from "@/lib/theme/themes"

export const metadata: Metadata = { title: "Hero" }

export default function HeroPage() {
  return (
    <main id="conteudo">
      <Hero seed="sistema" ctaHref="/#contato" />
      <div className="py-16">
        <Eyebrow>Vitrine</Eyebrow>
        <h2 className="mt-4 text-h2">Como o hero funciona</h2>
        <ul className="mt-6 flex max-w-measure list-disc flex-col gap-3 ps-5 text-body text-ink-muted">
          <li>
            As formas vêm do motor, com seed por página: a composição é sempre a mesma
            aqui.
          </li>
          <li>
            O tema troca a paleta e a energia: a deriva e a irregularidade mudam na hora.
          </li>
          <li>
            O texto fica numa placa com contraste calculado; nenhuma letra pousa direto
            numa forma.
          </li>
          <li>Com movimento reduzido, a composição fica parada na primeira pose.</li>
          <li>Fora da tela, a deriva e o morph pausam.</li>
        </ul>
        <h2 className="mt-12 text-h2">Cenas do rodapé</h2>
        <ul className="mt-6 flex max-w-measure flex-col gap-2 text-body text-ink-muted">
          {THEMES.map((t) => (
            <li key={t.id}>
              <strong className="text-ink">{t.label}:</strong> {SCENES[t.id]?.descricao}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
