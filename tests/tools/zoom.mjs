// Recorte ampliado para revisar bordas (regra SH-02).
// node tests/tools/zoom.mjs <rota> <saida.png> <x> <y> <largura> <altura> [tema] [ampliação]
// Captura a região em escala 2x e amplia sem suavização (pixel a pixel).
import { chromium } from "@playwright/test"
import { applyTheme } from "./theme.mjs"

const [route, out, x, y, w, h, theme = "", zoom = "4"] = process.argv.slice(2)
const clip = { x: Number(x), y: Number(y), width: Number(w), height: Number(h) }
const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  deviceScaleFactor: 2,
})
if (theme) await applyTheme(context, theme)
const page = await context.newPage()
await page.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle" })
const png = await page.screenshot({ clip })
const viewer = await browser.newPage({
  viewport: {
    width: clip.width * 2 * Number(zoom),
    height: clip.height * 2 * Number(zoom),
  },
})
await viewer.setContent(
  `<body style="margin:0"><img style="display:block;width:100%;image-rendering:pixelated" src="data:image/png;base64,${png.toString("base64")}"></body>`,
)
await viewer.screenshot({ path: out })
await browser.close()
console.log(`recorte ${w}x${h} em 2x ampliado ${zoom}x: ${out}`)
