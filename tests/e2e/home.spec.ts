/**
 * Home (docs/specs/pages/home.md): estrutura, axe nos 4 temas, chamadas,
 * pendências, 404, teclado, achados e metadados. Roda nos três motores.
 */
import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import { applyTheme, collectConsole, scrollThrough, THEMES } from "./helpers"

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

const SECTION_TITLES = [
  "Projetos em destaque",
  "O que eu faço",
  "O que dizem sobre o trabalho",
  "Resultado medido",
  "Desenvolvedor que veio do design de produto",
  "Vamos trabalhar no seu projeto",
]

async function focusedName(page: Page) {
  return page.evaluate(() => {
    const a = document.activeElement
    if (!a || a === document.body) return null
    return (a.getAttribute("aria-label") || a.textContent || "")
      .trim()
      .replace(/\s+/g, " ")
  })
}

for (const theme of THEMES) {
  test(`CA-2: axe sem violações e console limpo no tema ${theme}`, async ({ page }) => {
    const messages = collectConsole(page)
    await applyTheme(page, theme)
    await page.goto("/", { waitUntil: "networkidle" })
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
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
  await expect(page.locator("h1")).toHaveText("Front-end com visão de produto.")
  const h2 = await page.locator("main h2").allTextContents()
  expect(h2.map((t) => t.trim())).toEqual(SECTION_TITLES)
  await expect(page.locator("main #contato")).toHaveCount(1)
})

test("CA-3: com o WhatsApp pendente, as chamadas nunca levam a link quebrado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "load" })
  const talk = page.getByRole("link", { name: "Vamos conversar" })
  await expect(talk).toHaveCount(2)
  for (const link of await talk.all())
    await expect(link).toHaveAttribute("href", "#contato")
  await expect(page.getByRole("link", { name: "Solicitar orçamento" })).toHaveAttribute(
    "href",
    "mailto:vctgab.ux@gmail.com?subject=Or%C3%A7amento",
  )
  await page.locator("main").getByRole("link", { name: "Vamos conversar" }).click()
  await expect(page).toHaveURL(/#contato$/)
  await expect(
    page.getByRole("heading", { name: "Vamos trabalhar no seu projeto" }),
  ).toBeInViewport()

  // Fora da Home, o cabeçalho leva ao contato da Home.
  await page.goto("/sobre", { waitUntil: "load" })
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Vamos conversar" }),
  ).toHaveAttribute("href", "/#contato")
})

test("CA-4: toda pendência aparece como [a confirmar: …]", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" })
  const marks = await page.locator("main [data-pendente]").allTextContents()
  expect(marks.length).toBeGreaterThan(10)
  for (const m of marks) expect(m).toMatch(/^\[a confirmar: [^\]]+\]$/)
  // Vídeo pendente: Ficha marcada, nunca um player vazio (CA-8).
  await expect(page.locator("main video")).toHaveCount(0)
  await expect(
    page.getByText("[a confirmar: vídeo do Nexuscoop, até 30 s, sem som]"),
  ).toBeVisible()
})

test("CA-5: ficha da faixa leva à 404 'Trilha perdida', com volta à Home", async ({
  page,
}) => {
  const messages = collectConsole(page)
  await page.goto("/", { waitUntil: "networkidle" })
  await scrollThrough(page)
  // Sem pré-busca das rotas inexistentes: nenhum 404 no console da Home.
  expect(messages.filter((m) => /404|Failed to load/.test(m))).toEqual([])
  // A faixa pode estar em movimento: o clique vai pelo link original.
  await page.getByRole("link", { name: "Nexuscoop" }).first().click({ force: true })
  await expect(
    page.getByRole("heading", { level: 1, name: "Trilha perdida" }),
  ).toBeVisible()
  await expect(page).toHaveURL(/\/projetos\/nexuscoop$/)
  const direct = await page.request.get("/projetos/nexuscoop")
  expect(direct.status()).toBe(404)
  await page.getByRole("link", { name: "Voltar para a página inicial" }).click()
  await expect(page).toHaveURL(/\/$/)
})

