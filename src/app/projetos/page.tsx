import type { Metadata } from "next"
import { PaginaProvisoria } from "@/components/layout/placeholder-page"
import { PROVISIONAL_PAGES } from "@/content/pages"

export const metadata: Metadata = { title: PROVISIONAL_PAGES.projetos.title }

export default function Page() {
  return <PaginaProvisoria page="projetos" />
}
