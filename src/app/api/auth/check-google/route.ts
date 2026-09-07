import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ enabled: false, reason: "missing_supabase_url" });
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/authorize?provider=google`, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
    });

    const bodyText = await res.text();
    const isEnabled =
      res.status !== 400 &&
      !bodyText.includes("provider is not enabled") &&
      !bodyText.includes("validation_failed");

    return NextResponse.json({
      enabled: isEnabled,
      status: res.status,
    });
  } catch (err: any) {
    console.warn("Erreur vérification Google OAuth provider:", err);
    return NextResponse.json({ enabled: false, error: err.message });
  }
}
