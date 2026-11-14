import { pending } from "@/content/pending"
import { mailtoHref, quoteHref, talkHref, whatsappHref } from "."

describe("links de contato", () => {
  it("monta o link do WhatsApp com a mensagem codificada", () => {
    expect(whatsappHref("Olá, Victor.", "5586900000000")).toBe(
      "https://wa.me/5586900000000?text=Ol%C3%A1%2C%20Victor.",
    )
  })

  it("nunca monta link quebrado: número pendente ou fora do formato dá null", () => {
    expect(whatsappHref("Olá", pending("número do WhatsApp"))).toBeNull()
    expect(whatsappHref("Olá", "(86) 9 0000-0000")).toBeNull()
    expect(whatsappHref("Olá", "86900000000")).toBeNull()
  })

  it("com o número pendente, 'Vamos conversar' leva ao contato da Home", () => {
    // O número do site está pendente nesta fase.
    expect(talkHref("Olá", true)).toBe("#contato")
    expect(talkHref("Olá", false)).toBe("/#contato")
  })

  it("com o número pendente, 'Solicitar orçamento' vira e-mail com assunto", () => {
    expect(quoteHref("Olá", "Orçamento")).toBe(
      "mailto:vctgab.ux@gmail.com?subject=Or%C3%A7amento",
    )
    expect(mailtoHref()).toBe("mailto:vctgab.ux@gmail.com")
  })
})
