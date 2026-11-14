"use client"

import { Select as RadixSelect } from "radix-ui"
import { useId, type ReactNode } from "react"
import { describedBy, FieldFrame, FieldShell, fieldIds } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/cn"

export interface SelectOption {
  value: string
  label: string
}

type DisabledProps =
  | { disabled: true; disabledReason: string }
  | { disabled?: false; disabledReason?: never }

export type SelectProps = DisabledProps & {
  label: ReactNode
  options: readonly SelectOption[]
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  hint?: ReactNode
  error?: ReactNode
  optional?: boolean
  /** Opções ainda chegando. */
  loading?: boolean
  /** Falha ao carregar as opções: texto no padrão MS-02. */
  loadError?: ReactNode
  id?: string
}

/** Lista de escolha única com gatilho desenhado. Ficha: docs/specs/fields.md */
export function Select({
  label,
  options,
  name,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Escolha uma opção",
  hint,
  error,
  optional = false,
  loading = false,
  loadError,
  disabled = false,
  disabledReason,
  id,
}: SelectProps) {
  const auto = useId()
  const ids = fieldIds(id ?? auto)
  const empty = !loading && !loadError && options.length === 0
  const status = loading
    ? "Carregando opções"
    : loadError
      ? loadError
      : empty
        ? "Nenhuma opção disponível. Escreva o que precisa na mensagem."
        : null
  const blocked = disabled || loading || Boolean(loadError) || empty

  return (
    <FieldFrame
      ids={ids}
      label={label}
      optional={optional}
      hint={status ?? hint}
      error={error}
      disabledReason={disabled ? disabledReason : undefined}
    >
      <RadixSelect.Root
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={blocked}
        required={!optional}
      >
        <FieldShell
          seed={`campo:${name ?? String(label)}`}
          invalid={Boolean(error)}
          disabled={blocked}
          className="[&:has(button:active)]:[--shape-fill:var(--surface-hover)]"
        >
          <RadixSelect.Trigger
            id={ids.control}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(ids, {
              hint: Boolean(status || hint || disabled),
              error: Boolean(error),
            })}
            className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 px-3.5 text-left text-body text-ink outline-none disabled:cursor-not-allowed disabled:text-ink-disabled data-placeholder:text-ink-subtle"
          >
            <RadixSelect.Value placeholder={placeholder} />
            <RadixSelect.Icon asChild>
              {loading ? (
                <Spinner decorative size={16} />
              ) : (
                <Icon name="seletor" decorative className="text-ink-muted" />
              )}
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
        </FieldShell>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={8}
            className={cn(
              "relative isolate z-(--z-popover) max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) px-4 py-3",
              "data-[state=open]:motion-safe:animate-surgir",
            )}
          >
            <Shape
              seed={`lista:${name ?? String(label)}`}
              kind="wobblyRect"
              bucket="lg"
              // Tamanho real da lista: sem isso a forma de 56 px de altura é
              // esticada e os cantos invadem as opções.
              nominal={{ w: 360, h: options.length * 44 + 24 }}
              shadow="md"
            />
            <RadixSelect.Viewport className="flex flex-col">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 text-body text-ink outline-none select-none data-highlighted:bg-surface-hover data-[state=checked]:font-medium"
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Icon name="check" size={16} decorative />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </FieldFrame>
  )
}
