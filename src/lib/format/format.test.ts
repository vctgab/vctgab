import {
  formatCount,
  formatCurrency,
  formatDate,
  formatMonth,
  formatNumber,
  formatPercent,
  formatTime,
  formatTimeWithSeconds,
} from "."

// Instante fixo e fictício: 14/11/2026 08:11:05 em UTC, 05:11:05 em Teresina.
const instant = Date.UTC(2026, 10, 14, 8, 11, 5)

describe("format (NU-12)", () => {
  it("formata moeda como R$ 1.234,56", () => {
    expect(formatCurrency(1234.56)).toBe("R$ 1.234,56")
  })

  it("formata números com separador de milhar pt-BR", () => {
    expect(formatNumber(1234567)).toBe("1.234.567")
    expect(formatNumber(12.5, { decimals: true })).toBe("12,5")
  })

  it("formata percentual a partir de 0 a 100", () => {
    expect(formatPercent(89)).toBe("89%")
    expect(formatPercent(34)).toBe("34%")
  })

  it("formata contagem como 'x de y'", () => {
    expect(formatCount(3, 7)).toBe("3 de 7")
  })

  it("formata data como dd/mm/aaaa no fuso de Teresina", () => {
    expect(formatDate(instant)).toBe("14/11/2026")
  })

  it("formata hora em 24 h no fuso de Teresina", () => {
    expect(formatTime(instant)).toBe("05:11")
    expect(formatTime(Date.UTC(2026, 10, 14, 20, 25))).toBe("17:25")
    expect(formatTimeWithSeconds(instant)).toBe("05:11:05")
  })

  it("formata o mês por extenso em minúsculas", () => {
    expect(formatMonth(instant)).toBe("novembro")
  })
})
