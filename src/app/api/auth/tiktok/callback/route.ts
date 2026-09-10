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
    const clientKey = auth.clientKey || "sbawbo999rklwxzw3v";
    const clientSecret = auth.clientSecret || "mkUNcS7l7NzTsm2Yp769dUlSB34UMfLQ";
    const primaryRedirect = getTikTokRedirectUri();
    const secondaryRedirect = `${baseUrl}/hq-master-9821`;

    const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";

    async function tryExchange(uri: string) {
      const bodyParams = new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code!,
        grant_type: "authorization_code",
        redirect_uri: uri,
      });

      const res = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: bodyParams.toString(),
      });
      return await res.json();
    }

    let tokenJson = await tryExchange(primaryRedirect);
    if (!tokenJson.data?.access_token) {
      // Essai avec le second redirect URI si le premier échoue
      const retryJson = await tryExchange(secondaryRedirect);
      if (retryJson.data?.access_token) {
        tokenJson = retryJson;
      }
    }

    if (tokenJson.data && tokenJson.data.access_token) {
      let creatorUsername = "@tuneliva.officiel";
      let creatorAvatar = "";

      try {
        const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username", {
          headers: { Authorization: `Bearer ${tokenJson.data.access_token}` }
        });
        const userJson = await userRes.json();
        if (userJson.data?.user) {
          creatorUsername = userJson.data.user.display_name || userJson.data.user.username || creatorUsername;
          creatorAvatar = userJson.data.user.avatar_url || "";
        }
      } catch {}

      saveTikTokAuth({
        accessToken: tokenJson.data.access_token,
        refreshToken: tokenJson.data.refresh_token,
        openId: tokenJson.data.open_id,
        scope: tokenJson.data.scope,
        expiresAt: Date.now() + (tokenJson.data.expires_in || 86400) * 1000,
        connectedAt: new Date().toISOString(),
        creatorUsername,
        creatorAvatar,
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Si TikTok envoie un challenge de vérification de webhook
    if (body.challenge) {
      return NextResponse.json({ challenge: body.challenge }, { status: 200 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Webhook TikTok reçu avec succès (HTTP 200 OK)",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
