/**
 * Capturas de evidência (pnpm screenshots), uma rodada por motor
 * (capturas-chromium, capturas-webkit, capturas-firefox):
 * - Home: página inteira em 390×844 e 1366×768 nas 8 combinações de estação e
 *   modo, em docs/screenshots/home/<motor>/<combinação>/
 * - rodapé: a cena de cada combinação (dia e noite), em docs/screenshots/rodape/<motor>/
 * - vitrine de temas: as 8 combinações lado a lado, em docs/screenshots/sistema/<motor>/
 * - recortes 2x ampliados a 400% das bordas (SH-02) e dos traços com
 *   vector-effect: non-scaling-stroke, numa combinação clara e numa escura,
 *   em docs/screenshots/bordas/<motor>/
 */
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { test, type Browser, type Page } from "@playwright/test"
import { applyTheme, expectTheme, scrollThrough, THEMES, type ThemeId } from "./helpers"

const OUT = join(process.cwd(), "docs/screenshots")
// Capturas de página inteira e recortes 2x passam dos 30 s padrão com 2 workers.
test.setTimeout(120_000)
const engineOf = () => test.info().project.name.replace(/^capturas-/, "")

const HOME_VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "1366x768", width: 1366, height: 768 },
] as const

async function open(page: Page, path: string, theme: ThemeId) {
  await page.goto(path, { waitUntil: "networkidle" })
  await expectTheme(page, theme)
  await scrollThrough(page)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
}

for (const theme of THEMES) {
  for (const vp of HOME_VIEWPORTS) {
    test(`home ${theme} ${vp.name}`, async ({ browser }) => {
      const dir = join(OUT, "home", engineOf(), theme)
      mkdirSync(dir, { recursive: true })
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        // 1x nos três motores (o perfil do Safari viria em 2x): comparáveis e leves.
        deviceScaleFactor: 1,
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

  test(`rodapé ${theme}`, async ({ browser }) => {
    const dir = join(OUT, "rodape", engineOf())
    mkdirSync(dir, { recursive: true })
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    await applyTheme(page, theme)
    await open(page, "/", theme)
    const footer = page.locator("footer").first()
    await footer.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await footer.screenshot({
      path: join(dir, `${theme}.jpg`),
      type: "jpeg",
      quality: 80,
    })
    await context.close()
  })
}

test("vitrine de temas: as 8 combinações lado a lado", async ({ browser }) => {
  const dir = join(OUT, "sistema", engineOf())
  mkdirSync(dir, { recursive: true })
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await applyTheme(page, "primavera-claro")
  await open(page, "/sistema/temas", "primavera-claro")
  await page.screenshot({
    path: join(dir, "temas-1600x900.jpg"),
    type: "jpeg",
    quality: 72,
    fullPage: true,
  })
  await context.close()
})

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
  // Home (fase 2).
  {
    slug: "home-cta",
    path: "/",
    selector: "main section a:has-text('Vamos conversar')",
    at: "top-right",
  },
  {
    slug: "home-ficha",
    path: "/",
    selector: "[data-faixa] > div:first-child article",
    at: "top-right",
  },
  { slug: "home-polaroid", path: "/", selector: "#sobre figure", at: "top-right" },
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
    // A faixa da Home fica parada para o recorte.
    reducedMotion: "reduce",
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

// Uma combinação clara e uma escura, de estações diferentes.
for (const theme of ["primavera-claro", "verao-escuro"] as const) {
  test(`bordas 2x ${theme}`, async ({ browser }) => {
    await cropEdges(browser, theme)
  })
}
