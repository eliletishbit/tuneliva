import { NextResponse } from "next/server";
import { normalizeForSpeech } from "@/lib/tiktok/speechNormalizer";

export const dynamic = "force-dynamic";

// Cache mémoire serveur pour stocker les morceaux audio déjà transcrits
const audioCache = new Map<string, ArrayBuffer>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawText = searchParams.get("text")?.trim() || "";
    const lang = searchParams.get("lang") || "fr-FR";

    if (!rawText) {
      return new NextResponse("Paramètre 'text' manquant.", { status: 400 });
    }

    // Traduction et normalisation phonétique du texte (1M -> un million, etc.)
    const spokenText = normalizeForSpeech(rawText)
      .replace(/[^\p{L}\p{N}\p{P}\s']/gu, "")
      .trim()
      .slice(0, 195);

    const cacheKey = `${lang}:${spokenText}`;
    if (audioCache.has(cacheKey)) {
      const cachedBuffer = audioCache.get(cacheKey)!;
      return new NextResponse(cachedBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
      lang
    )}&client=tw-ob&q=${encodeURIComponent(spokenText)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(ttsUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      return new NextResponse(`Erreur TTS : ${response.status}`, { status: response.status });
    }

    const audioArrayBuffer = await response.arrayBuffer();

    // Mise en cache mémoire
    if (audioCache.size < 400) {
      audioCache.set(cacheKey, audioArrayBuffer);
    }

    return new NextResponse(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error: any) {
    return new NextResponse(error?.message || "Erreur interne serveur TTS", { status: 500 });
  }
}
