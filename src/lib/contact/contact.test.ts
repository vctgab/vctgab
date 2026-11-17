import { contactHref, mailtoHref } from "."

describe("contato", () => {
  it("CTAs levam ao /contato com a aba certa", () => {
    expect(contactHref("vaga")).toBe("/contato?aba=vaga")
    expect(contactHref("projeto")).toBe("/contato?aba=projeto")
  })

  it("mailto com e sem assunto, com o assunto codificado", () => {
    expect(mailtoHref()).toBe("mailto:vctgab.ux@gmail.com")
    expect(mailtoHref("Vaga")).toBe("mailto:vctgab.ux@gmail.com?subject=Vaga")
    expect(mailtoHref("Orçamento", "nome@exemplo.com")).toBe(
      "mailto:nome@exemplo.com?subject=Or%C3%A7amento",
    )
  })
})
