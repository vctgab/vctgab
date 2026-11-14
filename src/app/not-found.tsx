// camada: mistério. A anotação em Caveat pode ter humor leve; a mensagem e o link são factuais.
import type { Metadata } from "next"
import { LinkText } from "@/components/ui/link-text"
import { Section } from "@/components/ui/section"

export const metadata: Metadata = {
  title: "Trilha perdida",
  robots: { index: false, follow: true },
}

/** 404 "Trilha perdida". Ficha: docs/specs/pages/home.md */
export default function NotFound() {
  return (
    <main id="conteudo">
      <Section
        titleAs="h1"
        titleSize="h1"
        eyebrow="Erro 404"
        title="Trilha perdida"
        spacing="lg"
        width="measure"
      >
        <p className="text-body-lg text-ink-muted">
          Esta página não existe ou mudou de endereço.
        </p>
        <p
          aria-hidden="true"
          className="mt-6 -rotate-2 font-hand text-hand font-bold text-primary-text"
        >
          Até quem anda com caderno de campo se perde às vezes.
        </p>
        <p className="mt-8">
          <LinkText href="/">Voltar para a página inicial</LinkText>
        </p>
      </Section>
    </main>
  )
}
