import type { MetadataRoute } from "next"
import { CASES } from "@/content/projects"
import { SITE_URL } from "@/lib/site-url"

/**
 * Só páginas públicas prontas. A vitrine /sistema fica fora (e tem noindex);
 * as páginas provisórias entram quando tiverem conteúdo (release:check). Cada
 * caso publicado (`CASES`) entra sozinho.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    ...Object.keys(CASES).map((slug) => ({
      url: `${SITE_URL}/projetos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
