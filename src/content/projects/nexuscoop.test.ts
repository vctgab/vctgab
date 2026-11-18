import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { collectPending, collectReviews, type Found } from "../collect"
import { isPending, isReview, reviewLabel, review, unreview } from "../pending"
import { CASES, NEXUSCOOP } from "./index"
import type { CaseBlock, CaseFigureData, Content, Inline } from "./types"

const ROOT = process.cwd()
const COPY = readFileSync(join(ROOT, "docs/copy/case-nexuscoop.md"), "utf8").replaceAll(
  String.fromCharCode(13),
  "",
)

/** Tira a marcação do markdown e a caixa: a comparação ignora só isso (D-1302). */
const norm = (text: string) =>
  text.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim().toLowerCase()
// Os [validar: …] do copy viram `review()` no conteúdo: saem da comparação.
const COPY_NORM = norm(COPY.replace(/\[validar[^\]]*\]/g, ""))

function plain(content: Content | readonly Inline[]): string {
  return content
    .map((part) => {
      if (typeof part === "string") return part
      if (isReview(part))
        return typeof part.content === "string"
          ? part.content
          : plain(part.content as readonly Inline[])
      if ("strong" in part) return part.strong
      if ("code" in part) return part.code
      return part.em
    })
    .join("")
}

function blocks(): CaseBlock[] {
  return NEXUSCOOP.sections.flatMap((s) => [...s.blocks])
}

function figures(): CaseFigureData[] {
  return [
    NEXUSCOOP.cover,
    ...blocks().flatMap((b) =>
      b.type === "figure" ? [b.figure] : b.type === "figure-group" ? [...b.figures] : [],
    ),
  ]
}

describe("review()", () => {
  it("é um objeto simples, reconhecido por isReview, e diferente de pending", () => {
    const r = review("o que validar", "texto")
    expect(Object.getPrototypeOf(r)).toBe(Object.prototype)
    expect(isReview(r)).toBe(true)
    expect(reviewLabel(r)).toBe("[validar: o que validar]")
    expect(unreview(r)).toBe("texto")
    expect(unreview("texto")).toBe("texto")
    expect(r.withhold).toBe(false)
    expect(review("x", "y", { withhold: true }).withhold).toBe(true)
    expect(isReview("[validar: x]")).toBe(false)
    expect(isReview({ review: true })).toBe(false)
    expect(isPending(r)).toBe(false)
  })

  it("os coletores listam cada revisão e cada pendência com o caminho", () => {
    const found: Found[] = []
    collectReviews(
      { a: review("um", ["x", review("dois", "y")]), b: [review("três", 1)] },
      "raiz",
      found,
    )
    expect(found.map((f) => f.what)).toEqual([
      "[validar: um]",
      "[validar: dois]",
      "[validar: três]",
    ])
    expect(found[2]?.where).toBe("raiz.b[0]")
    const pend: Found[] = []
    collectPending({ k: review("a", { pending: true, what: "algo" }) }, "r", pend)
    expect(pend).toEqual([{ where: "r.k.content", what: "algo" }])
  })
})

