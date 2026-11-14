/**
 * Cenas do rodapé, uma por tema. Um tema novo precisa de um bloco em
 * `src/styles/themes.css` e de uma entrada aqui; nenhum componente muda.
 *
 * As árvores (três planos) são comuns a todas as cenas e herdam as cores
 * `--footer-tree-*` do tema. Os extras abaixo dão o clima de cada uma.
 */
export type SceneExtra =
  /** Ipê com a copa florida em `--footer-accent`. */
  | "ipe-florido"
  /** Lua crescente no canto. */
  | "lua"
  /** Estrelas pequenas no céu. */
  | "estrelas"
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
  ipe: { descricao: "Pinheiros e um ipê florido.", extras: ["ipe-florido"] },
  noturno: {
    descricao: "Noite com lua, estrelas e árvores em silhueta.",
    extras: ["lua", "estrelas"],
  },
  outono: {
    descricao: "Árvores alaranjadas e folhas caindo.",
    extras: ["copas", "folhas"],
  },
  inverno: {
    descricao: "Pinheiros com neve e flocos caindo.",
    extras: ["neve", "flocos"],
  },
}

/** Cena padrão para temas sem entrada (nunca quebra o rodapé). */
export const DEFAULT_SCENE: Scene = { descricao: "Pinheiros.", extras: [] }
