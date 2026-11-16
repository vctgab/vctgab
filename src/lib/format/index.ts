/**
 * Formatador único (regra NU-12). Todo número, moeda, data e hora visível
 * passa por aqui. Função local de formatação é proibida (o ESLint barra
 * `toLocale*String` e `new Intl.*` fora desta pasta).
 *
 * Padrões: R$ 1.234,56; dd/mm/aaaa; HH:mm em 24 h.
 */

const LOCALE = "pt-BR"

/** Fuso de Teresina (PI). Piauí segue o horário de Fortaleza, UTC−3, sem horário de verão. */
export const TERESINA_TIME_ZONE = "America/Fortaleza"

const currency = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "BRL" })
const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

type DateInput = Date | string | number

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value)
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>()
function dateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify(options)
  let f = dateFormatters.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(LOCALE, options)
    dateFormatters.set(key, f)
  }
  return f
}

/**
 * Mês (1 a 12) e dia (1 a 31) de um instante em um fuso. Serve a regras de
 * calendário (a estação do ano) sem depender do fuso de quem visita.
 */
export function monthDayInZone(
  value: DateInput,
  timeZone: string,
): { month: number; day: number } {
  const parts = dateFormatter({
    timeZone,
    month: "numeric",
    day: "numeric",
  }).formatToParts(toDate(value))
  const pick = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? Number.NaN)
  return { month: pick("month"), day: pick("day") }
}

/** Remove o espaço inseparável do Intl, que quebra buscas e testes. */
function normalizeSpaces(s: string): string {
  return s.replace(/[  ]/g, " ")
}

/** R$ 1.234,56 */
export function formatCurrency(value: number): string {
  return normalizeSpaces(currency.format(value))
}

/** 1.234 (inteiro) ou 1.234,5 (até duas casas). */
export function formatNumber(
  value: number,
  options: { decimals?: boolean } = {},
): string {
  return (options.decimals ? decimal : integer).format(value)
}

/** 89% (o valor entra como 0 a 100). */
export function formatPercent(value: number, fractionDigits = 0): string {
  return normalizeSpaces(
    new Intl.NumberFormat(LOCALE, {
      style: "percent",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value / 100),
  )
}

/** "3 de 7" */
export function formatCount(current: number, total: number): string {
  return `${integer.format(current)} de ${integer.format(total)}`
}

/** dd/mm/aaaa */
export function formatDate(
  value: DateInput,
  timeZone: string = TERESINA_TIME_ZONE,
): string {
  return dateFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(toDate(value))
}

/** HH:mm em 24 h */
export function formatTime(
  value: DateInput,
  timeZone: string = TERESINA_TIME_ZONE,
): string {
  return dateFormatter({
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(toDate(value))
}

/** HH:mm:ss em 24 h (relógio ao vivo) */
export function formatTimeWithSeconds(
  value: DateInput,
  timeZone: string = TERESINA_TIME_ZONE,
): string {
  return dateFormatter({
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(toDate(value))
}

/** Nome do mês por extenso, minúsculo: "novembro". */
export function formatMonth(
  value: DateInput,
  timeZone: string = TERESINA_TIME_ZONE,
): string {
  return dateFormatter({ month: "long", timeZone }).format(toDate(value))
}

/** ISO 8601 para o atributo `dateTime` de `<time>`. */
export function toIsoString(value: DateInput): string {
  return toDate(value).toISOString()
}
