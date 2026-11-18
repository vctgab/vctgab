/**
 * Caso Nexuscoop (docs/specs/pages/case.md): estrutura, axe nas 8 combinações,
 * revisões, imagens, teclado de ponta a ponta (sumário, figuras ampliadas,
 * copiar código, CTAs), sumário fixo e seção atual, CLS 0 com as imagens e
 * metadados. O Chromium audita as 8 combinações; WebKit e Firefox, a primavera
 * clara e escura (D-1113).
 */
import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import { applyTheme, collectConsole, expectTheme, scrollThrough, THEMES } from "./helpers"

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
const PATH = "/projetos/nexuscoop"

const SECTION_TITLES = [
  "Resumo",
  "Contexto",
  "O que eu fiz",
  "O problema que mais deu trabalho",
  "Resultado",
  "O que eu faria diferente",
]

for (const theme of THEMES) {
  test(`CA-2: axe sem violações e console limpo no tema ${theme}`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium" && !theme.startsWith("primavera"),
      "Fora do Chromium, só a primavera clara e escura (D-1113)",
    )
    const messages = collectConsole(page)
    await applyTheme(page, theme)
    await page.goto(PATH, { waitUntil: "networkidle" })
    await expectTheme(page, theme)
    await scrollThrough(page)
    await page.waitForLoadState("networkidle")
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
    const violations = results.violations.map((v) => ({
      id: v.id,
      alvos: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }))
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    expect(messages.filter((m) => !m.includes("favicon"))).toEqual([])
  })
}

test("CA-2: um h1, os h2 na ordem do copy e cada seção nomeada", async ({ page }) => {
  await page.goto(PATH, { waitUntil: "load" })
  await expect(page.locator("h1")).toHaveCount(1)
  await expect(page.locator("h1")).toHaveText("Nexuscoop")
  const h2 = await page.locator("main h2").allTextContents()
  expect(h2.map((t) => t.trim())).toEqual(["Ficha técnica", ...SECTION_TITLES])
  for (const title of SECTION_TITLES)
    await expect(page.getByRole("region", { name: title })).toHaveCount(1)
})

test("CA-4: as marcas de revisão aparecem e o código do cliente não vai ao navegador", async ({
  page,
}) => {
  const response = await page.goto(PATH, { waitUntil: "load" })
  const html = (await response?.text()) ?? ""
  expect(html).not.toContain("isNativePlatform")
  await expect(page.locator("[data-review-label]")).toHaveCount(5)
  await expect(
    page.getByText("[validar: permissão para mostrar trechos do código do cliente]"),
  ).toBeVisible()
  await expect(page.getByText("[validar: se pode contar o incidente]")).toBeVisible()
  await expect(
    page.getByText("[validar: se as regras de UI e linguagem foram escritas por você]"),
  ).toBeVisible()
  await expect(
    page.getByText("[validar: papéis do time, se quiser detalhar]"),
  ).toBeVisible()
  await expect(page.getByText("[validar: o que eu faria diferente]")).toBeVisible()
  await expect(page.getByRole("button", { name: "Copiar código" })).toHaveCount(0)
})

test("CA-3: 14 imagens com alt descritivo, dimensões declaradas e só a principal com prioridade", async ({
  page,
}) => {
  await page.goto(PATH, { waitUntil: "load" })
  const imgs = await page.locator("main img").evaluateAll((els) =>
    (els as HTMLImageElement[]).map((i) => ({
      alt: i.alt,
      w: i.getAttribute("width"),
      h: i.getAttribute("height"),
      loading: i.getAttribute("loading"),
    })),
  )
  expect(imgs).toHaveLength(14)
  for (const img of imgs) {
    expect(img.alt.length).toBeGreaterThan(60)
    expect(img.alt).not.toMatch(/\.(png|webp)/)
    expect(Number(img.w)).toBeGreaterThan(0)
    expect(Number(img.h)).toBeGreaterThan(0)
  }
  expect(imgs.filter((i) => i.loading !== "lazy")).toHaveLength(1)
  // A principal é a primeira e leva preload no <head>.
  expect(imgs[0]?.loading).not.toBe("lazy")
  await expect(page.locator('head link[rel="preload"][as="image"]')).not.toHaveCount(0)
})

