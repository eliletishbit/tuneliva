import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, saveOrder, updateOrderStatus, deleteOrder } from "@/lib/storage/funnels";

export async function GET() {
  const orders = getAllOrders();
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

    const order = saveOrder({
      funnelSlug: body.funnelSlug || "offre-speciale",
      productName: body.productName || "Produit Officiel",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerCity: body.customerCity || "Cotonou",
      customerAddress: body.customerAddress || "",
      totalAmount: body.totalAmount || 0,
      currency: body.currency || "XOF",
      paymentMethod: body.paymentMethod || "cod",
      orderStatus: "new",
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Erreur enregistrement commande:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la commande" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const updated = updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
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

  const success = deleteOrder(id);
  return NextResponse.json({ success });
}
