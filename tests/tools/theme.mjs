// Ajuda das ferramentas de QA: aplica uma combinação `estacao-modo` (por exemplo
// `verao-escuro`) antes de qualquer script da página, gravando as mesmas duas
// chaves que o script do <head> lê.
export const SEASONS = ["primavera", "verao", "outono", "inverno"]
export const MODES = ["claro", "escuro"]
export const THEMES = SEASONS.flatMap((s) => MODES.map((m) => `${s}-${m}`))

/** Aplica a combinação ao contexto (ou página) do Playwright. */
export async function applyTheme(target, theme) {
  const [season, mode] = theme.split("-")
  await target.addInitScript(
    ([s, m]) => {
      try {
        localStorage.setItem("vg-estacao", s)
        localStorage.setItem("vg-modo", m)
      } catch {
        // sem armazenamento: vale o calendário e o sistema
      }
    },
    [season, mode],
  )
}

/** Lê a combinação aplicada ao <html> como `estacao-modo`. */
export async function readTheme(page) {
  const season = await page.getAttribute("html", "data-season")
  const mode = await page.getAttribute("html", "data-mode")
  return `${season}-${mode}`
}
