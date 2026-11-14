import { DARK_THEME, DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from "./themes"

/**
 * Script bloqueante do `<head>`: define `data-theme` antes da primeira
 * pintura (sem flash). Ordem: escolha salva válida, depois
 * `prefers-color-scheme` (escuro leva ao tema escuro), depois o padrão.
 * Também atualiza o `<meta name="theme-color">`. Tudo em try/catch: sem
 * armazenamento, o tema segue o sistema.
 */
export function themeScript(): string {
  const ids = JSON.stringify(THEMES.map((t) => t.id))
  const colors = JSON.stringify(
    Object.fromEntries(THEMES.map((t) => [t.id, t.themeColor])),
  )
  return `(function(){var d=document.documentElement;d.setAttribute("data-js","");var ids=${ids},c=${colors},t=null;try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(ids.indexOf(s)>-1)t=s}catch(e){}if(!t){try{t=matchMedia("(prefers-color-scheme: dark)").matches?${JSON.stringify(DARK_THEME)}:${JSON.stringify(DEFAULT_THEME)}}catch(e){t=${JSON.stringify(DEFAULT_THEME)}}}d.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",c[t])})()`
}
