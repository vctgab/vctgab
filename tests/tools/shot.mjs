// Captura rápida para revisão visual: node tests/tools/shot.mjs <rota> <saida.png> [largura] [altura] [combinação] [escala]
import { chromium } from "@playwright/test"
import { applyTheme } from "./theme.mjs"

const [
  route = "/sistema",
  out = "shot.png",
  w = "1366",
  h = "768",
  theme = "",
  scale = "1",
] = process.argv.slice(2)
const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: Number(scale),
})
if (theme) {
  await applyTheme(context, theme)
}
const page = await context.newPage()
page.on("response", (r) => {
  if (r.status() >= 400) console.log(`HTTP ${r.status()}: ${r.url()}`)
})
const logs = []
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    logs.push(`${m.type()}: ${m.text()}`)
})
await page.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle" })
if (process.env.FULL === "1") {
  // Rola a página para os blocos com Reveal entrarem antes da captura inteira.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
}
await page.screenshot({ path: out, fullPage: process.env.FULL === "1" })
console.log(logs.length ? logs.join("\n") : "sem erros no console")
await browser.close()
