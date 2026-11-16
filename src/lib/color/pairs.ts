/**
 * Pares obrigatórios de contraste (regras VI-05, CR-01, AC-05, ES-01).
 * `tokens:build` calcula cada par em cada tema e falha se algum reprovar.
 */

export type PairKind = "texto" | "texto-grande" | "componente" | "foco" | "desabilitado"

export interface ContrastPair {
  fg: string
  bg: string
  kind: PairKind
  /** Onde o par aparece, para o relatório. */
  uso: string
}

export const MINIMUM: Record<PairKind, number> = {
  texto: 4.5,
  "texto-grande": 3,
  componente: 3,
  foco: 3,
  desabilitado: 3,
}

const SURFACES = ["surface-base", "surface-raised", "surface-sunken"] as const

const onSurfaces = (
  fg: string,
  kind: PairKind,
  uso: string,
  surfaces: readonly string[] = SURFACES,
) => surfaces.map((bg): ContrastPair => ({ fg, bg, kind, uso }))

export const PAIRS: ContrastPair[] = [
  ...onSurfaces("ink", "texto", "Texto principal"),
  ...onSurfaces("ink-muted", "texto", "Texto secundário"),
  { fg: "ink", bg: "surface-hover", kind: "texto", uso: "Controle em hover" },
  { fg: "ink", bg: "surface-active", kind: "texto", uso: "Controle pressionado" },
  {
    fg: "stroke",
    bg: "surface-active",
    kind: "componente",
    uso: "Contorno de controle pressionado",
  },
  ...onSurfaces("ink-subtle", "texto", "Metadados e rótulos mono"),
  ...onSurfaces(
    "ink-disabled",
    "desabilitado",
    "Texto desabilitado (com outro indicador)",
  ),
  ...onSurfaces("primary-text", "texto", "Link e texto em primária"),
  ...onSurfaces("primary-text-hover", "texto", "Link em hover"),
  {
    fg: "primary-text",
    bg: "primary-soft",
    kind: "texto",
    uso: "Texto em primária sobre fundo suave",
  },
  {
    fg: "ink",
    bg: "primary-soft",
    kind: "texto",
    uso: "Chip selecionado e campo em foco",
  },
  {
    fg: "ink-subtle",
    bg: "primary-soft",
    kind: "texto",
    uso: "Placeholder de campo em foco",
  },
  {
    fg: "ink-muted",
    bg: "primary-soft",
    kind: "texto",
    uso: "Ícone e contador de campo em foco",
  },
  {
    fg: "ink",
    bg: "primary-soft-hover",
    kind: "texto",
    uso: "Chip selecionado em hover",
  },
  ...onSurfaces(
    "primary-decor",
    "texto-grande",
    "Títulos de 24 px ou mais e ícones com rótulo",
    ["surface-base", "surface-raised"],
  ),

  { fg: "on-primary", bg: "primary-fill", kind: "texto", uso: "Botão primário" },
  {
    fg: "on-primary",
    bg: "primary-fill-hover",
    kind: "texto",
    uso: "Botão primário em hover",
  },
  {
    fg: "on-primary",
    bg: "primary-fill-active",
    kind: "texto",
    uso: "Botão primário pressionado",
  },
  ...onSurfaces("primary-fill", "componente", "Botão primário contra o papel", [
    "surface-base",
    "surface-raised",
  ]),

  ...onSurfaces("stroke", "componente", "Contorno desenhado"),
  ...onSurfaces("border-strong", "componente", "Borda de campo e controle"),
  ...onSurfaces("focus-ring", "foco", "Anel de foco"),
  ...onSurfaces("field-focus-stroke", "foco", "Contorno de campo em foco", [
    "surface-base",
    "surface-raised",
    "primary-soft",
  ]),

  {
    fg: "on-secondary-1",
    bg: "secondary-1-fill",
    kind: "texto",
    uso: "Preenchimento secundário 1",
  },
  {
    fg: "on-secondary-1",
    bg: "secondary-1-fill-hover",
    kind: "texto",
    uso: "Secundário 1 em hover",
  },
  ...onSurfaces("secondary-1-text", "texto", "Texto secundário 1", [
    "surface-base",
    "surface-raised",
  ]),
  {
    fg: "secondary-1-text",
    bg: "secondary-1-soft",
    kind: "texto",
    uso: "Texto sobre secundário 1 suave",
  },

  {
    fg: "on-secondary-2",
    bg: "secondary-2-fill",
    kind: "texto",
    uso: "Preenchimento secundário 2",
  },
  {
    fg: "on-secondary-2",
    bg: "secondary-2-fill-hover",
    kind: "texto",
    uso: "Secundário 2 em hover",
  },
  ...onSurfaces("secondary-2-text", "texto", "Texto secundário 2", [
    "surface-base",
    "surface-raised",
  ]),
  {
    fg: "secondary-2-text",
    bg: "secondary-2-soft",
    kind: "texto",
    uso: "Texto sobre secundário 2 suave",
  },

  { fg: "on-success", bg: "success-fill", kind: "texto", uso: "Sucesso preenchido" },
  ...onSurfaces("success-text", "texto", "Texto de sucesso", [
    "surface-base",
    "surface-raised",
  ]),
  { fg: "success-text", bg: "success-soft", kind: "texto", uso: "Aviso de sucesso" },
  { fg: "ink", bg: "success-soft", kind: "texto", uso: "Texto em aviso de sucesso" },

  { fg: "on-warning", bg: "warning-fill", kind: "texto", uso: "Atenção preenchido" },
  ...onSurfaces("warning-text", "texto", "Texto de atenção", [
    "surface-base",
    "surface-raised",
  ]),
  { fg: "warning-text", bg: "warning-soft", kind: "texto", uso: "Aviso de atenção" },
  { fg: "ink", bg: "warning-soft", kind: "texto", uso: "Texto em aviso de atenção" },

  { fg: "on-danger", bg: "danger-fill", kind: "texto", uso: "Perigo preenchido" },
  ...onSurfaces("danger-text", "texto", "Mensagem de erro"),
  { fg: "danger-text", bg: "danger-soft", kind: "texto", uso: "Erro sobre fundo suave" },
  { fg: "ink", bg: "danger-soft", kind: "texto", uso: "Texto em aviso de erro" },
  ...onSurfaces("danger-fill", "componente", "Borda de campo com erro", [
    "surface-base",
    "surface-raised",
  ]),

  { fg: "footer-ink", bg: "footer-bg", kind: "texto", uso: "Texto do rodapé" },
  { fg: "footer-link", bg: "footer-bg", kind: "texto", uso: "Link do rodapé" },
  {
    fg: "footer-link",
    bg: "footer-tree-far",
    kind: "texto",
    uso: "Link sobre árvore do fundo",
  },
  {
    fg: "footer-link",
    bg: "footer-tree-mid",
    kind: "texto",
    uso: "Link sobre árvore do meio",
  },
  {
    fg: "footer-link",
    bg: "footer-tree-near",
    kind: "texto",
    uso: "Link sobre árvore da frente",
  },
  { fg: "footer-focus", bg: "footer-bg", kind: "foco", uso: "Anel de foco no rodapé" },

  {
    fg: "ink",
    bg: "hero-plate",
    kind: "texto",
    uso: "Texto do hero sobre a placa de apoio",
  },
  { fg: "ink-muted", bg: "hero-plate", kind: "texto", uso: "Parágrafo do hero" },
]

