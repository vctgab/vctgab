import type { ReactNode } from "react"
import { DEFAULT_MODE, DEFAULT_SEASON, THEME_COMBOS } from "@/lib/theme/themes"

/**
 * Regras que mostram só o bloco da combinação (estação e modo) ativa, sem
 * JavaScript. O servidor não conhece o tema; o CSS escolhe. Use uma vez por
 * página.
 */
export function ThemeOnlyStyle() {
  const rules = THEME_COMBOS.map(
    (c) =>
      `[data-season="${c.season}"][data-mode="${c.mode}"] [data-so-tema="${c.id}"]{display:block}` +
      (c.season === DEFAULT_SEASON && c.mode === DEFAULT_MODE
        ? `:root:not([data-season]) [data-so-tema="${c.id}"]{display:block}`
        : ""),
  )
  return <style>{`[data-so-tema]{display:none}${rules.join("")}`}</style>
}

/** Conteúdo visível só quando a combinação `id` (`estacao-modo`) estiver ativa. */
export function ThemeOnly({ id, children }: { id: string; children: ReactNode }) {
  return <div data-so-tema={id}>{children}</div>
}
