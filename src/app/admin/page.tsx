"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff,
  LogOut,
  Users,
  Layers,
  ShoppingBag,
  TrendingUp,
  MapPin,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Award,
  Globe,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  PieChart,
  BarChart3,
  Lightbulb,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentification Super Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Filtres table tunnels
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tunnelSearch, setTunnelSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"gmv" | "orders" | "name">("gmv");

  // Filtres table utilisateurs
  const [userSearch, setUserSearch] = useState<string>("");
  const [authFilter, setAuthFilter] = useState<string>("all");

  const fetchMetrics = async (tokenOverride?: string) => {
    setLoading(true);
    setError(null);
    const activeToken =
      tokenOverride ||
      adminToken ||
      (typeof window !== "undefined" ? localStorage.getItem("tuneliva_admin_token") : null);

    try {
      const res = await fetch("/api/admin/metrics", {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error("Session Super Admin expirée. Veuillez vous reconnecter.");
        }
        throw new Error("Erreur de récupération des métriques admin.");
      }
      const data = await res.json();
      setMetrics(data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err?.message || "Impossible de charger les métriques admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const savedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("tuneliva_admin_token")
          : null;
      try {
        const res = await fetch("/api/admin/login", {
          headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
        });
        if (res.ok) {
          setIsAuthenticated(true);
          if (savedToken) setAdminToken(savedToken);
          fetchMetrics(savedToken || undefined);
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Identifiants super admin non valides.");
      }
      if (data.token) {
        localStorage.setItem("tuneliva_admin_token", data.token);
        setAdminToken(data.token);
      }
      setIsAuthenticated(true);
      fetchMetrics(data.token);
    } catch (err: any) {
      setLoginError(err.message || "Erreur lors de la tentative de connexion.");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("tuneliva_admin_token");
    }
    setAdminToken(null);
    setIsAuthenticated(false);
    setMetrics(null);
  };

  const formatMoney = (val: number) => {
    return (val || 0).toLocaleString("fr-FR") + " FCFA";
  };

  // Tunnels filtrés
  const filteredFunnels = useMemo(() => {
    if (!metrics?.funnels) return [];
    return metrics.funnels
      .filter((f: any) => {
        const matchCat =
          selectedCategory === "all" || f.categoryKey === selectedCategory;
        const matchSearch =
          (f.projectName || "").toLowerCase().includes(tunnelSearch.toLowerCase()) ||
          (f.slug || "").toLowerCase().includes(tunnelSearch.toLowerCase());
        return matchCat && matchSearch;
      })
      .sort((a: any, b: any) => {
        if (sortBy === "gmv") return b.gmv - a.gmv;
        if (sortBy === "orders") return b.ordersCount - a.ordersCount;
        return a.projectName.localeCompare(b.projectName);
      });
  }, [metrics, selectedCategory, tunnelSearch, sortBy]);

  // Utilisateurs filtrés
  const filteredUsers = useMemo(() => {
    if (!metrics?.users) return [];
    return metrics.users.filter((u: any) => {
      const matchAuth = authFilter === "all" || u.authMethod === authFilter;
      const matchSearch =
        (u.fullName || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone || "").includes(userSearch);
      return matchAuth && matchSearch;
    });
  }, [metrics, authFilter, userSearch]);

  // VÉRIFICATION D'ÉTAT DE CHARGEMENT INITIAL DE SESSION
  if (isAuthenticated === null && loading) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-400 font-mono">Vérification des accréditations Super Admin...</p>
        </div>
      </div>
    );
  }

  // ÉCRAN DE CONNEXION SUPER ADMIN RESTREINT (GATEKEEPER)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
        {/* Glows d'arrière-plan */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[140px] opacity-25 bg-amber-500 pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-25 bg-indigo-500 pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-amber-500/30 border border-amber-400/30">
              👑
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Super Admin Tuneliva
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              Portail confidentiel de gestion des données, métriques et arbitrages stratégiques.
            </p>
          </div>

          <div className="bg-[#0B1020]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black space-y-5">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Accès strictement réservé au propriétaire de l'application.</span>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Email Super Administrateur
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="rodrigueapothey@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-xs text-white outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Mot de Passe Super Admin
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-xs text-white outline-none transition-all placeholder:text-slate-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loginSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Vérification sécurisée...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Déverrouiller le Super Admin</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/dashboard"
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Retour au tableau de bord créateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-white selection:bg-indigo-500 selection:text-white pb-24">
      {/* HALO LUMINEUX D'AMBIANCE */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] opacity-40 bg-gradient-to-b from-indigo-500/30 via-emerald-500/10 to-transparent" />
        <div className="absolute top-[40%] -right-40 w-[600px] h-[400px] rounded-full blur-[160px] opacity-20 bg-purple-500/30" />
      </div>

      {/* HEADER SUPER ADMIN */}
      <header className="relative z-10 border-b border-white/10 bg-[#060913]/80 backdrop-blur-xl sticky top-0 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 text-white">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight">
                  Super Admin Tuneliva
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-extrabold text-amber-300">
                  Propriétaire
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centre de pilotage stratégique, traçabilité & insights de monétisation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchMetrics()}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/30 text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-300 hover:text-white cursor-pointer"
            >
              <RefreshCw className={"w-3.5 h-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Rafraîchir</span>
            </button>
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-all text-white flex items-center gap-1"
            >
              <span>Mon Dashboard</span>
            </Link>
            <button
              onClick={handleAdminLogout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Se déconnecter du Super Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-lg transition-all"
            >
              Générateur IA
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* BANNIÈRE STRATÉGIQUE PHASE GRATUITE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/60 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Phase Pionnière Gratuite Active
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Lancement 0 FCFA
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Les utilisateurs profitent actuellement d'un accès sans abonnement pour maximiser l'adoption. Les données ci-dessous mesurent la traction réelle et guideront vos futurs paliers payants.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 block font-mono">Quota par utilisateur</span>
            <span className="text-sm font-black text-amber-300">10 Tunnels Offerts</span>
          </div>
        </div>

        {/* 1. CARTES KPI CLÉS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* KPI 1 : Chiffre d'Affaires Global */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/25 shadow-xl backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Volume d'Affaires (GMV)
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {formatMoney(metrics?.summary?.totalGmv || 0)}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>{metrics?.summary?.paidOrdersCount || 0} commandes payées</span>
            </p>
          </div>

          {/* KPI 2 : Total Utilisateurs */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/25 shadow-xl backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Créateurs Inscrits
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {metrics?.summary?.totalUsers || 0}
            </div>
            <p className="text-[11px] text-slate-400">
              Inscriptions Google, Téléphone & Email
            </p>
          </div>

          {/* KPI 3 : Total Tunnels */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/25 shadow-xl backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Tunnels Créés
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {metrics?.summary?.totalFunnels || 0}
            </div>
            <p className="text-[11px] text-slate-400">
              Pages de vente et de capture en ligne
            </p>
          </div>

          {/* KPI 4 : Total Commandes */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/25 shadow-xl backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Commandes Reçues
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {metrics?.summary?.totalOrders || 0}
            </div>
            <p className="text-[11px] text-slate-400">
              MoMo, FedaPay, WhatsApp & Livraison
            </p>
          </div>
        </section>

        {/* 2. CARTOGRAPHIE PROVENANCE GÉOGRAPHIQUE & MOYENS DE PAIEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Provenance Géographique (7 cols) */}
          <section className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Provenance Géographique des Utilisateurs
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Basé sur les indicatifs</span>
            </div>

            <div className="space-y-3 pt-2">
              {(metrics?.provenance || []).map((prov: any) => (
                <div key={prov.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-base">{prov.flag}</span>
                      <span>{prov.country}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{prov.count} acteurs</span>
                      <span className="font-bold text-cyan-400">{prov.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                      style={{ width: prov.percentage + "%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Répartition Méthodes de Paiement (5 cols) */}
          <section className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Modes de Paiement Utilisés
                </h3>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { key: "momo", label: "Mobile Money (MTN / Moov / Wave)", icon: "📱", color: "bg-emerald-500" },
                { key: "fedapay", label: "Passerelle FedaPay", icon: "⚡", color: "bg-cyan-500" },
                { key: "cod", label: "Paiement à la Livraison", icon: "💵", color: "bg-amber-500" },
                { key: "whatsapp", label: "Commande Direct WhatsApp", icon: "💬", color: "bg-green-500" },
                { key: "card", label: "Carte Bancaire Visa / Mastercard", icon: "💳", color: "bg-indigo-500" },
              ].map((m) => {
                const count = metrics?.paymentMethodsStats?.[m.key] || 0;
                const total = metrics?.summary?.totalOrders || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={m.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="text-base">{m.icon}</span>
                      <span className="font-medium text-slate-200">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-white">{count}</span>
                      <span className="text-slate-400 text-[10px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 3. VENTILATION PAR CAS D'USAGE (TYPES D'UTILISATION) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-base text-white">
                Ventilation par Cas d'Usage
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Où vos utilisateurs génèrent-ils de la valeur ?
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {(metrics?.useCases || []).map((uc: any) => (
              <div
                key={uc.category}
                className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3 shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{uc.icon}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                    {uc.funnelsCount} tunnels
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {uc.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {uc.ordersCount} commandes enregistrées
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">GMV :</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {formatMoney(uc.gmv)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. RADAR STRATÉGIQUE POUR LA FUTURE MONÉTISATION (INSIGHTS IA) */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-sm uppercase tracking-wider text-amber-300">
              Radar Stratégique de Monétisation Future
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {(metrics?.strategicInsights || []).map((ins: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider">
                    {ins.tag}
                  </span>
                  <span className="text-xs">💡</span>
                </div>
                <h4 className="text-xs font-black text-white">{ins.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ins.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TABLE DES TUNNELS & MEILLEURES VENTES (FILTRABLE & TRIABLE) */}
        <section className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <span>Tous les Tunnels de la Plateforme</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
                  {filteredFunnels.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Analysez le chiffre d'affaires et les commandes générées par chaque page
              </p>
            </div>

            {/* Barre de recherche et Tri */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un tunnel..."
                  value={tunnelSearch}
                  onChange={(e) => setTunnelSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="gmv">Trier par Chiffre d'Affaires</option>
                <option value="orders">Trier par Nb de Commandes</option>
                <option value="name">Trier par Nom</option>
              </select>
            </div>
          </div>

          {/* Filtres par catégorie (Pills) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {[
              { id: "all", label: "Tous" },
              { id: "ecommerce", label: "🛍️ E-Commerce" },
              { id: "formation", label: "🎓 Formations" },
              { id: "event", label: "🎟️ Événements" },
              { id: "saas", label: "🚀 Logiciels & SaaS" },
              { id: "artisan", label: "🛡️ Artisans" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedCategory(p.id)}
                className={"px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer " + (selectedCategory === p.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-slate-950 text-slate-400 hover:text-white border border-white/5")}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Tunnel & Nom</th>
                  <th className="py-3 px-3">Cas d'Usage</th>
                  <th className="py-3 px-3">Lien Public</th>
                  <th className="py-3 px-3 text-right">Commandes</th>
                  <th className="py-3 px-3 text-right">Volume (GMV)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFunnels.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Aucun tunnel correspondant aux filtres sélectionnés.
                    </td>
                  </tr>
                ) : (
                  filteredFunnels.map((f: any) => (
                    <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{f.categoryIcon}</span>
                          <span>{f.projectName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Preset: {f.themePreset}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-white/5">
                          {f.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <a
                          href={"/p/" + f.slug}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                        >
                          <span>/p/{f.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                        {f.ordersCount}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                        {formatMoney(f.gmv)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. RÉPERTOIRE DES CRÉATEURS INSCRITS */}
        <section className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <span>Répertoire des Utilisateurs Créateurs</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
                  {filteredUsers.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Suivi des comptes, méthodes d'authentification et coordonnées
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filtrer utilisateur..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
              />
              <select
                value={authFilter}
                onChange={(e) => setAuthFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">Tous les modes d'auth</option>
                <option value="google">Google OAuth</option>
                <option value="phone">Téléphone / WhatsApp</option>
                <option value="email">Email classique</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Créateur</th>
                  <th className="py-3 px-3">Mode d'Authentification</th>
                  <th className="py-3 px-3">Téléphone / WhatsApp</th>
                  <th className="py-3 px-3">Date d'Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{u.fullName || "Créateur"}</div>
                        {u.email && <div className="text-[11px] text-slate-400">{u.email}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={"px-2 py-0.5 rounded-full text-[10px] font-bold " + (
                            u.authMethod === "google"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : u.authMethod === "phone"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          )}
                        >
                          {u.authMethod === "google"
                            ? "Google Auth"
                            : u.authMethod === "phone"
                            ? "Téléphone MoMo"
                            : "Email"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {u.phone || "Non renseigné"}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. RETOURS DU SONDAGE FLASH (*SMART PULSE FEEDBACK*) */}
        <section className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-base text-white">
                Retours du Sondage Flash Post-Publication
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {(metrics?.feedback || []).length} avis collectés
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {(metrics?.feedback || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Aucun retour de sondage soumis pour le moment. Les avis s'afficheront ici au fur et à mesure des publications.
              </p>
            ) : (
              (metrics?.feedback || []).map((fb: any) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-indigo-300">{fb.questionText}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(fb.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-300 font-semibold flex items-center gap-2">
                    <span>👉 Réponse :</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {fb.answer}
                    </span>
                  </div>
                  {fb.comment && (
                    <p className="text-xs text-slate-400 italic">
                      "{fb.comment}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
