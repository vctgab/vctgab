import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import {
  applyTheme,
  collectConsole,
  scrollThrough,
  SYSTEM_PAGES,
  THEMES,
} from "./helpers"

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

for (const theme of THEMES) {
  test.describe(`tema ${theme}`, () => {
    for (const path of SYSTEM_PAGES) {
      test(`${path}: axe sem violações e console limpo`, async ({ page }) => {
        const messages = collectConsole(page)
        await applyTheme(page, theme)
        await page.goto(path, { waitUntil: "networkidle" })
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
        await scrollThrough(page)
        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        const violations = results.violations.map((v) => ({
          id: v.id,
          impacto: v.impact,
          alvos: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
        }))
        expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
        expect(messages.filter((m) => !m.includes("favicon"))).toEqual([])
      })
    }
  })
}

test.describe("teclado e alvo", () => {
  test("o primeiro Tab mostra 'Pular para o conteúdo' e leva ao conteúdo", async ({
    page,
    browserName,
  }) => {
    await page.goto("/sistema/componentes", { waitUntil: "networkidle" })
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" })
    // No WebKit, o Tab não chega a links (padrão do Safari): foca direto.
    if (browserName === "webkit") await skip.focus()
    else await page.keyboard.press("Tab")
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#conteudo$/)
  })

  test("AC-04: todo controle da vitrine de componentes tem 44 px ou mais", async ({
    page,
  }) => {
    await page.goto("/sistema/componentes", { waitUntil: "networkidle" })
    const small = await page.evaluate(() => {
      const selector =
        'main button, main a[href], main input:not([type="hidden"]), main select, main textarea, main [role="radio"], main [role="switch"], main [role="checkbox"]'
      return (
        Array.from(document.querySelectorAll<HTMLElement>(selector))
          .filter((el) => el.offsetParent !== null)
          // Espelhos nativos do Radix (select e checkbox ocultos para formulário):
          // aria-hidden e fora da ordem de foco, não são alvo.
          .filter((el) => !(el.getAttribute("aria-hidden") === "true" && el.tabIndex < 0))
          // WCAG 2.5.8 isenta links dentro de frases.
          .filter((el) => !(el.tagName === "A" && el.closest("p")))
          .map((el) => {
            // O alvo é o próprio elemento ou a linha/rótulo que o contém (checkbox e rádio).
            const target = el.closest<HTMLElement>("[class*='min-h-11']") ?? el
            const r = target.getBoundingClientRect()
            return {
              name: el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 40),
              w: r.width,
              h: r.height,
            }
          })
          .filter((b) => b.h < 44 || b.w < 24)
      )
    })
    expect(small).toEqual([])
  })

  test("o seletor de tema troca data-theme e persiste", async ({ page }) => {
    await page.goto("/sistema", { waitUntil: "networkidle" })
    const group = page.getByRole("radiogroup", { name: "Tema" }).first()
    await group.getByRole("radio", { name: /Inverno/ }).click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "inverno")
    await page.reload({ waitUntil: "networkidle" })
    await expect(page.locator("html")).toHaveAttribute("data-theme", "inverno")
  })

  test("rádio marca com as setas no navegador real", async ({ page }) => {
    await page.goto("/sistema/componentes", { waitUntil: "networkidle" })
    const group = page.getByRole("radiogroup", { name: "Tipo de projeto" })
    await group.getByRole("radio", { name: "Produto digital" }).focus()
    // O Radix move o foco num setTimeout e marca só se a seta ainda estiver
    // pressionada; segura a tecla como uma pessoa faria.
    await page.keyboard.down("ArrowDown")
    await page.waitForTimeout(60)
    await page.keyboard.up("ArrowDown")
    await expect(group.getByRole("radio", { name: "Design system" })).toBeChecked()
  })
})

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" })

  test("hero e rodapé ficam parados", async ({ page }) => {
    await page.goto("/sistema/hero", { waitUntil: "networkidle" })
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .map((a) => (a.effect as KeyframeEffect | null)?.target?.toString() ?? "?"),
    )
    expect(running).toEqual([])
    const before = await page.locator("[data-forma-hero] path").first().getAttribute("d")
    await page.mouse.move(400, 300)
    await page.waitForTimeout(600)
    const after = await page.locator("[data-forma-hero] path").first().getAttribute("d")
    expect(after).toBe(before)
  })
})

test("sem JavaScript, o conteúdo com Reveal continua visível", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("/sistema/conteudo")
  await expect(page.locator("[data-reveal]").first()).toHaveCSS("opacity", "1")
  await context.close()
})
