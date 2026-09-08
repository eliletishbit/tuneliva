import { MetadataRoute } from "next";
import { getAllFunnels } from "@/lib/storage/funnels";
import { BLOG_TOPICS } from "@/lib/blog/topics";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tuneliva.com";

  // Routes statiques principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Articles de blog programmés et publiés
  const blogRoutes: MetadataRoute.Sitemap = BLOG_TOPICS.map((topic) => ({
    url: `${baseUrl}/blog/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Tunnels de vente créés et publiés
  let funnelRoutes: MetadataRoute.Sitemap = [];
  try {
    const funnels = await getAllFunnels();
    funnelRoutes = funnels.map((f) => ({
      url: `${baseUrl}/p/${f.slug}`,
      lastModified: (f as any).updatedAt ? new Date((f as any).updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Erreur récupération tunnels pour sitemap:", err);
  }

  return [...staticRoutes, ...blogRoutes, ...funnelRoutes];
}
