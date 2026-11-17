import { pending, type Maybe } from "./pending.ts"

/**
 * Dados do site e de contato. Só fatos verificados; o que falta é
 * `pending(...)` e aparece no `pnpm release:check`.
 */
export interface SiteContent {
  name: string
  /** Cargo, como aparece no JSON-LD e nos metadados. */
  role: string
  /** Domínio de produção. A URL usada no build vem de SITE_URL (src/lib/site-url.ts). */
  domain: string
  location: { city: string; region: string; country: string }
  email: string
  github: { user: string; url: string }
  linkedin: Maybe<string>
  /** Caminho do CV em PDF (em /public). */
  cv: Maybe<string>
}

export const SITE: SiteContent = {
  name: "Victor Gabriel",
  role: "Desenvolvedor front-end e tech lead",
  domain: "https://vctgab.com.br",
  location: { city: "Teresina", region: "PI", country: "Brasil" },
  email: "vctgab.ux@gmail.com",
  github: { user: "vctgab", url: "https://github.com/vctgab" },
  linkedin: pending("URL do LinkedIn"),
  cv: pending("arquivo do CV em PDF"),
}
