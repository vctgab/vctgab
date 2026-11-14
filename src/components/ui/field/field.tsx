import type { ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"
import type { ShapeBucket } from "@/lib/shapes"

/** Ids ligados a um campo: rótulo, ajuda, erro e contador. */
export interface FieldIds {
  control: string
  hint: string
  error: string
  counter: string
}

export function fieldIds(base: string): FieldIds {
  return {
    control: `${base}-controle`,
    hint: `${base}-ajuda`,
    error: `${base}-erro`,
    counter: `${base}-contador`,
  }
}

/** Valor de `aria-describedby` com só os textos que existem. */
export function describedBy(
  ids: FieldIds,
  parts: { hint?: boolean; error?: boolean; counter?: boolean },
): string | undefined {
  const list = [
    parts.hint ? ids.hint : null,
    parts.error ? ids.error : null,
    parts.counter ? ids.counter : null,
  ].filter(Boolean)
  return list.length ? list.join(" ") : undefined
}

export function Label({
  htmlFor,
  id,
  children,
  optional,
}: {
  htmlFor?: string
  id?: string
  children: ReactNode
  optional?: boolean
}) {
  return (
    <label htmlFor={htmlFor} id={id} className="text-body font-medium text-ink">
      {children}
      {optional ? (
        <>
          {" "}
          <span className="font-normal text-ink-muted">(opcional)</span>
        </>
      ) : null}
    </label>
  )
}

export function Hint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-sm text-ink-muted">
      {children}
    </p>
  )
}

/** Erro de campo: ícone + texto que diz o que informar (FM-04). Nunca só a cor. */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-danger-text">
      <Icon name="alerta" size={16} decorative className="mt-0.5" />
      <span>{children}</span>
    </p>
  )
}

/**
 * Moldura desenhada de um controle de formulário. Contorno `border-strong`
 * (3:1), hover um passo mais escuro, foco no hospedeiro seguindo o raio,
 * erro com contorno de perigo mais grosso.
 */
export function FieldShell({
  seed,
  bucket = "md",
  invalid = false,
  disabled = false,
  className,
  children,
}: {
  seed: string
  bucket?: ShapeBucket
  invalid?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  const host = shapeHostProps({ seed, kind: "wobblyRect", bucket, interactive: true })
  return (
    <div
      {...host}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "relative isolate flex w-full items-center",
        "[--shape-stroke:var(--border-strong)] hover:[--shape-stroke:var(--stroke)]",
        // Foco (inclusive por clique) e lista aberta: papel suave da primária e
        // contorno no passo mais escuro da paleta (o mais claro no noturno), que garante os 3:1 que o fundo sozinho não dá.
        "[&:has(:focus,[aria-expanded=true])]:[--shape-fill:var(--primary-soft)]",
        "[&:not([data-invalid]):has(:focus,[aria-expanded=true])]:[--shape-stroke:var(--field-focus-stroke)]",
        "data-invalid:[--shape-stroke:var(--danger-fill)] data-invalid:hover:[--shape-stroke:var(--danger-fill)]",
        "data-disabled:[--shape-dash:6_5] data-disabled:[--shape-fill:var(--surface-sunken)] data-disabled:hover:[--shape-stroke:var(--border-strong)]",
        className,
      )}
    >
      <Shape
        seed={seed}
        kind="wobblyRect"
        bucket={bucket}
        fill="surface-raised"
        stroke="border-strong"
        strokeWidth={invalid ? 2.5 : 1.75}
        misalign={false}
      />
      {children}
    </div>
  )
}

/** Classes do controle nativo dentro da moldura: sem borda nem anel próprios. */
export const controlClasses = cn(
  "w-full min-w-0 bg-transparent px-3.5 text-body text-ink placeholder:text-ink-subtle",
  "outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-ink-disabled",
)

export interface FieldFrameProps {
  ids: FieldIds
  label: ReactNode
  optional?: boolean
  hint?: ReactNode
  error?: ReactNode
  disabledReason?: ReactNode
  counter?: ReactNode
  children: ReactNode
  className?: string
}

/** Rótulo, controle, ajuda (ou motivo de desabilitado), erro e contador, empilhados. */
export function FieldFrame({
  ids,
  label,
  optional,
  hint,
  error,
  disabledReason,
  counter,
  children,
  className,
}: FieldFrameProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={ids.control} optional={optional}>
        {label}
      </Label>
      {children}
      {disabledReason ? (
        <Hint id={ids.hint}>{disabledReason}</Hint>
      ) : hint ? (
        <Hint id={ids.hint}>{hint}</Hint>
      ) : null}
      {error ? <FieldError id={ids.error}>{error}</FieldError> : null}
      {counter ? (
        <p
          id={ids.counter}
          className="tabular self-end font-mono text-label text-ink-subtle"
        >
          {counter}
        </p>
      ) : null}
    </div>
  )
}
