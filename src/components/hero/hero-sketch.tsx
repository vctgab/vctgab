import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { generateShape } from "@/lib/shapes"

/** Bloco da tela, em unidades da caixa (largura 100). */
interface Block {
  id: string
  x: number
  y: number
  w: number
  h: number
  /** Preenchimento na tela "no ar" (classe de token). */
  fill: string
}

/** A mesma tela nos dois desenhos: barra, título, texto, botão e imagem. */
const SCREEN: readonly Block[] = [
  { id: "barra", x: 6, y: 6, w: 88, h: 7, fill: "fill-surface-sunken" },
  { id: "titulo-1", x: 6, y: 20, w: 54, h: 7, fill: "fill-ink" },
  { id: "titulo-2", x: 6, y: 30, w: 40, h: 7, fill: "fill-ink" },
  { id: "texto-1", x: 6, y: 42, w: 50, h: 3, fill: "fill-ink-subtle" },
  { id: "texto-2", x: 6, y: 48, w: 42, h: 3, fill: "fill-ink-subtle" },
  { id: "botao", x: 6, y: 57, w: 22, h: 8, fill: "fill-primary-fill" },
  { id: "imagem", x: 62, y: 20, w: 32, h: 45, fill: "fill-secondary-1-soft" },
]

/**
 * Os blocos de uma tela num único SVG (uma camada): cada um é um retângulo
 * torto do motor, esticado na sua caixa. `draft` desenha só o contorno
 * tracejado (o rascunho); senão, preenche com os tokens da estação.
 */
function Screen({ seed, draft }: { seed: string; draft: boolean }) {
  return (
    <svg
      viewBox="0 0 100 72"
      focusable="false"
      className="block h-auto w-full overflow-visible"
    >
      {SCREEN.map((b) => {
        const shape = generateShape({
          kind: "wobblyRect",
          seed: `${seed}:${b.id}`,
          bucket: "sm",
          irregularity: draft ? 0.7 : 0.35,
        })
        return (
          <svg
            key={b.id}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <path
              d={shape.path}
              className={draft ? "fill-none stroke-ink-muted" : cn(b.fill, "stroke-ink")}
              strokeWidth={draft ? 1.5 : 1.25}
              strokeDasharray={draft ? "4 3" : undefined}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )
      })}
    </svg>
  )
}

/**
 * Esboço do hero, "do rascunho ao ar" (D-1205): atrás, uma ficha com a tela
 * em wireframe à mão; na frente, a mesma tela numa moldura de navegador, nas
 * cores da estação. Decorativo e estático (Server Component).
 * Ficha: docs/specs/hero-footer.md
 */
export function HeroSketch({ seed, className }: { seed: string; className?: string }) {
  const paper = `hero:${seed}:esboco:papel`
  const frame = `hero:${seed}:esboco:navegador`
  const dots = ["fill-primary-decor", "fill-secondary-1-fill", "fill-secondary-2-fill"]
  return (
    <div
      aria-hidden="true"
      data-hero-esboco=""
      className={cn("relative aspect-5/4 w-full forced-colors:hidden", className)}
    >
      <div
        {...shapeHostProps({ seed: paper, bucket: "lg" })}
        className="absolute top-0 left-0 isolate w-4/5 -rotate-3 p-5 pb-4"
      >
        <Shape
          seed={paper}
          bucket="lg"
          fill="surface-raised"
          shadow="md"
          shadowColor="shadow-soft"
        />
        <Screen seed={`${seed}:rascunho`} draft />
        <p className="mt-2 font-hand text-hand text-ink-muted">rascunho</p>
      </div>

      <div
        {...shapeHostProps({ seed: frame, bucket: "lg" })}
        className="absolute right-0 bottom-0 isolate w-4/5 rotate-2 p-3"
      >
        <Shape
          seed={frame}
          bucket="lg"
          fill="surface-raised"
          shadow="lg"
          shadowColor="shadow-soft"
        />
        <div className="flex items-center gap-3 px-1 pb-3">
          <span className="flex gap-1.5">
            {dots.map((fill, i) => {
              const dot = generateShape({
                kind: "blob",
                seed: `${frame}:ponto:${i}`,
                points: 7,
                irregularity: 0.3,
              })
              return (
                <svg
                  key={fill}
                  viewBox="0 0 1 1"
                  focusable="false"
                  className="size-3 overflow-visible"
                >
                  <path
                    d={dot.path}
                    className={cn(fill, "stroke-ink")}
                    strokeWidth={1.25}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )
            })}
          </span>
          <span className="relative isolate flex min-h-7 flex-1 items-center px-3 font-mono text-sm text-ink-muted">
            <Shape
              seed={`${frame}:endereco`}
              kind="pill"
              bucket="sm"
              fill="surface-sunken"
              strokeWidth={1.25}
            />
            vctgab.com.br
          </span>
        </div>
        <div className="bg-surface-base p-2">
          <Screen seed={`${seed}:no-ar`} draft={false} />
        </div>
      </div>
    </div>
  )
}
