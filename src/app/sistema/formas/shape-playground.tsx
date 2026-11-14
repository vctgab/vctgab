"use client"

import { useId, useState } from "react"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { formatNumber } from "@/lib/format"
import {
  BUCKETS,
  SHAPE_BUCKETS,
  SHAPE_KINDS,
  type ShapeBucket,
  type ShapeKind,
} from "@/lib/shapes"

const KIND_LABEL: Record<ShapeKind, string> = {
  blob: "Blob",
  wobblyRect: "Retângulo torto",
  pill: "Cápsula",
  tornEdge: "Papel rasgado",
  handLine: "Traço à mão",
  hole: "Furo",
}

type CopyStatus = "parado" | "copiado" | "falhou"

/** Controles interativos do motor de formas. */
export function ShapePlayground() {
  const id = useId()
  const [kind, setKind] = useState<ShapeKind>("wobblyRect")
  const [seed, setSeed] = useState("ficha-01")
  const [irregularity, setIrregularity] = useState(0.5)
  const [points, setPoints] = useState(BUCKETS.md.points)
  const [bucket, setBucket] = useState<ShapeBucket>("md")
  const [status, setStatus] = useState<CopyStatus>("parado")

  const spec = BUCKETS[bucket]
  const code = `<Shape kind="${kind}" seed="${seed}" bucket="${bucket}" irregularity={${irregularity}} />
// ou, só a geometria:
generateShape({ kind: "${kind}", seed: "${seed}", bucket: "${bucket}", irregularity: ${irregularity}, points: ${points} })`

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus("copiado")
    } catch {
      setStatus("falhou")
    }
  }

  const field = "flex flex-col gap-1 text-sm"
  const control =
    "min-h-11 border-2 border-border-strong bg-surface-raised px-3 text-body text-ink"

  return (
    <section aria-labelledby={`${id}-titulo`} className="mt-10">
      <h2 id={`${id}-titulo`} className="text-h3">
        Controles
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className={field}>
          <span className="font-mono text-label text-ink-subtle">Tipo</span>
          <select
            className={control}
            value={kind}
            onChange={(e) => setKind(e.target.value as ShapeKind)}
          >
            {SHAPE_KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={field}>
          <span className="font-mono text-label text-ink-subtle">Seed</span>
          <input
            className={control}
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </label>
        <label className={field}>
          <span className="font-mono text-label text-ink-subtle">
            Irregularidade: {formatNumber(irregularity, { decimals: true })}
          </span>
          <input
            className="min-h-11 accent-(--primary-fill)"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={irregularity}
            onChange={(e) => setIrregularity(Number(e.target.value))}
          />
        </label>
        <label className={field}>
          <span className="font-mono text-label text-ink-subtle">
            Pontos: {formatNumber(points)}
          </span>
          <input
            className="min-h-11 accent-(--primary-fill)"
            type="range"
            min={6}
            max={60}
            step={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </label>
        <label className={field}>
          <span className="font-mono text-label text-ink-subtle">Tamanho</span>
          <select
            className={control}
            value={bucket}
            onChange={(e) => {
              const next = e.target.value as ShapeBucket
              setBucket(next)
              setPoints(BUCKETS[next].points)
            }}
          >
            {SHAPE_BUCKETS.map((b) => (
              <option key={b} value={b}>
                {b} ({formatNumber(BUCKETS[b].w)} × {formatNumber(BUCKETS[b].h)})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <figure className="flex flex-col gap-3">
          <div
            className="relative w-full max-w-full"
            style={{
              aspectRatio:
                kind === "blob" || kind === "hole" ? "1" : `${spec.w} / ${spec.h}`,
            }}
          >
            <div
              {...shapeHostProps({ seed, kind, bucket, irregularity })}
              className="absolute inset-0 isolate"
            >
              <PlaygroundShape
                kind={kind}
                seed={seed}
                bucket={bucket}
                irregularity={irregularity}
                points={points}
              />
            </div>
          </div>
          <figcaption className="font-mono text-label text-ink-subtle">
            {KIND_LABEL[kind]}, seed “{seed}”, bucket {bucket}
          </figcaption>
        </figure>

        <div className="flex flex-col gap-3">
          <pre
            role="region"
            aria-label="Código de uso"
            tabIndex={0}
            className="overflow-x-auto bg-surface-sunken p-4 font-mono text-sm text-ink"
          >
            <code>{code}</code>
          </pre>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={copy}
              className="min-h-11 border-2 border-stroke bg-primary-fill px-5 font-marker text-marker text-on-primary hover:bg-primary-fill-hover active:bg-primary-fill-active"
            >
              Copiar código de uso
            </button>
            <p role="status" className="text-sm">
              {status === "copiado" ? "Código copiado." : null}
              {status === "falhou" ? (
                <span className="text-danger-text">
                  Não foi possível copiar o código. Selecione o trecho e copie
                  manualmente.
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PlaygroundShape(props: {
  kind: ShapeKind
  seed: string
  bucket: ShapeBucket
  irregularity: number
  points: number
}) {
  // `points` muda a geometria: a chave força a troca do caminho.
  return (
    <Shape
      key={props.points}
      kind={props.kind}
      seed={props.seed}
      bucket={props.bucket}
      irregularity={props.irregularity}
      points={props.points}
      fill={props.kind === "hole" ? "hole" : "primary-soft"}
      shadow={props.kind === "handLine" ? "none" : "md"}
    />
  )
}
