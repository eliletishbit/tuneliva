import { NextRequest, NextResponse } from "next/server";
import {
  getAllFunnels,
  getFunnelBySlug,
  saveFunnel,
  deleteFunnel,
} from "@/lib/storage/funnels";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  // Si on recherche un tunnel public spécifique par son slug
  if (slug) {
    const funnel = await getFunnelBySlug(slug);
    if (!funnel) {
      return NextResponse.json({ error: "Tunnel introuvable" }, { status: 404 });
    }
    return NextResponse.json(funnel);
  }

  // Sinon, récupération de la liste des tunnels de l'utilisateur connecté
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {}

  // Si non authentifié, ne jamais exposer de données globales ou de session tierce
  if (!userId) {
    return NextResponse.json([]);
  }

  const all = await getAllFunnels(userId);
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.sections) {
      return NextResponse.json(
        { error: "Données de tunnel invalides" },
        { status: 400 }
      );
    }

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {}

    const saved = await saveFunnel(body, userId);
    return NextResponse.json({ success: true, funnel: saved });
  } catch (error) {
    console.error("Erreur enregistrement tunnel:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Slug requis" }, { status: 400 });
  }

  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {}

  const success = await deleteFunnel(slug, userId);
  return NextResponse.json({ success });
}
