import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-url"

/**
 * Só páginas públicas prontas. A vitrine /sistema fica fora (e tem noindex);
 * as páginas provisórias entram quando tiverem conteúdo (release:check).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 }]
}
