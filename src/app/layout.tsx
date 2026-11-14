import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Victor Gabriel",
  description: "Portfólio de desenvolvimento de Victor Gabriel.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
