/**
 * Capturas de evidência (pnpm screenshots), uma rodada por motor
 * (capturas-chromium, capturas-webkit, capturas-firefox):
 * - vitrine: 3 páginas × 3 viewports × 4 temas, em docs/screenshots/sistema/<motor>/<tema>/
 * - Home: página inteira em 4 viewports × 4 temas, em docs/screenshots/home/<motor>/<tema>/
 * - recortes 2x ampliados a 400% das bordas (SH-02) e dos traços com
 *   vector-effect: non-scaling-stroke, em docs/screenshots/bordas/<motor>/
 */
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { expect, test, type Browser, type Page } from "@playwright/test"
import { applyTheme, scrollThrough, THEMES, type ThemeId } from "./helpers"

const OUT = join(process.cwd(), "docs/screenshots")
// Capturas de página inteira e recortes 2x passam dos 30 s padrão com 2 workers.
test.setTimeout(120_000)
const engineOf = () => test.info().project.name.replace(/^capturas-/, "")

const SYSTEM_VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
] as const
const HOME_VIEWPORTS = [
  ...SYSTEM_VIEWPORTS,
  { name: "1440x900", width: 1440, height: 900 },
] as const
const SYSTEM_PAGES = [
  { slug: "sistema", path: "/sistema" },
  { slug: "componentes", path: "/sistema/componentes" },
  { slug: "hero", path: "/sistema/hero" },
] as const

async function open(page: Page, path: string, theme: string) {
  await page.goto(path, { waitUntil: "networkidle" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
  await scrollThrough(page)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
}

for (const theme of THEMES) {
  for (const vp of SYSTEM_VIEWPORTS) {
    test(`vitrine ${theme} ${vp.name}`, async ({ browser }) => {
      const dir = join(OUT, "sistema", engineOf(), theme)
      mkdirSync(dir, { recursive: true })
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      })
      const page = await context.newPage()
      await applyTheme(page, theme)
      for (const p of SYSTEM_PAGES) {
        await open(page, p.path, theme)
        await page.screenshot({
          path: join(dir, `${p.slug}-${vp.name}.jpg`),
          type: "jpeg",
          quality: 80,
        })
      }
      await context.close()
    })
  }

  for (const vp of HOME_VIEWPORTS) {
    test(`home ${theme} ${vp.name}`, async ({ browser }) => {
      const dir = join(OUT, "home", engineOf(), theme)
      mkdirSync(dir, { recursive: true })
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      })
      const page = await context.newPage()
      await applyTheme(page, theme)
      await open(page, "/", theme)
      await page.screenshot({
        path: join(dir, `${vp.name}.jpg`),
        type: "jpeg",
        quality: 72,
        fullPage: true,
      })
      await context.close()
    })
  }
}

interface Edge {
  slug: string
  path: string
  selector: string
  /** Onde recortar, relativo à caixa do elemento. */
  at: "top-right" | "right-end"
}

const EDGES: readonly Edge[] = [
  {
    slug: "botao",
    path: "/sistema/componentes",
    selector: "#button button:has-text('Vamos conversar')",
    at: "top-right",
  },
  {
    slug: "chip",
    path: "/sistema/componentes",
    selector: "#tag-chip button[aria-pressed='true']",
    at: "top-right",
  },
  {
    slug: "ficha",
    path: "/sistema/componentes",
    selector: "#ficha article",
    at: "top-right",
  },
  // Traços em SVG esticado (preserveAspectRatio none + non-scaling-stroke).
  {
    slug: "sublinhado-hero",
    path: "/sistema/hero",
    selector: "main h1 svg",
    at: "right-end",
  },
  {
    slug: "sublinhado-link",
    path: "/sistema/componentes",
    selector: "main a:has(svg [data-sublinhado])",
    at: "right-end",
  },
]

async function cropEdges(browser: Browser, theme: ThemeId) {
  const dir = join(OUT, "bordas", engineOf())
  mkdirSync(dir, { recursive: true })
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  await applyTheme(page, theme)
  let current = ""
  for (const edge of EDGES) {
    if (edge.path !== current) {
      await open(page, edge.path, theme)
      current = edge.path
    }
    const el = page.locator(edge.selector).first()
    await el.scrollIntoViewIfNeeded()
    const box = await el.boundingBox()
    if (!box) throw new Error(`sem caixa para ${edge.slug}`)
    const clip =
      edge.at === "top-right"
        ? { x: box.x + box.width - 60, y: box.y - 10, width: 80, height: 60 }
        : { x: box.x + box.width - 70, y: box.y + box.height - 30, width: 80, height: 40 }
    const png = await page.screenshot({ clip })
    const viewer = await context.newPage()
    await viewer.setViewportSize({
      width: clip.width * 2 * 4,
      height: clip.height * 2 * 4,
    })
    await viewer.setContent(
      `<body style="margin:0"><img style="display:block;width:100%;image-rendering:pixelated" src="data:image/png;base64,${png.toString("base64")}"></body>`,
    )
    await viewer.screenshot({ path: join(dir, `${edge.slug}-${theme}-2x-400.png`) })
    await viewer.close()
  }
  await context.close()
}

for (const theme of ["ipe", "noturno"] as const) {
  test(`bordas 2x ${theme}`, async ({ browser }) => {
    await cropEdges(browser, theme)
  })
}
