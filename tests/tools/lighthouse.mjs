// Lighthouse mobile (porta de qualidade: acessibilidade ≥ 95, desempenho ≥ 90, CLS 0).
// Uso: node tests/tools/lighthouse.mjs <rota> <simulate|devtools|ambos> [rótulo] [execuções] [url-base]
//   rota: /sistema, /  ·  rótulo: antes, depois…  ·  execuções: 3 (mediana)
//   url-base: http://localhost:3100 (padrão) ou a URL de um preview.
// No Git Bash, prefixe com MSYS_NO_PATHCONV=1 para a rota não virar caminho do Windows.
// Requer o servidor de produção na porta 3100 (ou a url-base) e rede para o `pnpm dlx lighthouse`.
// "simulate" é o método padrão do Lighthouse (estima a rede e a CPU lentas);
// "devtools" aplica a limitação de verdade. Relate sempre os dois (D-1008).
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const route = process.argv[2] ?? "/sistema"
const which = process.argv[3] ?? "ambos"
const label = process.argv[4] ?? "medicao"
const runs = Number(process.argv[5] ?? 3)
const base = (process.argv[6] ?? "http://localhost:3100").replace(/\/$/, "")
const methods = which === "ambos" ? ["simulate", "devtools"] : [which]
const slug = route.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home"
const chromes = [
  process.env.CHROME_PATH ?? "",
  join(homedir(), "AppData/Local/ms-playwright/chromium-1254/chrome-win64/chrome.exe"),
].filter((p) => p && existsSync(p))
const dir = join(process.env.QA_DIR ?? "docs/qa/phase-2")
mkdirSync(dir, { recursive: true })

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

const summary = { rota: route, base, rotulo: label, execucoes: runs, metodos: {} }
for (const method of methods) {
  const results = []
  for (let i = 1; i <= runs; i++) {
    const out = join(dir, `lighthouse-${slug}-${label}-${method}-${i}.json`)
    execFileSync(
      "pnpm",
      [
        "dlx",
        "lighthouse@12",
        `${base}${route}`,
        "--form-factor=mobile",
        `--throttling-method=${method}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${out}`,
        // No runner Linux do CI, o Chrome só abre sem sandbox.
        `--chrome-flags="--headless=new --no-first-run${process.env.CI ? " --no-sandbox" : ""}"`,
        "--quiet",
        ...(chromes[0] ? [`--chrome-path="${chromes[0]}"`] : []),
      ],
      { stdio: "inherit", shell: true },
    )
    const r = JSON.parse(readFileSync(out, "utf8"))
    const score = (k) => Math.round((r.categories[k]?.score ?? 0) * 100)
    const ms = (k) => Math.round(r.audits[k]?.numericValue ?? NaN)
    results.push({
      desempenho: score("performance"),
      acessibilidade: score("accessibility"),
      boasPraticas: score("best-practices"),
      seo: score("seo"),
      fcpMs: ms("first-contentful-paint"),
      lcpMs: ms("largest-contentful-paint"),
      tbtMs: ms("total-blocking-time"),
      siMs: ms("speed-index"),
      cls: r.audits["cumulative-layout-shift"]?.numericValue ?? NaN,
    })
  }
  const keys = Object.keys(results[0])
  summary.metodos[method] = {
    mediana: Object.fromEntries(keys.map((k) => [k, median(results.map((x) => x[k]))])),
    execucoes: results,
  }
}
const file = join(dir, `lighthouse-${slug}-${label}.summary.json`)
writeFileSync(file, `${JSON.stringify(summary, null, 2)}\n`)
console.log(JSON.stringify(summary, null, 2))
