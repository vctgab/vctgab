/**
 * CLS 0 com troca de fonte (D-1009). Atrasa as fontes sem pré-carga
 * (Patrick Hand, JetBrains Mono e Caveat chegam depois da primeira pintura)
 * e soma os layout-shift. A API LayoutShift só existe no Chromium.
 */
import { expect, test, type Page } from "@playwright/test"

// /contato?aba=projeto: a hidratação troca a aba do fallback ("vaga") pela da URL.
const PAGES = ["/", "/contato?aba=projeto", "/sistema"] as const
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1366, height: 768 },
] as const

/** Fraunces e DM Sans vêm de /fonts/ e são pré-carregadas no HTML (D-1010). */
const isPreloaded = (url: string) => new URL(url).pathname.startsWith("/fonts/")

async function measure(page: Page, path: string, delayAll: boolean) {
  await page.addInitScript(() => {
    const w = window as unknown as { __shifts: { value: number; nodes: string[] }[] }
    w.__shifts = []
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as {
        value: number
        hadRecentInput: boolean
        sources?: { node?: Node }[]
      }[]) {
        if (e.hadRecentInput) continue
        w.__shifts.push({
          value: e.value,
          nodes: (e.sources ?? []).map((s) => {
            const n = s.node
            if (n instanceof Element) return n.outerHTML.slice(0, 100)
            if (n instanceof Text)
              return `texto "${n.textContent?.slice(0, 40)}" em <${n.parentElement?.tagName.toLowerCase()} class="${n.parentElement?.className.slice(0, 60)}">`
            return String(n)
          }),
        })
      }
    }).observe({ type: "layout-shift", buffered: true })
  })
  await page.route(/\.woff2$/, async (route) => {
    if (delayAll || !isPreloaded(route.request().url()))
      await new Promise((r) => setTimeout(r, 1500))
    await route.continue()
  })
  await page.goto(path, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(800)
  return page.evaluate(
    () =>
      (window as unknown as { __shifts: { value: number; nodes: string[] }[] }).__shifts,
  )
}

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    test(`CLS 0 em ${path} (${vp.name}) com as fontes sem pré-carga atrasadas`, async ({
      browser,
      browserName,
    }) => {
      test.skip(browserName !== "chromium", "LayoutShift só existe no Chromium")
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      })
      const page = await context.newPage()
      const shifts = await measure(page, path, false)
      expect(shifts).toEqual([])
      await context.close()
    })
  }
}

test("registro: CLS com todas as fontes atrasadas (rede muito lenta)", async ({
  browser,
  browserName,
}, testInfo) => {
  test.skip(browserName !== "chromium", "LayoutShift só existe no Chromium")
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const shifts = await measure(page, "/", true)
  const total = shifts.reduce((s, x) => s + x.value, 0)
  testInfo.annotations.push({ type: "cls-todas-atrasadas", description: String(total) })
  console.log(`CLS com todas as fontes atrasadas: ${total}`, JSON.stringify(shifts))
  await context.close()
})