/** Tokens semânticos que todo tema precisa resolver. */
export const SEMANTIC_TOKENS = [
  "surface-base",
  "surface-raised",
  "surface-sunken",
  "surface-hover",
  "surface-active",
  "ink",
  "ink-muted",
  "ink-subtle",
  "ink-disabled",
  "border",
  "border-strong",
  "stroke",
  "primary-fill",
  "primary-fill-hover",
  "primary-fill-active",
  "on-primary",
  "primary-text",
  "primary-text-hover",
  "primary-soft",
  "primary-soft-hover",
  "primary-decor",
  "focus-ring",
  "field-focus-stroke",
  "secondary-1-fill",
  "secondary-1-fill-hover",
  "on-secondary-1",
  "secondary-1-text",
  "secondary-1-soft",
  "secondary-2-fill",
  "secondary-2-fill-hover",
  "on-secondary-2",
  "secondary-2-text",
  "secondary-2-soft",
  "success-fill",
  "on-success",
  "success-text",
  "success-soft",
  "warning-fill",
  "on-warning",
  "warning-text",
  "warning-soft",
  "danger-fill",
  "on-danger",
  "danger-text",
  "danger-soft",
  "overlay",
  "shadow-ink",
  "shadow-soft",
  "tape",
  "hatch-a",
  "hatch-b",
  "hole",
  "hole-rim",
  "selection",
  "footer-bg",
  "footer-ink",
  "footer-link",
  "footer-focus",
  "footer-tree-far",
  "footer-tree-mid",
  "footer-tree-near",
  "footer-accent",
  "footer-sky-accent",
  "hero-shape-1",
  "hero-shape-2",
  "hero-shape-3",
  "hero-shape-4",
  "hero-shape-5",
  "hero-plate",
] as const

export const SCALE_NAMES = [
  "primary",
  "secondary-1",
  "secondary-2",
  "success",
  "warning",
  "danger",
] as const

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export const NEUTRAL_STEPS = [
  0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const

/** Percentual de branco (negativo: de preto) aplicado em cada passo. */
export const STEP_MIX: Record<(typeof SCALE_STEPS)[number], string> = {
  50: "92% branco",
  100: "84% branco",
  200: "68% branco",
  300: "50% branco",
  400: "25% branco",
  500: "semente",
  600: "12% preto",
  700: "28% preto",
  800: "45% preto",
  900: "62% preto",
  950: "78% preto",
}

/** Distância mínima de matiz entre perigo e primária (perigo nunca se confunde com a marca). */
export const MIN_DANGER_HUE_DISTANCE = 12

/**
 * Distância mínima de matiz entre sucesso e primária: no verão a primária é
 * verde, e sem afastar a matiz do sucesso as duas se confundiriam.
 */
export const MIN_SUCCESS_HUE_DISTANCE = 25

/** Modos do tema. O claro é o mapeamento base; o escuro tem bloco próprio em `themes.css`. */
export const MODES = ["claro", "escuro"] as const
export type ModeId = (typeof MODES)[number]
