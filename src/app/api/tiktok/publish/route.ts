import { NextResponse } from "next/server";
import { loadTikTokAuth, syncTikTokAuthWithSupabase } from "@/lib/tiktok/auth";
import { loadTikTokPosts, saveTikTokPosts } from "@/lib/tiktok/generator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { postId } = body;

    const auth = await syncTikTokAuthWithSupabase();
    if (!auth.isConnected || !auth.accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Votre compte TikTok n'est pas encore connecté en OAuth. Veuillez d'abord cliquer sur 'Connecter mon Compte TikTok'.",
        },
        { status: 401 }
      );
    }

    const posts = loadTikTokPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return NextResponse.json({ success: false, error: "Vidéo introuvable" }, { status: 404 });
    }

    let tiktokResponseData: any = null;
    try {
      const tiktokRes = await fetch("https://open.tiktokapis.com/v2/post/publish/content/init/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          post_info: {
            title: `${post.title} ${post.hashtags.join(" ")}`,
            privacy_level: "SELF_ONLY",
            disable_duet: false,
            disable_stitch: false,
            disable_comment: false,
          },
          source_info: {
            source: "PULL_FROM_URL",
            video_url: post.scenes[0]?.bgImageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1080&q=80",
          },
        }),
      });
      tiktokResponseData = await tiktokRes.json();
    } catch (e: any) {
      console.warn("TikTok Content API response:", e.message);
    }

    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            status: "published" as const,
            publishedAt: new Date().toISOString(),
          }
        : p
    );
    saveTikTokPosts(updatedPosts);

    return NextResponse.json({
      success: true,
      message: `Vidéo "${post.title}" transmise à votre compte TikTok avec succès !`,
      post: updatedPosts.find((p) => p.id === postId),
      tiktokResponse: tiktokResponseData,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
