import type { Metadata } from "next"
import { PaginaProvisoria } from "@/components/layout/placeholder-page"

export const metadata: Metadata = { title: "Projetos" }

export default function Page() {
  return <PaginaProvisoria title="Projetos" />
}
