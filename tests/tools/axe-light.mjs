// Auditoria axe "leve": injeta o axe uma vez e devolve só o resumo das
// violações (sem a lista de "passes"), para páginas grandes.
// Uso: node tests/tools/axe-light.mjs <estacao-modo> <rota> [tentativas]
import { createRequire } from "node:module"
import { chromium } from "@playwright/test"
import { applyTheme, readTheme } from "./theme.mjs"

const [theme = "primavera-claro", route = "/sistema", maxAttempts = "10"] =
  process.argv.slice(2)
const require = createRequire(import.meta.url)
const axePath = createRequire(require.resolve("@axe-core/playwright")).resolve(
  "axe-core/axe.min.js",
)
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

for (let attempt = 1; attempt <= Number(maxAttempts); attempt++) {
  const browser = await chromium.launch({ timeout: 30_000 })
  try {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } })
    context.setDefaultTimeout(60_000)
    await applyTheme(context, theme)
    const page = await context.newPage()
    await page.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle" })
    if ((await readTheme(page)) !== theme) throw new Error("tema não aplicado")
    await page.addScriptTag({ path: axePath })
    const summary = await page.evaluate(async (tags) => {
      // @ts-expect-error axe é global depois da injeção
      const r = await window.axe.run(document, {
        runOnly: { type: "tag", values: tags },
        resultTypes: ["violations"],
      })
      return JSON.stringify(
        r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      )
    }, TAGS)
    const violations = JSON.parse(summary)
    console.log(
      JSON.stringify({ tema: theme, pagina: route, tentativas: attempt, violations }),
    )
    await browser.close()
    process.exit(violations.length ? 1 : 0)
  } catch (error) {
    console.error(
      `tentativa ${attempt}: ${String(error.message).split("\n")[0].slice(0, 100)}`,
    )
    await browser.close().catch(() => {})
  }
}
console.log(JSON.stringify({ tema: theme, pagina: route, erro: "sem resultado íntegro" }))
process.exit(2)
