/**
 * Home v2 (docs/specs/pages/home.md): estrutura, axe nas 8 combinações de
 * estação e modo, CTAs, pendências, contador de achados, nome da estação,
 * teclado, achados e metadados. Roda nos três motores.
 */
import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import {
  applyTheme,
  collectConsole,
  expectTheme,
  scrollThrough,
  THEMES,
  type ThemeId,
} from "./helpers"

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

const SECTION_TITLES = [
  "o que eu ando construindo",
  "do layout ao deploy",
  "depoimento e números",
  "prazer, Victor",
  "bora conversar?",
]

/** Nome do elemento focado: aria-label ou o texto renderizado (sem os spans escondidos). */
async function focusedName(page: Page) {
  return page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null
    if (!a || a === document.body) return null
    return (a.getAttribute("aria-label") || a.innerText || "").trim().replace(/\s+/g, " ")
  })
}

for (const theme of THEMES) {
  test(`CA-2: axe sem violações e console limpo no tema ${theme}`, async ({ page }) => {
    const messages = collectConsole(page)
    await applyTheme(page, theme)
    await page.goto("/", { waitUntil: "networkidle" })
    await expectTheme(page, theme)
    await scrollThrough(page)
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
    const violations = results.violations.map((v) => ({
      id: v.id,
      alvos: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }))
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    expect(messages.filter((m) => !m.includes("favicon"))).toEqual([])
  })
}

test("CA-1: um h1 e as seções na ordem do pedido", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" })
  await expect(page.locator("h1")).toHaveCount(1)
  await expect(page.locator("h1")).toHaveText(
    "Comecei desenhando as telas. Hoje eu coloco elas no ar.",
  )
  const h2 = await page.locator("main h2").allTextContents()
  expect(h2.map((t) => t.trim())).toEqual(SECTION_TITLES)
  // O hero vem antes de tudo; o contato é a última seção do main.
  const sections = await page
    .locator("main > section")
    .evaluateAll((els) => els.map((e) => e.id || e.getAttribute("aria-labelledby")))
  expect(sections[0]).toBe("hero-home-titulo")
  expect(sections.at(-1)).toBe("contato")
  await expect(page.locator("main #projetos article")).toHaveCount(4)
  await expect(page.locator("main #o-que-eu-faco ol > li")).toHaveCount(4)
})

test("CA-3: os CTAs levam ao /contato com a aba certa marcada", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "load" })
  const vaga = page.getByRole("link", { name: "tenho uma vaga" })
  const projeto = page.getByRole("link", { name: "tenho um projeto" })
  await expect(vaga).toHaveCount(2)
  await expect(projeto).toHaveCount(2)
  for (const link of await vaga.all())
    await expect(link).toHaveAttribute("href", "/contato?aba=vaga")
  for (const link of await projeto.all())
    await expect(link).toHaveAttribute("href", "/contato?aba=projeto")
  await projeto.first().click()
  await expect(page).toHaveURL(/\/contato\?aba=projeto$/)
  await expect(page.getByRole("radio", { name: "projeto" })).toBeChecked()
})

test("CA-4: toda pendência aparece como [a confirmar: …]", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" })
  const marks = await page.locator("[data-pendente]").allTextContents()
  for (const m of marks) expect(m).toMatch(/^\[a confirmar: [^\]]+\]$/)
  for (const what of [
    "captura do Nexuscoop",
    "captura do Kasb Health",
    "captura da Suíte OdiN",
    "captura do Lance!",
    "depoimento voltado a dev, de preferência sobre a atuação como tech lead",
    "como foi medido e o tempo final em segundos",
    "validar: arquivos ou testes",
    "foto do Victor",
    "URL do LinkedIn",
    "arquivo do CV em PDF",
    "confirmar o sobrenome usado no site",
  ])
    expect(marks).toContain(`[a confirmar: ${what}]`)
  // Sem citação inventada nem player vazio.
  await expect(page.locator("main blockquote")).toHaveCount(0)
  await expect(page.locator("main video")).toHaveCount(0)
})

test("CA-4: ficha de projeto leva à 404 'Trilha perdida', sem pré-busca", async ({
  page,
}) => {
  const messages = collectConsole(page)
  await page.goto("/", { waitUntil: "networkidle" })
  await scrollThrough(page)
  expect(messages.filter((m) => /404|Failed to load/.test(m))).toEqual([])
  await page.getByRole("link", { name: "Nexuscoop" }).click()
  await expect(
    page.getByRole("heading", { level: 1, name: "Trilha perdida" }),
  ).toBeVisible()
  await expect(page).toHaveURL(/\/projetos\/nexuscoop$/)
  const direct = await page.request.get("/projetos/nexuscoop")
  expect(direct.status()).toBe(404)
})

