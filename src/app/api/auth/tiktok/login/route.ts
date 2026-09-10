import { NextResponse } from "next/server";
import { loadTikTokAuth, getTikTokRedirectUri, syncTikTokAuthWithSupabase } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auth = await syncTikTokAuthWithSupabase();
    const clientKey = searchParams.get("client_key") || auth.clientKey || "sbawbo999rklwxzw3v";
    const customRedirect = searchParams.get("redirect_uri");
    const rawRedirectUri = customRedirect || getTikTokRedirectUri();
    const redirectUri = encodeURIComponent(rawRedirectUri);
    const scope = encodeURIComponent("user.info.basic,video.upload,video.publish");

    // Stocke l'URL de redirection exacte dans le state pour garantir 100% de concordance lors de l'échange de token
    const statePayload = {
      csrf: Math.random().toString(36).substring(2, 15),
      redirect_uri: rawRedirectUri,
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;

    return NextResponse.redirect(tiktokAuthUrl);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

