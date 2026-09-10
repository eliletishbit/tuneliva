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
  Wallet,
  CreditCard,
  Building,
  Globe,
} from "lucide-react";

export default function MerchantDashboard() {
  const [authChecking, setAuthChecking] = useState(true);
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

    // DOMAINES PERSONNALISÉS
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [domainSlugInput, setDomainSlugInput] = useState("");
  const [domainSaving, setDomainSaving] = useState(false);
  const [domainMsg, setDomainMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setDomains(json.domains || []);
      }
    } catch (e) {
      console.warn("Erreur fetch domains:", e);
    }
  };

    // Calcul dynamique de l'hôte DNS selon le domaine saisi (évite les erreurs OVH/GoDaddy)
  const computedDnsHost = useMemo(() => {
    const raw = domainInput.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!raw) return "promo";
    const parts = raw.split(".");
    if (parts.length > 2) {
      return parts[0]; // ex: promo.maboutique.com -> promo
    }
    return "@"; // ex: maboutique.com -> @
  }, [domainInput]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim() || !domainSlugInput) {
      setDomainMsg({ type: "error", text: "Veuillez renseigner un domaine et choisir un tunnel." });
      return;
    }
    setDomainSaving(true);
    setDomainMsg(null);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput.trim(), funnelSlug: domainSlugInput }),
      });
      const json = await res.json();
      if (json.success) {
        setDomainMsg({
          type: "success",
          text: json.isVerified
            ? `Domaine "${json.domain.domain}" vérifié et actif !`
            : `Domaine "${json.domain.domain}" enregistré. Veuillez configurer le CNAME dans votre zone DNS.`,
        });
        setDomainInput("");
        fetchDomains();
      } else {
        setDomainMsg({ type: "error", text: json.error || "Erreur enregistrement" });
      }
    } catch (err: any) {
      setDomainMsg({ type: "error", text: err.message });
    } finally {
      setDomainSaving(false);
    }
  };

  const handleDeleteDomainRecord = async (domain: string) => {
    if (!confirm(`Déconnecter le domaine "${domain}" ?`)) return;
    try {
      const res = await fetch(`/api/domains?domain=${encodeURIComponent(domain)}`, { method: "DELETE" });
      if (res.ok) {
        setDomains((prev) => prev.filter((d) => d.domain !== domain));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // REVERSEMENTS & SOUS-COMPTES FEDAPAY
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutData, setPayoutData] = useState({
    fullName: "",
    businessName: "",
    payoutMethod: "momo",
    payoutMomoPhone: "",
    payoutMomoOperator: "MTN",
    payoutBankName: "",
    payoutBankRib: "",
    fedapaySubAccountId: "",
    plan: "free",
    commissionRate: 4.5,
  });
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  const fetchPayoutSettings = async () => {
    try {
      const res = await fetch("/api/merchant/payout-settings");
      if (res.ok) {
        const json = await res.json();
        if (json.profile) {
          setPayoutData({
            fullName: json.profile.full_name || "",
            businessName: json.profile.business_name || "",
            payoutMethod: json.profile.payout_method || "momo",
            payoutMomoPhone: json.profile.payout_momo_phone || "",
            payoutMomoOperator: json.profile.payout_momo_operator || "MTN",
            payoutBankName: json.profile.payout_bank_name || "",
            payoutBankRib: json.profile.payout_bank_rib || "",
            fedapaySubAccountId: json.profile.fedapay_sub_account_id || "",
            plan: json.profile.plan || "free",
            commissionRate: json.profile.commission_rate || 4.5,
          });
        }
      }
    } catch (e) {
      console.warn("Erreur fetch payout settings:", e);
    }
  };

  const handleSavePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSaving(true);
    setPayoutSuccessMsg(null);
    try {
      const res = await fetch("/api/merchant/payout-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payoutData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.profile?.fedapay_sub_account_id) {
          setPayoutData((prev) => ({
            ...prev,
            fedapaySubAccountId: json.profile.fedapay_sub_account_id,
          }));
        }
        setPayoutSuccessMsg("Coordonnées de versement et sous-compte FedaPay synchronisés avec succès !");
        setTimeout(() => setPayoutSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error("Erreur sauvegarde payout:", e);
    } finally {
      setPayoutSaving(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!session || !session.user || error) {
          window.location.href = "/login?redirect=/dashboard";
          return;
        }

        if (isMounted) {
          setCurrentUser(session.user);
          setAuthChecking(false);
          fetchDashboardData();
          fetchPayoutSettings();
        }
      } catch (err) {
        window.location.href = "/login?redirect=/dashboard";
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        window.location.href = "/login?redirect=/dashboard";
      } else if (session?.user && isMounted) {
        setCurrentUser(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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

  const totalPlatformFees = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, curr) => acc + (curr.platformFee || 0), 0);

  const totalNetRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce(
      (acc, curr) =>
        acc +
        (curr.merchantNetAmount !== undefined
          ? curr.merchantNetAmount
          : curr.totalAmount - (curr.platformFee || 0)),
      0
    );

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

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#07080D] text-white flex flex-col items-center justify-center space-y-4 font-sans selection:bg-indigo-500">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black uppercase tracking-wider text-slate-300">
            Vérification de la session...
          </p>
          <p className="text-[11px] text-slate-500">
            Accès sécurisé réservé aux vendeurs connectés
          </p>
        </div>
      </div>
    );
  }

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
              onClick={() => {
                setShowDomainModal(true);
                if (funnels.length > 0 && !domainSlugInput) {
                  setDomainSlugInput(funnels[0].slug);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Gérer vos noms de domaine personnalisés"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Domaines</span>
            </button>
            <button
              onClick={() => {
                setShowPayoutModal(true);
                fetchPayoutSettings();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Gérer les versements Mobile Money / Banque et sous-compte FedaPay"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Versements</span>
            </button>

            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Actualiser les données"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>


            <a
              href="/blog"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Lire les 150 guides du blog e-commerce"
            >
              <span>📚 Blog</span>
            </a>

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
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 flex-1 w-full">
        {/* BANNIÈRE OFFRE FONDATEUR GRATUITE & QUOTA PIONNIER */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Accès Fondateur 100% Offert
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Gratuit 0 FCFA
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Créez, personnalisez et publiez vos tunnels sans aucun abonnement payant pendant la phase de lancement !
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Quota Tunnels Offerts</span>
              <span className="text-xs font-black text-amber-300 font-mono">
                {funnels.length} / 3 Gratuits
              </span>
            </div>
            <a
              href="/"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
            >
              + Nouveau Tunnel
            </a>
          </div>
        </div>

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

        {/* CARTES DE KPIS EN TEMPS RÉEL AVEC SPLIT DES COMMISSIONS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm font-bold">
              💰
            </div>
            <p className="text-xs text-slate-400 font-medium">Ventes Brutes Encaissées</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">
              {totalRevenue.toLocaleString("fr-FR")} <span className="text-xs text-slate-400">FCFA</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
              💵
            </div>
            <p className="text-xs text-slate-400 font-medium">Revenu Net Reversé</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              {totalNetRevenue.toLocaleString("fr-FR")} <span className="text-xs text-slate-400">FCFA</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              🤝
            </div>
            <p className="text-xs text-slate-400 font-medium">Commissions Tuneliva ({payoutData.commissionRate}%)</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-amber-400">
              {totalPlatformFees.toLocaleString("fr-FR")} <span className="text-xs text-slate-400">FCFA</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-2 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
              🚀
            </div>
            <p className="text-xs text-slate-400 font-medium">Tunnels / Projets Actifs</p>
            <p className="text-xl sm:text-2xl font-black font-mono text-white">
              {funnels.length} <span className="text-xs text-slate-400 font-normal">({orders.length} cmd)</span>
            </p>
          </div>
        </div>

        {/* BANNIÈRE DÉDIÉE NOMS DE DOMAINE PERSONNALISÉS */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-600/20">
              <Globe className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>Noms de Domaine Personnalisés</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    Pro • SSL Inclus
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                Connectez vos propres domaines professionnels (ex: <code className="text-indigo-300 font-mono">promo.maboutique.com</code>) directement à vos tunnels pour inspirer 100% de confiance à vos acheteurs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto justify-end">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Domaines actifs</span>
              <span className="text-xs font-black text-emerald-400 font-mono">
                {domains.length} connecté{domains.length > 1 ? "s" : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowDomainModal(true);
                if (funnels.length > 0 && !domainSlugInput) {
                  setDomainSlugInput(funnels[0].slug);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Gérer / Connecter un Domaine</span>
            </button>
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
                          <div className="space-y-0.5 mt-0.5">
                            <span className="font-bold text-amber-400 font-mono text-xs block">
                              {order.totalAmount.toLocaleString("fr-FR")} {order.currency}
                            </span>
                            {order.platformFee !== undefined && order.platformFee > 0 && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                Net reçu : {(order.merchantNetAmount !== undefined ? order.merchantNetAmount : order.totalAmount - order.platformFee).toLocaleString("fr-FR")} {order.currency} (-{order.commissionRate || 4.5}%)
                              </span>
                            )}
                          </div>
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

        {/* MODAL PARAMÈTRES DE VERSEMENT & SOUS-COMPTE FEDAPAY */}
        {showPayoutModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A0D18] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Versements &amp; Sous-compte FedaPay</span>
                </div>
                <h2 className="text-xl font-black text-white">
                  Paramètres de Versement
                </h2>
                <p className="text-xs text-slate-400">
                  Configurez votre compte de réception pour recevoir automatiquement vos fonds lors des encaissements en ligne.
                </p>
              </div>

              {/* CARTE MODÈLE ÉCONOMIQUE TRANSPARENT */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">
                    Plan Actuel : {payoutData.plan === "pro" ? "Pro Creator (2%)" : "Freemium Starter (4.5%)"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 text-[10px] font-bold">
                    0 FCFA / mois
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Pas de frais cachés : Tuneliva prélève uniquement <strong>{payoutData.commissionRate}%</strong> de commission sur les paiements en ligne. Vous encaissez <strong>{100 - payoutData.commissionRate}%</strong> net directement sur votre numéro MoMo ou compte bancaire.
                </p>
              </div>

              {payoutSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{payoutSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSavePayoutSettings} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nom du Bénéficiaire ou Raison Sociale
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutData.fullName}
                    onChange={(e) =>
                      setPayoutData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Ex: Amina Diallo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Mode de Versement Préféré
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPayoutData((prev) => ({ ...prev, payoutMethod: "momo" }))
                      }
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                        payoutData.payoutMethod === "momo"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-950 border-white/10 text-slate-400"
                      }`}
                    >
                      <span>📱 Mobile Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPayoutData((prev) => ({ ...prev, payoutMethod: "bank" }))
                      }
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                        payoutData.payoutMethod === "bank"
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                          : "bg-slate-950 border-white/10 text-slate-400"
                      }`}
                    >
                      <span>🏦 Virement Bancaire</span>
                    </button>
                  </div>
                </div>

                {payoutData.payoutMethod === "momo" ? (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 block">
                        Opérateur Mobile Money
                      </label>
                      <select
                        value={payoutData.payoutMomoOperator}
                        onChange={(e) =>
                          setPayoutData((prev) => ({
                            ...prev,
                            payoutMomoOperator: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      >
                        <option value="MTN">MTN Mobile Money (Bénin / CI)</option>
                        <option value="Moov">Moov Money (Bénin / CI / Togo)</option>
                        <option value="Wave">Wave (Côte d'Ivoire / Sénégal)</option>
                        <option value="Orange">Orange Money (CI / Sénégal)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 block">
                        Numéro de Téléphone Mobile Money
                      </label>
                      <input
                        type="tel"
                        required
                        value={payoutData.payoutMomoPhone}
                        onChange={(e) =>
                          setPayoutData((prev) => ({
                            ...prev,
                            payoutMomoPhone: e.target.value,
                          }))
                        }
                        placeholder="+229 97 00 00 00"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 block">
                        Nom de l'Établissement Bancaire
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutData.payoutBankName}
                        onChange={(e) =>
                          setPayoutData((prev) => ({
                            ...prev,
                            payoutBankName: e.target.value,
                          }))
                        }
                        placeholder="Ex: Ecobank, BOA, SG, etc."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 block">
                        IBAN / RIB de Versement
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutData.payoutBankRib}
                        onChange={(e) =>
                          setPayoutData((prev) => ({
                            ...prev,
                            payoutBankRib: e.target.value,
                          }))
                        }
                        placeholder="BJ00 0000 0000 0000 0000 0000"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {payoutData.fedapaySubAccountId && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-400 text-[11px] flex items-center justify-between">
                    <span>Identifiant Sous-compte FedaPay :</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {payoutData.fedapaySubAccountId}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={payoutSaving}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {payoutSaving ? (
                    <span>Synchronisation avec FedaPay...</span>
                  ) : (
                    <>
                      <span>Enregistrer mes Coordonnées de Versement</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
        {/* MODAL GESTION DES NOMS DE DOMAINE PERSONNALISÉS */}
        {showDomainModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">
                      Noms de Domaine Personnalisés
                    </h3>
                    <p className="text-xs text-slate-400">
                      Branchez votre propre domaine professionnel sur vos tunnels
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDomainModal(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {domainMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    domainMsg.type === "success"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                  }`}
                >
                  {domainMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 shrink-0" />
                  )}
                  <span>{domainMsg.text}</span>
                </div>
              )}

              {/* Instructions DNS Dynamiques & Explicites */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3 text-xs">
                <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider block">
                  ⚙️ Enregistrement DNS à copier chez votre hébergeur (OVH, GoDaddy, LWS, Namecheap...) :
                </span>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">TYPE</span>
                    <span className="text-white font-bold">CNAME</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">NOM / HÔTE</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block font-mono">
                      {computedDnsHost}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">VALEUR / CIBLE</span>
                    <span className="text-indigo-400 font-bold break-all font-mono">cname.vercel-dns.com</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 text-[11px] text-slate-300 space-y-1.5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>👉</span>
                    <span>Comment remplir le champ "Hôte" sans vous tromper :</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[10px] leading-relaxed">
                    <li>
                      <strong className="text-amber-200">Pour un sous-domaine (Conseillé) :</strong> Si vous voulez <code className="text-indigo-300 font-mono font-bold">promo.maboutique.com</code>, mettez uniquement <strong className="text-emerald-300 font-mono font-bold">promo</strong> dans la case Hôte.
                    </li>
                    <li>
                      <strong className="text-amber-200">Pour votre domaine principal :</strong> Si vous voulez <code className="text-indigo-300 font-mono font-bold">maboutique.com</code> directement, mettez <strong className="text-emerald-300 font-mono font-bold">@</strong> (ou laissez vide selon OVH/Namecheap).
                    </li>
                  </ul>
                </div>
              </div>

              {/* Formulaire ajout domaine */}
              <form onSubmit={handleAddDomain} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase block">
                      Votre Domaine
                    </label>
                    <input
                      type="text"
                      required
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="Ex: promo.maboutique.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase block">
                      Associer au Tunnel
                    </label>
                    <select
                      value={domainSlugInput}
                      onChange={(e) => setDomainSlugInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    >
                      {funnels.map((f) => (
                        <option key={f.slug} value={f.slug}>
                          {f.projectName} (/p/{f.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={domainSaving || funnels.length === 0}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {domainSaving ? (
                    <span>Vérification &amp; Enregistrement...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Connecter ce Domaine</span>
                    </>
                  )}
                </button>
              </form>

              {/* Domaines connectés */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Domaines Actifs ({domains.length})
                </span>

                {domains.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Aucun domaine personnalisé connecté pour l'instant.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {domains.map((d) => (
                      <div
                        key={d.domain}
                        className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono">{d.domain}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                d.status === "verified"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {d.status === "verified" ? "✅ Actif" : "⏳ DNS en attente"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Pointe vers : /p/{d.funnelSlug}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://${d.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            title="Visiter"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteDomainRecord(d.domain)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Déconnecter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
