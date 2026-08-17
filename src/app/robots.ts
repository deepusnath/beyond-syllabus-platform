import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${getSite().url}/sitemap.xml`,
  };
}
