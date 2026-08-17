import type { MetadataRoute } from "next";
import { getConversations, getPrototypes, getSite, getSpeakers, getTopics } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url;
  const staticRoutes = [
    "",
    "/journey",
    "/live",
    "/voices",
    "/conversations",
    "/commons",
    "/ideas",
    "/prototypes",
    "/outcomes",
    "/participate",
    "/about",
    "/search",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: (path === "/live" ? "daily" : "weekly") as "daily" | "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicRoutes = [
    ...getSpeakers().map((s) => `/voices/${s.slug}`),
    ...getConversations().map((c) => `/conversations/${c.slug}`),
    ...getTopics().map((t) => `/commons/${t.slug}`),
    ...getPrototypes().map((p) => `/prototypes/${p.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
