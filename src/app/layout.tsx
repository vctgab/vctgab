import type { Metadata, Viewport } from "next"
import { FooterScene } from "@/components/footer-scene"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { AchadosChip, AchadosProvider } from "@/components/ui/finds"
import { HOME } from "@/content/home"
import { SITE } from "@/content/site"
import { fontVariables, PRELOADED_FONTS } from "@/lib/fonts"
import { SITE_URL } from "@/lib/site-url"
import { ThemeProvider } from "@/lib/theme/theme-provider"
import { themeScript } from "@/lib/theme/theme-script"
import { DEFAULT_MODE, DEFAULT_SEASON, getThemeColor } from "@/lib/theme/themes"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME.meta.title,
    template: `%s · ${SITE.name}`,
  },
  description: HOME.meta.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: HOME.meta.title,
    description: HOME.meta.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: HOME.meta.title },
}

export const viewport: Viewport = {
  themeColor: getThemeColor(DEFAULT_SEASON, DEFAULT_MODE),
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning só por causa de data-season e data-mode, que o
    // script do <head> define antes da hidratação.
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
          <AchadosProvider>
            <Header />
            {children}
            <Footer
              achados={<AchadosChip placement="inline" />}
              scene={<FooterScene />}
            />
            <AchadosChip placement="dock" />
          </AchadosProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
