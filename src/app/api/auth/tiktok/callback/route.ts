import { NextResponse } from "next/server";
import { loadTikTokAuth, persistTikTokAuthToSupabase, syncTikTokAuthWithSupabase, getTikTokRedirectUri } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const stateParam = url.searchParams.get("state");

  const baseUrl = url.origin;
  const redirectTarget = `${baseUrl}/hq-master-9821`;

  if (error || !code) {
    const detail = errorDescription ? `${error || "Erreur"}: ${errorDescription}` : (error || "Autorisation refusée par l'utilisateur");
    console.error("[TikTok Callback] Auth error from TikTok:", detail);
    return NextResponse.redirect(
      `${redirectTarget}?tab=tiktok&error=${encodeURIComponent(detail)}`
    );
  }

  try {
    const auth = await syncTikTokAuthWithSupabase();
    const clientKey = auth.clientKey || "sbawbo999rklwxzw3v";
    const clientSecret = auth.clientSecret || "mkUNcS7l7NzTsm2Yp769dUlSB34UMfLQ";

    // Récupère l'URL de redirection exacte passée dans le state, sinon fallback
    let exactRedirectUri = getTikTokRedirectUri();
    if (stateParam) {
      try {
        const decodedState = JSON.parse(Buffer.from(stateParam, "base64url").toString("utf8"));
        if (decodedState.redirect_uri) {
          exactRedirectUri = decodedState.redirect_uri;
        }
      } catch {
        // format non-json, ignoré
      }
    }

    const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";

    console.log(`[TikTok Callback] Code reçu. Échange avec redirect_uri: ${exactRedirectUri}`);

    const bodyParams = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: exactRedirectUri,
    });

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: bodyParams.toString(),
    });

    const tokenJson = await res.json();
    console.log("[TikTok Token Exchange Response]:", JSON.stringify(tokenJson));

    const accessToken = tokenJson.access_token || tokenJson.data?.access_token;
    const refreshToken = tokenJson.refresh_token || tokenJson.data?.refresh_token;
    const openId = tokenJson.open_id || tokenJson.data?.open_id;
    const scope = tokenJson.scope || tokenJson.data?.scope;
    const expiresIn = tokenJson.expires_in || tokenJson.data?.expires_in || 86400;

    if (accessToken) {
      let creatorUsername = "@createur.tiktok";
      let creatorAvatar = "";

      try {
        const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userJson = await userRes.json();
        if (userJson.data?.user) {
          creatorUsername = userJson.data.user.display_name || userJson.data.user.username || creatorUsername;
          creatorAvatar = userJson.data.user.avatar_url || "";
        }
      } catch (e) {
        console.warn("[TikTok User Info Fetch Error]:", e);
      }

      await persistTikTokAuthToSupabase({
        accessToken,
        refreshToken,
        openId,
        scope,
        expiresAt: Date.now() + expiresIn * 1000,
        connectedAt: new Date().toISOString(),
        creatorUsername,
        creatorAvatar,
        isConnected: true,
      });

      return NextResponse.redirect(`${redirectTarget}?tab=tiktok&connected=true`);
    } else {
      let errMsg = "";
      if (tokenJson.error_description) {
        errMsg = `${tokenJson.error || "Erreur"}: ${tokenJson.error_description}`;
      } else if (typeof tokenJson.error === "string") {
        errMsg = `${tokenJson.error}${tokenJson.message ? `: ${tokenJson.message}` : ""}`;
      } else if (tokenJson.error?.message) {
        errMsg = `${tokenJson.error.code || "Erreur"}: ${tokenJson.error.message}`;
      } else if (tokenJson.error?.code) {
        errMsg = `Code erreur TikTok: ${tokenJson.error.code}`;
      } else if (tokenJson.data?.description) {
        errMsg = `Erreur ${tokenJson.data.error_code || ""}: ${tokenJson.data.description}`;
      } else if (tokenJson.message) {
        errMsg = tokenJson.message;
      } else {
        errMsg = JSON.stringify(tokenJson);
      }

      if (!errMsg || errMsg === "{}" || errMsg === "error") {
        errMsg = `Échec de l'échange (HTTP ${res.status}): ${JSON.stringify(tokenJson)}`;
      }

      if (tokenJson.log_id) {
        errMsg += ` (Log: ${tokenJson.log_id})`;
      }

      console.error("[TikTok Token Exchange Error]:", errMsg);
      return NextResponse.redirect(`${redirectTarget}?tab=tiktok&error=${encodeURIComponent(errMsg)}`);
    }
  } catch (err: any) {
    console.error("[TikTok Callback Exception]:", err);
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
