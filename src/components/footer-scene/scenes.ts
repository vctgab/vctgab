/**
 * Cenas do rodapé, uma por estação. Uma estação nova precisa de um bloco em
 * `src/styles/themes.css` e de uma entrada aqui; nenhum componente muda.
 *
 * As árvores (três planos) são comuns a todas as cenas e herdam as cores
 * `--footer-tree-*` da estação e do modo. Os extras abaixo dão o clima de cada
 * uma. O modo escuro não troca de cena: leva a mesma à noite, com os extras
 * de `NIGHT_EXTRAS` e sem os de `DAY_ONLY` (D-1108).
 */
export type SceneExtra =
  /** Ipê com a copa florida em `--footer-accent`. */
  | "ipe-florido"
  /** Lua crescente no canto (só à noite). */
  | "lua"
  /** Estrelas pequenas no céu (só à noite). */
  | "estrelas"
  /** Sol no canto da lua (só de dia). */
  | "sol"
  /** Copas redondas (árvores de folha larga) em `--footer-accent`. */
  | "copas"
  /** Folhas caindo (CSS, parado com movimento reduzido). */
  | "folhas"
  /** Neve no topo dos pinheiros. */
  | "neve"
  /** Flocos caindo (CSS, parado com movimento reduzido). */
  | "flocos"

export interface Scene {
  /** Descrição curta da cena (documentação e vitrine). */
  descricao: string
  extras: readonly SceneExtra[]
}

export const SCENES: Record<string, Scene> = {
  primavera: { descricao: "Pinheiros e um ipê florido.", extras: ["ipe-florido"] },
  verao: { descricao: "Árvores de copa cheia e sol.", extras: ["copas", "sol"] },
  outono: {
    descricao: "Árvores alaranjadas e folhas caindo.",
    extras: ["copas", "folhas"],
  },
  inverno: {
    descricao: "Pinheiros com neve e flocos caindo.",
    extras: ["neve", "flocos"],
  },
}

/** Extras que entram em qualquer estação no modo escuro: lua e estrelas. */
export const NIGHT_EXTRAS: readonly SceneExtra[] = ["lua", "estrelas"]

/** Extras que só existem de dia e somem no modo escuro. */
export const DAY_ONLY: readonly SceneExtra[] = ["sol"]

/** Cena padrão para estações sem entrada (nunca quebra o rodapé). */
export const DEFAULT_SCENE: Scene = { descricao: "Pinheiros.", extras: [] }