test("CA-5: contador do cabeçalho ao vivo, abre o caderno e devolve o foco", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  const header = page.getByRole("banner")
  const counter = header.getByRole("button", { name: /^achados: 0 de 7/ })
  await expect(counter).toBeVisible()
  await expect(page.getByRole("contentinfo")).toContainText(
    "Achados: 0 de 7. Tem coisa escondida por aqui.",
  )
  await page.getByRole("button", { name: "Algo entre as formas do hero" }).click()
  await expect(header.getByRole("button", { name: /^achados: 1 de 7/ })).toBeVisible()
  await expect(page.getByRole("contentinfo")).toContainText("Achados: 1 de 7.")
  const open = header.getByRole("button", { name: /^achados: 1 de 7/ })
  await open.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(open).toBeFocused()
})

test("CA-6: o nome da estação já vem certo sem React e muda ao trocar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await applyTheme(page, "outono-escuro")
  // Sem os scripts do Next: só o script do <head> e o CSS decidem o nome.
  await page.route(/\/_next\/static\/.*\.js$/, (route) => route.abort())
  await page.goto("/", { waitUntil: "load" })
  const seasonText = page.getByRole("banner").locator("[data-season-only]:visible")
  await expect(seasonText).toHaveCount(1)
  await expect(seasonText).toHaveText("estação: outono")
  await page.unroute(/\/_next\/static\/.*\.js$/)

  await page.goto("/", { waitUntil: "networkidle" })
  const trigger = page.getByRole("button", { name: "estação: outono" })
  await trigger.click()
  await page
    .getByRole("radiogroup", { name: "Estação" })
    .getByRole("radio", { name: /Inverno/ })
    .click()
  await expect(page.locator("html")).toHaveAttribute("data-season", "inverno")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("button", { name: "estação: inverno" })).toBeVisible()
})

test("CA-7: teclado de ponta a ponta no desktop", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "No WebKit o Tab pula links (CN-01)")
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  const order: string[] = []
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab")
    const name = await focusedName(page)
    if (name) order.push(name)
  }
  const expected: (string | RegExp)[] = [
    "Pular para o conteúdo",
    "Victor Gabriel, início",
    "projetos",
    "sobre",
    "contato",
    /^achados: 0 de 7/,
    /^estação: (primavera|verão|outono|inverno)$/,
    "tenho uma vaga",
    "tenho um projeto",
    "Algo entre as formas do hero",
    "Nexuscoop",
    "Kasb Health",
    "Suíte OdiN",
    "Lance!",
    "ver todos os projetos",
    "mais sobre mim",
    "Algo para escrever perto da foto",
    "tenho uma vaga",
    "tenho um projeto",
    "vctgab.ux@gmail.com",
    "Algo pousado perto do correio",
    "Victor Gabriel, voltar ao início",
  ]
  expect(order.length).toBeGreaterThanOrEqual(expected.length)
  expected.forEach((want, i) => {
    if (typeof want === "string") expect(order[i], `posição ${i}`).toBe(want)
    else expect(order[i], `posição ${i}`).toMatch(want)
  })
})

