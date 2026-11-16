import type { SVGProps } from "react"
import { cn } from "@/lib/cn"
import { ICON_PATHS, type IconName } from "./icon.paths"

export type { IconName }
export const ICON_NAMES = Object.keys(ICON_PATHS) as IconName[]

type IconBase = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "aria-label" | "aria-hidden" | "role"
> & {
  name: IconName
  /** 16, 20 (padrão) ou 24 px. */
  size?: 16 | 20 | 24
}

/**
 * O ícone precisa dizer se é decorativo ou qual é o seu nome acessível
 * (regra AC-03). Sem um dos dois, não compila.
 */
export type IconProps = IconBase &
  ({ decorative: true; label?: never } | { label: string; decorative?: never })

/** Ícone desenhado à mão, grade 24, traço 1,75. Cor herdada do texto. */
export function Icon({
  name,
  size = 20,
  decorative,
  label,
  className,
  ...rest
}: IconProps) {
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": label } as const)
  return (
    <svg
      {...rest}
      {...a11y}
      data-icon={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

/** Um significado, um ícone (CR-03). A vitrine mostra este quadro. */
export const ACAO_ICONE: ReadonlyArray<{ acao: string; icone: IconName }> = [
  { acao: "Avançar, ir para", icone: "seta" },
  { acao: "Ler um caso, abrir página relacionada", icone: "seta-diagonal" },
  { acao: "Abrir em nova aba", icone: "externo" },
  { acao: "Fechar", icone: "fechar" },
  { acao: "Abrir menu", icone: "menu" },
  { acao: "Concluído, selecionado", icone: "check" },
  { acao: "Expandir, adicionar", icone: "mais" },
  { acao: "Recolher, remover", icone: "menos" },
  { acao: "Tema claro", icone: "lampada" },
  { acao: "Tema escuro", icone: "lua" },
  { acao: "Primavera", icone: "flor" },
  { acao: "Verão", icone: "sol" },
  { acao: "Outono", icone: "folha" },
  { acao: "Inverno", icone: "floco" },
  { acao: "Escolher tema", icone: "tema" },
  { acao: "E-mail", icone: "mail" },
  { acao: "GitHub", icone: "github" },
  { acao: "LinkedIn", icone: "linkedin" },
  { acao: "WhatsApp", icone: "whatsapp" },
  { acao: "Terminal", icone: "terminal" },
  { acao: "Buscar", icone: "busca" },
  { acao: "Erro, atenção", icone: "alerta" },
  { acao: "Informação", icone: "info" },
  { acao: "Abrir lista de opções", icone: "seletor" },
]
