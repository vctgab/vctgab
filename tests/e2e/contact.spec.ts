/**
 * Página /contato (docs/specs/pages/contact.md): abas por ?aba=, assunto do
 * e-mail, histórico, teclado, axe e a mesa. O Chromium audita as 8
 * combinações; WebKit e Firefox, a primavera clara e escura (D-1113).
 */
import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { applyTheme, collectConsole, expectTheme, THEMES } from "./helpers"

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

for (const theme of THEMES) {
  test(`CA-4: axe sem violações e console limpo no tema ${theme}`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium" && !theme.startsWith("primavera"),
      "Fora do Chromium, só a primavera clara e escura (D-1113)",
    )
    const messages = collectConsole(page)
    await applyTheme(page, theme)
    await page.goto("/contato?aba=projeto", { waitUntil: "networkidle" })
    await expectTheme(page, theme)
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
    const violations = results.violations.map((v) => ({
      id: v.id,
      alvos: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }))
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    expect(messages.filter((m) => !m.includes("favicon"))).toEqual([])
  })
}

test("CA-1: ?aba=projeto abre em projeto; sem ?aba=, em vaga, com o assunto certo", async ({
  page,
}) => {
  await page.goto("/contato?aba=projeto", { waitUntil: "networkidle" })
  await expect(page.locator("h1")).toHaveText("contato")
  await expect(page.getByRole("radio", { name: "projeto" })).toBeChecked()
  await expect(
    page.getByRole("heading", { level: 2, name: "sobre o projeto" }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "vctgab.ux@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:vctgab.ux@gmail.com?subject=Projeto",
  )
  await expect(
    page.locator("main").getByText("[a confirmar: URL do LinkedIn]"),
  ).toBeVisible()

  for (const url of ["/contato", "/contato?aba=orcamento"]) {
    await page.goto(url, { waitUntil: "networkidle" })
    await expect(page.getByRole("radio", { name: "vaga" })).toBeChecked()
    await expect(
      page.getByRole("heading", { level: 2, name: "sobre a vaga" }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "vctgab.ux@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:vctgab.ux@gmail.com?subject=Vaga",
    )
  }
})

test("CA-2: trocar a aba reescreve ?aba= sem rolar nem criar histórico", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto("/contato", { waitUntil: "networkidle" })
  const control = page.getByRole("radio", { name: "projeto" })
  await control.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => ({ y: window.scrollY, h: history.length }))
  await control.click()
  await expect(page).toHaveURL(/\/contato\?aba=projeto$/)
  await expect(
    page.getByRole("heading", { level: 2, name: "sobre o projeto" }),
  ).toBeVisible()
  const after = await page.evaluate(() => ({ y: window.scrollY, h: history.length }))
  expect(after).toEqual(before)
})

test("CA-3: Tab até o controle; setas e Espaço trocam a aba", async ({ page }) => {
  await page.goto("/contato", { waitUntil: "networkidle" })
  const vaga = page.getByRole("radio", { name: "vaga" })
  await vaga.focus()
  await page.keyboard.press("ArrowRight")
  const projeto = page.getByRole("radio", { name: "projeto" })
  await expect(projeto).toBeFocused()
  await page.keyboard.press("Space")
  await expect(projeto).toBeChecked()
  await expect(page).toHaveURL(/\?aba=projeto$/)
})

test("CA-5: a mesa conta no caderno, com alvo de 44 px", async ({ page }) => {
  await page.goto("/contato", { waitUntil: "networkidle" })
  const mesa = page.getByRole("button", { name: "Algo em cima da mesa" })
  const box = await mesa.boundingBox()
  expect(box && box.width >= 44 && box.height >= 44).toBe(true)
  await mesa.click()
  await expect(
    page.getByRole("button", { name: "Mesa de contato, achado" }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(
    page.getByRole("banner").getByRole("button", { name: /^achados: 1 de 7/ }),
  ).toBeVisible()
})
