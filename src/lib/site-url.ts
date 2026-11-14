import { SITE } from "@/content/site"

/**
 * URL canônica do site (metadataBase, sitemap, robots, JSON-LD e imagem
 * Open Graph). Padrão: o domínio de produção. Enquanto o domínio ainda serve
 * o site antigo, defina SITE_URL no ambiente (preview da Vercel, por
 * exemplo) para apontar para outro endereço (D-1016).
 */
export const SITE_URL = (process.env.SITE_URL || SITE.domain).replace(/\/+$/, "")
