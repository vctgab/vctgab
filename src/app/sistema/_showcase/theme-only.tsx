import type { ReactNode } from "react"
import { DEFAULT_THEME, THEMES } from "@/lib/theme/themes"

/**
 * Regras que mostram só o bloco do tema ativo (sem JavaScript). O servidor
 * não conhece o tema; o CSS escolhe. Use uma vez por página.
 */
export function ThemeOnlyStyle() {
  const rules = THEMES.map(
    (t) =>
      `[data-theme="${t.id}"] [data-so-tema="${t.id}"]{display:block}` +
      (t.id === DEFAULT_THEME
        ? `:root:not([data-theme]) [data-so-tema="${t.id}"]{display:block}`
        : ""),
  )
  return <style>{`[data-so-tema]{display:none}${rules.join("")}`}</style>
}

/** Conteúdo visível só quando o tema `id` estiver ativo. */
export function ThemeOnly({ id, children }: { id: string; children: ReactNode }) {
  return <div data-so-tema={id}>{children}</div>
}
