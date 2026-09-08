import fs from "fs";
import path from "path";
import { FunnelPageData } from "@/types/page";
import { createAdminClient } from "@/lib/supabase/admin";

const DATA_DIR = path.join(process.cwd(), ".data");
const FUNNELS_FILE = path.join(DATA_DIR, "funnels.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

export interface OrderRecord {
  id: string;
  funnelSlug: string;
  userId?: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: "cod" | "whatsapp" | "online" | "fedapay" | "momo" | "card";
  paymentStatus?: "pending" | "paid" | "failed";
  orderStatus: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  fedapayTransactionId?: string;
  fedapaySubAccountId?: string;
  platformFee?: number;
  merchantNetAmount?: number;
  commissionRate?: number;
  createdAt: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // Ignoré en environnement serverless read-only
    }
  }
}

// ==============================================================================
// 1. GESTION DES TUNNELS (SUPABASE POSTGRESQL + LOCAL FALLBACK)
// ==============================================================================

export async function getAllFunnels(userId?: string): Promise<FunnelPageData[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("funnels")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((row) => ({
        ...row.data,
        id: row.id,
        slug: row.slug,
        projectName: row.name,
        pageType: row.page_type,
        userId: row.user_id,
      }));
    }
    if (error) {
      console.warn("Supabase getAllFunnels error:", error);
    }
  } catch (e) {
    console.warn("Supabase non disponible pour getAllFunnels, bascule locale:", e);
  }

  // Fallback Fichier Local (uniquement si Supabase inaccessible)
  ensureDataDir();
  if (!fs.existsSync(FUNNELS_FILE)) return [];
  try {
    const raw = fs.readFileSync(FUNNELS_FILE, "utf-8");
    const list: FunnelPageData[] = JSON.parse(raw);
    return userId ? list.filter((f) => f.userId === userId) : list;
  } catch {
    return [];
  }
}

export async function getFunnelBySlug(slug: string): Promise<FunnelPageData | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("funnels")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      return {
        ...data.data,
        id: data.id,
        slug: data.slug,
        projectName: data.name,
        pageType: data.page_type,
        userId: data.user_id,
      };
    }
  } catch (e) {
    console.warn(`Supabase getFunnelBySlug (${slug}) fallback:`, e);
  }

  // Fallback Local
  try {
    ensureDataDir();
    if (fs.existsSync(FUNNELS_FILE)) {
      const raw = fs.readFileSync(FUNNELS_FILE, "utf-8");
      const list: FunnelPageData[] = JSON.parse(raw);
      return list.find((f) => f.slug === slug) || null;
    }
  } catch {}
  return null;
}

export async function saveFunnel(
  funnel: FunnelPageData,
  userId?: string
): Promise<FunnelPageData> {
  // Normalisation du slug
  let slug = funnel.slug;
  if (!slug || slug === "offre-speciale") {
    slug =
      funnel.projectName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "offre-speciale";
  }

  const updatedFunnel: FunnelPageData = {
    ...funnel,
    slug,
    userId: userId || funnel.userId,
  };

  // 1. Sauvegarde dans Supabase PostgreSQL
  try {
    const supabase = createAdminClient();
    const payload: any = {
      name: funnel.projectName || "Tunnel de Vente",
      slug,
      page_type: funnel.pageType || "sales",
      data: updatedFunnel,
      is_published: true,
      updated_at: new Date().toISOString(),
    };

    if (userId || funnel.userId) {
      payload.user_id = userId || funnel.userId;
    }

    const { data, error } = await supabase
      .from("funnels")
      .upsert(payload, { onConflict: "slug" })
      .select()
      .single();

    if (!error && data) {
      updatedFunnel.id = data.id;
    }
  } catch (e) {
    console.warn("Erreur sauvegarde Supabase, persistance locale de secours:", e);
  }

  // 2. Mise à jour de la mémoire cache locale de secours
  try {
    ensureDataDir();
    let funnels: FunnelPageData[] = [];
    if (fs.existsSync(FUNNELS_FILE)) {
      try {
        funnels = JSON.parse(fs.readFileSync(FUNNELS_FILE, "utf-8"));
      } catch {}
    }
    const existingIndex = funnels.findIndex((f) => f.slug === slug);
    if (existingIndex >= 0) {
      funnels[existingIndex] = updatedFunnel;
    } else {
      funnels.push(updatedFunnel);
    }
    fs.writeFileSync(FUNNELS_FILE, JSON.stringify(funnels, null, 2), "utf-8");
  } catch {}

  return updatedFunnel;
}

export async function deleteFunnel(slug: string, userId?: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("funnels").delete().eq("slug", slug);
    if (userId) {
      query = query.eq("user_id", userId);
    }
    await query;
  } catch (e) {
    console.warn("Erreur suppression Supabase:", e);
  }

  try {
    ensureDataDir();
    if (fs.existsSync(FUNNELS_FILE)) {
      const raw = fs.readFileSync(FUNNELS_FILE, "utf-8");
      const funnels: FunnelPageData[] = JSON.parse(raw);
      const filtered = funnels.filter((f) => f.slug !== slug);
      if (filtered.length !== funnels.length) {
        fs.writeFileSync(FUNNELS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
        return true;
      }
    }
  } catch {}

  return true;
}

// ==============================================================================
// 2. GESTION DES COMMANDES (SUPABASE POSTGRESQL + LOCAL FALLBACK)
// ==============================================================================

