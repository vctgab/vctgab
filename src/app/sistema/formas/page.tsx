import type { Metadata } from "next"
import Link from "next/link"
import { Shape, shapeHostProps, type ShapeColor } from "@/components/ui/shape"
import { BUCKETS, SHAPE_KINDS, type ShapeBucket, type ShapeKind } from "@/lib/shapes"
import { ShapePlayground } from "./shape-playground"

export const metadata: Metadata = { title: "Formas" }

const KIND_INFO: Record<
  ShapeKind,
  { label: string; bucket: ShapeBucket; fill: ShapeColor | "none" }
> = {
  blob: { label: "Blob", bucket: "md", fill: "primary-soft" },
  wobblyRect: { label: "Retângulo torto", bucket: "sm", fill: "surface-raised" },
  pill: { label: "Cápsula", bucket: "sm", fill: "secondary-1-soft" },
  tornEdge: { label: "Papel rasgado", bucket: "lg", fill: "surface-raised" },
  handLine: { label: "Traço à mão", bucket: "sm", fill: "none" },
  hole: { label: "Furo", bucket: "sm", fill: "hole" },
}

const SEEDS = Array.from({ length: 24 }, (_, i) => `amostra-${i + 1}`)

function aspect(kind: ShapeKind, bucket: ShapeBucket): string {
  if (kind === "blob" || kind === "hole") return "1"
  if (kind === "handLine") return "8 / 1"
  return `${BUCKETS[bucket].w} / ${BUCKETS[bucket].h}`
}

export default function FormasPage() {
  return (
    <main className="mx-auto max-w-page px-(--gutter) py-12">
      <p className="font-mono text-label text-ink-subtle">
        <Link className="text-primary-text underline underline-offset-4" href="/sistema">
          Voltar para a vitrine do sistema
        </Link>
      </p>
      <h1 className="mt-4 text-h1">Formas</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        O motor que desenha os contornos. Mesma seed, mesma forma, sempre: no servidor, no
        navegador e em qualquer recarga.
      </p>

      <ShapePlayground />

      {SHAPE_KINDS.map((kind) => {
        const info = KIND_INFO[kind]
        return (
          <section key={kind} aria-labelledby={`grade-${kind}`} className="mt-16">
            <h2 id={`grade-${kind}`} className="text-h3">
              {info.label}: 24 seeds
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
              {SEEDS.map((seed) => (
                <li key={seed} className="flex flex-col gap-2">
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: aspect(kind, info.bucket) }}
                  >
                    <div
                      {...shapeHostProps({ seed, kind, bucket: info.bucket })}
                      className="absolute inset-0 isolate"
                    >
                      <Shape
                        seed={seed}
                        kind={kind}
                        bucket={info.bucket}
                        fill={info.fill}
                        waves={kind === "handLine" && seed.endsWith("2") ? 3 : undefined}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-label text-ink-subtle">{seed}</span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
