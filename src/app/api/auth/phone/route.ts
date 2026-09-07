import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, password, fullName } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Numéro de téléphone et mot de passe requis" },
        { status: 400 }
      );
    }

    // Nettoyage du numéro de téléphone : garder uniquement les chiffres
    const cleanDigits = phone.replace(/[^0-9]/g, "");
    if (cleanDigits.length < 8) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide (minimum 8 chiffres requis)" },
        { status: 400 }
      );
    }

    const syntheticEmail = `phone_${cleanDigits}@phone.tuneliva.com`;
    const admin = createAdminClient();

    if (action === "signup") {
      // 1. Création du compte utilisateur dans Supabase Auth avec confirmation automatique
      const { data: userData, error: createError } = await admin.auth.admin.createUser({
        email: syntheticEmail,
        password: password,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          phone: phone,
          full_name: fullName || `Utilisateur ${phone}`,
          auth_provider: "phone",
        },
      });

      if (createError) {
        if (
          createError.message.includes("already registered") ||
          createError.message.includes("User already exists") ||
          createError.message.includes("unique")
        ) {
          return NextResponse.json(
            {
              error:
                "Un compte existe déjà avec ce numéro de téléphone. Veuillez vous connecter.",
            },
            { status: 409 }
          );
        }
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }

      // 2. Synchronisation du profil dans la table 'profiles'
      if (userData?.user?.id) {
        try {
          await admin.from("profiles").upsert({
            id: userData.user.id,
            email: syntheticEmail,
            full_name: fullName || phone,
            phone: phone,
            updated_at: new Date().toISOString(),
          });
        } catch (profileErr) {
          console.warn("Profil upsert warning:", profileErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Compte créé avec succès",
        email: syntheticEmail,
      });
    } else if (action === "signin") {
      // En mode signin, on renvoie l'email synthétique associé
      // pour que le client Supabase puisse appeler signInWithPassword
      // et stocker la session/cookies de manière standard.
      return NextResponse.json({
        success: true,
        email: syntheticEmail,
      });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err: any) {
    console.error("Erreur API auth phone:", err);
    return NextResponse.json(
      { error: err.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
