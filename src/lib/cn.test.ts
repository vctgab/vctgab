import { cn } from "./cn"

describe("cn", () => {
  it("mantém tamanho e cor de texto do sistema juntos", () => {
    expect(cn("text-on-primary", "text-marker")).toBe("text-on-primary text-marker")
    expect(cn("text-body", "text-ink-muted")).toBe("text-body text-ink-muted")
  })

  it("resolve conflitos reais", () => {
    expect(cn("text-body", "text-sm")).toBe("text-sm")
    expect(cn("text-ink", "text-primary-text")).toBe("text-primary-text")
  })
})
