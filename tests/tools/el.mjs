// Captura de um elemento em 2x: node tests/tools/el.mjs <rota> <seletor> <saida.png> [tema]
import { chromium } from "@playwright/test"
import { applyTheme } from "./theme.mjs"
const [route, sel, out, theme = ""] = process.argv.slice(2)
const b = await chromium.launch()
const c = await b.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
})
if (theme) await applyTheme(c, theme)
const p = await c.newPage()
await p.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle" })
await p.locator(sel).first().screenshot({ path: out })
await b.close()
