import { monthDayInZone } from "@/lib/format"

/** Fuso do calendário de estações (D-1104). */
export const SEASON_TIME_ZONE = "America/Sao_Paulo"

/**
 * Início de cada estação no hemisfério sul, como mês × 100 + dia, na ordem do
 * ano: o verão atravessa a virada (de 21/12 a 19/03), então começa o ano e o
 * fecha. Primavera de 22/09 a 20/12, verão de 21/12 a 19/03, outono de 20/03
 * a 20/06 e inverno de 21/06 a 21/09.
 *
 * O script bloqueante do `<head>` recebe esta mesma tabela (ver
 * `theme-script.ts`), então a regra tem uma só fonte.
 */
export const SEASON_STARTS: readonly (readonly [number, string])[] = [
  [101, "verao"],
  [320, "outono"],
  [621, "inverno"],
  [922, "primavera"],
  [1221, "verao"],
]

/** Estação do calendário para um mês (1 a 12) e um dia (1 a 31). */
export function seasonForMonthDay(month: number, day: number): string {
  const key = month * 100 + day
  let season = SEASON_STARTS[0]?.[1] ?? "primavera"
  for (const [start, id] of SEASON_STARTS) {
    if (key >= start) season = id
  }
  return season
}

/** Estação do calendário para um instante, no fuso `America/Sao_Paulo`. */
export function seasonForDate(value: Date | number = new Date()): string {
  const { month, day } = monthDayInZone(value, SEASON_TIME_ZONE)
  return seasonForMonthDay(month, day)
}
