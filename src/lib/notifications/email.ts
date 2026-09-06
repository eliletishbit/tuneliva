export interface OrderEmailNotification {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress?: string;
  productName: string;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  funnelSlug: string;
  orderId: string;
  merchantEmail?: string;
}

export async function sendOrderNotificationEmail(data: OrderEmailNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY manquant, email non envoyé.");
    return { success: false, error: "Clé API Resend manquante" };
  }

  // Si pas d'email marchand spécifié, on utilise l'adresse de notification par défaut
  const recipient = data.merchantEmail || "contact@tuneliva.com";

  const paymentLabel =
    data.paymentMethod === "cod"
      ? "💵 Paiement à la Livraison (Espèces au coursier)"
      : data.paymentMethod === "fedapay" || data.paymentMethod === "momo"
      ? "📱 Mobile Money (FedaPay / Wave / MTN / Moov)"
      : "💳 Carte Bancaire";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07080d; color: #f8fafc; margin: 0; padding: 20px; }
    .card { background-color: #0d111e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; max-width: 560px; margin: 0 auto; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
    .body { padding: 24px; }
    .highlight-box { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 14px; padding: 16px; margin-bottom: 20px; text-align: center; }
    .amount { font-size: 28px; font-weight: 900; color: #10b981; margin: 4px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
    .info-label { color: #94a3b8; font-weight: 600; }
    .info-val { color: #ffffff; font-weight: 700; text-align: right; }
    .cta-btn { display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 12px; margin-top: 20px; text-align: center; }
    .footer { text-align: center; padding: 16px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🎉 Nouvelle Commande Reçue !</h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Tunnel : <b>${data.funnelSlug}</b></p>
    </div>
    <div class="body">
      <div class="highlight-box">
        <span style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Montant de la commande</span>
        <div class="amount">${Number(data.totalAmount).toLocaleString("fr-FR")} ${data.currency}</div>
        <span style="font-size: 12px; color: #e2e8f0;">${paymentLabel}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Produit commandé</span>
        <span class="info-val">${data.productName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Client</span>
        <span class="info-val">${data.customerName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Téléphone</span>
        <span class="info-val">${data.customerPhone}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Ville de livraison</span>
        <span class="info-val">${data.customerCity}</span>
      </div>
      ${
        data.customerAddress
          ? `<div class="info-row">
              <span class="info-label">Adresse / Quartier</span>
              <span class="info-val">${data.customerAddress}</span>
            </div>`
          : ""
      }
      <div class="info-row">
        <span class="info-label">Identifiant Commande</span>
        <span class="info-val" style="font-family: monospace;">${data.orderId}</span>
      </div>

      <div style="text-align: center;">
        <a href="https://wa.me/${data.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
          `Bonjour ${data.customerName}, nous confirmons la réception de votre commande "${data.productName}" d'un montant de ${data.totalAmount} ${data.currency}. Notre coursier prépare votre livraison à ${data.customerCity}.`
        )}" class="cta-btn" target="_blank">
          💬 Contacter le Client sur WhatsApp
        </a>
      </div>
    </div>
    <div class="footer">
      Propulsé par Tuneliva E-commerce Studio • <a href="http://localhost:3000/dashboard" style="color: #6366f1;">Accéder au Dashboard</a>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tuneliva <onboarding@resend.dev>",
        to: recipient,
        subject: `🔥 Nouvelle commande : ${data.productName} (${data.totalAmount} ${data.currency})`,
        html: htmlContent,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      return { success: true, data: result };
    } else {
      const errorText = await res.text();
      console.error("Erreur envoi email Resend:", errorText);
      return { success: false, error: errorText };
    }
  } catch (err: any) {
    console.error("Exception envoi Resend:", err);
    return { success: false, error: err.message };
  }
}
