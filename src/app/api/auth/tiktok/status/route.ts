import { NextResponse } from "next/server";
import { loadTikTokAuth, saveTikTokAuth } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = loadTikTokAuth();
    return NextResponse.json({
      success: true,
      isConnected: auth.isConnected,
      clientKey: auth.clientKey ? `${auth.clientKey.slice(0, 4)}...***` : undefined,
      hasSecret: !!auth.clientSecret,
      creatorUsername: auth.creatorUsername,
      connectedAt: auth.connectedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientKey, clientSecret, disconnect } = body;

    if (disconnect) {
      saveTikTokAuth({
        accessToken: undefined,
        refreshToken: undefined,
        openId: undefined,
        creatorUsername: undefined,
        isConnected: false,
      });
      return NextResponse.json({ success: true, message: "Compte TikTok déconnecté avec succès." });
    }

    if (!clientKey || !clientSecret) {
      return NextResponse.json(
        { success: false, error: "Client Key et Client Secret requis" },
        { status: 400 }
      );
    }

    saveTikTokAuth({
      clientKey: clientKey.trim(),
      clientSecret: clientSecret.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Clés TikTok API enregistrées avec succès.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
