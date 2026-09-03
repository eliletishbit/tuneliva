import { NextRequest, NextResponse } from "next/server";
import { getAllFunnels, getFunnelBySlug, saveFunnel } from "@/lib/storage/funnels";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const funnel = getFunnelBySlug(slug);
    if (!funnel) {
      return NextResponse.json({ error: "Tunnel introuvable" }, { status: 404 });
    }
    return NextResponse.json(funnel);
  }

  const all = getAllFunnels();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.sections) {
      return NextResponse.json({ error: "Données de tunnel invalides" }, { status: 400 });
    }

    const saved = saveFunnel(body);
    return NextResponse.json({ success: true, funnel: saved });
  } catch (error) {
    console.error("Erreur enregistrement tunnel:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la sauvegarde" }, { status: 500 });
  }
}
