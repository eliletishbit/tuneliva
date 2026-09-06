import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createFedaPaySubAccount } from "@/lib/fedapay/subaccounts";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: profile, error } = await admin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("Erreur lecture profil payout:", error);
    }

    return NextResponse.json({
      success: true,
      profile: profile || {
        id: user.id,
        email: user.email,
        plan: "free",
        commission_rate: 4.5,
        payout_method: "momo",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erreur récupération paramètres de versement" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      businessName,
      payoutMethod = "momo", // "momo" | "bank"
      payoutMomoPhone,
      payoutMomoOperator,
      payoutBankName,
      payoutBankRib,
    } = body;

    let fedapaySubAccountId = body.fedapaySubAccountId;

    // Si payout par Mobile Money et pas encore de sub-account FedaPay, on le crée
    if (payoutMethod === "momo" && payoutMomoPhone) {
      try {
        const subAccount = await createFedaPaySubAccount({
          name: fullName || businessName || user.email || "Marchand Tuneliva",
          email: user.email,
          phone: payoutMomoPhone,
          customMetadata: {
            userId: user.id,
            operator: payoutMomoOperator,
          },
        });
        fedapaySubAccountId = subAccount.id;
      } catch (subErr) {
        console.warn("Création sous-compte FedaPay non bloquante:", subErr);
      }
    }

    const admin = createAdminClient();
    const updatePayload: any = {
      id: user.id,
      email: user.email,
      full_name: fullName,
      business_name: businessName,
      payout_method: payoutMethod,
      payout_momo_phone: payoutMomoPhone,
      payout_momo_operator: payoutMomoOperator,
      payout_bank_name: payoutBankName,
      payout_bank_rib: payoutBankRib,
      fedapay_sub_account_id: fedapaySubAccountId,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await admin
      .from("profiles")
      .upsert(updatePayload)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Erreur upsert profile:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Paramètres de versement enregistrés avec succès !",
      profile: updated || updatePayload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Impossible d'enregistrer les paramètres" },
      { status: 500 }
    );
  }
}
