import fs from "fs";
import path from "path";
import { FunnelPageData } from "@/types/page";

const DATA_DIR = path.join(process.cwd(), ".data");
const FUNNELS_FILE = path.join(DATA_DIR, "funnels.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

export interface OrderRecord {
  id: string;
  funnelSlug: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: "cod" | "whatsapp" | "online";
  orderStatus: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ==========================================
// TUNNELS DE VENTE (FUNNELS)
// ==========================================
export function getAllFunnels(): FunnelPageData[] {
  ensureDataDir();
  if (!fs.existsSync(FUNNELS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(FUNNELS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erreur lecture funnels.json:", e);
    return [];
  }
}

export function getFunnelBySlug(slug: string): FunnelPageData | null {
  const funnels = getAllFunnels();
  return funnels.find((f) => f.slug === slug) || null;
}

export function saveFunnel(funnel: FunnelPageData): FunnelPageData {
  ensureDataDir();
  const funnels = getAllFunnels();

  // Si le slug n'existe pas, on le dérive du nom de projet
  let slug = funnel.slug;
  if (!slug || slug === "offre-speciale") {
    slug = funnel.projectName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "offre-speciale";
  }

  const updatedFunnel: FunnelPageData = {
    ...funnel,
    slug,
  };

  const existingIndex = funnels.findIndex((f) => f.slug === slug);
  if (existingIndex >= 0) {
    funnels[existingIndex] = updatedFunnel;
  } else {
    funnels.push(updatedFunnel);
  }

  fs.writeFileSync(FUNNELS_FILE, JSON.stringify(funnels, null, 2), "utf-8");
  return updatedFunnel;
}

export function deleteFunnel(slug: string): boolean {
  ensureDataDir();
  const funnels = getAllFunnels();
  const filtered = funnels.filter((f) => f.slug !== slug);
  if (filtered.length !== funnels.length) {
    fs.writeFileSync(FUNNELS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}

// ==========================================
// COMMANDES (ORDERS)
// ==========================================
export function getAllOrders(): OrderRecord[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    // Échantillons de démonstration pour que le tableau de bord soit vivant dès l'ouverture !
    const demoOrders: OrderRecord[] = [
      {
        id: "cmd-101",
        funnelSlug: "offre-speciale",
        productName: "Pack Découverte",
        customerName: "Amina Diallo",
        customerPhone: "+22997123456",
        customerCity: "Cotonou",
        customerAddress: "Haie Vive, face Pharmacie",
        totalAmount: 18000,
        currency: "XOF",
        paymentMethod: "cod",
        orderStatus: "new",
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // Il y a 35 min
      },
      {
        id: "cmd-102",
        funnelSlug: "offre-speciale",
        productName: "Pack Duo Privilège",
        customerName: "Koffi Mensah",
        customerPhone: "+22901532952",
        customerCity: "Calavi",
        customerAddress: "KPOTA, près du carrefour",
        totalAmount: 29000,
        currency: "XOF",
        paymentMethod: "cod",
        orderStatus: "confirmed",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // Il y a 2h
      },
      {
        id: "cmd-103",
        funnelSlug: "offre-speciale",
        productName: "Pack Découverte",
        customerName: "Fatou Sow",
        customerPhone: "+221776543210",
        customerCity: "Dakar",
        customerAddress: "Plateau, Rue Carnot",
        totalAmount: 18000,
        currency: "XOF",
        paymentMethod: "whatsapp",
        orderStatus: "delivered",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hier
      },
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(demoOrders, null, 2), "utf-8");
    return demoOrders;
  }

  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erreur lecture orders.json:", e);
    return [];
  }
}

export function saveOrder(order: Omit<OrderRecord, "id" | "createdAt">): OrderRecord {
  ensureDataDir();
  const orders = getAllOrders();
  const newOrder: OrderRecord = {
    ...order,
    id: `cmd-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderRecord["orderStatus"]
): OrderRecord | null {
  ensureDataDir();
  const orders = getAllOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) return null;

  orders[orderIndex].orderStatus = newStatus;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  return orders[orderIndex];
}

export function deleteOrder(orderId: string): boolean {
  ensureDataDir();
  const orders = getAllOrders();
  const filtered = orders.filter((o) => o.id !== orderId);
  if (filtered.length !== orders.length) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}
