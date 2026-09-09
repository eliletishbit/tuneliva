import { NextResponse } from "next/server";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import { generateDailyTikTokPosts } from "@/lib/tiktok/generator";
import { loadTikTokAuth } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const BASE_DATE = new Date("2026-09-08T00:00:00Z");
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - BASE_DATE.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Déblocage mathématique de 2 articles par tranche de 24h
    const unlockedCount = Math.min(BLOG_TOPICS.length, Math.max(2, (daysElapsed + 1) * 2));
    const publishedTopics = BLOG_TOPICS.slice(0, unlockedCount);

    // Les 2 articles du jour
    const todayStartIndex = Math.max(0, unlockedCount - 2);
    const todayArticles = publishedTopics.slice(todayStartIndex, unlockedCount).map((topic) => ({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      url: `/blog/${topic.slug}`,
      category: topic.categoryLabel,
      categoryColor: topic.categoryColor,
      readTime: topic.readTime,
      publishTime: topic.publishTime,
      summary: topic.summary,
      author: topic.author.name,
      coverImage: topic.images[0],
    }));

    // Génération automatique des 5 vidéos TikTok IA du jour basées sur les 2 articles
    const dailyTikTokPosts = generateDailyTikTokPosts(5);
    const todayVideos = dailyTikTokPosts.slice(-5).map((v) => ({
      id: v.id,
      title: v.title,
      scheduledTime: v.scheduledTime,
      hookText: v.hookText,
      viralityScore: v.viralityScore,
      articleTitle: v.articleTitle,
      status: v.status,
    }));

    // Statut de connexion TikTok OAuth
    const auth = loadTikTokAuth();

    // Calcul du prochain créneau
    const nextDate = new Date(BASE_DATE.getTime() + (daysElapsed + 1) * 24 * 60 * 60 * 1000);
    nextDate.setUTCHours(8, 0, 0, 0);

    return NextResponse.json({
      success: true,
      service: "Tuneliva Automated Publishing Engine (2 Articles Blog & 5 Vidéos TikTok / Jour)",
      currentDate: now.toISOString(),
      launchBaseDate: "2026-09-08T00:00:00Z",
      daysElapsed,
      ratePerDay: {
        articles: 2,
        tiktokVideos: 5,
      },
      totalTopicsScheduled: BLOG_TOPICS.length,
      totalArticlesPublishedSoFar: unlockedCount,
      remainingArticlesToPublish: BLOG_TOPICS.length - unlockedCount,
      estimatedCoverageDays: Math.ceil(BLOG_TOPICS.length / 2),
      todayArticles,
      todayTikTokVideos: todayVideos,
      tiktokIntegration: {
        isConnected: auth.isConnected,
        creatorUsername: auth.creatorUsername || "Non connecté (Mode Sandbox)",
        mode: auth.isConnected ? "Production Direct Post" : "Sandbox Simulator Ready",
      },
      nextPublicationScheduledAt: nextDate.toISOString(),
      allPublished: showAll
        ? publishedTopics.map((t) => ({
            id: t.id,
            title: t.title,
            slug: t.slug,
            url: `/blog/${t.slug}`,
            category: t.categoryLabel,
          }))
        : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Erreur de cron publication blog et TikTok" },
      { status: 500 }
    );
  }
}
