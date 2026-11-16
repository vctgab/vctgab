"use client"

import { RadioGroup } from "radix-ui"
import { useId } from "react"
import { Icon } from "@/components/ui/icon"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { useTheme } from "@/lib/theme/theme-provider"
import { DEFAULT_MODE, DEFAULT_SEASON, MODES } from "@/lib/theme/themes"

export interface ThemeSwitcherProps {
  /** `grid`: amostras grandes com descrição; `compact`: amostras com o nome, para Popover e Drawer. */
  layout?: "grid" | "compact"
  className?: string
}

/** Valor do rádio "Automática": segue o calendário (a escolha salva some). */
const AUTO = "automatica"
/** Valor do segmento "Do sistema": segue `prefers-color-scheme`. */
const SYSTEM = "sistema"

const MODE_OPTIONS = [
  ...MODES.map((m) => ({ value: m.id, label: m.label })),
  { value: SYSTEM, label: "Do sistema" },
]

/**
 * Escolha de tema em dois controles independentes: estação (quatro amostras
 * mais "Automática") e modo (claro, escuro, do sistema). Cada amostra vive
 * dentro de um `data-season` e `data-mode` próprios, então mostra as cores
 * reais da estação no modo atual.
 * Ficha: docs/specs/themes-seasons.md
 */
export function ThemeSwitcher({ layout = "compact", className }: ThemeSwitcherProps) {
  const { state, mode, seasonPref, modePref, autoSeason, seasons, setSeason, setMode } =
    useTheme()
  const id = useId()
  const grid = layout === "grid"
  const swatchMode = mode ?? DEFAULT_MODE
  const autoId = autoSeason ?? DEFAULT_SEASON
  const autoLabel = seasons.find((s) => s.id === autoId)?.label ?? ""

  const options = [
    ...seasons.map((s) => ({
      value: s.id,
      label: s.label,
      description: s.description,
      swatch: s.id,
      auto: false,
    })),
    {
      value: AUTO,
      label: "Automática",
      description: `Segue o calendário. Agora: ${autoLabel}.`,
      swatch: autoId,
      auto: true,
    },
  ]

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-col gap-2">
        <p id={`${id}-estacao`} className="font-mono text-label text-ink-subtle">
          Estação
        </p>
        <RadioGroup.Root
          aria-labelledby={`${id}-estacao`}
          value={state ? (seasonPref ?? AUTO) : ""}
          onValueChange={(value) => setSeason(value === AUTO ? null : value)}
          orientation="horizontal"
          className={cn(
            "grid gap-3",
            grid ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2",
          )}
        >
          {options.map((option) => {
            const seed = `estacao:${option.value}`
            const host = shapeHostProps({ seed, bucket: "sm", interactive: true })
            return (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
                {...host}
                className={cn(
                  "group/estacao relative isolate flex min-h-11 cursor-pointer gap-2 p-2 text-left text-ink",
                  "[--shape-fill:transparent] hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
                  "data-[state=checked]:[--shape-fill:var(--primary-soft)]",
                  grid ? "flex-col items-start" : "items-center",
                  !grid && option.auto && "col-span-2",
                )}
              >
                <Shape
                  seed={seed}
                  bucket="sm"
                  fill="surface-raised"
                  stroke="none"
                  misalign={false}
                />
                <span
                  data-season={option.swatch}
                  data-mode={swatchMode}
                  aria-hidden="true"
                  className={cn(
                    "shape-scope relative isolate grid shrink-0 place-items-center",
                    grid ? "size-16" : "size-9",
                  )}
                >
                  <Shape
                    seed={`${seed}:papel`}
                    kind="blob"
                    bucket="sm"
                    fill="surface-base"
                    strokeWidth={1.75}
                    misalign={false}
                  />
                  <span className="relative isolate size-1/2">
                    <Shape
                      seed={`${seed}:tinta`}
                      kind="blob"
                      bucket="sm"
                      fill="primary-fill"
                      stroke="none"
                    />
                  </span>
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "flex items-center gap-1 hyphens-none whitespace-nowrap",
                      grid ? "text-body font-medium" : "text-sm",
                    )}
                  >
                    {option.label}
                    {!grid && option.auto ? (
                      <span className="sr-only">, agora {autoLabel}</span>
                    ) : null}
                    {grid ? (
                      <Icon
                        name="check"
                        size={16}
                        decorative
                        className="hidden group-data-[state=checked]/estacao:inline-block"
                      />
                    ) : null}
                  </span>
                  {grid ? (
                    <span className="text-sm text-ink-muted">{option.description}</span>
                  ) : option.auto ? (
                    <span aria-hidden="true" className="text-label text-ink-muted">
                      Agora: {autoLabel}
                    </span>
                  ) : null}
                </span>
                {grid ? null : (
                  <Icon
                    name="check"
                    size={16}
                    decorative
                    className="absolute top-1 right-1 hidden text-primary-text group-data-[state=checked]/estacao:block"
                  />
                )}
              </RadioGroup.Item>
            )
          })}
        </RadioGroup.Root>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-label text-ink-subtle">Modo</p>
        <SegmentedControl
          label="Modo"
          block={!grid}
          options={MODE_OPTIONS}
          value={state ? (modePref ?? SYSTEM) : ""}
          onValueChange={(value) => setMode(value === SYSTEM ? null : value)}
          seed="tema:modo"
        />
      </div>
    </div>
  )
}
