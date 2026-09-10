import { NextRequest, NextResponse } from "next/server";
import { getAllDomains, saveDomain, deleteDomain } from "@/lib/storage/domains";
import { createClient } from "@/lib/supabase/server";
import dns from "dns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {}

    const domains = await getAllDomains(userId);
    return NextResponse.json({ success: true, domains });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, funnelSlug } = body;

    if (!domain || !funnelSlug) {
      return NextResponse.json(
        { success: false, error: "Le domaine et le slug du tunnel sont requis." },
        { status: 400 }
      );
    }

    const cleanDomain = domain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {}

    // Vérification DNS légère (test de résolution CNAME ou A)
    let isVerified = false;
    try {
      const records = await dns.promises.resolveCname(cleanDomain).catch(() => []);
      if (
        records.some(
          (r) =>
            r.includes("vercel") ||
            r.includes("tuneliva") ||
            r.includes("cname.vercel-dns.com")
        )
      ) {
        isVerified = true;
      }
    } catch {}

    const record = await saveDomain(
      cleanDomain,
      funnelSlug,
      userId,
      isVerified ? "verified" : "pending"
    );

    return NextResponse.json({ success: true, domain: record, isVerified });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ success: false, error: "Domaine manquant" }, { status: 400 });
    }

    await deleteDomain(domain);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
