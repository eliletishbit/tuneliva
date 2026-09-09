import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Cache mémoire serveur pour éviter de rappeler l'API pour les mêmes sous-titres
const audioCache = new Map<string, ArrayBuffer>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawText = searchParams.get("text")?.trim() || "";
    const lang = searchParams.get("lang") || "fr-FR";

    if (!rawText) {
      return new NextResponse("Paramètre 'text' manquant.", { status: 400 });
    }

    // Nettoyage et limitation sécurisée à 190 caractères par chunk
    const cleanText = rawText
      .replace(/[\r\n]+/g, " ")
      .replace(/[^\p{L}\p{N}\p{P}\s]/gu, "")
      .trim()
      .slice(0, 190);

    const cacheKey = `${lang}:${cleanText}`;
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
    )}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!response.ok) {
      return new NextResponse(`Erreur TTS : ${response.status}`, { status: response.status });
    }

    const audioArrayBuffer = await response.arrayBuffer();

    // Mise en cache (limite à 300 entrées pour la mémoire)
    if (audioCache.size < 300) {
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
