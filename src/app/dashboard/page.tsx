"use client";

import React, { useEffect, useState } from "react";
import { OrderRecord } from "@/lib/storage/funnels";
import { FunnelPageData } from "@/types/page";
import {
  TrendingUp,
  PackageCheck,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Download,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function MerchantDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [funnels, setFunnels] = useState<FunnelPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resOrders, resFunnels] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/funnels"),
      ]);

      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }
      if (resFunnels.ok) {
        const dataFunnels = await resFunnels.json();
        setFunnels(dataFunnels);
      }
    } catch (e) {
      console.error("Erreur chargement dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderRecord["orderStatus"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (e) {
      console.error("Erreur mise à jour statut:", e);
    }
  };

  const handleOpenWhatsApp = (order: OrderRecord) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Bonjour ${order.customerName} ! Je vous contacte depuis notre boutique concernant votre commande de "${order.productName}" (${order.totalAmount.toLocaleString("fr-FR")} FCFA). Pouvez-vous nous confirmer que vous êtes disponible pour la livraison à ${order.customerCity} ?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const exportOrdersToCSV = () => {
    if (orders.length === 0) {
      alert("Aucune commande à exporter.");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Client",
      "Telephone",
      "Ville",
      "Adresse",
      "Produit",
      "Montant",
      "Paiement",
      "Statut",
    ];

    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString("fr-FR"),
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerCity}"`,
      `"${o.customerAddress || ""}"`,
      `"${o.productName}"`,
      o.totalAmount,
      o.paymentMethod,
      o.orderStatus,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `commandes-tuneliva-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculs statistiques
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

  const totalDelivered = orders.filter((o) => o.orderStatus === "delivered").length;
  const deliveryRate =
    orders.length > 0 ? Math.round((totalDelivered / orders.length) * 100) : 100;

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.orderStatus === filterStatus;
    const matchSearch =
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.customerCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: OrderRecord["orderStatus"]) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">🟡 Nouveau</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">🔵 Confirmé</span>;
      case "shipped":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">🟣 En cours</span>;
      case "delivered":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">🟢 Livré & Encaissé</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">🔴 Annulé</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 font-sans flex flex-col">
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080D]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md"
          >
            T
          </a>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Tableau de Bord Vendeur</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Direct COD & MoMo
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              Gérez vos commandes, contactez vos clients et suivez vos livraisons
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Tunnel</span>
          </a>
        </div>
      </header>

      {/* 2. ZONE PRINCIPALE DU DASHBOARD */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* CARTES KPIS EN TEMPS RÉEL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Chiffre d'Affaires</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalRevenue.toLocaleString("fr-FR")} <span className="text-xs text-amber-400 font-bold">FCFA</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              +100% encaissé ou en cours
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Commandes Reçues</span>
              <PackageCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {orders.length}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block">
              Formulaires COD & WhatsApp
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Taux de Livraison</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400">
              {deliveryRate}%
            </div>
            <span className="text-[10px] text-cyan-300 font-semibold block">
              {totalDelivered} colis encaissés
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tunnels Actifs</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {funnels.length || 1}
            </div>
            <span className="text-[10px] text-amber-400 font-semibold block">
              En ligne et accessibles
            </span>
          </div>
        </div>

        {/* SECTION DES TUNNELS PUBLIÉS EN LIGNE */}
        {funnels.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Vos Tunnels de Vente en Ligne ({funnels.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {funnels.map((f) => (
                <div
                  key={f.slug}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                      /{f.slug}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1 truncate">{f.projectName}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      {f.branding?.tagline || "Tunnel officiel optimisé"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <a
                      href={`/p/${f.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir la page client</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/p/${f.slug}`);
                        alert(`Lien copié : ${window.location.origin}/p/${f.slug}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold cursor-pointer"
                    >
                      Copier le lien
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION DE GESTION DES COMMANDES */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Gestion des Commandes</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                  {filteredOrders.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Contactez chaque acheteur en 1 clic pour convenir de l'heure de livraison
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboardData}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                title="Actualiser"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
              </button>

              <button
                onClick={exportOrdersToCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exporter CSV Livreurs</span>
              </button>
            </div>
          </div>

          {/* BARRE DE FILTRES ET RECHERCHE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, ville ou produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "Toutes" },
                { id: "new", label: "Nouveau" },
                { id: "confirmed", label: "Confirmé" },
                { id: "shipped", label: "En cours" },
                { id: "delivered", label: "Livré" },
                { id: "cancelled", label: "Annulé" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    filterStatus === f.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-900 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU DES COMMANDES */}
          <div className="rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <PackageCheck className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold">Aucune commande trouvée</p>
                <p className="text-xs text-slate-500">
                  Partagez le lien de votre page de vente pour commencer à recevoir des commandes !
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/70 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                      <th className="p-3.5 pl-5">Réf & Date</th>
                      <th className="p-3.5">Client & Ville</th>
                      <th className="p-3.5">Action WhatsApp</th>
                      <th className="p-3.5">Produit & Montant</th>
                      <th className="p-3.5">Paiement</th>
                      <th className="p-3.5 pr-5">Statut de la commande</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 pl-5">
                          <span className="font-mono font-bold text-indigo-400 block">
                            #{order.id}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-white block">{order.customerName}</span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{order.customerCity}</span>
                            {order.customerAddress && (
                              <span className="text-slate-500">• {order.customerAddress}</span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => handleOpenWhatsApp(order)}
                            className="px-3 py-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                            title="Contacter le client sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>{order.customerPhone}</span>
                          </button>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200 block truncate max-w-xs">
                            {order.productName}
                          </span>
                          <span className="font-bold text-amber-400 font-mono">
                            {order.totalAmount.toLocaleString("fr-FR")} {order.currency}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            {order.paymentMethod === "cod"
                              ? "💵 Espèces à la livraison"
                              : order.paymentMethod === "whatsapp"
                              ? "💬 Direct WhatsApp"
                              : "💳 En ligne"}
                          </span>
                        </td>

                        <td className="p-3.5 pr-5">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderRecord["orderStatus"])
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="new">🟡 Nouveau (À confirmer)</option>
                            <option value="confirmed">🔵 Confirmé par téléphone</option>
                            <option value="shipped">🟣 En cours de livraison</option>
                            <option value="delivered">🟢 Livré & Encaissé</option>
                            <option value="cancelled">🔴 Annulé</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
