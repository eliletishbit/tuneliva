import { NextResponse } from "next/server";
import { loadTikTokAuth, getTikTokRedirectUri } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auth = loadTikTokAuth();
    const clientKey = searchParams.get("client_key") || auth.clientKey || "sbawbo999rklwxzw3v";
    const customRedirect = searchParams.get("redirect_uri");
    const redirectUri = encodeURIComponent(customRedirect || getTikTokRedirectUri());
    const scope = encodeURIComponent("user.info.basic,video.upload,video.publish");
    const state = Math.random().toString(36).substring(2, 15);

    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;

    return NextResponse.redirect(tiktokAuthUrl);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
