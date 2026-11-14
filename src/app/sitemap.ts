import type { MetadataRoute } from "next"

// [a confirmar: domínio do site]. Até lá, defina SITE_URL no deploy.
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000"

/** Só páginas públicas. A vitrine /sistema fica fora (e tem noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 }]
}
