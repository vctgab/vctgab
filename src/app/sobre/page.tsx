import type { Metadata } from "next"
import { PaginaProvisoria } from "@/components/layout/pagina-provisoria"

export const metadata: Metadata = { title: "Sobre" }

export default function Page() {
  return <PaginaProvisoria title="Sobre" />
}
