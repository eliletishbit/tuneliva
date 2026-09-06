// ==============================================================================
// 💳 TUNELIVA - CLIENT D'INTÉGRATION OFFICIEL FEDAPAY
// ==============================================================================

const FEDAPAY_LIVE_API = "https://api.fedapay.com/v1";
const FEDAPAY_SANDBOX_API = "https://sandbox-api.fedapay.com/v1";

export interface FedaPayTransactionParams {
  amount: number;
  currency?: string;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  callbackUrl?: string;
  customMetadata?: Record<string, any>;
}

export function getFedaPayBaseUrl(): string {
  const mode = process.env.FEDAPAY_MODE || "live";
  return mode === "live" ? FEDAPAY_LIVE_API : FEDAPAY_SANDBOX_API;
}

export async function createFedaPayTransaction(params: FedaPayTransactionParams) {
  const apiKey = process.env.FEDAPAY_API_KEY;
  const accountId = process.env.FEDAPAY_ACCOUNT_ID;

  if (!apiKey) {
    throw new Error("Clé API FEDAPAY_API_KEY manquante dans .env.local");
  }

  const baseUrl = getFedaPayBaseUrl();
  const nameParts = params.customerName.trim().split(" ");
  const firstname = nameParts[0] || "Client";
  const lastname = nameParts.slice(1).join(" ") || "Tuneliva";

  // Nettoyage du numéro de téléphone
  const cleanPhone = params.customerPhone.replace(/[^0-9+]/g, "");

  const callbackUrl =
    params.callbackUrl ||
    process.env.FEDAPAY_CALLBACK_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/fedapay/callback`;

  // 1. Créer la transaction FedaPay
  const createRes = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "FedaPay-Account": accountId || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: params.description,
      amount: Math.round(params.amount),
      currency: { iso: params.currency || "XOF" },
      callback_url: callbackUrl,
      customer: {
        firstname,
        lastname,
        email: params.customerEmail || "commande@tuneliva.com",
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
      custom_metadata: params.customMetadata || {},
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.text();
    console.error("Erreur création transaction FedaPay:", errData);
    throw new Error(`Erreur FedaPay: ${errData}`);
  }

  const transactionData = await createRes.json();
  const transactionId =
    transactionData["v1/transaction"]?.id || transactionData.id;

  if (!transactionId) {
    throw new Error("Identifiant de transaction FedaPay introuvable");
  }

  // 2. Générer le jeton de paiement (Checkout Token)
  const tokenRes = await fetch(`${baseUrl}/transactions/${transactionId}/token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "FedaPay-Account": accountId || "",
      "Content-Type": "application/json",
    },
  });

  if (!tokenRes.ok) {
    const tokenErr = await tokenRes.text();
    console.error("Erreur génération token FedaPay:", tokenErr);
    throw new Error(`Erreur token FedaPay: ${tokenErr}`);
  }

  const tokenData = await tokenRes.json();
  const checkoutUrl = tokenData.url || `https://checkout.fedapay.com/${tokenData.token}`;

  return {
    transactionId,
    token: tokenData.token,
    checkoutUrl,
  };
}

export async function verifyFedaPayTransaction(transactionId: string | number) {
  const apiKey = process.env.FEDAPAY_API_KEY;
  const accountId = process.env.FEDAPAY_ACCOUNT_ID;

  if (!apiKey) {
    throw new Error("Clé API FEDAPAY_API_KEY manquante");
  }

  const baseUrl = getFedaPayBaseUrl();
  const res = await fetch(`${baseUrl}/transactions/${transactionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "FedaPay-Account": accountId || "",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Impossible de vérifier la transaction ${transactionId}`);
  }

  const data = await res.json();
  const transaction = data["v1/transaction"] || data;
  return {
    id: transaction.id,
    status: transaction.status, // "approved" | "transferred" | "declined" | "canceled"
    amount: transaction.amount,
    currency: transaction.currency?.iso,
    customer: transaction.customer,
    customMetadata: transaction.custom_metadata,
  };
}
