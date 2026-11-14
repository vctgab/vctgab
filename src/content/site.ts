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
  /** Só dígitos, com país e DDD (ex.: 55 86 9…). */
  whatsapp: Maybe<string>
  github: { user: string; url: string }
  linkedin: Maybe<string>
  /** Mês com agenda aberta, por extenso e em minúsculas ("dezembro"). */
  agendaMonth: Maybe<string>
}

export const SITE: SiteContent = {
  name: "Victor Gabriel",
  role: "Desenvolvedor front-end",
  domain: "https://vctgab.com.br",
  location: { city: "Teresina", region: "PI", country: "Brasil" },
  email: "vctgab.ux@gmail.com",
  whatsapp: pending("número do WhatsApp"),
  github: { user: "vctgab", url: "https://github.com/vctgab" },
  linkedin: pending("perfil do LinkedIn"),
  agendaMonth: pending("mês da agenda aberta"),
}
