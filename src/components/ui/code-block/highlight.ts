import { createCssVariablesTheme, createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import bash from "shiki/langs/bash.mjs"
import json from "shiki/langs/json.mjs"
import tsx from "shiki/langs/tsx.mjs"
import ts from "shiki/langs/typescript.mjs"

/**
 * Realce de sintaxe no servidor (D-1307): `shiki` só roda aqui, no build e no
 * servidor, e entrega HTML estático. O tema `css-variables` usa as variáveis
 * `--shiki-*` de src/styles/base.css, ligadas a tokens semânticos (D-1308).
 */
export type CodeLanguage = "ts" | "tsx" | "json" | "bash"

export const LANGUAGE_LABEL: Record<CodeLanguage, string> = {
  ts: "TypeScript",
  tsx: "TSX",
  json: "JSON",
  bash: "Shell",
}

const theme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
})

let highlighter: ReturnType<typeof createHighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [theme],
    langs: [ts, tsx, json, bash],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighter
}

/** HTML do `<pre><code>` realçado, com `tabindex` e nome para rolar pelo teclado. */
export async function highlight(code: string, language: CodeLanguage): Promise<string> {
  // Em cache (Cache Components): o realce roda uma vez por trecho, no build, e a
  // inicialização do shiki (que lê o relógio) não vira valor instável no render.
  "use cache"
  const h = await getHighlighter()
  return h.codeToHtml(code, {
    lang: language,
    theme: "css-variables",
    transformers: [
      {
        pre(node) {
          node.properties = {
            class: "code-block-pre",
            tabindex: "0",
            role: "region",
            "aria-label": `Código ${LANGUAGE_LABEL[language]}`,
          }
        },
      },
    ],
  })
}
