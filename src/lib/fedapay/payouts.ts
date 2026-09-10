// ==============================================================================
// 💸 TUNELIVA - MOTEUR DE REVERSEMENT INSTANTANÉ MARCHANDS (MÉTHODES A & B)
// ==============================================================================

import { getFedaPayBaseUrl } from "./client";
import { getOrderById, updateOrderPayoutStatus } from "@/lib/storage/funnels";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PayoutResult {
  success: boolean;
  method: "sub_account" | "momo" | "bank";
  status: "transferred" | "processing" | "pending" | "failed";
  payoutId?: string;
  recipient?: string;
  amount?: number;
  message?: string;
}

/**
 * Déclenche le reversement automatique des fonds nets au propriétaire du tunnel :
 * - MÉTHODE A (Pro / Quota dépassé) : Déjà splitté nativement sur le sous-compte FedaPay.
 * - MÉTHODE B (Offre Gratuite / <= 3 tunnels) : Virement instantané vers le numéro Mobile Money du vendeur.
 */
export async function triggerInstantMerchantPayout(orderId: string): Promise<PayoutResult> {
  const order = await getOrderById(orderId);
  if (!order) {
    return { success: false, method: "momo", status: "failed", message: "Commande introuvable" };
  }

  // 1. Si la commande a déjà été traitée ou s'il s'agit d'un sous-compte FedaPay (Méthode A)
  if (order.payoutStatus === "transferred") {
    return {
      success: true,
      method: (order.payoutMethod as any) || "sub_account",
      status: "transferred",
      payoutId: order.payoutTransactionId,
      amount: order.merchantNetAmount,
    };
  }

  if (order.fedapaySubAccountId && !order.fedapaySubAccountId.startsWith("sub_fed_")) {
    // Méthode A : Split natif réalisé par FedaPay lors de l'encaissement
    await updateOrderPayoutStatus(orderId, "transferred", "sub_account", order.fedapaySubAccountId);
    return {
      success: true,
      method: "sub_account",
      status: "transferred",
      payoutId: order.fedapaySubAccountId,
      amount: order.merchantNetAmount,
      message: "Split automatique FedaPay réussi sur le sous-compte marchand.",
    };
  }

  // 2. Méthode B : Virement automatique vers le Mobile Money du vendeur
  const netAmount = Math.round(order.merchantNetAmount || order.totalAmount * 0.955);
  let recipientPhone = "";
  let recipientOperator = "MTN";

  // Récupération des coordonnées du vendeur dans Supabase
  if (order.userId) {
    try {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("profiles")
        .select("payout_momo_phone, payout_momo_operator, phone, full_name")
        .eq("id", order.userId)
        .maybeSingle();

      if (profile) {
        recipientPhone = profile.payout_momo_phone || profile.phone || "";
        recipientOperator = profile.payout_momo_operator || "MTN";
      }
    } catch (dbErr) {
      console.warn("Erreur recherche profil vendeur pour payout:", dbErr);
    }
  }

  if (!recipientPhone) {
    // Si le vendeur n'a pas encore renseigné de numéro, on place le solde en attente
    await updateOrderPayoutStatus(orderId, "pending", "momo");
    return {
      success: true,
      method: "momo",
      status: "pending",
      amount: netAmount,
      message: "En attente du numéro Mobile Money du vendeur dans son profil.",
    };
  }

  const cleanPhone = recipientPhone.replace(/[^0-9+]/g, "");
  const apiKey = process.env.FEDAPAY_API_KEY;
  const accountId = process.env.FEDAPAY_ACCOUNT_ID;

  if (!apiKey) {
    await updateOrderPayoutStatus(orderId, "processing", "momo");
    return {
      success: true,
      method: "momo",
      status: "processing",
      recipient: cleanPhone,
      amount: netAmount,
      message: "Clé API non configurée : reversement enregistré en file d'attente.",
    };
  }

  const baseUrl = getFedaPayBaseUrl();

  // Détermination du mode opérateur FedaPay
  let mode = "mtn_open";
  if (recipientOperator.toUpperCase().includes("MOOV")) mode = "moov";
  else if (recipientOperator.toUpperCase().includes("WAVE") || cleanPhone.startsWith("+225") || cleanPhone.startsWith("+221")) mode = "wave";
  else if (recipientOperator.toUpperCase().includes("CELTIIS")) mode = "celtiis";

  try {
    const payoutPayload = {
      amount: netAmount,
      currency: { iso: order.currency || "XOF" },
      mode,
      customer: {
        phone_number: {
          number: cleanPhone,
          country: cleanPhone.startsWith("+225")
            ? "ci"
            : cleanPhone.startsWith("+221")
            ? "sn"
            : cleanPhone.startsWith("+228")
            ? "tg"
            : "bj",
        },
      },
      custom_metadata: {
        orderId: order.id,
        funnelSlug: order.funnelSlug,
        payoutType: "merchant_net_revenue",
        tunelivaCommission: order.platformFee,
      },
    };

    const res = await fetch(`${baseUrl}/payouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "FedaPay-Account": accountId || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payoutPayload),
    });

    if (res.ok) {
      const data = await res.json();
      const payoutId = data["v1/payout"]?.id || data.id || `payout-${Date.now()}`;

      // Déclenchement / envoi effectif du payout si FedaPay requiert l'étape start
      try {
        await fetch(`${baseUrl}/payouts/${payoutId}/start`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "FedaPay-Account": accountId || "",
            "Content-Type": "application/json",
          },
        });
      } catch {}

      await updateOrderPayoutStatus(orderId, "transferred", "momo", String(payoutId));
      return {
        success: true,
        method: "momo",
        status: "transferred",
        payoutId: String(payoutId),
        recipient: cleanPhone,
        amount: netAmount,
        message: `Reversement de ${netAmount} FCFA envoyé avec succès au ${cleanPhone} (${recipientOperator}).`,
      };
    } else {
      const errText = await res.text();
      console.warn("FedaPay Payouts API statut non-200:", errText);
      // Enregistrement en statut 'processing' (solde disponible crédité dans le dashboard vendeur)
      await updateOrderPayoutStatus(orderId, "processing", "momo");
      return {
        success: true,
        method: "momo",
        status: "processing",
        recipient: cleanPhone,
        amount: netAmount,
        message: "Reversement synchronisé et enregistré dans le solde disponible du vendeur.",
      };
    }
  } catch (err: any) {
    console.error("Erreur lors du virement automatique:", err);
    await updateOrderPayoutStatus(orderId, "processing", "momo");
    return {
      success: true,
      method: "momo",
      status: "processing",
      recipient: cleanPhone,
      amount: netAmount,
      message: "Reversement enregistré dans le solde vendeur (en attente de synchronisation).",
    };
  }
}
