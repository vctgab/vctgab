// Auditoria axe de todas as páginas da vitrine nas 8 combinações de estação e modo, com repetição por
// par (combinação, página) até obter um resultado íntegro. Grava docs/qa/axe-report.json.
// Uso: node tests/tools/axe-audit.mjs (com o servidor de produção na porta 3100)
import { mkdirSync, writeFileSync } from "node:fs"
import AxeBuilder from "@axe-core/playwright"
import { chromium } from "@playwright/test"
import { applyTheme, readTheme, THEMES } from "./theme.mjs"

const BASE = "http://localhost:3100"
const PAGES = [
  "/",
  "/projetos",
  "/sobre",
  "/contato",
  "/projetos/nexuscoop",
  "/sistema",
  "/sistema/cores",
  "/sistema/tipografia",
  "/sistema/espaco",
  "/sistema/formas",
  "/sistema/componentes",
  "/sistema/conteudo",
  "/sistema/caso",
  "/sistema/achados",
  "/sistema/hero",
  "/sistema/temas",
  "/sistema/acessibilidade",
]
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
const MAX_ATTEMPTS = 10

const report = { geradoEm: new Date().toISOString(), tags: TAGS, resultados: [] }
const launch = () => chromium.launch({ timeout: 30_000 })
let browser = await launch()

/** Rejeita se a promessa não terminar no prazo (navegador travado). */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`tempo esgotado (${ms} ms)`)), ms),
    ),
  ])
}

async function audit(theme, path) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } })
  context.setDefaultTimeout(30_000)
  await applyTheme(context, theme)
  const page = await context.newPage()
  const consoleMessages = []
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") consoleMessages.push(m.text())
  })
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle" })
    const applied = await readTheme(page)
    if (applied !== theme) throw new Error(`tema aplicado ${applied}`)
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    return {
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
      })),
      passes: results.passes.length,
      console: consoleMessages,
    }
  } finally {
    await context.close()
  }
}

for (const theme of THEMES) {
  for (const path of PAGES) {
    let result = null
    let attempts = 0
    const errors = []
    while (!result && attempts < MAX_ATTEMPTS) {
      attempts++
      try {
        result = await withTimeout(audit(theme, path), 60_000)
      } catch (error) {
        errors.push(String(error.message).split("\n")[0].slice(0, 120))
        // O navegador pode ter ficado num estado ruim: recomeça.
        await withTimeout(browser.close(), 10_000).catch(() => {})
        browser = await launch()
      }
    }
    const entry = {
      tema: theme,
      pagina: path,
      tentativas: attempts,
      ...(result ?? { erro: errors.at(-1) }),
    }
    report.resultados.push(entry)
    const status = result
      ? result.violations.length === 0 && result.console.length === 0
        ? "ok"
        : `VIOLAÇÕES ${JSON.stringify(result.violations)} CONSOLE ${result.console.length}`
      : "SEM RESULTADO"
    console.log(`${theme.padEnd(8)} ${path.padEnd(24)} tentativas ${attempts}  ${status}`)
  }
}
await browser.close()

mkdirSync("docs/qa", { recursive: true })
writeFileSync("docs/qa/axe-report.json", JSON.stringify(report, null, 2) + "\n")
const bad = report.resultados.filter(
  (r) => !r.violations || r.violations.length || r.console?.length,
)
console.log(
  `${report.resultados.length} auditorias; ${bad.length} com problema ou sem resultado.`,
)
process.exit(bad.length ? 1 : 0)
