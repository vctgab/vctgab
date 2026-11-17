import { CONTACT_PAGE, isContactTab } from "./contact"
import { HOME } from "./home"
import { isPending, pending, pendingLabel, textOf } from "./pending"
import { PROJECTS, projectHref } from "./projects"
import { SITE } from "./site"

describe("pendência tipada", () => {
  it("vira exatamente [a confirmar: o que falta]", () => {
    const p = pending("URL do LinkedIn")
    expect(isPending(p)).toBe(true)
    expect(pendingLabel(p)).toBe("[a confirmar: URL do LinkedIn]")
    expect(textOf(p)).toBe("[a confirmar: URL do LinkedIn]")
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

/** Frases do pedido da Home v2, copiadas dele. O conteúdo não pode reescrevê-las (CA-13, D-1201). */
describe("CA-13: o copy da Home é o do pedido, literal", () => {
  it("cabeçalho e hero", () => {
    expect(HOME.header.nav.map((l) => l.label)).toEqual(["projetos", "sobre", "contato"])
    expect(HOME.hero.badge).toBe("aberto a vagas e projetos")
    expect(HOME.hero.place).toBe("Teresina, PI")
    expect(HOME.hero.weather).toBe("provavelmente uns 30 °C")
    const t = HOME.hero.title
    expect(`${t.before}${t.highlight}${t.after}`).toBe(
      "Comecei desenhando as telas. Hoje eu coloco elas no ar.",
    )
    expect(t.highlight).toBe("no ar")
    expect(HOME.hero.lead).toBe(
      "Sou o Victor, dev front-end e tech lead. Passei cinco anos desenhando interfaces e conferindo se o que chegava em produção era o que tinha sido desenhado. Hoje eu mesmo construo, em React e TypeScript, e o caminho entre a ideia e o deploy ficou bem mais curto.",
    )
    expect(HOME.ctas.map((c) => [c.label, c.tab, c.variant])).toEqual([
      ["tenho uma vaga", "vaga", "primary"],
      ["tenho um projeto", "projeto", "secondary"],
    ])
  })

  it("projetos em destaque", () => {
    expect(HOME.projects.title).toBe("o que eu ando construindo")
    expect(HOME.projects.allLabel).toBe("ver todos os projetos")
    expect(PROJECTS.map((p) => [p.name, p.meta, p.status, p.description])).toEqual([
      [
        "Nexuscoop",
        "Felicoop · código, liderança",
        "em andamento",
        "Lidero o time que constrói o portal de faturamento de uma cooperativa médica, com uma base de código só pra web, Android e iOS.",
      ],
      [
        "Kasb Health",
        "liderança, design, código",
        "em andamento",
        "Uma healthtech que eu fundei e conduzo da ideia ao MVP, do Figma ao código.",
      ],
      [
        "Suíte OdiN",
        "OdiNetwork · design, liderança, código",
        "no ar",
        "Três sistemas SaaS B2B, um design system criado do zero e um time de design pra liderar.",
      ],
      [
        "Lance!",
        "design",
        "no ar",
        "Home, Tempo Real e Bolão de um dos maiores portais esportivos do Brasil.",
      ],
    ])
    expect(PROJECTS.map(projectHref)).toEqual([
      "/projetos/nexuscoop",
      "/projetos/kasb-health",
      "/projetos/suite-odin",
      "/projetos/lance",
    ])
    expect(PROJECTS.every((p) => isPending(p.image))).toBe(true)
    expect(isPending(PROJECTS[0]?.image) && PROJECTS[0].image.what).toBe(
      "captura do Nexuscoop",
    )
  })

  it("o que eu faço", () => {
    expect(HOME.skills.title).toBe("do layout ao deploy")
    expect(HOME.skills.lead).toBe("quatro coisas que eu faço bem, de preferência juntas.")
    expect(HOME.skills.items.map((i) => [i.marker, i.title, i.chips])).toEqual([
      [
        "01",
        "Front-end",
        ["React", "Next.js", "TypeScript", "Tailwind CSS", "acessibilidade"],
      ],
      [
        "02",
        "Produto completo",
        ["Supabase", "Node", "React Native", "Vitest", "Playwright", "GitHub Actions"],
      ],
      [
        "03",
        "Design de produto",
        ["Figma", "design systems", "design tokens", "pesquisa", "protótipos"],
      ],
      ["04", "Liderança técnica", ["tech lead", "code review", "Scrum", "Kanban"]],
    ])
    expect(HOME.skills.items[1]?.description).toBe(
      "Pra quando o projeto precisa de mais que uma interface: banco, autenticação, API e app mobile, com testes e CI pra nada quebrar em silêncio.",
    )
  })

  it("depoimento e números", () => {
    expect(isPending(HOME.proof.testimonial.text)).toBe(true)
    expect(
      HOME.proof.figures.map((f) => [
        "from" in f ? `${f.from} → ${f.value}` : f.value,
        f.label,
        isPending(f.method) ? `pendente: ${f.method.what}` : f.method,
      ]),
    ).toEqual([
      ["5+", "anos em produto digital", "desde 2021"],
      [
        "8s → quase instantâneo",
        "carregamento da landing do Nexuscoop",
        "pendente: como foi medido e o tempo final em segundos",
      ],
      [
        "1 base de código, 3 plataformas",
        "web, Android e iOS",
        "mesmo código React para as três",
      ],
      [
        "400+",
        "arquivos de teste no projeto atual",
        "pendente: validar: arquivos ou testes",
      ],
    ])
  })

  it("sobre, contato e rodapé", () => {
    expect(HOME.about.title).toBe("prazer, Victor")
    expect(HOME.about.paragraphs[0]).toMatch(
      /^Comecei no design em 2021, desenhando produtos/,
    )
    expect(HOME.about.paragraphs[1]).toBe(
      "Fora do trabalho, leio mistério e horror (Poe, Lovecraft e qualquer coisa com um enigma no meio) e ouço rock nacional alto demais. Se você reparar bem, esse site também guarda alguns segredos.",
    )
    expect(HOME.about.link).toBe("mais sobre mim")
    expect(HOME.contact.title).toBe("bora conversar?")
    expect(HOME.contact.lead).toBe(
      "Pode ser uma vaga, um projeto ou só uma ideia ainda meio solta. Costumo responder em até um dia útil.",
    )
    expect(HOME.footer.credit).toBe("Desenhado e codado por mim, em Teresina.")
    expect(`${HOME.footer.finds.before} 3 de 7${HOME.footer.finds.after}`).toBe(
      "Achados: 3 de 7. Tem coisa escondida por aqui.",
    )
    expect(HOME.footer.signature).toBe("© 2026 Victor Barros")
    expect(HOME.footer.signatureCheck.what).toBe("confirmar o sobrenome usado no site")
  })
})

describe("conteúdo do site", () => {
  it("só fatos confirmados: o que Victor não informou está pendente", () => {
    expect(SITE.email).toBe("vctgab.ux@gmail.com")
    expect(SITE.github.url).toBe("https://github.com/vctgab")
    expect(isPending(SITE.linkedin) && SITE.linkedin.what).toBe("URL do LinkedIn")
    expect(isPending(SITE.cv) && SITE.cv.what).toBe("arquivo do CV em PDF")
    expect(isPending(HOME.about.photo) && HOME.about.photo.what).toBe("foto do Victor")
    // WhatsApp e agenda saíram do copy (D-1202).
    expect("whatsapp" in SITE).toBe(false)
    expect("agendaMonth" in SITE).toBe(false)
  })

  it("página /contato com as duas abas e assunto pronto", () => {
    expect(CONTACT_PAGE.tabs.map((t) => [t.value, t.subject])).toEqual([
      ["vaga", "Vaga"],
      ["projeto", "Projeto"],
    ])
    expect(CONTACT_PAGE.defaultTab).toBe("vaga")
    expect(isContactTab("projeto")).toBe(true)
    expect(isContactTab("orcamento")).toBe(false)
    expect(isContactTab(null)).toBe(false)
  })
})

describe("páginas pendentes", () => {
  it("páginas provisórias e página secreta ficam como pendência no conteúdo", async () => {
    const { PROVISIONAL_PAGES, SECRET_PAGE } = await import("./pages")
    for (const page of Object.values(PROVISIONAL_PAGES))
      expect(isPending(page.content)).toBe(true)
    expect(isPending(SECRET_PAGE.href)).toBe(true)
  })
})
