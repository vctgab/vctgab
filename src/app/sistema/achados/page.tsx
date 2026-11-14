import type { Metadata } from "next"
import {
  AchadosCardBody,
  AchadosChip,
  Achavel,
  AvisoPaginaSecreta,
} from "@/components/ui/achados"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Container } from "@/components/ui/section"
import { Demo, Row } from "../_vitrine/demo"

export const metadata: Metadata = { title: "Achados" }

/** Pinha desenhada à mão (decorativa; o nome vem do Achavel). */
function Pinha() {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" className="rotate-12 text-ink">
      <path
        d="M20 4c7 3 12 11 12 20 0 9-5 16-12 16S8 33 8 24C8 15 13 7 20 4Z"
        className="fill-secondary-2-soft stroke-current"
        strokeWidth={2}
      />
      <path
        d="M11 18c5 2 13 2 18 0M10 25c6 2 14 2 20 0M12 32c5 1.6 11 1.6 16 0M20 6v34"
        fill="none"
        className="stroke-current"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AchadosPage() {
  return (
    <main id="conteudo">
      <Container className="py-12">
        <Eyebrow>Vitrine</Eyebrow>
        <h1 className="mt-4 text-h1">Achados</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
          Sete achados escondidos pelo site. Esta página mostra as peças do sistema; os
          outros seis continuam escondidos.
        </p>

        <Demo
          id="achavel"
          title="Achavel e chip"
          description="Ache a pinha e veja o chip contar. O anúncio sai numa região polite."
        >
          <Row label="Achavel (pinha) e chip no fluxo">
            <Achavel id="pinha" label="Algo entre as formas do hero">
              <Pinha />
            </Achavel>
            <AchadosChip placement="inline" />
          </Row>
        </Demo>

        <Demo
          id="caderno"
          title="Caderno de achados: estados"
          description="Os estados do caderno com dados fictícios, fora do estado real deste navegador."
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label text-ink-subtle">Carregando</p>
              <AchadosCardBody state={null} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label text-ink-subtle">Vazio (primeiro uso)</p>
              <AchadosCardBody state={{ found: [], storage: "ok" }} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label text-ink-subtle">
                Erro de armazenamento, com dados
              </p>
              <AchadosCardBody
                state={{ found: ["pinha", "coruja", "lapis"], storage: "indisponivel" }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-label text-ink-subtle">Sete de sete</p>
              <AchadosCardBody
                state={{
                  found: ["pinha", "coruja", "mesa", "lapis", "pena", "chave", "bussola"],
                  storage: "ok",
                }}
              />
            </div>
          </div>
        </Demo>

        <Demo
          id="indisponivel"
          title="Página secreta: indisponível"
          description="Estado factual com o progresso real deste navegador."
        >
          <AvisoPaginaSecreta />
        </Demo>
      </Container>
    </main>
  )
}
