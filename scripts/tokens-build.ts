/**
 * pnpm tokens:build
 *
 * Lê `src/styles/tokens.css` e `src/styles/themes.css`, resolve cada tema,
 * grava `src/styles/tokens.generated.json` (consumido pela vitrine e pelo
 * script de tema) e `docs/CONTRAST.md`, e encerra com erro se algum par
 * obrigatório de contraste reprovar ou se algum token não resolver.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { buildTokenReport, type ThemeReport } from "../src/lib/color/report.ts"

const root = join(import.meta.dirname, "..")
const read = (p: string) => readFileSync(join(root, p), "utf8")

const { report, problems } = buildTokenReport(
  read("src/styles/tokens.css"),
  read("src/styles/themes.css"),
)

const json = JSON.stringify(report, null, 2) + "\n"
writeFileSync(join(root, "src/styles/tokens.generated.json"), json)

const fmt = (n: number) => n.toFixed(2).replace(".", ",")

function themeSection(t: ThemeReport): string {
  const lines = [
    `## ${t.label} (\`${t.id}\`)`,
    "",
    `${t.description} Esquema ${t.colorScheme === "dark" ? "escuro" : "claro"}. Energia ${t.energy}, rotação máxima ${t.rotationMax}°. Distância de matiz perigo × primária: ${fmt(t.dangerHueDistance)}°.`,
    "",
    "| Par | Uso | Tipo | Mínimo | Razão | Resultado |",
    "| --- | --- | --- | --- | --- | --- |",
    ...t.pairs.map(
      (p) =>
        `| \`${p.fg}\` sobre \`${p.bg}\` | ${p.uso} | ${p.kind} | ${fmt(p.min)}:1 | ${fmt(p.ratio)}:1 | ${p.pass ? "aprovado" : "**reprovado**"} |`,
    ),
    "",
    "### Escalas",
    "",
    "| Escala | " + (t.scales.primary ?? []).map((s) => s.step).join(" | ") + " |",
    "| --- | " + (t.scales.primary ?? []).map(() => "---").join(" | ") + " |",
    ...Object.entries(t.scales).map(
      ([name, steps]) => `| ${name} | ${steps.map((s) => `\`${s.hex}\``).join(" | ")} |`,
    ),
    `| neutral (0 a 950) | ${t.neutrals.map((s) => `\`${s.hex}\``).join(" | ")} |`,
    "",
  ]
  return lines.join("\n")
}

const md = [
  "# Contraste",
  "",
  "Gerado por `pnpm tokens:build` a partir de `src/styles/tokens.css` e `src/styles/themes.css`. Não edite à mão.",
  "",
  "Mínimos: texto 4,5:1; texto grande (24 px ou mais), componentes e foco 3:1; texto desabilitado 3:1 com outro indicador além da cor.",
  "",
  ...report.themes.map(themeSection),
].join("\n")
writeFileSync(join(root, "docs/CONTRAST.md"), md)

const total = report.themes.reduce((n, t) => n + t.pairs.length, 0)
if (problems.length > 0) {
  console.error(`tokens:build reprovou ${problems.length} verificação(ões):`)
  for (const p of problems) console.error(`  [${p.theme}] ${p.message}`)
  process.exit(1)
}
console.log(
  `tokens:build: ${report.themes.length} temas, ${total} pares de contraste aprovados. Tema padrão: ${report.defaultTheme}.`,
)