test("as imagens carregam (AVIF ou WebP) e nenhuma resposta falha", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Acompanha o Chromium")
  const failed: string[] = []
  const types = new Set<string>()
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`)
    if (r.url().includes("/_next/image"))
      types.add(r.headers()["content-type"] ?? "sem tipo")
  })
  await page.goto(PATH, { waitUntil: "networkidle" })
  await scrollThrough(page)
  await page.waitForLoadState("networkidle")
  expect(failed).toEqual([])
  expect([...types].every((t) => /image\/(avif|webp)/.test(t))).toBe(true)
  const broken = await page
    .locator("main img")
    .evaluateAll(
      (els) =>
        (els as HTMLImageElement[]).filter((i) => !i.complete || i.naturalWidth === 0)
          .length,
    )
  expect(broken).toBe(0)
})

test("sumário: coluna fixa durante a rolagem no desktop e a seção atual é marcada", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto(PATH, { waitUntil: "load" })
  const nav = page.getByRole("navigation", { name: "Sumário", exact: true })
  await expect(nav).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Sumário do caso" })).toBeHidden()
  await page.locator("#o-que-eu-fiz").scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo(0, 4200))
  await expect(nav).toBeInViewport()
  const top = await nav.evaluate((el) => el.getBoundingClientRect().top)
  expect(top).toBeGreaterThan(0)
  expect(top).toBeLessThan(200)
  await page.evaluate(() => document.getElementById("contexto")?.scrollIntoView())
  await expect(nav.getByRole("link", { name: "Contexto" })).toHaveAttribute(
    "aria-current",
    "location",
  )
  await expect(nav.locator('a[aria-current="location"]')).toHaveCount(1)
  await page.evaluate(() => document.getElementById("resultado")?.scrollIntoView())
  await expect(nav.getByRole("link", { name: "Resultado" })).toHaveAttribute(
    "aria-current",
    "location",
  )
})

test("sumário no celular: bloco recolhível no topo, fechado, que abre e leva à seção", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(PATH, { waitUntil: "load" })
  const mobile = page.getByRole("navigation", { name: "Sumário do caso" })
  await expect(mobile).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "Sumário", exact: true }),
  ).toBeHidden()
  const details = mobile.locator("details")
  await expect(details).not.toHaveAttribute("open", "")
  await mobile.getByText("Sumário").click()
  await expect(details).toHaveAttribute("open", "")
  await mobile.getByRole("link", { name: "Resultado" }).click()
  await expect(page).toHaveURL(/#resultado$/)
  await expect(details).not.toHaveAttribute("open", "")
})

test("teclado: sumário, figura ampliada, e CTAs de ponta a ponta (desktop)", async ({
  page,
  browserName,
}, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto(PATH, { waitUntil: "load" })

  /** Tab até o elemento cujo nome acessível satisfaz o teste. */
  async function tabTo(match: (name: string) => boolean, max = 80) {
    const seen: string[] = []
    for (let i = 0; i < max; i++) {
      await page.keyboard.press("Tab")
      const name = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null
        return a ? (a.getAttribute("aria-label") ?? a.innerText ?? "").trim() : ""
      })
      seen.push(name.slice(0, 30))
      if (match(name.replace(/\s+/g, " "))) return name
    }
    throw new Error(
      `O foco não chegou ao elemento esperado. Passou por: ${seen.join(" | ")}`,
    )
  }

  // Imagem principal: abre com Enter, foco preso, Esc fecha e devolve o foco.
  // O texto do botão é "Ampliar imagem: " + o selo; o alt entra só no nome acessível.
  await tabTo((n) => /^Ampliar imagem:/.test(n))
  await expect(page.locator(":focus img")).toHaveAttribute("alt", /^Painel do cooperado/)
  const trigger = page.locator(":focus")
  await page.keyboard.press("Enter")
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("img")).toBeVisible()
  await page.keyboard.press("Tab")
  expect(
    await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')),
  ).toBe(true)
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()

  // O Safari não põe links na ordem do Tab por padrão (só botões e campos): o
  // trecho de links roda no Chromium e no Firefox. Registrado, não escondido.
  if (browserName === "webkit") {
    testInfo.annotations.push({
      type: "webkit",
      description:
        "Tab não alcança links no Safari por padrão; sumário e CTAs não percorridos",
    })
    return
  }

  // Sumário: Enter em um link leva à seção.
  await tabTo((n) => n === "Contexto")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#contexto$/)

  // Rodapé do caso: próximo projeto e CTAs, na ordem.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await tabTo((n) => n === "Kasb Health")
  await tabTo((n) => n === "tenho uma vaga")
  await tabTo((n) => n === "tenho um projeto")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/contato\?aba=projeto$/)
})

test("teclado: o bloco do sumário abre e fecha com o teclado no celular", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(PATH, { waitUntil: "load" })
  const summary = page
    .getByRole("navigation", { name: "Sumário do caso" })
    .locator("summary")
  await summary.focus()
  await page.keyboard.press("Enter")
  await expect(page.locator("details")).toHaveAttribute("open", "")
  await page.keyboard.press("Escape")
  await expect(page.locator("details")).not.toHaveAttribute("open", "")
  await expect(summary).toBeFocused()
})

test("teclado: Copiar código na vitrine copia, anuncia e volta ao rótulo", async ({
  page,
  browserName,
  context,
}) => {
  if (browserName === "chromium")
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/sistema/caso", { waitUntil: "networkidle" })
  const button = page.getByRole("button", { name: "Copiar código" })
  await button.focus()
  await page.keyboard.press("Enter")
  // Chromium e Firefox liberam a cópia com o gesto; se algum motor negar, o erro é inline.
  const copied = page.getByRole("button", { name: "Código copiado" })
  // O Next também mantém um role=alert (anunciador de rota): filtra pelo texto.
  const failed = page.getByRole("alert").filter({ hasText: "Não foi possível copiar" })
  await expect(copied.or(failed)).toBeVisible()
  if (await copied.isVisible()) {
    if (browserName === "chromium")
      expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
        "export function somar",
      )
    await expect(button).toBeVisible({ timeout: 4000 })
  } else {
    await expect(failed).toContainText("Não foi possível copiar o código")
    await expect(button).toBeEnabled()
  }
  // A região de código é alcançável pelo teclado e tem nome.
  const region = page.getByRole("region", { name: "Código TypeScript" })
  await expect(region).toHaveAttribute("tabindex", "0")
})

test("alvos de toque de 44 px ou mais (390 e 1366)", async ({ page }) => {
  for (const width of [390, 1366]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(PATH, { waitUntil: "load" })
    const small = await page
      .locator(
        "main a:visible, main button:visible, main summary:visible, footer a:visible",
      )
      .evaluateAll((els) =>
        els
          .map((el) => {
            const r = el.getBoundingClientRect()
            return {
              name: (el.getAttribute("aria-label") ?? el.textContent ?? "")
                .trim()
                .slice(0, 40),
              w: Math.round(r.width),
              h: Math.round(r.height),
            }
          })
          // Links dentro de parágrafos não existem aqui; o sumário e os botões, sim.
          .filter((x) => x.h < 44 || x.w < 44),
      )
    expect(small, `${width}px: ${JSON.stringify(small)}`).toEqual([])
  }
})

test("grupos: empilhados no celular e lado a lado no desktop", async ({ page }) => {
  const centers = async () =>
    page
      .locator("section#o-que-eu-fiz figure")
      .filter({ hasText: "A mesma base de código, no app." })
      .locator("[data-ampliar]")
      .evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect()
          return { x: r.left + r.width / 2, y: r.top }
        }),
      )
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(PATH, { waitUntil: "load" })
  const mobile = await centers()
  expect(mobile).toHaveLength(2)
  expect(Math.abs(mobile[0]!.x - mobile[1]!.x)).toBeLessThan(2)
  expect(mobile[1]!.y).toBeGreaterThan(mobile[0]!.y + 200)
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto(PATH, { waitUntil: "load" })
  const desktop = await centers()
  expect(Math.abs(desktop[0]!.y - desktop[1]!.y)).toBeLessThan(8)
  expect(desktop[1]!.x).toBeGreaterThan(desktop[0]!.x + 100)
})

test("sem rolagem horizontal em 390 px (código, tabelas e figuras)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(PATH, { waitUntil: "load" })
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

async function measureCls(page: Page, path: string) {
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
          nodes: (e.sources ?? []).map((s) =>
            s.node instanceof Element ? s.node.outerHTML.slice(0, 100) : String(s.node),
          ),
        })
      }
    }).observe({ type: "layout-shift", buffered: true })
  })
  // Imagens e fontes chegam devagar: o que não tiver espaço reservado se mexe.
  // Fraunces e DM Sans são pré-carregadas no HTML (D-1010): só as demais fontes atrasam.
  await page.route(/\/_next\/image|\.woff2$/, async (route) => {
    const url = new URL(route.request().url())
    if (url.pathname.startsWith("/_next/image") || !url.pathname.startsWith("/fonts/"))
      await new Promise((r) => setTimeout(r, 400))
    await route.continue()
  })
  await page.goto(path, { waitUntil: "load" })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
  })
  await page.waitForLoadState("networkidle")
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  return page.evaluate(
    () =>
      (window as unknown as { __shifts: { value: number; nodes: string[] }[] }).__shifts,
  )
}

for (const vp of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1366, height: 768 },
]) {
  test(`CLS 0 em ${PATH} (${vp.name}) com imagens e fontes atrasadas`, async ({
    browser,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "LayoutShift só existe no Chromium")
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    })
    const page = await context.newPage()
    const shifts = await measureCls(page, PATH)
    expect(shifts, JSON.stringify(shifts)).toEqual([])
    await context.close()
  })
}

test("CA-8: metadados em pt-BR, Open Graph sem print do cliente e sitemap", async ({
  page,
  request,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Metadados iguais nos motores")
  await page.goto(PATH, { waitUntil: "load" })
  await expect(page).toHaveTitle("Caso Nexuscoop · Victor Gabriel")
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /portal de faturamento, glosas, repasse e credenciamento de uma cooperativa médica/,
  )
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/projetos\/nexuscoop$/,
  )
  const og = await page.locator('meta[property="og:image"]').getAttribute("content")
  expect(og).toMatch(/\/projetos\/nexuscoop\/opengraph-image/)
  const image = await request.get(new URL(og ?? "", page.url()).pathname)
  expect(image.status()).toBe(200)
  expect(image.headers()["content-type"]).toContain("image/png")
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).toContain("/projetos/nexuscoop")
})

test("Home: o card do Nexuscoop leva ao caso e os quatro números têm fonte", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "load" })
  const card = page.locator("#projetos article").filter({ hasText: "Nexuscoop" })
  await expect(card).toContainText(
    "Lidero o time que constrói o portal de faturamento de uma cooperativa médica com mais de 500 médicos, com uma base de código só pra web, Android e iOS.",
  )
  await expect(card.getByRole("img")).toBeVisible()
  const proof = page.locator("section[aria-labelledby='home-prova']")
  await expect(proof.locator("li")).toHaveCount(4)
  await expect(proof).not.toContainText("quase instantâneo")
  await expect(proof).not.toContainText("400+")
  await expect(proof).toContainText("testes unitários no Vitest, todos passando")
  await card.getByRole("link", { name: "Nexuscoop" }).click()
  await expect(page).toHaveURL(/\/projetos\/nexuscoop$/)
  // O Next mantém a Home escondida: só o h1 acessível (visível) conta.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nexuscoop")
})

test("o achado da chave fica perto de 'Nada some sem deixar rastro' e conta no caderno", async ({
  page,
}) => {
  await page.goto(PATH, { waitUntil: "load" })
  const key = page.getByRole("button", {
    name: "Algo que abre uma porta, perto do rastro",
  })
  await expect(key).toBeVisible()
  const box = await key.boundingBox()
  const para = await page.getByText("Nada some sem deixar rastro.").first().boundingBox()
  expect(box && para && Math.abs(box.y - para.y)).toBeLessThan(400)
  const width = await key.evaluate((el) => el.getBoundingClientRect())
  expect(width.width).toBeGreaterThanOrEqual(44)
  expect(width.height).toBeGreaterThanOrEqual(44)
  await key.click()
  await expect(page.getByRole("button", { name: "Chave de latão, achado" })).toBeVisible()
  await expect(page.getByRole("button", { name: /achados: 1 de 7/ })).toBeVisible()
})
