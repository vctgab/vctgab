import type { Page } from "@playwright/test"

export const THEMES = ["ipe", "noturno", "outono", "inverno"] as const
export type ThemeId = (typeof THEMES)[number]

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

/** Define o tema antes de qualquer script da página (o mesmo que o script do <head> lê). */
export async function applyTheme(page: Page, theme: ThemeId): Promise<void> {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("vg-tema", t)
    } catch {
      // sem armazenamento: o tema segue o sistema
    }
  }, theme)
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
