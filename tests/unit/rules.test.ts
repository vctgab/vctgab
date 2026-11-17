/**
 * Varreduras das regras de docs/RULES.md. Cada teste é uma busca ou
 * contagem que outra pessoa refaz sem opinião.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import ts from "typescript"

const ROOT = process.cwd()

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (name === "node_modules" || name === "__snapshots__") return []
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const rel = (f: string) => relative(ROOT, f).split(sep).join("/")
const SRC = walk(join(ROOT, "src")).map(rel)
const CODE = SRC.filter((f) => /\.(tsx?|css)$/.test(f))
const read = (f: string) => readFileSync(join(ROOT, f), "utf8")

/** Arquivos onde cor literal é permitida (TK-01). */
const TOKEN_FILES =
  /^src\/(styles\/(tokens|themes)\.css|styles\/tokens\.generated\.json|lib\/color\/)/
/** Arquivos da camada de mistério (humor leve permitido; VZ-04 não se aplica). */
const isMystery = (source: string) => source.includes("camada: mistério")
const isTest = (f: string) => /\.test\.tsx?$/.test(f)

function offenders(files: string[], pattern: RegExp): string[] {
  const out: string[] = []
  for (const f of files) {
    read(f)
      .split("\n")
      .forEach((line, i) => {
        if (pattern.test(line)) out.push(`${f}:${i + 1}: ${line.trim().slice(0, 120)}`)
      })
  }
  return out
}

