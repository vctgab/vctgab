import type { Metadata, Viewport } from "next"
import { FooterScene } from "@/components/footer-scene"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { AchadosChip, AchadosProvider } from "@/components/ui/finds"
import { ToastProvider } from "@/components/ui/toast"
import { fontVariables, PRELOADED_FONTS } from "@/lib/fonts"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { themeScript } from "@/lib/theme/theme-script"
import { getThemeInfo, DEFAULT_THEME } from "@/lib/theme/themes"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Victor Gabriel, desenvolvedor front-end",
    template: "%s · Victor Gabriel",
  },
  description:
    "Portfólio de Victor Gabriel, desenvolvedor front-end em Teresina que veio do design de produto.",
}

export const viewport: Viewport = {
  themeColor: getThemeInfo(DEFAULT_THEME).themeColor,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning só por causa de data-theme, que o script do
    // <head> define antes da hidratação.
    <html lang="pt-BR" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
        {/* Pré-carga no HTML, com crossOrigin explícito: o Firefox reaproveita
            esta e não a do cabeçalho Link (D-1010). */}
        {PRELOADED_FONTS.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AchadosProvider>
              <Header />
              {children}
              <Footer
                achados={<AchadosChip placement="inline" />}
                scene={<FooterScene />}
              />
              <AchadosChip placement="dock" />
            </AchadosProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
