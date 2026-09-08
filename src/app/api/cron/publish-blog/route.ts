import { NextResponse } from "next/server";
import { BLOG_TOPICS, getPublishedTopics } from "@/lib/blog/topics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const BASE_DATE = new Date("2026-09-08T00:00:00Z");
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - BASE_DATE.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Déblocage de 2 articles par tranche de 24h
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

    // Calcul du prochain créneau
    const nextDate = new Date(BASE_DATE.getTime() + (daysElapsed + 1) * 24 * 60 * 60 * 1000);
    nextDate.setUTCHours(8, 0, 0, 0);

    return NextResponse.json({
      success: true,
      service: "Tuneliva Blog Auto-Publisher (2 Posts / Jour)",
      currentDate: now.toISOString(),
      launchBaseDate: "2026-09-08T00:00:00Z",
      daysElapsed,
      ratePerDay: 2,
      totalScheduled: BLOG_TOPICS.length,
      totalPublishedSoFar: unlockedCount,
      remainingToPublish: BLOG_TOPICS.length - unlockedCount,
      todayArticles,
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
      { success: false, error: err.message || "Erreur de cron publication blog" },
      { status: 500 }
    );
  }
}
