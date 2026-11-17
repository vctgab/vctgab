import type { Metadata } from "next"
import {
  AchadosCardBody,
  AchadosChip,
  AchadosCount,
  Achavel,
  AvisoPaginaSecreta,
} from "@/components/ui/finds"
import { Coruja, Mesa, Pena, Pinha } from "@/components/ui/finds/drawings"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Demo, Row } from "../_showcase/demo"

export const metadata: Metadata = { title: "Achados" }

export default function AchadosPage() {
  return (
    <main id="conteudo">
      <div className="py-12">
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
              <Pinha className="rotate-12" />
            </Achavel>
            <AchadosChip placement="inline" />
          </Row>
          <Row label="Contador do cabeçalho e contagem em texto (rodapé)">
            <AchadosChip placement="header" />
            <p className="text-body">
              Achados: <AchadosCount />.
            </p>
          </Row>
          <Row label="Desenhos (só o desenho; o achado de verdade fica escondido)">
            <Coruja />
            <Pena />
            <Mesa />
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
      </div>
    </main>
  )
}
