// camada: mistério. As dicas podem ter humor leve; nomes e contagem são fatos.

export interface Achado {
  id: AchadoId
  /** Nome do achado, mostrado depois de achado. */
  nome: string
  /** Dica curta em Caveat, mostrada antes de achar. */
  dica: string
}

export type AchadoId =
  "pinha" | "coruja" | "mesa" | "lapis" | "pena" | "chave" | "bussola"

/** Os sete achados, na ordem do caderno. */
export const ACHADOS: readonly Achado[] = [
  {
    id: "pinha",
    nome: "Pinha escondida",
    dica: "Lá no fundo do hero, entre as formas que flutuam.",
  },
  {
    id: "coruja",
    nome: "Coruja do correio",
    dica: "Alguém vigia o correio, perto do contato.",
  },
  { id: "mesa", nome: "Mesa de contato", dica: "Na página de contato tem uma mesa." },
  {
    id: "lapis",
    nome: "Lápis fossilizado",
    dica: "Entre as polaroids, algo bem antigo para escrever.",
  },
  {
    id: "pena",
    nome: "Pena de escrever",
    dica: "Perto de quem se apresenta na Home, algo para escrever.",
  },
  {
    id: "chave",
    nome: "Chave de latão",
    dica: "No caso Nexuscoop, perto de onde nada some sem rastro, algo abre uma porta.",
  },
  { id: "bussola", nome: "Bússola", dica: "Também nos projetos, algo aponta o caminho." },
]

export const TOTAL_ACHADOS = ACHADOS.length

export function isAchadoId(value: unknown): value is AchadoId {
  return typeof value === "string" && ACHADOS.some((a) => a.id === value)
}

export function getAchado(id: AchadoId): Achado {
  return ACHADOS.find((a) => a.id === id) as Achado
}
