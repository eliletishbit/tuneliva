import { NextRequest, NextResponse } from "next/server";
import { createFedaPayTransaction } from "@/lib/fedapay/client";
import { saveOrder } from "@/lib/storage/funnels";

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

    // 1. Enregistrer la commande en statut "en attente de paiement"
    await saveOrder({
      id: orderId,
      funnelSlug: funnelSlug || "offre-speciale",
      productName: productName || "Article Officiel",
      customerName,
      customerPhone,
      customerCity: customerCity || "Cotonou",
      customerAddress: customerAddress || "",
      totalAmount: Number(amount),
      currency,
      paymentMethod: "fedapay",
      paymentStatus: "pending",
      orderStatus: "new",
    });

    // 2. Générer la transaction FedaPay
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
      customMetadata: {
        orderId,
        funnelSlug,
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      transactionId,
      checkoutUrl,
    });
  } catch (error: any) {
    console.error("Erreur création paiement FedaPay:", error);
    return NextResponse.json(
      { error: error.message || "Impossible d'initialiser le paiement Mobile Money" },
      { status: 500 }
    );
  }
}
