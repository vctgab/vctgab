import { isPending, type Maybe } from "@/content/pending"
import { SITE } from "@/content/site"

/** Número do WhatsApp só com dígitos: país (55), DDD e número. */
const WHATSAPP_DIGITS = /^55\d{10,11}$/

/**
 * Link do WhatsApp com mensagem pronta, ou `null` enquanto o número estiver
 * pendente (ou fora do formato). Quem chama decide o destino alternativo:
 * nunca um link quebrado.
 */
export function whatsappHref(
  message: string,
  phone: Maybe<string> = SITE.whatsapp,
): string | null {
  if (isPending(phone) || !WHATSAPP_DIGITS.test(phone)) return null
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Destino do "Vamos conversar": WhatsApp quando houver número; senão, a
 * seção de contato da Home (`#contato` na própria Home, `/#contato` nas
 * outras páginas).
 */
export function talkHref(message: string, onHome: boolean): string {
  return whatsappHref(message) ?? (onHome ? "#contato" : "/#contato")
}

/** mailto com assunto, para o e-mail confirmado do site. */
export function mailtoHref(subject?: string, email: string = SITE.email): string {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`
}

/**
 * Destino do "Solicitar orçamento" (já dentro do #contato): WhatsApp quando
 * houver número; senão, e-mail com assunto (D-1015).
 */
export function quoteHref(message: string, subject: string): string {
  return whatsappHref(message) ?? mailtoHref(subject)
}