describe("caso Nexuscoop: o copy é literal (CA-1)", () => {
  it("as seções saem na ordem do copy", () => {
    const headings = [...COPY.matchAll(/^## (.+)$/gm)].map((m) => m[1] as string)
    const order = [
      "Resumo",
      "Contexto",
      "O que eu fiz",
      "O problema que mais deu trabalho",
      "Resultado",
      "O que eu faria diferente",
    ]
    expect(NEXUSCOOP.sections.map((s) => s.title)).toEqual(order)
    const positions = order.map((t) => headings.indexOf(t))
    expect(positions.every((p) => p >= 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })

  it("todo texto do caso aparece no copy, sem outra mudança além da primeira letra", () => {
    const missing: string[] = []
    const check = (text: string) => {
      if (text && !COPY_NORM.includes(norm(text))) missing.push(text.slice(0, 80))
    }
    const { header } = NEXUSCOOP
    check(header.name)
    check(header.about)
    check(header.facts.role)
    check(header.facts.company)
    check(header.facts.period)
    check(String(unreview(header.facts.team)))
    header.facts.stack.forEach((item) => check(item))
    header.areas.forEach(check)
    for (const b of blocks()) {
      if (b.type === "text" || b.type === "callout") check(plain(b.content))
      if (b.type === "subtitle") check(b.text)
      if (b.type === "list")
        b.items.forEach((i) => {
          if (i.label) check(i.label)
          check(plain(i.content))
        })
      if (b.type === "code") {
        check(plain(b.caption))
        expect(isReview(b.code)).toBe(true)
        // o código é comparado linha a linha com o bloco do copy
        const raw = String(unreview(b.code))
        expect(COPY).toContain(raw)
      }
      if (b.type === "figure-group") check(b.caption)
      if (b.type === "figure" && b.figure.caption) check(b.figure.caption)
    }
    if (NEXUSCOOP.cover.caption) check(NEXUSCOOP.cover.caption)
    expect(missing).toEqual([])
  })

  it("o 'o que é', o status e o próximo projeto são os do copy", () => {
    expect(NEXUSCOOP.header.facts.status).toBe("em andamento")
    expect(NEXUSCOOP.header.facts.stack).toHaveLength(9)
    expect(NEXUSCOOP.next).toEqual({ name: "Kasb Health", href: "/projetos/kasb-health" })
  })

  it("os seis blocos de Código e os dois de Liderança estão todos lá (D-1317)", () => {
    const leads = blocks()
      .filter((b): b is Extract<CaseBlock, { type: "text" }> => b.type === "text")
      .map((b) => b.content[0])
      .filter((c): c is { strong: string } => typeof c === "object" && "strong" in c)
      .map((c) => c.strong)
    expect(leads).toEqual([
      "Uma base de código, três plataformas.",
      "A regra mora no banco.",
      "Nada some sem deixar rastro.",
      "Fluxos que parecem simples e não são.",
      "Qualidade no caminho, não no fim.",
      "O style guide do time.",
      "Validar o XML do lote antes que a operadora rejeite.",
    ])
  })
})

describe("caso Nexuscoop: itens [validar] (CA-4, CA-5)", () => {
  it("são cinco, com o que validar do copy", () => {
    const found: Found[] = []
    collectReviews(NEXUSCOOP, "nexuscoop", found)
    expect(found.map((f) => f.what)).toEqual([
      "[validar: papéis do time, se quiser detalhar]",
      "[validar: permissão para mostrar trechos do código do cliente]",
      "[validar: se pode contar o incidente]",
      "[validar: se as regras de UI e linguagem foram escritas por você]",
      "[validar: o que eu faria diferente]",
    ])
  })

  it("o código do cliente é retido até a liberação", () => {
    const code = blocks().find((b) => b.type === "code")
    expect(code?.type === "code" && isReview(code.code) && code.code.withhold).toBe(true)
  })

  it("não há pendência de print: os 14 prints existem", () => {
    const found: Found[] = []
    collectPending(NEXUSCOOP, "nexuscoop", found)
    expect(found).toEqual([])
  })
})

describe("caso Nexuscoop: prints (CA-3, D-1311)", () => {
  const list = figures()

  it("são 14 prints, só a capa tem prioridade e nenhum é a landing", () => {
    expect(list.length).toBe(1 + 13)
    expect(list.filter((f) => f.priority).map((f) => f.id)).toEqual(["capa"])
    for (const f of list) {
      if (isPending(f.image)) continue
      expect(f.image.source).not.toMatch(/^01-landing/)
      expect(f.image.src).not.toMatch(/landing/)
    }
  })

  it("o alt descreve a tela: não é nome de arquivo e é um texto de verdade", () => {
    for (const f of list) {
      if (isPending(f.image)) continue
      expect(f.image.alt).not.toMatch(/\.(png|webp|jpe?g)|[a-z]+-[a-z]+-desktop/i)
      expect(f.image.alt.length).toBeGreaterThan(80)
      // O style guide não mostra dados de ninguém; as demais telas, sim (fictícios).
      if (!f.image.source.startsWith("10b")) expect(f.image.alt).toMatch(/fictícios/)
    }
  })

  it("o dashboard não apresenta extrato e repasse como integrados (D-1311)", () => {
    const text = JSON.stringify(NEXUSCOOP)
    expect(text).not.toMatch(/extrato[^."]{0,40}integrad|repasse[^."]{0,40}integrad/i)
  })

  it("largura e altura declaradas batem com o arquivo (CLS 0)", () => {
    for (const f of list) {
      if (isPending(f.image)) continue
      const file = join(ROOT, "public", f.image.src)
      expect(existsSync(file)).toBe(true)
      expect(webpSize(readFileSync(file))).toEqual({
        width: f.image.width,
        height: f.image.height,
      })
    }
  })

  it("legenda de figura solta existe; figuras de grupo não têm legenda própria", () => {
    for (const b of blocks()) {
      if (b.type === "figure") expect(b.figure.caption).toBeTruthy()
      if (b.type === "figure-group") {
        expect(b.caption).toBeTruthy()
        for (const f of b.figures) expect(f.caption).toBeUndefined()
      }
    }
  })
})

describe("caso Nexuscoop: resultado (CA-6)", () => {
  it("cinco números com fonte ou método, como pedido", () => {
    const stats = blocks().find((b) => b.type === "stats")
    expect(
      stats?.type === "stats" && stats.items.map((i) => [i.value, i.method]),
    ).toEqual([
      ["1", "React + Capacitor"],
      ["6.560", "todos passando, mais 132 arquivos de teste de integração"],
      ["44", "Supabase, em Deno"],
      ["180", "uma por história, no SDD"],
      ["9 a 24 ms", "lote de 99 guias validado contra o schema oficial da ANS (TISS)"],
    ])
  })
})

describe("molde", () => {
  it("o caso está registrado por slug", () => {
    expect(CASES.nexuscoop).toBe(NEXUSCOOP)
  })
})

/** Largura e altura de um WebP (VP8, VP8L ou VP8X). */
function webpSize(buf: Buffer): { width: number; height: number } {
  const kind = buf.toString("ascii", 12, 16)
  if (kind === "VP8X")
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3),
    }
  if (kind === "VP8L") {
    const bits = buf.readUInt32LE(21)
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) }
  }
  return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
}
