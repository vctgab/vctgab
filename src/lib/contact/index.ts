import type { ContactTab } from "@/content/home"
import { SITE } from "@/content/site"

/** mailto com assunto, para o e-mail confirmado do site. */
export function mailtoHref(subject?: string, email: string = SITE.email): string {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`
}

/**
 * Destino dos CTAs "tenho uma vaga" e "tenho um projeto": a página de
 * contato já com a aba certa (D-1202).
 */
export function contactHref(tab: ContactTab): `/contato?aba=${ContactTab}` {
  return `/contato?aba=${tab}`
}
