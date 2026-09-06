"use client";

import React, { useEffect, useState, useMemo } from "react";
import { OrderRecord } from "@/lib/storage/funnels";
import { FunnelPageData } from "@/types/page";
import { createClient } from "@/lib/supabase/client";
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
  Edit,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  X,
  Eye,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function MerchantDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [funnels, setFunnels] = useState<FunnelPageData[]>([]);
  const [loading, setLoading] = useState(true);

  // ÉTAT COPIE DE LIEN
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // FILTRES ET PAGINATION - PROJETS / TUNNELS
  const [funnelSearch, setFunnelSearch] = useState("");
  const [funnelPage, setFunnelPage] = useState(1);
  const funnelsPerPage = 5;

  // FILTRES ET PAGINATION - COMMANDES
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 6;

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
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser(data.user);
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // GESTION STATUT COMMANDE
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

  // SUPPRESSION COMMANDE
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (e) {
      console.error("Erreur suppression commande:", e);
    }
  };

  // SUPPRESSION TUNNEL / PROJET
  const handleDeleteFunnel = async (slug: string) => {
    if (!confirm(`Supprimer définitivement le tunnel "${slug}" ?`)) return;
    try {
      const res = await fetch(`/api/funnels?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFunnels((prev) => prev.filter((f) => f.slug !== slug));
      }
    } catch (e) {
      console.error("Erreur suppression tunnel:", e);
    }
  };

  // COPIER LE LIEN PUBLIC
  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // CONTACT WHATSAPP 1-CLIC
  const handleOpenWhatsApp = (order: OrderRecord) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Bonjour ${order.customerName} ! Je vous contacte depuis notre boutique concernant votre commande de "${order.productName}" (${order.totalAmount.toLocaleString("fr-FR")} FCFA). Pouvez-vous nous confirmer que vous êtes disponible pour la livraison à ${order.customerCity} ?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // EXPORT CSV LIVREURS
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
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.customerCity}"`,
      `"${(o.customerAddress || "").replace(/"/g, '""')}"`,
      `"${o.productName.replace(/"/g, '""')}"`,
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
    link.setAttribute(
      "download",
      `commandes-tuneliva-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPIs
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const deliveryRate =
    orders.length > 0 ? Math.round((deliveredCount / orders.length) * 100) : 100;

  // FILTRAGE ET PAGINATION DES PROJETS
  const filteredFunnels = useMemo(() => {
    return funnels.filter((f) => {
      const q = funnelSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        f.projectName.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        (f.branding?.address?.city || "").toLowerCase().includes(q)
      );
    });
  }, [funnels, funnelSearch]);

  const totalFunnelPages = Math.ceil(filteredFunnels.length / funnelsPerPage) || 1;
  const paginatedFunnels = filteredFunnels.slice(
    (funnelPage - 1) * funnelsPerPage,
    funnelPage * funnelsPerPage
  );

  // FILTRAGE ET PAGINATION DES COMMANDES
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Filtre statut
      if (orderStatusFilter !== "all" && o.orderStatus !== orderStatusFilter) {
        return false;
      }
      // Filtre paiement
      if (orderPaymentFilter !== "all" && o.paymentMethod !== orderPaymentFilter) {
        return false;
      }
      // Filtre texte
      const q = orderSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.customerCity.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    });
  }, [orders, orderStatusFilter, orderPaymentFilter, orderSearch]);

  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ordersPerPage,
    orderPage * ordersPerPage
  );

  return (
    <div className="min-h-screen bg-[#07080D] text-white flex flex-col">
      {/* 1. HEADER DU DASHBOARD */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Tuneliva <span className="text-xs text-indigo-400 font-bold">Studio</span>
              </span>
            </a>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-slate-300">Tableau de Bord</span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
                <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.email?.charAt(0).toUpperCase() || "V"}
                </div>
                <span className="text-slate-300 font-medium truncate max-w-[140px]">
                  {currentUser.user_metadata?.full_name || currentUser.email}
                </span>
              </div>
            )}

            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Actualiser les données"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            <a
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Tunnel</span>
            </a>

            {currentUser && (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 flex-1 w-full">
        {/* TITRE ET BANDEAU D'ACCUEIL */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Gestion de vos Tunnels & Ventes
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pilotez vos pages, modifiez vos offres et gérez les expéditions avec vos livreurs.
            </p>
          </div>
        </div>

        {/* CARTES DE KPIS EN TEMPS RÉEL */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-bold">
              💰
            </div>
            <p className="text-xs text-slate-400 font-medium">Chiffre d'Affaires</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">
              {totalRevenue.toLocaleString("fr-FR")} <span className="text-xs text-slate-400">FCFA</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              📦
            </div>
            <p className="text-xs text-slate-400 font-medium">Total Commandes</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">
              {orders.length}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
              🚚
            </div>
            <p className="text-xs text-slate-400 font-medium">Taux de Livraison</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              {deliveryRate}%
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
              🚀
            </div>
            <p className="text-xs text-slate-400 font-medium">Tunnels / Projets Actifs</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">
              {funnels.length}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1 : MES PROJETS & TUNNELS DE VENTE (1 PROJET = 1 TUNNEL COMPLET) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <span>🚀</span>
                <span>Mes Projets & Tunnels de Vente ({filteredFunnels.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Chaque projet correspond à 1 tunnel autonome composé de ses étapes (Capture, Vente, Commande, Merci).
              </p>
            </div>

            {/* BARRE DE RECHERCHE PROJETS */}
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou slug..."
                  value={funnelSearch}
                  onChange={(e) => {
                    setFunnelSearch(e.target.value);
                    setFunnelPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              {funnelSearch && (
                <button
                  onClick={() => {
                    setFunnelSearch("");
                    setFunnelPage(1);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                  title="Réinitialiser"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* TABLEAU DES TUNNELS / PROJETS */}
          <div className="rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl">
            {paginatedFunnels.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold">Aucun tunnel trouvé</p>
                <p className="text-xs text-slate-500">
                  {funnelSearch
                    ? "Aucun résultat ne correspond à votre recherche."
                    : "Vous n'avez pas encore publié de tunnel. Créez-en un depuis l'accueil !"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/70 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                      <th className="p-3.5 pl-5">Nom du Projet</th>
                      <th className="p-3.5">Lien Public</th>
                      <th className="p-3.5">Étapes du Tunnel</th>
                      <th className="p-3.5">Ville & Contact</th>
                      <th className="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedFunnels.map((funnel) => {
                      const origin = typeof window !== "undefined" ? window.location.origin : "";
                      const publicUrl = `${origin}/p/${funnel.slug}`;
                      const isCopied = copiedSlug === funnel.slug;

                      // Étapes du tunnel
                      const stepsList = funnel.steps && funnel.steps.length > 0
                        ? funnel.steps
                        : [
                            { name: "Capture" },
                            { name: "Vente" },
                            { name: "Commande" },
                            { name: "Merci" },
                          ];

                      return (
                        <tr key={funnel.slug} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 pl-5">
                            <span className="font-bold text-white block text-sm">
                              {funnel.projectName}
                            </span>
                            <span className="text-[11px] text-indigo-400 font-mono">
                              slug: {funnel.slug}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <a
                              href={`/p/${funnel.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-300 hover:text-white flex items-center gap-1 font-mono hover:underline truncate max-w-xs"
                            >
                              <span>/p/{funnel.slug}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                            </a>
                          </td>

                          <td className="p-3.5">
                            <div className="flex flex-wrap items-center gap-1">
                              {stepsList.map((st, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md bg-indigo-600/15 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold"
                                >
                                  {st.name}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="text-slate-300 block">
                              📍 {funnel.branding?.address?.city || "Cotonou"}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {funnel.branding?.whatsappNumber || "WhatsApp direct"}
                            </span>
                          </td>

                          <td className="p-3.5 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1. RETOURNER SUR L'ÉDITION DANS LE STUDIO */}
                              <a
                                href={`/?edit=${encodeURIComponent(funnel.slug)}`}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                title="Ouvrir ce tunnel dans l'éditeur"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Modifier</span>
                              </a>

                              {/* 2. VOIR LA PAGE FINALE */}
                              <a
                                href={`/p/${funnel.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-xl bg-slate-900 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                                title="Voir la page client"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>

                              {/* 3. COPIER LE LIEN */}
                              <button
                                onClick={() => handleCopyLink(funnel.slug)}
                                className="p-1.5 rounded-xl bg-slate-900 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                title="Copier le lien"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* 4. SUPPRIMER LE TUNNEL */}
                              <button
                                onClick={() => handleDeleteFunnel(funnel.slug)}
                                className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                                title="Supprimer ce tunnel"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION DES PROJETS */}
            {totalFunnelPages > 1 && (
              <div className="p-3 border-t border-white/10 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {funnelPage} sur {totalFunnelPages} ({filteredFunnels.length} projets)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFunnelPage((p) => Math.max(1, p - 1))}
                    disabled={funnelPage === 1}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setFunnelPage((p) => Math.min(totalFunnelPages, p + 1))}
                    disabled={funnelPage === totalFunnelPages}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2 : GESTION DES COMMANDES REÇUES AVEC FILTRES ET PAGINATION */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <span>📦</span>
                <span>Commandes Reçues ({filteredOrders.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Prospects ayant commandé en espèces (COD) ou via WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportOrdersToCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exporter CSV Livreurs</span>
              </button>
            </div>
          </div>

          {/* BARRE DE RECHERCHE ET FILTRES DES COMMANDES */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-950 border border-white/10">
            {/* RECHERCHE */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher par client, téléphone, ville..."
                value={orderSearch}
                onChange={(e) => {
                  setOrderSearch(e.target.value);
                  setOrderPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* FILTRE STATUT */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
              {[
                { id: "all", label: "Tous" },
                { id: "new", label: "🟡 Nouveau" },
                { id: "confirmed", label: "🔵 Confirmé" },
                { id: "shipped", label: "🟣 En cours" },
                { id: "delivered", label: "🟢 Livré" },
                { id: "cancelled", label: "🔴 Annulé" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setOrderStatusFilter(f.id);
                    setOrderPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === f.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* RÉINITIALISER */}
            {(orderSearch || orderStatusFilter !== "all" || orderPaymentFilter !== "all") && (
              <button
                onClick={() => {
                  setOrderSearch("");
                  setOrderStatusFilter("all");
                  setOrderPaymentFilter("all");
                  setOrderPage(1);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-900 text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>

          {/* TABLEAU DES COMMANDES */}
          <div className="rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl">
            {paginatedOrders.length === 0 ? (
              <div className="p-10 text-center text-slate-400 space-y-2">
                <PackageCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold">Aucune commande trouvée</p>
                <p className="text-xs text-slate-500">
                  {orderSearch || orderStatusFilter !== "all"
                    ? "Aucune commande ne correspond aux filtres sélectionnés."
                    : "Partagez votre tunnel pour enregistrer vos premières ventes !"}
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
                      <th className="p-3.5">Statut de la commande</th>
                      <th className="p-3.5 pr-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedOrders.map((order) => (
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
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderRecord["orderStatus"])
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="new">🟡 Nouveau</option>
                            <option value="confirmed">🔵 Confirmé</option>
                            <option value="shipped">🟣 En cours</option>
                            <option value="delivered">🟢 Livré</option>
                            <option value="cancelled">🔴 Annulé</option>
                          </select>
                        </td>

                        <td className="p-3.5 pr-5 text-right">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION DES COMMANDES */}
            {totalOrderPages > 1 && (
              <div className="p-3 border-t border-white/10 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {orderPage} sur {totalOrderPages} ({filteredOrders.length} commandes)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    disabled={orderPage === 1}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                    disabled={orderPage === totalOrderPages}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
