import { NextRequest, NextResponse } from "next/server";
import { generateSmartFunnel } from "@/lib/ai/smart-engine";
import { CurrencyCode, FunnelPageType } from "@/types/page";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const currency = (body.currency as CurrencyCode) || "XOF";
    const pageType = (body.pageType as FunnelPageType) || "sales";

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Veuillez décrire votre produit ou votre idée." },
        { status: 400 }
      );
    }

    const funnelData = await generateSmartFunnel(prompt.trim(), currency, pageType);

    return NextResponse.json({ success: true, data: funnelData });
  } catch (error) {
    console.error("Erreur dans /api/generate:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la génération." },
      { status: 500 }
    );
  }
}