export async function getAllOrders(userId?: string): Promise<OrderRecord[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((row) => ({
        id: row.id,
        funnelSlug: row.funnel_slug,
        userId: row.user_id,
        productName: row.product_name,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerCity: row.customer_city,
        customerAddress: row.customer_address,
        totalAmount: Number(row.total_amount),
        currency: row.currency,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        orderStatus: row.order_status,
        fedapayTransactionId: row.fedapay_transaction_id,
        fedapaySubAccountId: row.fedapay_sub_account_id,
        platformFee: row.platform_fee ? Number(row.platform_fee) : undefined,
        merchantNetAmount: row.merchant_net_amount ? Number(row.merchant_net_amount) : undefined,
        commissionRate: row.commission_rate ? Number(row.commission_rate) : undefined,
        createdAt: row.created_at,
      }));
    }
    if (error) {
      console.warn("Supabase getAllOrders error:", error);
    }
  } catch (e) {
    console.warn("Supabase getAllOrders fallback:", e);
  }

  // Fallback Local (uniquement si Supabase inaccessible)
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    const list: OrderRecord[] = JSON.parse(raw);
    return userId ? list.filter((o) => o.userId === userId) : list;
  } catch {
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        funnelSlug: data.funnel_slug,
        userId: data.user_id,
        productName: data.product_name,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerCity: data.customer_city,
        customerAddress: data.customer_address,
        totalAmount: Number(data.total_amount),
        currency: data.currency,
        paymentMethod: data.payment_method,
        paymentStatus: data.payment_status,
        orderStatus: data.order_status,
        fedapayTransactionId: data.fedapay_transaction_id,
        fedapaySubAccountId: data.fedapay_sub_account_id,
        platformFee: data.platform_fee ? Number(data.platform_fee) : undefined,
        merchantNetAmount: data.merchant_net_amount ? Number(data.merchant_net_amount) : undefined,
        commissionRate: data.commission_rate ? Number(data.commission_rate) : undefined,
        createdAt: data.created_at,
      };
    }
  } catch (e) {
    console.warn("Supabase getOrderById fallback:", e);
  }

  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
      const list: OrderRecord[] = JSON.parse(raw);
      return list.find((o) => o.id === orderId) || null;
    }
  } catch {}
  return null;
}

export async function saveOrder(order: Partial<OrderRecord>): Promise<OrderRecord> {
  const newOrder: OrderRecord = {
    id: order.id || `cmd-${Math.floor(1000 + Math.random() * 9000)}`,
    funnelSlug: order.funnelSlug || "offre-speciale",
    userId: order.userId,
    productName: order.productName || "Article Officiel",
    customerName: order.customerName || "Client Anonyme",
    customerPhone: order.customerPhone || "+22900000000",
    customerCity: order.customerCity || "Cotonou",
    customerAddress: order.customerAddress || "",
    totalAmount: order.totalAmount || 0,
    currency: order.currency || "XOF",
    paymentMethod: order.paymentMethod || "cod",
    paymentStatus: order.paymentStatus || "pending",
    orderStatus: order.orderStatus || "new",
    fedapayTransactionId: order.fedapayTransactionId,
    fedapaySubAccountId: order.fedapaySubAccountId,
    platformFee: order.platformFee,
    merchantNetAmount: order.merchantNetAmount,
    commissionRate: order.commissionRate,
    createdAt: order.createdAt || new Date().toISOString(),
  };

  // 1. Sauvegarde dans Supabase
  try {
    const supabase = createAdminClient();
    await supabase.from("orders").upsert({
      id: newOrder.id,
      funnel_slug: newOrder.funnelSlug,
      user_id: newOrder.userId || null,
      customer_name: newOrder.customerName,
      customer_phone: newOrder.customerPhone,
      customer_city: newOrder.customerCity,
      customer_address: newOrder.customerAddress,
      product_name: newOrder.productName,
      total_amount: newOrder.totalAmount,
      currency: newOrder.currency,
      payment_method: newOrder.paymentMethod,
      payment_status: newOrder.paymentStatus,
      order_status: newOrder.orderStatus,
      fedapay_transaction_id: newOrder.fedapayTransactionId || null,
      fedapay_sub_account_id: newOrder.fedapaySubAccountId || null,
      platform_fee: newOrder.platformFee || 0,
      merchant_net_amount: newOrder.merchantNetAmount || newOrder.totalAmount,
      commission_rate: newOrder.commissionRate || 4.5,
      created_at: newOrder.createdAt,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Erreur insertion commande Supabase:", e);
  }

  // 2. Sauvegarde locale de secours
  try {
    ensureDataDir();
    let orders: OrderRecord[] = [];
    if (fs.existsSync(ORDERS_FILE)) {
      try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
      } catch {}
    }
    orders.unshift(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch {}

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderRecord["orderStatus"],
  paymentStatus?: OrderRecord["paymentStatus"]
): Promise<OrderRecord | null> {
  // 1. Supabase update
  try {
    const supabase = createAdminClient();
    const updatePayload: any = {
      order_status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (paymentStatus) {
      updatePayload.payment_status = paymentStatus;
    }

    await supabase.from("orders").update(updatePayload).eq("id", orderId);
  } catch (e) {
    console.warn("Erreur updateOrderStatus Supabase:", e);
  }

  // 2. Local update
  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const orders: OrderRecord[] = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        orders[idx].orderStatus = newStatus;
        if (paymentStatus) {
          orders[idx].paymentStatus = paymentStatus;
        }
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
        return orders[idx];
      }
    }
  } catch {}

  return getOrderById(orderId);
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    await supabase.from("orders").delete().eq("id", orderId);
  } catch (e) {
    console.warn("Erreur suppression commande Supabase:", e);
  }

  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const orders: OrderRecord[] = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
      const filtered = orders.filter((o) => o.id !== orderId);
      if (filtered.length !== orders.length) {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
        return true;
      }
    }
  } catch {}

  return true;
}
