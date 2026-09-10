import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrderById } from "@/lib/storage/funnels";
import { sendOrderNotificationEmail } from "@/lib/notifications/email";
import { triggerInstantMerchantPayout } from "@/lib/fedapay/payouts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.name || body.event;
    const entity = body.entity || body.data;

    // FedaPay envoie des événements comme 'transaction.approved'
    if (event === "transaction.approved" || entity?.status === "approved") {
      const orderId =
        entity?.custom_metadata?.orderId ||
        entity?.custom_metadata?.order_id ||
        entity?.description?.match(/cmd-feda-[a-z0-9-]+/)?.[0];

      if (orderId) {
        await updateOrderStatus(orderId, "confirmed", "paid");
        const order = await getOrderById(orderId);

        if (order) {
          try {
            await triggerInstantMerchantPayout(order.id);
          } catch (payoutErr) {
            console.warn("Webhook payout notice:", payoutErr);
          }
          await sendOrderNotificationEmail({
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerCity: order.customerCity,
            customerAddress: order.customerAddress,
            productName: order.productName,
            totalAmount: order.totalAmount,
            currency: order.currency,
            paymentMethod: "fedapay",
            funnelSlug: order.funnelSlug,
            orderId,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur traitement webhook FedaPay:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
