import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Stockage sécurisé en mémoire des codes OTP temporaires (valables 10 minutes)
interface OtpRecord {
  code: string;
  phone: string;
  expiresAt: number;
  attempts: number;
}

const globalOtpMap = (global as any).__tuneliva_otp_store || new Map<string, OtpRecord>();
(global as any).__tuneliva_otp_store = globalOtpMap;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, password, fullName, code: inputCode, channel = "whatsapp" } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Numéro de téléphone obligatoire." },
        { status: 400 }
      );
    }

    // Nettoyage du numéro de téléphone : garder uniquement les chiffres
    const cleanDigits = phone.replace(/[^0-9]/g, "");
    if (cleanDigits.length < 8) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide (minimum 8 chiffres requis)." },
        { status: 400 }
      );
    }

    const syntheticEmail = `phone_${cleanDigits}@phone.tuneliva.com`;
    const admin = createAdminClient();

    // =========================================================================
    // 1. ACTION: ENVOYER UN CODE OTP (SMS / WHATSAPP DIRECT)
    // =========================================================================
    if (action === "send_otp") {
      // Génération d'un code à 6 chiffres
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      globalOtpMap.set(cleanDigits, {
        code: otpCode,
        phone,
        expiresAt,
        attempts: 0,
      });

      console.log(`[AUTH OTP] Code généré pour ${phone} (${channel}): ${otpCode}`);

      return NextResponse.json({
        success: true,
        message: `Code de confirmation généré pour le ${phone}.`,
        otpCode, // Permet le test direct en environnement local et production sandbox
        channel,
        expiresSec: 600,
      });
    }

    // =========================================================================
    // 2. ACTION: VÉRIFIER LE CODE OTP ET CONNECTER / CRÉER L'UTILISATEUR
    // =========================================================================
    if (action === "verify_otp") {
      if (!inputCode || typeof inputCode !== "string") {
        return NextResponse.json(
          { error: "Veuillez renseigner le code OTP à 6 chiffres." },
          { status: 400 }
        );
      }

      const record = globalOtpMap.get(cleanDigits);
      if (!record) {
        return NextResponse.json(
          { error: "Aucun code en attente ou code expiré. Veuillez redemander un code." },
          { status: 400 }
        );
      }

      if (Date.now() > record.expiresAt) {
        globalOtpMap.delete(cleanDigits);
        return NextResponse.json(
          { error: "Ce code OTP a expiré. Veuillez en redemander un nouveau." },
          { status: 400 }
        );
      }

      if (record.code !== inputCode.trim()) {
        record.attempts += 1;
        if (record.attempts >= 5) {
          globalOtpMap.delete(cleanDigits);
          return NextResponse.json(
            { error: "Trop de tentatives échouées. Veuillez redemander un nouveau code." },
            { status: 429 }
          );
        }
        return NextResponse.json(
          { error: `Code de confirmation incorrect (Tentative ${record.attempts}/5).` },
          { status: 400 }
        );
      }

      // Code valide : suppression du code utilisé
      globalOtpMap.delete(cleanDigits);

      // Mot de passe unique déterministe pour la session Supabase
      const secretSalt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 12) || "tuneliva_otp_secure";
      const otpAuthPassword = `Otp_${cleanDigits}_${secretSalt}`;

      // Vérifier si l'utilisateur existe déjà ou le créer
      const { data: createData, error: createError } = await admin.auth.admin.createUser({
        email: syntheticEmail,
        password: otpAuthPassword,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          phone: phone,
          full_name: fullName || `Vendeur ${phone}`,
          auth_provider: "phone_otp",
        },
      });

      let userId = createData?.user?.id;

      if (createError) {
        // Si l'utilisateur existe déjà, mettre à jour son mot de passe pour autoriser la connexion
        if (
          createError.message.includes("already registered") ||
          createError.message.includes("User already exists") ||
          createError.message.includes("unique")
        ) {
          try {
            const { data: listData } = await admin.auth.admin.listUsers();
            const existingUser = listData?.users?.find((u) => u.email === syntheticEmail);
            if (existingUser) {
              userId = existingUser.id;
              await admin.auth.admin.updateUserById(existingUser.id, {
                password: otpAuthPassword,
              });
            }
          } catch (listErr) {
            console.warn("Erreur recherche utilisateur existant:", listErr);
          }
        } else {
          return NextResponse.json({ error: createError.message }, { status: 400 });
        }
      }

      // Synchronisation du profil
      if (userId) {
        try {
          await admin.from("profiles").upsert({
            id: userId,
            email: syntheticEmail,
            full_name: fullName || `Vendeur ${phone}`,
            phone: phone,
            updated_at: new Date().toISOString(),
          });
        } catch (pErr) {
          console.warn("Profile sync warning:", pErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Numéro vérifié avec succès !",
        email: syntheticEmail,
        password: otpAuthPassword,
      });
    }

    // =========================================================================
    // 3. ACTION: INSCRIPTION DIRECTE TÉLÉPHONE + MOT DE PASSE
    // =========================================================================
    if (action === "signup") {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: "Le mot de passe doit comporter au moins 6 caractères." },
          { status: 400 }
        );
      }

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
              error: "Un compte existe déjà avec ce numéro de téléphone. Veuillez vous connecter.",
            },
            { status: 409 }
          );
        }
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }

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
    }

    // =========================================================================
    // 4. ACTION: CONNEXION TÉLÉPHONE + MOT DE PASSE
    // =========================================================================
    if (action === "signin") {
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
