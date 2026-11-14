import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Ficha } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { LinkText } from "@/components/ui/link-text"
import { Switch } from "@/components/ui/switch"
import { Tag } from "@/components/ui/tag"
import { TextField } from "@/components/ui/text-field"
import { SCENES } from "@/components/footer-scene"
import { THEMES } from "@/lib/theme/themes"

export const metadata: Metadata = { title: "Temas" }

export default function TemasPage() {
  return (
    <main id="conteudo" className="py-12">
      <Eyebrow>Composições</Eyebrow>
      <h1 className="mt-4 text-h1">Temas</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Os quatro temas lado a lado, com o mesmo conjunto de componentes. Cada coluna tem
        o próprio <code className="font-mono text-sm">data-theme</code>: as escalas e os
        tokens se recalculam a partir das sementes do tema, sem tocar nos componentes.
      </p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
        {THEMES.map((t) => (
          <li key={t.id}>
            <section
              data-theme={t.id}
              aria-labelledby={`tema-${t.id}`}
              className="flex h-full flex-col gap-5 border-2 border-border bg-surface-base p-5 text-ink"
            >
              <div className="flex flex-col gap-1">
                <h2 id={`tema-${t.id}`} className="text-h3">
                  {t.label}
                </h2>
                <p className="text-sm text-ink-muted">{t.description}</p>
                <p className="font-mono text-label text-ink-subtle">
                  Rodapé: {SCENES[t.id]?.descricao}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" seed={`tema:${t.id}:primario`}>
                  Enviar mensagem
                </Button>
                <Button size="sm" variant="secondary" seed={`tema:${t.id}:secundario`}>
                  Mais sobre mim
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag>React</Tag>
                <Tag tone="primary">Design system</Tag>
                <Chip defaultPressed seed={`tema:${t.id}:chip`}>
                  Next.js
                </Chip>
              </div>
              <TextField
                label="E-mail"
                name={`email-${t.id}`}
                id={`email-${t.id}`}
                error="Informe um e-mail com @."
                defaultValue="nome-exemplo.com"
              />
              <Switch
                label="Animações do hero"
                defaultChecked
                seed={`tema:${t.id}:switch`}
              />
              <Ficha
                title="Projeto fictício"
                eyebrow="01"
                seed={`tema:${t.id}:ficha`}
                rotate={false}
              >
                Projeto para [a confirmar: cliente]
              </Ficha>
              <LinkText href="/sistema/cores">Ver as escalas de cor</LinkText>
            </section>
          </li>
        ))}
      </ul>
    </main>
  )
}
