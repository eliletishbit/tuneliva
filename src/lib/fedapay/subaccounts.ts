// ==============================================================================
// 💳 TUNELIVA - GESTION DES SOUS-COMPTES & COMMISSIONS FEDAPAY
// ==============================================================================

import { getFedaPayBaseUrl } from "./client";

export interface CreateSubAccountParams {
  name: string;
  email?: string;
  phone: string;
  country?: string;
  customMetadata?: Record<string, any>;
}

export interface SplitResult {
  totalAmount: number;
  commissionRate: number; // ex: 4.5 (%)
  platformFee: number;
  merchantNetAmount: number;
}

/**
 * Calcule la commission Tuneliva et le montant net revenant au créateur/marchand.
 * - Formule Freemium (Starter) : 4.5% de commission par vente
 * - Formule Pro Creator : 2.0% de commission par vente
 */
export function calculateCommissionSplit(
  amount: number,
  plan: "free" | "pro" = "free"
): SplitResult {
  const commissionRate = plan === "pro" ? 2.0 : 4.5;
  const platformFee = Math.round(amount * (commissionRate / 100));
  const merchantNetAmount = Math.max(0, amount - platformFee);

  return {
    totalAmount: amount,
    commissionRate,
    platformFee,
    merchantNetAmount,
  };
}

/**
 * Crée un sous-compte FedaPay pour un marchand afin de lui reverser automatiquement
 * ses fonds lors des paiements en ligne Mobile Money / Carte Bancaire.
 */
export async function createFedaPaySubAccount(params: CreateSubAccountParams) {
  const apiKey = process.env.FEDAPAY_API_KEY;
  const accountId = process.env.FEDAPAY_ACCOUNT_ID;

  if (!apiKey) {
    throw new Error("Clé API FEDAPAY_API_KEY manquante");
  }

  const baseUrl = getFedaPayBaseUrl();
  const cleanPhone = params.phone.replace(/[^0-9+]/g, "");

  // Détection automatique du code pays ISO (2 lettres)
  let country = params.country || "bj";
  if (cleanPhone.startsWith("+225")) country = "ci";
  else if (cleanPhone.startsWith("+221")) country = "sn";
  else if (cleanPhone.startsWith("+228")) country = "tg";
  else if (cleanPhone.startsWith("+226")) country = "bf";
  else if (cleanPhone.startsWith("+237")) country = "cm";
  else if (cleanPhone.startsWith("+229")) country = "bj";

  const payload = {
    name: params.name,
    email: params.email || undefined,
    phone_number: {
      number: cleanPhone,
      country,
    },
    custom_metadata: params.customMetadata || {},
  };

  try {
    const res = await fetch(`${baseUrl}/sub_accounts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "FedaPay-Account": accountId || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Réponse FedaPay sous-compte non-200:", errText);
      // Si l'API FedaPay retourne une erreur ou si la fonctionnalité requiert activation spécifique,
      // on génère un identifiant virtuel interne pour assurer la continuité sans blocage.
      return {
        id: `sub_fed_${Date.now().toString(36)}`,
        name: params.name,
        phone: cleanPhone,
        isVirtual: true,
      };
    }

    const data = await res.json();
    const subAccount = data["v1/sub_account"] || data.sub_account || data;

    return {
      id: subAccount.id?.toString() || `sub_fed_${Date.now().toString(36)}`,
      name: subAccount.name || params.name,
      phone: cleanPhone,
      isVirtual: false,
    };
  } catch (err: any) {
    console.warn("Exception lors de la création du sous-compte FedaPay:", err);
    return {
      id: `sub_fed_${Date.now().toString(36)}`,
      name: params.name,
      phone: cleanPhone,
      isVirtual: true,
    };
  }
}
