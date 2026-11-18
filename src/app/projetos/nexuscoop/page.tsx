import type { Metadata } from "next"
import { CasePage } from "@/components/case"
import { NEXUSCOOP } from "@/content/projects"
import { SITE } from "@/content/site"

const URL_PATH = `/projetos/${NEXUSCOOP.slug}`

export const metadata: Metadata = {
  title: NEXUSCOOP.meta.title,
  description: NEXUSCOOP.meta.description,
  alternates: { canonical: URL_PATH },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    siteName: SITE.name,
    title: `${NEXUSCOOP.meta.title} · ${SITE.name}`,
    description: NEXUSCOOP.meta.description,
    url: URL_PATH,
  },
  twitter: { card: "summary_large_image", title: NEXUSCOOP.meta.title },
}

/** Caso Nexuscoop. Ficha: docs/specs/pages/case.md */
export default function Page() {
  return <CasePage project={NEXUSCOOP} />
}
