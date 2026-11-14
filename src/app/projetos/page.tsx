import type { Metadata } from "next"
import { PaginaProvisoria } from "@/components/layout/pagina-provisoria"

export const metadata: Metadata = { title: "Projetos" }

export default function Page() {
  return <PaginaProvisoria title="Projetos" />
}
