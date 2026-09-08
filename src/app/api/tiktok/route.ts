import { NextResponse } from "next/server";
import { loadTikTokPosts, generateDailyTikTokPosts, saveTikTokPosts } from "@/lib/tiktok/generator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let posts = loadTikTokPosts();
    if (posts.length === 0) {
      posts = generateDailyTikTokPosts(3);
    }
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const count = typeof body.count === "number" ? body.count : 3;
    const posts = generateDailyTikTokPosts(count);
    return NextResponse.json({ success: true, posts, message: `${count} vidéos TikTok générées avec succès par l'IA !` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, scheduledTime } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID de vidéo requis" }, { status: 400 });
    }

    const posts = loadTikTokPosts();
    const targetIdx = posts.findIndex((p) => p.id === id);
    if (targetIdx === -1) {
      return NextResponse.json({ success: false, error: "Vidéo introuvable" }, { status: 404 });
    }

    if (status) {
      posts[targetIdx].status = status;
      if (status === "published") {
        posts[targetIdx].publishedAt = new Date().toISOString();
      }
    }
    if (scheduledTime) {
      posts[targetIdx].scheduledTime = scheduledTime;
    }

    saveTikTokPosts(posts);
    return NextResponse.json({ success: true, post: posts[targetIdx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
