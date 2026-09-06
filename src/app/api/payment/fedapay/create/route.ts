import { NextRequest, NextResponse } from "next/server";
import { createFedaPayTransaction } from "@/lib/fedapay/client";
import { saveOrder, getFunnelBySlug } from "@/lib/storage/funnels";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateCommissionSplit } from "@/lib/fedapay/subaccounts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      funnelSlug,
      productName,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      customerAddress,
      amount,
      currency = "XOF",
    } = body;

    if (!customerName || !customerPhone || !amount) {
      return NextResponse.json(
        { error: "Nom, téléphone et montant obligatoires" },
        { status: 400 }
      );
    }

    const orderId = `cmd-feda-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    // 1. Récupération du créateur du tunnel et de ses paramètres de commission / sous-compte
    let userId: string | undefined = undefined;
    let plan: "free" | "pro" = "free";
    let fedapaySubAccountId: string | undefined = undefined;

    if (funnelSlug) {
      try {
        const funnel = await getFunnelBySlug(funnelSlug);
        if (funnel?.userId) {
          userId = funnel.userId;
          const admin = createAdminClient();
          const { data: profile } = await admin
            .from("profiles")
            .select("plan, fedapay_sub_account_id")
            .eq("id", userId)
            .maybeSingle();

          if (profile) {
            plan = (profile.plan as "free" | "pro") || "free";
            fedapaySubAccountId = profile.fedapay_sub_account_id || undefined;
          }
        }
      } catch (err) {
        console.warn("Erreur recherche créateur tunnel:", err);
      }
    }

    // 2. Calcul du split de commission Tuneliva (Freemium: 4.5%, Pro: 2%)
    const split = calculateCommissionSplit(Number(amount), plan);

    // 3. Enregistrer la commande en statut "en attente de paiement" avec transparence des commissions
    await saveOrder({
      id: orderId,
      funnelSlug: funnelSlug || "offre-speciale",
      userId,
      productName: productName || "Offre Officielle",
      customerName,
      customerPhone,
      customerCity: customerCity || "Cotonou",
      customerAddress: customerAddress || "",
      totalAmount: Number(amount),
      currency,
      paymentMethod: "fedapay",
      paymentStatus: "pending",
      orderStatus: "new",
      platformFee: split.platformFee,
      merchantNetAmount: split.merchantNetAmount,
      commissionRate: split.commissionRate,
      fedapaySubAccountId,
    });

    // 4. Générer la transaction FedaPay (avec reversement automatique au sous-compte si lié)
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const callbackUrl = `${origin}/api/payment/fedapay/callback?orderId=${encodeURIComponent(
      orderId
    )}&slug=${encodeURIComponent(funnelSlug || "offre-speciale")}`;

    const { transactionId, checkoutUrl } = await createFedaPayTransaction({
      amount: Number(amount),
      currency,
      description: `Achat : ${productName} (Réf: ${orderId})`,
      customerName,
      customerPhone,
      customerEmail,
      callbackUrl,
      subAccountId: fedapaySubAccountId,
      merchantNetAmount: split.merchantNetAmount,
      customMetadata: {
        orderId,
        funnelSlug,
        platformFee: split.platformFee,
        merchantNetAmount: split.merchantNetAmount,
        commissionRate: split.commissionRate,
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      transactionId,
      checkoutUrl,
      platformFee: split.platformFee,
      merchantNetAmount: split.merchantNetAmount,
    });
  } catch (error: any) {
    console.error("Erreur création paiement FedaPay:", error);
    return NextResponse.json(
      { error: error.message || "Impossible d'initialiser le paiement Mobile Money" },
      { status: 500 }
    );
  }
}
