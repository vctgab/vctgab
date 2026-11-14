// Captura rápida para revisão visual: node tests/tools/shot.mjs <rota> <saida.png> [largura] [altura] [tema] [escala]
import { chromium } from "@playwright/test"

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
  await context.addInitScript((t) => localStorage.setItem("vg-tema", t), theme)
}
const page = await context.newPage()
const logs = []
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    logs.push(`${m.type()}: ${m.text()}`)
})
await page.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle" })
await page.screenshot({ path: out, fullPage: process.env.FULL === "1" })
console.log(logs.length ? logs.join("\n") : "sem erros no console")
await browser.close()
