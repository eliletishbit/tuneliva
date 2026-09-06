import { NextRequest, NextResponse } from "next/server";
import { verifyFedaPayTransaction } from "@/lib/fedapay/client";
import { updateOrderStatus, getOrderById } from "@/lib/storage/funnels";
import { sendOrderNotificationEmail } from "@/lib/notifications/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const slug = searchParams.get("slug") || "offre-speciale";
  const transactionId = searchParams.get("id");

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000";

  if (!orderId) {
    return NextResponse.redirect(`${origin}/p/${slug}?payment_error=missing_order`);
  }

  try {
    let isApproved = false;

    if (transactionId) {
      const tx = await verifyFedaPayTransaction(transactionId);
      isApproved = tx.status === "approved" || tx.status === "transferred";
    } else {
      // Par défaut si le statut n'est pas passé mais retour du callback
      isApproved = true;
    }

    if (isApproved) {
      await updateOrderStatus(orderId, "confirmed", "paid");
      const order = await getOrderById(orderId);

      if (order) {
        // Envoi de la notification email Resend
        await sendOrderNotificationEmail({
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerCity: order.customerCity,
          customerAddress: order.customerAddress,
          productName: order.productName,
          totalAmount: order.totalAmount,
          currency: order.currency,
          paymentMethod: "fedapay",
          funnelSlug: slug,
          orderId,
        });
      }

      // Redirection vers la page avec indicateur de succès ou vers l'étape merci
      return NextResponse.redirect(
        `${origin}/p/${slug}?order_success=true&paid=true&order_id=${encodeURIComponent(
          orderId
        )}`
      );
    } else {
      return NextResponse.redirect(
        `${origin}/p/${slug}?payment_error=declined&order_id=${encodeURIComponent(
          orderId
        )}`
      );
    }
  } catch (error) {
    console.error("Erreur vérification callback FedaPay:", error);
    return NextResponse.redirect(
      `${origin}/p/${slug}?order_success=true&order_id=${encodeURIComponent(orderId)}`
    );
  }
}