describe("tokens", () => {
  it("TK-01: nenhuma cor literal fora dos arquivos de tokens", () => {
    const files = CODE.filter((f) => !TOKEN_FILES.test(f) && !isTest(f))
    expect(
      offenders(
        files,
        /(?<![&\w])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\brgba?\(|\bhsla?\(/,
      ),
    ).toEqual([])
  })

  it("TK-02: nenhum espaçamento arbitrário", () => {
    const spacing =
      /(?<![\w-])-?(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|start|end|scroll-m|scroll-p)-\[[^\]]+\]/
    expect(
      offenders(
        CODE.filter((f) => !isTest(f)),
        spacing,
      ),
    ).toEqual([])
  })

  it("TK-03: sem rounded-* nem border-radius literal fora do motor e dos tokens", () => {
    const files = CODE.filter(
      (f) => !/^src\/(styles\/|lib\/shapes\/)/.test(f) && !isTest(f),
    )
    expect(offenders(files, /\brounded(-[\w[\]]+)?\b|border-radius\s*:/)).toEqual([])
  })

  it("ES-02: durações só por tokens (nada de duration-300 ou 300ms soltos)", () => {
    const files = CODE.filter((f) => !/^src\/styles\//.test(f) && !isTest(f))
    expect(offenders(files, /\bduration-\d+\b|\b\d+ms\b/)).toEqual([])
  })
})

describe("cor", () => {
  it("CR-01: nenhum componente usa passo cru de escala (só tokens semânticos)", () => {
    const components = CODE.filter((f) => f.startsWith("src/components/") && !isTest(f))
    expect(
      offenders(
        components,
        /--(primary|secondary-1|secondary-2|success|warning|danger|neutral)-d{1,3}/,
      ),
    ).toEqual([])
  })
})

describe("temas", () => {
  /** Só a migração de `vg-tema` (D-1105) e os testes dela (unitário e e2e) conhecem os ids antigos. */
  const LEGACY_OK = new Set([
    "src/lib/theme/themes.ts",
    "src/lib/theme/theme.test.ts",
    "tests/e2e/engines.spec.ts",
  ])

  it("TM-01: nenhum id de tema antigo (ipe, noturno) nem data-theme em src, tests e scripts", () => {
    const files = [
      ...SRC,
      ...walk(join(ROOT, "tests")).map(rel),
      ...walk(join(ROOT, "scripts")).map(rel),
    ].filter(
      (f) =>
        /\.(tsx?|mjs|css)$/.test(f) &&
        !LEGACY_OK.has(f) &&
        f !== "tests/unit/rules.test.ts",
    )
    expect(
      offenders(files, /["'`]ipe["'`]|\bnoturno\b|data-theme(?!-transition)/i),
    ).toEqual([])
  })
})

describe("formas", () => {
  it("SH-01: nenhum Math.random em src", () => {
    expect(
      offenders(
        SRC.filter((f) => !isTest(f)),
        /Math\.random\s*\(/,
      ),
    ).toEqual([])
  })

  it("SH-02: nenhum feDisplacementMap; feTurbulence só no grão de papel", () => {
    expect(
      offenders(
        SRC.filter((f) => !isTest(f)),
        /feDisplacementMap/,
      ),
    ).toEqual([])
    expect(
      offenders(
        SRC.filter((f) => !f.startsWith("src/components/paper-grain/") && !isTest(f)),
        /feTurbulence/,
      ),
    ).toEqual([])
  })
})

describe("texto", () => {
  it("TL-11: nada de caixa-alta forçada", () => {
    expect(
      offenders(
        CODE.filter((f) => !isTest(f)),
        /\buppercase\b|text-transform:\s*uppercase/,
      ),
    ).toEqual([])
  })

  it("MS-03: toast nunca com tom de erro", () => {
    expect(
      offenders(
        SRC.filter((f) => !isTest(f)),
        /tone:\s*["'](erro|error|perigo)["']/,
      ),
    ).toEqual([])
  })

  it("ER-03: nada técnico na tela (error.message, stack)", () => {
    const ui = SRC.filter((f) => /^src\/(components|app)\//.test(f) && !isTest(f))
    expect(offenders(ui, /\.message\s*\}|error\.stack|err\.stack/)).toEqual([])
  })

  // Extrai o texto visível (texto JSX e atributos de texto) de cada arquivo de interface.
  const TEXT_ATTRS = new Set([
    "aria-label",
    "placeholder",
    "title",
    "label",
    "alt",
    "description",
    "hint",
    "error",
    "disabledReason",
    "loadingLabel",
    "legend",
    "content",
    "closeLabel",
    "intro",
    "eyebrow",
  ])

  interface Visible {
    file: string
    text: string
    /** Texto de botão (filho direto de Button). */
    button: boolean
    mystery: boolean
  }

  function visibleText(): Visible[] {
    const out: Visible[] = []
    const files = SRC.filter(
      (f) => /^src\/(components|app)\/.*\.tsx$/.test(f) && !isTest(f),
    )
    for (const file of files) {
      const source = read(file)
      const mystery = isMystery(source)
      const sf = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )
      const visit = (node: ts.Node, inButton: boolean) => {
        let button = inButton
        if (ts.isJsxElement(node)) {
          const tag = node.openingElement.tagName.getText(sf)
          button = tag === "Button" || tag === "button"
        }
        if (ts.isJsxText(node)) {
          const text = node.getText(sf).replace(/\s+/g, " ").trim()
          if (text) out.push({ file, text, button, mystery })
        }
        if (ts.isJsxAttribute(node) && TEXT_ATTRS.has(node.name.getText(sf))) {
          const init = node.initializer
          const literal =
            init && ts.isStringLiteral(init)
              ? init.text
              : init &&
                  ts.isJsxExpression(init) &&
                  init.expression &&
                  ts.isStringLiteralLike(init.expression)
                ? init.expression.text
                : null
          if (literal) out.push({ file, text: literal, button: false, mystery })
        }
        ts.forEachChild(node, (child) => visit(child, button))
      }
      visit(sf, false)
    }
    return out
  }

  const TEXTS = visibleText()
  const fmt = (list: Visible[]) => list.map((v) => `${v.file}: "${v.text}"`)

  it("extrai textos visíveis suficientes para a varredura valer", () => {
    expect(TEXTS.length).toBeGreaterThan(50)
  })

  it("VZ-04: voz de sistema sem Ops, Uau, exclamação ou caixa-alta de ênfase", () => {
    const system = TEXTS.filter((t) => !t.mystery)
    expect(fmt(system.filter((t) => /\b(Ops|Uau|Opa)\b/i.test(t.text)))).toEqual([])
    expect(fmt(system.filter((t) => /!/.test(t.text)))).toEqual([])
    expect(
      fmt(
        system.filter((t) =>
          /\b(?!(?:OIA|SVG|CSS|HTML|JSON|WCAG|URL|API|UI|SOFT|WONK)\b)[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{4,}\b/.test(
            t.text,
          ),
        ),
      ),
    ).toEqual([])
  })

  it("VZ-04: nenhum emoji em lugar nenhum", () => {
    // ©, ® e ™ são pictográficos no Unicode, mas não são emoji.
    expect(offenders(SRC, /(?![©®™])\p{Extended_Pictographic}/u)).toEqual([])
  })

  it("VZ-05: nunca culpar quem usa", () => {
    expect(fmt(TEXTS.filter((t) => /inválid|incorret|você errou/i.test(t.text)))).toEqual(
      [],
    )
  })

  it("BT-01: nenhum botão com verbo solto", () => {
    expect(
      fmt(
        TEXTS.filter(
          (t) => t.button && /^(OK|Sim|Não|Enviar|Cancelar|Confirmar)$/i.test(t.text),
        ),
      ),
    ).toEqual([])
  })

  it("BT-04: nenhum link genérico", () => {
    expect(
      fmt(
        TEXTS.filter((t) => /clique aqui|saiba mais|leia mais|veja mais/i.test(t.text)),
      ),
    ).toEqual([])
  })

  it("MS-06: nunca 'Sem dados'", () => {
    expect(fmt(TEXTS.filter((t) => /sem dados|nenhum dado/i.test(t.text)))).toEqual([])
  })

  it("VC-01: termos fora do glossário", () => {
    expect(
      fmt(
        TEXTS.filter((t) =>
          /\b(coleção|inventário|skin|storybook|cotação|conquistas?)\b/i.test(t.text),
        ),
      ),
    ).toEqual([])
  })
})

describe("processo", () => {
  /** Pasta do componente → ficha. */
  const SPEC: Record<string, string> = {
    shape: "shape-engine",
    icon: "icon",
    spinner: "spinner",
    skeleton: "spinner",
    button: "button",
    "link-text": "link-text",
    eyebrow: "eyebrow",
    section: "section",
    tag: "tag-chip",
    chip: "tag-chip",
    card: "card",
    field: "fields",
    "text-field": "fields",
    textarea: "fields",
    select: "fields",
    checkbox: "controls",
    "radio-group": "controls",
    switch: "controls",
    "segmented-control": "controls",
    dialog: "overlays",
    tooltip: "overlays",
    popover: "overlays",
    toast: "overlays",
    logo: "header-footer",
    "theme-switcher": "header-footer",
    header: "header-footer",
    footer: "header-footer",
    "placeholder-page": "header-footer",
    divider: "p1-visuals",
    "progress-hatch": "p1-visuals",
    polaroid: "p1-visuals",
    stat: "p1-visuals",
    quote: "quote",
    marquee: "motion",
    reveal: "motion",
    "live-clock": "motion",
    accordion: "accordion-terminal",
    "terminal-shell": "accordion-terminal",
    terminal: "accordion-terminal",
    finds: "finds",
    hero: "hero-footer",
    "footer-scene": "hero-footer",
    home: "pages/home",
    contact: "pages/contact",
    fact: "fact",
    "video-clip": "video-clip",
  }

  const isDir = (p: string) => statSync(join(ROOT, p)).isDirectory()
  const folders = readdirSync(join(ROOT, "src/components"))
    .filter((d) => isDir(`src/components/${d}`))
    .flatMap((d) =>
      d === "ui" || d === "layout"
        ? readdirSync(join(ROOT, "src/components", d)).filter((s) =>
            isDir(`src/components/${d}/${s}`),
          )
        : [d],
    )

  it.each(folders)(
    "PR-01: %s tem ficha com Spec, Plan, Tarefas, Ficha de Texto e critérios",
    (folder) => {
      const spec = SPEC[folder] ?? folder
      const doc = readFileSync(join(ROOT, "docs/specs", `${spec}.md`), "utf8")
      for (const section of [
        "## Spec",
        "## Plan",
        "## Tarefas",
        "### Ficha de Texto",
        "### Critérios de aceite",
      ]) {
        expect(`${spec}: ${doc.includes(section)}`).toBe(`${spec}: true`)
      }
    },
  )

  it("PR-02: toda dependência tem uma linha em DECISIONS.md", () => {
    const pkg = JSON.parse(read("package.json")) as {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }
    const decisions = read("docs/DECISIONS.md")
    const names = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
    const missing = names.filter(
      (n) =>
        !decisions.includes(`\`${n}\``) &&
        !(n.startsWith("@types/") && decisions.includes("`@types/*`")),
    )
    expect(missing).toEqual([])
  })
})
