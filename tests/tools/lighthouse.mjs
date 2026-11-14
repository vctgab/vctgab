// Lighthouse mobile na vitrine (porta de qualidade: acessibilidade ≥ 95,
// desempenho ≥ 90, CLS 0). Uso: node tests/tools/lighthouse.mjs [rota]
// Requer o servidor de produção na porta 3100 e rede para o `pnpm dlx lighthouse`.
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const route = process.argv[2] ?? "/sistema"
// "devtools" aplica a limitação de rede e CPU de verdade; "simulate" (padrão do
// Lighthouse) estima a partir do carregamento local e infla o LCP (D-709).
const method = process.argv[3] ?? "devtools"
const slug = route.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "raiz"
const chromes = [
  join(homedir(), "AppData/Local/ms-playwright/chromium-1254/chrome-win64/chrome.exe"),
  process.env.CHROME_PATH ?? "",
].filter((p) => p && existsSync(p))
mkdirSync("docs/qa", { recursive: true })
const out = join("docs/qa", `lighthouse-${slug}-${process.argv[3] ?? "devtools"}.json`)

execFileSync(
  "pnpm",
  [
    "dlx",
    "lighthouse@12",
    `http://localhost:3100${route}`,
    "--form-factor=mobile",
    `--throttling-method=${method}`,
    "--only-categories=performance,accessibility",
    "--output=json",
    `--output-path=${out}`,
    "--chrome-flags=--headless=new --no-first-run",
    "--quiet",
    ...(chromes[0] ? [`--chrome-path=${chromes[0]}`] : []),
  ],
  { stdio: "inherit", shell: true },
)

const report = JSON.parse(readFileSync(out, "utf8"))
const score = (k) => Math.round((report.categories[k]?.score ?? 0) * 100)
const cls = report.audits["cumulative-layout-shift"]?.numericValue ?? NaN
const lcp = report.audits["largest-contentful-paint"]?.numericValue ?? NaN
console.log(
  JSON.stringify(
    {
      rota: route,
      metodo: method,
      desempenho: score("performance"),
      acessibilidade: score("accessibility"),
      cls,
      lcpMs: Math.round(lcp),
    },
    null,
    2,
  ),
)
