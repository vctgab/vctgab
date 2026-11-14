/**
 * Capturas de evidência (pnpm screenshots): 3 páginas × 3 viewports × 4 temas
 * e recortes 2x ampliados a 400% das bordas de botão, chip e ficha (SH-02).
 * Grava em docs/screenshots.
 */
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { expect, test } from "@playwright/test"
import { applyTheme, scrollThrough, THEMES } from "./helpers"

const OUT = join(process.cwd(), "docs/screenshots")
const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
] as const
const PAGES = [
  { slug: "sistema", path: "/sistema" },
  { slug: "componentes", path: "/sistema/componentes" },
  { slug: "hero", path: "/sistema/hero" },
] as const

for (const theme of THEMES) {
  for (const vp of VIEWPORTS) {
    test(`telas ${theme} ${vp.name}`, async ({ browser }) => {
      mkdirSync(join(OUT, theme), { recursive: true })
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      })
      const page = await context.newPage()
      await applyTheme(page, theme)
      for (const p of PAGES) {
        await page.goto(p.path, { waitUntil: "networkidle" })
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
        await scrollThrough(page)
        await page.waitForTimeout(300)
        await page.screenshot({
          path: join(OUT, theme, `${p.slug}-${vp.name}.jpg`),
          type: "jpeg",
          quality: 82,
        })
      }
      await context.close()
    })
  }
}

const EDGES = [
  { slug: "botao", selector: "#button button:has-text('Vamos conversar')" },
  { slug: "chip", selector: "#tag-chip button[aria-pressed='true']" },
  { slug: "ficha", selector: "#ficha article" },
] as const

for (const theme of ["ipe", "noturno"] as const) {
  test(`bordas 2x ${theme}`, async ({ browser }) => {
    mkdirSync(join(OUT, "bordas"), { recursive: true })
    const context = await browser.newContext({
      viewport: { width: 1366, height: 900 },
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()
    await applyTheme(page, theme)
    await page.goto("/sistema/componentes", { waitUntil: "networkidle" })
    for (const edge of EDGES) {
      const el = page.locator(edge.selector).first()
      await el.scrollIntoViewIfNeeded()
      const box = await el.boundingBox()
      if (!box) throw new Error(`sem caixa para ${edge.slug}`)
      // Canto superior direito com margem: contorno, preenchimento e sombra.
      const clip = { x: box.x + box.width - 60, y: box.y - 10, width: 80, height: 60 }
      const png = await page.screenshot({ clip })
      const viewer = await context.newPage()
      await viewer.setViewportSize({
        width: clip.width * 2 * 4,
        height: clip.height * 2 * 4,
      })
      await viewer.setContent(
        `<body style="margin:0"><img style="display:block;width:100%;image-rendering:pixelated" src="data:image/png;base64,${png.toString("base64")}"></body>`,
      )
      await viewer.screenshot({
        path: join(OUT, "bordas", `${edge.slug}-${theme}-2x-400.png`),
      })
      await viewer.close()
    }
    await context.close()
  })
}
