/**
 * Pontos de risco entre motores (etapa 0.3): color-mix(), script de tema
 * antes da primeira pintura, LiveClock e suporte de hifenização e
 * text-wrap. Roda em chromium, webkit e firefox.
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { expect, test } from "@playwright/test"
import { applyTheme, collectConsole, THEMES } from "./helpers"

interface GeneratedTheme {
  id: string
  semantic: Record<string, string>
}

const generated = JSON.parse(
  readFileSync(join(process.cwd(), "src/styles/tokens.generated.json"), "utf8"),
) as { themes: GeneratedTheme[] }

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

for (const theme of THEMES) {
  test(`color-mix: tokens semânticos do tema ${theme} pintam o hex do build`, async ({
    page,
  }) => {
    const expected = Object.entries(
      generated.themes.find((t) => t.id === theme)?.semantic ?? {},
    ).filter(([, v]) => /^#[0-9A-F]{6}$/i.test(v))
    expect(expected.length).toBeGreaterThan(30)

    await applyTheme(page, theme)
    await page.goto("/sistema", { waitUntil: "load" })
    const painted = await page.evaluate(
      (names) => {
        // O canvas normaliza qualquer sintaxe (rgb(), color(srgb …)) em pixels.
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 1
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        const probe = document.createElement("span")
        document.body.append(probe)
        const out: Record<string, number[]> = {}
        for (const name of names) {
          probe.style.color = `var(--${name})`
          const color = getComputedStyle(probe).color
          if (!ctx) continue
          ctx.clearRect(0, 0, 1, 1)
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 1, 1)
          out[name] = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3))
        }
        probe.remove()
        return out
      },
      expected.map(([name]) => name),
    )

    const off = expected
      .map(([name, hex]) => {
        const want = hexToRgb(hex)
        const got = painted[name] ?? []
        const delta = Math.max(...want.map((c, i) => Math.abs(c - (got[i] ?? -99))))
        return { name, hex, got: got.join(","), delta }
      })
      // ±1 por canal: arredondamento de cada motor no color-mix.
      .filter((x) => x.delta > 1)
    expect(off).toEqual([])
  })
}

test("tema salvo já está no <html> quando o <body> entra (antes da primeira pintura)", async ({
  page,
}) => {
  await applyTheme(page, "outono")
  await page.addInitScript(() => {
    const w = window as unknown as { __temaNoBody?: string | null }
    new MutationObserver((_, obs) => {
      if (document.body) {
        w.__temaNoBody = document.documentElement.getAttribute("data-theme")
        obs.disconnect()
      }
    }).observe(document, { childList: true, subtree: true })
  })
  await page.goto("/", { waitUntil: "load" })
  const seen = await page.evaluate(
    () => (window as unknown as { __temaNoBody?: string | null }).__temaNoBody,
  )
  expect(seen).toBe("outono")
})

test("sem tema salvo e com sistema escuro, abre no noturno", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" })
  const page = await context.newPage()
  await page.goto("/", { waitUntil: "load" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "noturno")
  await context.close()
})

test("LiveClock mostra a hora de Teresina, avança e não gera aviso", async ({ page }) => {
  const messages = collectConsole(page)
  await page.goto("/sistema/hero", { waitUntil: "networkidle" })
  const clock = page.locator("main time").first()
  await expect(clock).toHaveText(/^\d{2}:\d{2}:\d{2}$/)
  const first = await clock.textContent()
  // America/Fortaleza (UTC−3): compara com a hora calculada aqui.
  const [h, m] = (first ?? "").split(":").map(Number)
  const now = new Date(Date.now() - 3 * 3600 * 1000)
  const diff = Math.abs(
    (h ?? 0) * 60 + (m ?? 0) - (now.getUTCHours() * 60 + now.getUTCMinutes()),
  )
  expect(Math.min(diff, 1440 - diff)).toBeLessThanOrEqual(1)
  await expect(clock).not.toHaveText(first ?? "", { timeout: 3000 })
  await expect(clock).toHaveAttribute("aria-label", /^Horário em Teresina: \d{2}:\d{2}$/)
  expect(messages.filter((m) => !m.includes("favicon"))).toEqual([])
})

test("suporte de hifenização e text-wrap (registro, não falha)", async ({
  page,
}, testInfo) => {
  await page.goto("/sistema/tipografia", { waitUntil: "load" })
  const support = await page.evaluate(() => ({
    hyphensAuto: CSS.supports("hyphens", "auto"),
    hyphenateLimitChars: CSS.supports("hyphenate-limit-chars", "7 4 3"),
    textWrapPretty: CSS.supports("text-wrap", "pretty"),
    textWrapBalance: CSS.supports("text-wrap", "balance"),
    colorMix: CSS.supports("color", "color-mix(in srgb, red 50%, white)"),
    has: CSS.supports("selector(:has(a))"),
    round: CSS.supports("width", "round(10px, 1px)"),
    // Dicionário de pt-BR presente? Numa coluna estreita, palavras longas
    // hifenizadas ocupam menos linhas que sem hifenização.
    hyphenatesPtBr: (() => {
      const box = document.createElement("p")
      box.lang = "pt-BR"
      box.style.cssText =
        "width:9ch;position:absolute;visibility:hidden;font-size:16px;overflow-wrap:normal;word-break:normal"
      box.textContent = "desenvolvimento responsabilidade compartilhamento"
      document.body.append(box)
      box.style.hyphens = "manual"
      const manual = box.getBoundingClientRect().height
      box.style.hyphens = "auto"
      const auto = box.getBoundingClientRect().height
      box.remove()
      // Sem dicionário, a palavra longa transborda numa linha só; com ele, quebra.
      return auto !== manual
    })(),
  }))
  testInfo.annotations.push({ type: "suporte", description: JSON.stringify(support) })
  console.log(`[${testInfo.project.name}] ${JSON.stringify(support)}`)
  // O que o sistema exige para funcionar (o resto é refinamento progressivo).
  expect(support.colorMix).toBe(true)
  expect(support.has).toBe(true)
})
