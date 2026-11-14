import { cn } from "@/lib/cn"

export interface SpinnerProps {
  /** 16, 20 (padrão) ou 24 px. */
  size?: 16 | 20 | 24
  /** Texto visível ao lado. Sem ele, o nome acessível é "Carregando". */
  label?: string
  /** Dentro de um controle que já anuncia o carregamento (ex.: Button com aria-busy). */
  decorative?: boolean
  className?: string
}

/** Arco desenhado à mão que gira; parado com movimento reduzido. */
export function Spinner({
  size = 20,
  label,
  decorative = false,
  className,
}: SpinnerProps) {
  const arc = (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      className="shrink-0 motion-safe:animate-girar"
      data-spinner=""
    >
      <path d="M12.2 3.4c4.7-.1 8.5 3.6 8.5 8.4 0 4.8-3.7 8.6-8.4 8.7-3.2 0-6-1.7-7.5-4.3" />
    </svg>
  )
  if (decorative) return <span className={cn("inline-flex", className)}>{arc}</span>
  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)}>
      {arc}
      {label ? <span>{label}</span> : <span className="sr-only">Carregando</span>}
    </span>
  )
}
