import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function getAdminTokenSecret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "tuneliva_super_admin_secure_secret_2026_!@#"
  );
}

export function generateAdminSessionToken(email: string, userId?: string): string {
  const payload = {
    email,
    userId: userId || "usr-admin-rodrigue-master",
    role: "super_admin",
    is_admin: true,
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
    if (payload.role !== "super_admin" && !payload.is_admin) return false;
    if (payload.email !== "rodrigueapothey@gmail.com") return false;
    if (payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPassword = (password || "").trim();

    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    let authenticatedUserId: string | null = null;
    let isAdminConfirmed = false;
    let userMetadata: any = {
      id: "usr-admin-rodrigue-master",
      email: trimmedEmail,
      name: "Rodrigue Apothey",
      role: "super_admin",
      is_admin: true,
    };

    // 1. TENTATIVE D'AUTHENTIFICATION VIA SUPABASE AUTH
    try {
      const { data: authData } = await adminSupabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      if (authData?.user) {
        authenticatedUserId = authData.user.id;
        userMetadata.id = authData.user.id;
        userMetadata.name =
          authData.user.user_metadata?.full_name ||
          authData.user.user_metadata?.name ||
          "Rodrigue Apothey";
      }
    } catch (authErr) {
      console.warn("Supabase auth direct sign-in fallback:", authErr);
    }

    // 2. VÉRIFICATION DES IDENTIFIANTS DU SUPER ADMINISTRATEUR FONDATION
    if (!authenticatedUserId) {
      if (
        trimmedEmail === "rodrigueapothey@gmail.com" &&
        trimmedPassword === "Mes2meilleur@"
      ) {
        authenticatedUserId = "usr-admin-rodrigue-master";
        isAdminConfirmed = true;
      } else {
        return NextResponse.json(
          {
            error:
              "Accès refusé : Identifiants super admin non valides ou compte introuvable.",
          },
          { status: 401 }
        );
      }
    }

    // 3. VÉRIFICATION STRICTE DU FLAG IS_ADMIN EN BASE DE DONNÉES (PROFILES)
    try {
      if (trimmedEmail === "rodrigueapothey@gmail.com") {
        // Enregistre et garantit la présence de is_admin: true dans profiles
        await adminSupabase
          .from("profiles")
          .upsert(
            {
              id: authenticatedUserId,
              email: trimmedEmail,
              is_admin: true,
              role: "super_admin",
              full_name: userMetadata.name,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        isAdminConfirmed = true;
      } else if (authenticatedUserId) {
        // Pour tout autre compte : lecture stricte en base de données
        const { data: profile } = await adminSupabase
          .from("profiles")
          .select("is_admin, role")
          .eq("id", authenticatedUserId)
          .maybeSingle();

        if (profile && (profile.is_admin === true || profile.role === "super_admin")) {
          isAdminConfirmed = true;
        }
      }
    } catch (dbErr) {
      console.warn("Erreur vérification profiles is_admin:", dbErr);
      if (trimmedEmail === "rodrigueapothey@gmail.com") {
        isAdminConfirmed = true;
      }
    }

    if (!isAdminConfirmed) {
      return NextResponse.json(
        {
          error:
            "Accès refusé : Ce compte utilisateur ne dispose pas de la valeur 'is_admin: true' en base de données.",
        },
        { status: 403 }
      );
    }

    // 4. GÉNÉRATION DU JETON DE SESSION SÉCURISÉ
    const token = generateAdminSessionToken(trimmedEmail, authenticatedUserId);

    const response = NextResponse.json({
      success: true,
      message: "Authentification Super Admin réussie (is_admin vérifié).",
      user: userMetadata,
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
      { error: err?.message || "Erreur interne lors de la tentative de connexion." },
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
        is_admin: true,
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
