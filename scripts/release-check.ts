/**
 * Bloqueio de publicação (pnpm release:check). Falha, listando cada item, se:
 * 1. houver pendência no conteúdo (`pending(...)` em src/content);
 * 2. houver marca `[a confirmar: …]` escrita direto no código das páginas
 *    públicas (fora da vitrine /sistema, que mostra exemplos fictícios);
 * 3. algum link interno apontar para rota que não existe ou para página
 *    provisória (PaginaProvisoria).
 *
 * Roda direto no Node 24 (remoção de tipos), sem build.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import ts from "typescript"
import { HOME } from "../src/content/home.ts"
import { PROVISIONAL_PAGES, SECRET_PAGE } from "../src/content/pages.ts"
import { isPending, type Pending } from "../src/content/pending.ts"
import { PROJECTS, projectHref } from "../src/content/projects.ts"
import { SITE } from "../src/content/site.ts"

const ROOT = process.cwd()
const rel = (f: string) => relative(ROOT, f).split(sep).join("/")

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (name === "node_modules") return []
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

// 1. Pendências no conteúdo ------------------------------------------------

interface Found {
  where: string
  what: string
}

function collectPending(value: unknown, path: string, out: Found[]): void {
  if (isPending(value)) {
    out.push({ where: path, what: (value as Pending).what })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectPending(v, `${path}[${i}]`, out))
    return
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectPending(v, `${path}.${k}`, out)
  }
}

const pendings: Found[] = []
collectPending(SITE, "site", pendings)
collectPending(HOME, "home", pendings)
collectPending(PROJECTS, "projects", pendings)
collectPending(PROVISIONAL_PAGES, "pages.provisional", pendings)
collectPending(SECRET_PAGE, "pages.secret", pendings)

// 2. Marcas escritas no código e 3. links internos -------------------------

const PUBLIC_UI = walk(join(ROOT, "src"))
  .map(rel)
  .filter((f) => /^src\/(app|components)\/.*\.tsx?$/.test(f))
  .filter((f) => !f.startsWith("src/app/sistema/") && !/\.test\.tsx?$/.test(f))

const hardcoded: Found[] = []
const links: Found[] = []

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//")
}

for (const file of PUBLIC_UI) {
  const source = readFileSync(join(ROOT, file), "utf8")
  const sf = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const visit = (node: ts.Node) => {
    const line = () => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
    if (
      (ts.isStringLiteralLike(node) || ts.isJsxText(node)) &&
      node.getText(sf).includes("[a confirmar: ")
    ) {
      hardcoded.push({
        where: `${file}:${line()}`,
        what: node.getText(sf).trim().slice(0, 80),
      })
    }
    // href="/rota", href={"/rota"} e { href: "/rota" }
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "href" && node.initializer) {
      const init = node.initializer
      const value = ts.isStringLiteral(init)
        ? init.text
        : ts.isJsxExpression(init) &&
            init.expression &&
            ts.isStringLiteralLike(init.expression)
          ? init.expression.text
          : null
      if (value && isInternal(value))
        links.push({ where: `${file}:${line()}`, what: value })
    }
    if (
      ts.isPropertyAssignment(node) &&
      /^(href|ctaHref|allHref)$/.test(node.name.getText(sf)) &&
      ts.isStringLiteralLike(node.initializer) &&
      isInternal(node.initializer.text)
    ) {
      links.push({ where: `${file}:${line()}`, what: node.initializer.text })
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

// Links que vêm do conteúdo.
links.push({
  where: "src/content/home.ts (projects.allHref)",
  what: HOME.projects.allHref,
})
links.push({ where: "src/content/home.ts (about.ctaHref)", what: HOME.about.ctaHref })
for (const p of PROJECTS)
  links.push({ where: `src/content/projects.ts (${p.slug})`, what: projectHref(p) })

// Rotas que existem em src/app.
interface RouteInfo {
  pattern: RegExp
  path: string
  provisional: boolean
}

const routes: RouteInfo[] = walk(join(ROOT, "src/app"))
  .map(rel)
  .filter((f) => /\/page\.tsx$/.test(f))
  .map((f) => {
    const segments = f
      .replace(/^src\/app/, "")
      .replace(/\/page\.tsx$/, "")
      .split("/")
      .filter((s) => s && !/^\(.*\)$/.test(s) && !s.startsWith("@"))
    const path = `/${segments.join("/")}`
    const pattern = new RegExp(
      `^/${segments.map((s) => (/^\[.*\]$/.test(s) ? "[^/]+" : s.replace(/[.*+?^${}()|\\]/g, "\\$&"))).join("/")}$`.replace(
        /^\^\/\$$/,
        "^/$",
      ),
    )
    return {
      path,
      pattern,
      provisional: readFileSync(join(ROOT, f), "utf8").includes("PaginaProvisoria"),
    }
  })

const broken: Found[] = []
const provisional: Found[] = []
const seen = new Set<string>()
for (const link of links) {
  const path = link.what.split(/[?#]/)[0] || "/"
  const key = `${link.where}|${path}`
  if (seen.has(key)) continue
  seen.add(key)
  const route = routes.find((r) => r.pattern.test(path))
  if (!route) broken.push(link)
  else if (route.provisional) provisional.push(link)
}

// Relatório ----------------------------------------------------------------

const sections: [string, Found[], (f: Found) => string][] = [
  ["Pendências no conteúdo", pendings, (f) => `${f.where}: [a confirmar: ${f.what}]`],
  [
    "Marcas [a confirmar] no código das páginas",
    hardcoded,
    (f) => `${f.where}: ${f.what}`,
  ],
  ["Links para rotas inexistentes", broken, (f) => `${f.what}  (${f.where})`],
  ["Links para páginas provisórias", provisional, (f) => `${f.what}  (${f.where})`],
]

let total = 0
for (const [title, items, fmt] of sections) {
  total += items.length
  console.log(`\n${title}: ${items.length}`)
  for (const item of items) console.log(`  - ${fmt(item)}`)
}

if (total > 0) {
  console.log(`\nrelease:check reprovado: ${total} itens impedem a publicação.`)
  process.exit(1)
}
console.log("\nrelease:check aprovado: nenhuma pendência nem link sem destino.")
