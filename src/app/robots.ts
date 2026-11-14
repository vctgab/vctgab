import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-url"

/** Tudo liberado, menos a vitrine do design system (D-207). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/sistema"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
