import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function getAdminTokenSecret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "tuneliva_super_admin_secure_secret_2026_!@#"
  );
}

export function generateAdminSessionToken(email: string): string {
  const payload = {
    email,
    role: "super_admin",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 jours
  };
  const str = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", getAdminTokenSecret())
    .update(str)
    .digest("hex");
  return Buffer.from(str).toString("base64") + "." + signature;
}

export function verifyAdminSessionToken(token: string): boolean {
  try {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payloadStr = Buffer.from(payloadB64, "base64").toString("utf8");
    const expectedSig = crypto
      .createHmac("sha256", getAdminTokenSecret())
      .update(payloadStr)
      .digest("hex");

    if (signature !== expectedSig) return false;
    const payload = JSON.parse(payloadStr);
    if (payload.email !== "rodrigueapothey@gmail.com") return false;
    if (payload.role !== "super_admin") return false;
    if (payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (password || "").trim();

    // 1. VÉRIFICATION STRICTE DE L'EMAIL ET DU MOT DE PASSE SUPER ADMIN
    if (
      trimmedEmail !== "rodrigueapothey@gmail.com" ||
      trimmedPassword !== "Mes2meilleur@"
    ) {
      return NextResponse.json(
        {
          error:
            "Accès refusé : Identifiants super admin non valides ou permissions insuffisantes.",
        },
        { status: 401 }
      );
    }

    // 2. VÉRIFICATION DANS SUPABASE (AUTH + METADATA IS_ADMIN)
    const adminSupabase = createAdminClient();
    const { data: usersData, error: listError } =
      await adminSupabase.auth.admin.listUsers({ perPage: 100 });

    if (listError) {
      console.error("Erreur lecture Supabase users:", listError);
      return NextResponse.json(
        { error: "Erreur de connexion au serveur d'authentification." },
        { status: 500 }
      );
    }

    const user = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === "rodrigueapothey@gmail.com"
    );

    if (!user) {
      return NextResponse.json(
        { error: "Compte super administrateur introuvable en base Supabase." },
        { status: 403 }
      );
    }

    const isAdmin =
      user.user_metadata?.is_admin === true ||
      user.app_metadata?.is_admin === true ||
      user.user_metadata?.role === "super_admin";

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Accès refusé : Ce compte ne possède pas le privilège is_admin = true dans Supabase.",
        },
        { status: 403 }
      );
    }

    // 3. GÉNÉRATION DU JETON DE SESSION SÉCURISÉ
    const token = generateAdminSessionToken(trimmedEmail);

    const response = NextResponse.json({
      success: true,
      message: "Authentification Super Admin réussie.",
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "Rodrigue Apothey",
        role: "super_admin",
      },
      token,
    });

    response.cookies.set("tuneliva_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Erreur route login admin:", err);
    return NextResponse.json(
      { error: "Erreur interne lors de la tentative de connexion." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookieToken = req.cookies.get("tuneliva_admin_token")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const token = cookieToken || bearerToken;

  if (token && verifyAdminSessionToken(token)) {
    return NextResponse.json({
      authenticated: true,
      user: {
        email: "rodrigueapothey@gmail.com",
        name: "Rodrigue Apothey",
        role: "super_admin",
      },
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Déconnexion réussie." });
  response.cookies.delete("tuneliva_admin_token");
  return response;
}
