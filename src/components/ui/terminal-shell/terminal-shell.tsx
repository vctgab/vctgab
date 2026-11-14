"use client"
// camada: mistério. O terminal pode ter humor leve (VZ-04 não se aplica).

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { cn } from "@/lib/cn"

export interface TerminalLine {
  kind: "saida" | "comando"
  text: string
}

export interface TerminalShellProps {
  /** Saída inicial. */
  lines?: readonly TerminalLine[]
  placeholder?: string
  /** Foca o campo ao montar (dentro do diálogo). */
  focusOnMount?: boolean
  className?: string
}

const BOAS_VINDAS: readonly TerminalLine[] = [
  { kind: "saida", text: "vctgab cmd, versão de caderno" },
  {
    kind: "saida",
    text: "Este terminal ainda está aprendendo comandos. Digite algo e veja o que acontece.",
  },
]

/**
 * Moldura do terminal `cmd`: saída e linha de prompt. A lógica de comandos
 * entra depois; por ora, ecoa e responde com a mensagem de mistério.
 * Ficha: docs/specs/accordion-terminal.md
 */
export function TerminalShell({
  lines = BOAS_VINDAS,
  placeholder = "digite ajuda",
  focusOnMount = false,
  className,
}: TerminalShellProps) {
  const id = useId()
  const [log, setLog] = useState<TerminalLine[]>([...lines])
  const [value, setValue] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const output = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusOnMount) input.current?.focus()
  }, [focusOnMount])

  useEffect(() => {
    const el = output.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const command = value.trim()
    if (!command) return
    setLog((l) => [
      ...l,
      { kind: "comando", text: command },
      {
        kind: "saida",
        text: "Este terminal ainda está aprendendo comandos. Volte em breve.",
      },
    ])
    setValue("")
  }

  return (
    <div
      {...shapeHostProps({ seed: "terminal", bucket: "lg" })}
      className={cn(
        "relative isolate flex flex-col gap-2 p-5 text-footer-ink [--focus-ring:var(--footer-focus)]",
        className,
      )}
    >
      <Shape
        seed="terminal"
        bucket="lg"
        fill="footer-bg"
        stroke="border-strong"
        shadow="lg"
      />
      <div
        ref={output}
        role="log"
        aria-live="polite"
        aria-label="Saída do terminal"
        className="h-64 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap md:h-80"
      >
        {log.map((line, i) => (
          <p key={i} className={line.kind === "comando" ? "text-footer-link" : undefined}>
            {line.kind === "comando" ? <span aria-hidden="true">&gt; </span> : null}
            {line.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={onSubmit}
        className="flex min-h-12 items-center gap-3 border-t-2 border-dashed border-border-strong pt-2"
      >
        <label htmlFor={`${id}-comando`} className="sr-only">
          Comando
        </label>
        <span aria-hidden="true" className="font-mono text-body text-footer-link">
          &gt;_
        </span>
        <input
          ref={input}
          id={`${id}-comando`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 min-w-0 flex-1 border-b-2 border-transparent bg-transparent px-2 font-mono text-body text-footer-ink outline-none placeholder:text-footer-ink/70 focus:border-footer-ink focus:bg-footer-ink/10"
        />
      </form>
    </div>
  )
}
