import { expect, type Page } from "@playwright/test"

export const SEASONS = ["primavera", "verao", "outono", "inverno"] as const
export const MODES = ["claro", "escuro"] as const
export type SeasonId = (typeof SEASONS)[number]
export type ModeId = (typeof MODES)[number]

/** As 8 combinações `estacao-modo`, na ordem do CSS. */
export const THEMES = SEASONS.flatMap((s) =>
  MODES.map((m) => `${s}-${m}` as `${SeasonId}-${ModeId}`),
)
export type ThemeId = (typeof THEMES)[number]

/** Separa `estacao-modo` nas duas escolhas. */
export function splitTheme(theme: ThemeId): { season: SeasonId; mode: ModeId } {
  const [season, mode] = theme.split("-") as [SeasonId, ModeId]
  return { season, mode }
}

export const SYSTEM_PAGES = [
  "/sistema",
  "/sistema/cores",
  "/sistema/tipografia",
  "/sistema/espaco",
  "/sistema/formas",
  "/sistema/componentes",
  "/sistema/conteudo",
  "/sistema/achados",
  "/sistema/hero",
  "/sistema/temas",
  "/sistema/acessibilidade",
] as const

/**
 * Define estação e modo antes de qualquer script da página (as mesmas duas
 * chaves que o script do <head> lê). Regrava a cada navegação.
 */
export async function applyTheme(page: Page, theme: ThemeId): Promise<void> {
  const { season, mode } = splitTheme(theme)
  await page.addInitScript(
    ([s, m]) => {
      try {
        window.localStorage.setItem("vg-estacao", s as string)
        window.localStorage.setItem("vg-modo", m as string)
      } catch {
        // sem armazenamento: o tema segue o calendário e o sistema
      }
    },
    [season, mode],
  )
}

/** Confere que o <html> tem a estação e o modo da combinação. */
export async function expectTheme(page: Page, theme: ThemeId): Promise<void> {
  const { season, mode } = splitTheme(theme)
  const html = page.locator("html")
  await expect(html).toHaveAttribute("data-season", season)
  await expect(html).toHaveAttribute("data-mode", mode)
}

/** Coleta erros e avisos do console (inclui avisos de hidratação do React). */
export function collectConsole(page: Page): string[] {
  const messages: string[] = []
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning")
      messages.push(`${m.type()}: ${m.text()}`)
  })
  page.on("pageerror", (e) => messages.push(`pageerror: ${e.message}`))
  return messages
}

/** Rola a página inteira para os blocos com Reveal entrarem. */
export async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 30))
    }
    window.scrollTo(0, 0)
  })
}