test("CA-6: teclado de ponta a ponta no desktop", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "No WebKit o Tab pula links (CN-01)")
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  const order: string[] = []
  for (let i = 0; i < 26; i++) {
    await page.keyboard.press("Tab")
    const name = await focusedName(page)
    if (name) order.push(name)
  }
  const expected = [
    "Pular para o conteúdo",
    "Victor Gabriel, início",
    "Projetos",
    "Sobre",
    "Contato",
    "Escolher tema",
    "Vamos conversar",
    "Vamos conversar",
    "Algo entre as formas do hero",
    "Nexuscoop",
    "OIA",
    "Cinnatra",
    "Kasb Health",
    "Ver todos os projetos",
    "Natália Oliveira",
    "Mais sobre mim",
    "Solicitar orçamento",
    "vctgab.ux@gmail.com",
    "github.com/vctgab (abre em nova aba)",
    "Algo pousado perto do correio",
  ]
  expect(order.slice(0, expected.length)).toEqual(expected)
})

test("CA-6: tema pelo teclado: abre, troca com as setas, fecha com Esc e persiste", async ({
  page,
}) => {
  // Sem tema salvo e com sistema claro, começa no ipê (o applyTheme regravaria a cada reload).
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "ipe")
  const trigger = page.getByRole("button", { name: "Escolher tema" })
  await trigger.focus()
  await page.keyboard.press("Enter")
  const group = page.getByRole("radiogroup", { name: "Tema" })
  await expect(group).toBeVisible()
  // Tab até o grupo (cai no tema marcado) e seta segurada, como uma pessoa (D-707).
  for (
    let i = 0;
    i < 4 &&
    !(await group
      .getByRole("radio", { name: /Ipê/ })
      .evaluate((el) => el === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab")
  await expect(group.getByRole("radio", { name: /Ipê/ })).toBeFocused()
  await page.keyboard.down("ArrowRight")
  await page.waitForTimeout(60)
  await page.keyboard.up("ArrowRight")
  await expect(page.locator("html")).toHaveAttribute("data-theme", "noturno")
  await page.keyboard.press("Escape")
  await expect(group).toBeHidden()
  await expect(trigger).toBeFocused()
  await page.reload({ waitUntil: "networkidle" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "noturno")
})

test("CA-6: menu mobile em Drawer, com Esc e foco de volta", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/", { waitUntil: "networkidle" })
  const open = page.getByRole("button", { name: "Abrir menu" })
  await open.focus()
  await page.keyboard.press("Enter")
  const dialog = page.getByRole("dialog", { name: "Menu" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("link", { name: "Projetos" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(open).toBeFocused()
  // O CTA do menu leva ao contato sem o foco puxar a página de volta ao topo.
  await open.click()
  await dialog.getByRole("link", { name: "Vamos conversar" }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/#contato$/)
  await expect(
    page.getByRole("heading", { name: "Vamos trabalhar no seu projeto" }),
  ).toBeInViewport()
})

test("CA-12: pinha e coruja pelo teclado contam no caderno; alvo de 44 px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto("/", { waitUntil: "networkidle" })
  for (const label of ["Algo entre as formas do hero", "Algo pousado perto do correio"]) {
    const finder = page.getByRole("button", { name: label })
    const box = await finder.boundingBox()
    expect(box && box.width >= 44 && box.height >= 44).toBe(true)
    await finder.focus()
    await page.keyboard.press("Enter")
  }
  await expect(
    page.getByRole("button", { name: "Coruja do correio, achado" }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(
    page.getByRole("button", { name: /Achados: 2 de 7/ }).first(),
  ).toBeVisible()
})

test("AC-04: todo controle da Home tem 44 px ou mais", async ({ page }) => {
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
        .filter((el) => !(el.tagName === "A" && el.closest("p")))
        .filter((el) => !el.closest("[data-faixa]") || el.closest("article"))
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

test("movimento reduzido: faixa e hero parados", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto("/", { waitUntil: "networkidle" })
  const running = await page.evaluate(
    () => document.getAnimations().filter((a) => a.playState === "running").length,
  )
  expect(running).toBe(0)
  await context.close()
})

test("CA-9: metadados, Open Graph, sitemap, robots e JSON-LD", async ({
  page,
  request,
}) => {
  await page.goto("/", { waitUntil: "load" })
  await expect(page).toHaveTitle("Victor Gabriel, desenvolvedor front-end")
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Desenvolvedor front-end em Teresina/,
  )
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")
  const og = await page.locator('meta[property="og:image"]').getAttribute("content")
  expect(og).toMatch(/\/opengraph-image/)
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
    jobTitle: "Desenvolvedor front-end",
    sameAs: ["https://github.com/vctgab"],
  })

  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Disallow: /sistema")
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).not.toContain("/sistema")
})