test("CA-7: tema pelo teclado: abre, troca estação e modo, fecha com Esc e persiste", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  await expect(page.locator("html")).toHaveAttribute("data-mode", "claro")
  const trigger = page.getByRole("button", { name: /^estação:/ })
  await trigger.focus()
  await page.keyboard.press("Enter")
  const group = page.getByRole("radiogroup", { name: "Estação" })
  await expect(group).toBeVisible()
  // Tab até o grupo (cai na opção marcada) e seta segurada, como uma pessoa (D-707).
  const current = group.getByRole("radio", { checked: true })
  await expect(current).toHaveCount(1)
  for (
    let i = 0;
    i < 4 && !(await current.evaluate((el) => el === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab")
  await expect(current).toBeFocused()
  const order = ["primavera", "verao", "outono", "inverno"]
  const start = (await page.locator("html").getAttribute("data-season")) ?? "primavera"
  const previous = order[(order.indexOf(start) + 3) % 4] as string
  await page.keyboard.down("ArrowLeft")
  await page.waitForTimeout(60)
  await page.keyboard.up("ArrowLeft")
  await expect(page.locator("html")).toHaveAttribute("data-season", previous)
  await page.keyboard.press("Tab")
  const mode = page.getByRole("radiogroup", { name: "Modo" })
  await expect(mode.getByRole("radio", { name: "Claro" })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(mode.getByRole("radio", { name: "Escuro" })).toBeFocused()
  await page.keyboard.press("Space")
  await expect(page.locator("html")).toHaveAttribute("data-mode", "escuro")
  await page.keyboard.press("Escape")
  await expect(group).toBeHidden()
  await expect(trigger).toBeFocused()
  await page.reload({ waitUntil: "networkidle" })
  await expectTheme(page, `${previous}-escuro` as ThemeId)
})

test("CA-7: no mobile, links no Drawer; contador e estação no cabeçalho", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/", { waitUntil: "networkidle" })
  const header = page.getByRole("banner")
  await expect(header.getByRole("button", { name: /^achados: 0 de 7/ })).toBeVisible()
  await expect(header.getByRole("button", { name: /^estação:/ })).toBeVisible()
  await expect(header.getByRole("navigation", { name: "Principal" })).toBeHidden()
  const open = page.getByRole("button", { name: "Abrir menu" })
  await open.focus()
  await page.keyboard.press("Enter")
  const dialog = page.getByRole("dialog", { name: "Menu" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("link", { name: "projetos" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(open).toBeFocused()
  await open.click()
  await dialog.getByRole("link", { name: "contato" }).click()
  await expect(page).toHaveURL(/\/contato$/)
  await expect(dialog).toBeHidden()
})

test("CA-12: pinha, pena e coruja pelo teclado contam no caderno; alvo de 44 px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  for (const label of [
    "Algo entre as formas do hero",
    "Algo para escrever perto da foto",
    "Algo pousado perto do correio",
  ]) {
    const finder = page.getByRole("button", { name: label })
    await finder.scrollIntoViewIfNeeded()
    const box = await finder.boundingBox()
    expect(box && box.width >= 44 && box.height >= 44, label).toBe(true)
    await finder.focus()
    await page.keyboard.press("Enter")
  }
  await expect(
    page.getByRole("button", { name: "Pena de escrever, achado" }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(
    page.getByRole("banner").getByRole("button", { name: /^achados: 3 de 7/ }),
  ).toBeVisible()
})

test("CA-12: todo controle da Home tem 44 px ou mais", async ({ page }) => {
  for (const width of [390, 1366]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/", { waitUntil: "networkidle" })
    const small = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          'header a[href], header button, main a[href], main button, main [role="radio"], footer a[href], footer button',
        ),
      )
        .filter((el) => el.offsetParent !== null && !el.closest("[inert]"))
        // Links dentro de texto corrido seguem a linha (exceção da WCAG 2.5.8).
        .filter((el) => !(el.tagName === "A" && el.closest("p") && !el.closest("footer")))
        .map((el) => {
          // O link do título da Ficha cobre o card inteiro (::after): o alvo é o card.
          const r = (el.closest("article") ?? el).getBoundingClientRect()
          return {
            name: el.getAttribute("aria-label") ?? el.textContent?.trim(),
            h: r.height,
          }
        })
        .filter((b) => b.h < 44),
    )
    expect(small).toEqual([])
  }
})

test("movimento reduzido: hero parado", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto("/", { waitUntil: "networkidle" })
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        // Transições de 0,01 ms da rede de segurança de base.css não são movimento.
        .filter((a) => Number(a.effect?.getTiming().duration ?? 0) > 1).length,
  )
  expect(running).toBe(0)
  await context.close()
})

test("CA-9: metadados, Open Graph, sitemap, robots e JSON-LD", async ({
  page,
  request,
}) => {
  await page.goto("/", { waitUntil: "load" })
  await expect(page).toHaveTitle("Victor Gabriel, dev front-end e tech lead")
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Victor Gabriel, dev front-end e tech lead em Teresina/,
  )
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")
  const og = await page.locator('meta[property="og:image"]').getAttribute("content")
  expect(og).toMatch(/\/opengraph-image/)
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    /Comecei desenhando as telas\. Hoje eu coloco elas no ar\./,
  )
  const image = await request.get(new URL(og ?? "", "http://localhost:3100").pathname)
  expect(image.status()).toBe(200)
  expect(image.headers()["content-type"]).toBe("image/png")

  const ld = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
  ) as Record<string, unknown>
  expect(Object.keys(ld).sort()).toEqual(
    ["@context", "@type", "jobTitle", "name", "sameAs", "url"].sort(),
  )
  expect(ld).toMatchObject({
    "@type": "Person",
    name: "Victor Gabriel",
    jobTitle: "Desenvolvedor front-end e tech lead",
    sameAs: ["https://github.com/vctgab"],
  })

  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Disallow: /sistema")
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).not.toContain("/sistema")
})
