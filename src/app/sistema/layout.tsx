import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { default: "Sistema", template: "%s · Sistema · Victor Gabriel" },
  description: "Vitrine do design system do portfólio de Victor Gabriel.",
  robots: { index: false, follow: false },
}

export default function SistemaLayout({ children }: LayoutProps<"/sistema">) {
  return children
}
