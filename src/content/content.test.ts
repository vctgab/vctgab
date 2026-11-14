import { HOME } from "./home"
import { isPending, pending, pendingLabel, textOf } from "./pending"
import { PROJECTS, projectHref } from "./projects"
import { SITE } from "./site"

describe("pendência tipada", () => {
  it("vira exatamente [a confirmar: o que falta]", () => {
    const p = pending("número do WhatsApp")
    expect(isPending(p)).toBe(true)
    expect(pendingLabel(p)).toBe("[a confirmar: número do WhatsApp]")
    expect(textOf(p)).toBe("[a confirmar: número do WhatsApp]")
    expect(textOf("dezembro")).toBe("dezembro")
  })

  it("não confunde texto comum com pendência", () => {
    expect(isPending("[a confirmar: algo]")).toBe(false)
    expect(isPending({ pending: true })).toBe(false)
    expect(isPending(null)).toBe(false)
  })

  it("é um objeto simples (atravessa a fronteira servidor → cliente)", () => {
    expect(Object.getPrototypeOf(pending("x"))).toBe(Object.prototype)
  })
})

describe("conteúdo", () => {
  it("só fatos confirmados: o que Victor não informou está pendente", () => {
    expect(isPending(SITE.whatsapp)).toBe(true)
    expect(isPending(SITE.linkedin)).toBe(true)
    expect(isPending(SITE.agendaMonth)).toBe(true)
    expect(SITE.email).toBe("vctgab.ux@gmail.com")
    expect(SITE.github.url).toBe("https://github.com/vctgab")
  })

  it("quatro projetos com marcos 01 a 04 e rota /projetos/<slug>", () => {
    expect(PROJECTS.map((p) => p.marker)).toEqual(["01", "02", "03", "04"])
    expect(PROJECTS.map(projectHref)).toEqual([
      "/projetos/nexuscoop",
      "/projetos/oia",
      "/projetos/cinnatra",
      "/projetos/kasb-health",
    ])
  })

  it("quatro depoentes, com texto e cargo pendentes", () => {
    const items = HOME.testimonials.items
    expect(items.map((t) => t.author)).toEqual([
      "Natália Oliveira",
      "Diogo Reis",
      "Eduardo Silva",
      "Jecielly Mota",
    ])
    expect(items.every((t) => isPending(t.text) && isPending(t.role))).toBe(true)
  })
})
