import { NextRequest, NextResponse } from "next/server";
import {
  getAllOrders,
  saveOrder,
  updateOrderStatus,
  deleteOrder,
  getFunnelBySlug,
} from "@/lib/storage/funnels";
import { createClient } from "@/lib/supabase/server";
import { sendOrderNotificationEmail } from "@/lib/notifications/email";

export async function GET() {
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {}

  // Si non authentifié, isolation stricte : 0 commandes
  if (!userId) {
    return NextResponse.json([]);
  }

  const orders = await getAllOrders(userId);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { error: "Nom et téléphone obligatoires pour valider la commande" },
        { status: 400 }
      );
    }

    const funnelSlug = body.funnelSlug || "offre-speciale";
    let ownerUserId: string | undefined;

    // Déterminer le propriétaire du tunnel pour lui associer la commande
    try {
      const funnel = await getFunnelBySlug(funnelSlug);
      ownerUserId = funnel?.userId;
    } catch {}

    const order = await saveOrder({
      funnelSlug,
      userId: ownerUserId,
      productName: body.productName || "Produit Officiel",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerCity: body.customerCity || "Cotonou",
      customerAddress: body.customerAddress || "",
      totalAmount: Number(body.totalAmount) || 0,
      currency: body.currency || "XOF",
      paymentMethod: body.paymentMethod || "cod",
      paymentStatus: body.paymentStatus || (body.paymentMethod === "cod" ? "pending" : "paid"),
      orderStatus: "new",
    });

    // Envoi de la notification email Resend en tâche de fond
    try {
      sendOrderNotificationEmail({
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerCity: order.customerCity,
        customerAddress: order.customerAddress,
        productName: order.productName,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        funnelSlug,
        orderId: order.id,
      }).catch((e) => console.warn("Erreur Resend async:", e));
    } catch {}

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Erreur enregistrement commande:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la commande" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, paymentStatus } = body;
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderId, status, paymentStatus);
    if (!updated) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Erreur mise à jour commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const success = await deleteOrder(id);
  return NextResponse.json({ success });
}
