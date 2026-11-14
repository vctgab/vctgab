"use client"

import { RadioGroup } from "radix-ui"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import { useTheme } from "@/lib/theme/theme-provider"

export interface ThemeSwitcherProps {
  /** `grid`: amostras grandes com descrição; `compact`: linha de amostras com o nome. */
  layout?: "grid" | "compact"
  className?: string
}

/**
 * Escolha de tema por amostras desenhadas. Cada amostra vive dentro do
 * próprio `data-theme`, então mostra as cores reais daquele tema.
 * Ficha: docs/specs/header-footer.md
 */
export function ThemeSwitcher({ layout = "compact", className }: ThemeSwitcherProps) {
  const { theme, themes, setTheme } = useTheme()
  const grid = layout === "grid"

  return (
    <RadioGroup.Root
      aria-label="Tema"
      value={theme ?? undefined}
      onValueChange={setTheme}
      orientation="horizontal"
      className={cn(
        "grid gap-3",
        grid ? "grid-cols-2 md:grid-cols-4" : "grid-cols-4",
        className,
      )}
    >
      {themes.map((t) => {
        const seed = `tema:${t.id}`
        const host = shapeHostProps({ seed, bucket: "sm", interactive: true })
        return (
          <RadioGroup.Item
            key={t.id}
            value={t.id}
            {...host}
            className={cn(
              "group/tema relative isolate flex cursor-pointer flex-col items-start gap-2 p-2 text-left text-ink",
              "[--shape-fill:transparent] hover:[--shape-fill:var(--surface-hover)] active:[--shape-fill:var(--surface-active)]",
              "data-[state=checked]:[--shape-fill:var(--primary-soft)]",
              grid ? "min-h-11" : "min-h-11 items-center",
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
              data-theme={t.id}
              aria-hidden="true"
              className={cn(
                "shape-scope relative isolate grid shrink-0 place-items-center",
                grid ? "size-16" : "size-11",
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
            <span
              className={cn(
                "flex items-center gap-1",
                grid ? "text-body font-medium" : "text-sm",
              )}
            >
              {t.label}
              <Icon
                name="check"
                size={16}
                decorative
                className="hidden group-data-[state=checked]/tema:inline-block"
              />
            </span>
            {grid ? (
              <span className="text-sm text-ink-muted">{t.description}</span>
            ) : null}
          </RadioGroup.Item>
        )
      })}
    </RadioGroup.Root>
  )
}
