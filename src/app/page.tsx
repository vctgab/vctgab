import type { Metadata } from "next"
import { Hero } from "@/components/hero"
import { About, Contact, Projects, Proof, Skills } from "@/components/home"
import { HOME } from "@/content/home"
import { SITE } from "@/content/site"
import { SITE_URL } from "@/lib/site-url"

export const metadata: Metadata = {
  title: { absolute: HOME.meta.title },
  description: HOME.meta.description,
  alternates: { canonical: "/" },
}

/** JSON-LD Person só com fatos verificados: nome, cargo, URL e GitHub. */
function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.role,
    url: SITE_URL,
    sameAs: [SITE.github.url],
  }
  return (
    <script
      type="application/ld+json"
      // "<" escapado: o JSON não fecha a tag <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

/** Home. Ficha: docs/specs/pages/home.md */
export default function Home() {
  return (
    <main id="conteudo">
      <PersonJsonLd />
      <Hero seed="home" />
      <Projects />
      <Skills />
      <Proof />
      <About />
      <Contact />
    </main>
  )
}
