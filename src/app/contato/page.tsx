import type { Metadata } from "next"
import { Suspense } from "react"
import { ContactTabs, ContactTabsView } from "@/components/contact/contact-tabs"
import { Section } from "@/components/ui/section"
import { CONTACT_PAGE } from "@/content/contact"

export const metadata: Metadata = {
  title: "Contato",
  description: CONTACT_PAGE.lead,
  alternates: { canonical: "/contato" },
}

/**
 * Contato mínimo, para os CTAs da Home ("tenho uma vaga", "tenho um
 * projeto"). Sem formulário. O fallback do Suspense é a aba padrão: o HTML
 * estático já tem a altura certa (D-1212). Ficha: docs/specs/pages/contact.md
 */
export default function Page() {
  return (
    <main id="conteudo">
      <Section
        titleAs="h1"
        titleSize="h1"
        title={CONTACT_PAGE.title}
        intro={CONTACT_PAGE.lead}
        spacing="lg"
      >
        <Suspense fallback={<ContactTabsView tab={CONTACT_PAGE.defaultTab} />}>
          <ContactTabs />
        </Suspense>
      </Section>
    </main>
  )
}
