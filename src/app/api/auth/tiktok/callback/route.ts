import { NextResponse } from "next/server";
import { loadTikTokAuth, saveTikTokAuth, getTikTokRedirectUri } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  const baseUrl = url.origin;
  const redirectTarget = `${baseUrl}/hq-master-9821`;

  if (error || !code) {
    return NextResponse.redirect(
      `${redirectTarget}?tab=tiktok&error=${encodeURIComponent(errorDescription || error || "Autorisation refusée")}`
    );
  }

  try {
    const auth = loadTikTokAuth();
    const clientKey = auth.clientKey || process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = auth.clientSecret || process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = getTikTokRedirectUri();

    if (!clientKey || !clientSecret) {
      return NextResponse.redirect(
        `${redirectTarget}?tab=tiktok&error=${encodeURIComponent("Clé Client ou Clé Secrète manquante")}`
      );
    }

    // Échange du code temporaire contre le token officiel TikTok
    const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
    const bodyParams = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: bodyParams.toString(),
    });

    const tokenJson = await tokenRes.json();

    if (tokenJson.data && tokenJson.data.access_token) {
      saveTikTokAuth({
        accessToken: tokenJson.data.access_token,
        refreshToken: tokenJson.data.refresh_token,
        openId: tokenJson.data.open_id,
        scope: tokenJson.data.scope,
        expiresAt: Date.now() + (tokenJson.data.expires_in || 86400) * 1000,
        connectedAt: new Date().toISOString(),
        creatorUsername: "@tuneliva.officiel",
        isConnected: true,
      });

      return NextResponse.redirect(`${redirectTarget}?tab=tiktok&connected=true`);
    } else {
      const errMsg = tokenJson.error?.message || "Échec de l'échange de token TikTok";
      return NextResponse.redirect(`${redirectTarget}?tab=tiktok&error=${encodeURIComponent(errMsg)}`);
    }
  } catch (err: any) {
    return NextResponse.redirect(
      `${redirectTarget}?tab=tiktok&error=${encodeURIComponent(err.message || "Erreur serveur callback")}`
    );
  }
}
