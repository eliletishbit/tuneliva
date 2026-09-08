"use client";

import React, { useState } from "react";
import { FunnelPageData, CurrencyCode, FunnelPageType } from "@/types/page";
import { FunnelEditor } from "@/components/editor/FunnelEditor";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  ShoppingBag,
  Wrench,
  Crown,
  CreditCard,
  Globe2,
  MessageCircle,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  PackageCheck,
} from "lucide-react";
import { generateSmartFunnel } from "@/lib/ai/smart-engine";

const STARTER_TEMPLATES = [
  {
    id: "momoopti_fintech",
    icon: Zap,
    name: "MomoOpti – Fintech & SaaS",
    badge: "Comparateur MoMo",
    desc: "Simulateur de taux Mobile Money, grille de tarifs transparente et API marchands.",
    prompt: "MomoOpti choisir le bon reseau Mobile Money pour payer moins comparateur MTN Moov Wave",
  },
  {
    id: "event_masterclass",
    icon: Sparkles,
    name: "The Art of Agentic AI (v0app)",
    badge: "Live Masterclass VIP",
    desc: "Conférence en direct Zoom, speaker bio, 3 modules et billetterie VIP.",
    prompt: "The Art of Agentic AI Live Masterclass 2026 avec pass Standard et VIP en direct sur Zoom v0app",
  },
  {
    id: "creator_hub",
    icon: Crown,
    name: "Creator Hub – Plateforme Créateurs",
    badge: "Produits Digitaux",
    desc: "Vente de formations et coaching avec encaissement hybride MoMo & Cartes et relance WhatsApp.",
    prompt: "Creator Hub la plateforme tout-en-un pour créateurs et infopreneurs monétisation produits digitaux",
  },
  {
    id: "visual_ai_studio",
    icon: Layers,
    name: "Visual AI Studio (Ideogram)",
    badge: "Studio Graphique IA",
    desc: "Design épuré et aéré haute définition pour outils créatifs, mockups et intégration API.",
    prompt: "Visual AI Studio donnez vie à vos idées en haute définition Ideogram studio ia",
  },
  {
    id: "service_artisan",
    icon: Wrench,
    name: "Artisan & Prestataire Pro",
    badge: "PME & Dépannage",
    desc: "Cabinet, serrurerie, plomberie avec appel direct et WhatsApp 24/7.",
    prompt: "Serrurier d'urgence à Cotonou intervention sous 15 minutes",
  },
  {
    id: "ecommerce_light",
    icon: ShoppingBag,
    name: "Boutique & E-commerce",
    badge: "Produit Physique",
    desc: "Produits physiques, packs en vedette et option paiement à la livraison.",
    prompt: "Boutique Cosmétique Bio & Sérum Éclat avec livraison express",
  },
];

const SHOWCASE_CREATIVES = [
  {
    id: "momo",
    title: "MomoOpti – Fintech MoMo",
    subtitle: "Comparateur de frais en temps réel • MTN / Moov / Wave",
    theme: "Fintech Mint & Obsidian",
    stats: "Économie moyenne : +14.2%",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80",
    color: "#00F5A0",
    prompt: "MomoOpti choisir le bon reseau Mobile Money pour payer moins comparateur MTN Moov Wave",
  },
  {
    id: "masterclass",
    title: "The Art of Agentic AI (v0app)",
    subtitle: "Live Masterclass 2026 • 3h intensives sur Zoom",
    theme: "Midnight Navy & Electric Violet",
    stats: "+3 482 participants certifiés",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
    color: "#8B5CF6",
    prompt: "The Art of Agentic AI Live Masterclass 2026 avec pass Standard et VIP en direct sur Zoom v0app",
  },
  {
    id: "creator",
    title: "Creator Hub – Monétisation",
    subtitle: "La suite tout-en-un des infopreneurs • MoMo & Cartes",
    theme: "Deep Carbon & Neon Magenta",
    stats: "Multiplicateur conversion : 3.4x",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
    color: "#EC4899",
    prompt: "Creator Hub la plateforme tout-en-un pour créateurs et infopreneurs monétisation produits digitaux",
  },
  {
    id: "visual_ai",
    title: "Visual AI Studio (Ideogram)",
    subtitle: "Studio créatif IA • Rendu 4K & Typographie haute précision",
    theme: "Pastel Mesh Minimaliste",
    stats: "Temps d'inférence : 2.8s",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
    color: "#6366F1",
    prompt: "Visual AI Studio donnez vie à vos idées en haute définition Ideogram studio ia",
  },
  {
    id: "artisan",
    title: "Serrurier Urgence Cotonou",
    subtitle: "Dépannage express 15 min • Appel direct & WhatsApp",
    theme: "Bleu Pro & Orange",
    stats: "Taux de conversion : 24.8%",
    imageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1000&auto=format&fit=crop&q=80",
    color: "#EA580C",
    prompt: "Serrurier à Cotonou intervention sous 15 minutes devis gratuit",
  },
  {
    id: "serum",
    title: "Sérum Éclat Anti-Taches",
    subtitle: "Paiement à la livraison • Dakar & Abidjan",
    theme: "Mode Clair Pur E-commerce",
    stats: "+340 commandes / semaine",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop&q=80",
    color: "#10B981",
    prompt: "Sérum visage éclat bio anti-taches 15000 FCFA Dakar",
  },
];

const TESTIMONIALS = [
  {
    name: "Koffi Mensah",
    role: "E-commerçant (Cotonou & Lomé)",
    text: "Avant Tuneliva, mes clients abandonnaient à cause des formulaires compliqués. Avec le paiement à la livraison et WhatsApp en 1 clic, mes ventes ont triplé en 2 semaines.",
    rating: 5,
  },
  {
    name: "Aïssatou Diallo",
    role: "Formatrice & Consultante (Paris / Dakar)",
    text: "Vendant depuis la France vers l'Afrique, j'avais besoin d'encaisser à la fois en cartes bancaires et en Mobile Money. Tuneliva est le seul outil qui gère cette double réalité sans prise de tête.",
    rating: 5,
  },
  {
    name: "Stéphane Kouamé",
    role: "Artisan Électricien (Abidjan)",
    text: "En 5 minutes ma page était en ligne avec le bouton d'appel direct et WhatsApp. Les clients m'appellent directement depuis leur smartphone.",
    rating: 5,
  },
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("XOF");
  const [pageType, setPageType] = useState<FunnelPageType>("sales");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFunnel, setGeneratedFunnel] = useState<FunnelPageData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Index du slider de créatives
  const [activeCreativeIndex, setActiveCreativeIndex] = useState(0);

  // Détection synchrone de ?edit= pour éviter le flash de l'accueil
  const [isEditLoading, setIsEditLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).has("edit");
    }
    return false;
  });

  // CHARGEMENT DIRECT D'UN PROJET EXISTANT DEPUIS LE DASHBOARD (?edit=mon-slug)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const editSlug = urlParams.get("edit");
      if (editSlug) {
        setIsLoading(true);
        setIsEditLoading(true);
        fetch(`/api/funnels?slug=${encodeURIComponent(editSlug)}`)
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Introuvable");
          })
          .then((data) => {
            if (data && data.projectName) {
              setGeneratedFunnel(data);
            }
          })
          .catch((err) => {
            console.warn("Erreur chargement projet à éditer:", err);
            setIsEditLoading(false);
          })
          .finally(() => {
            setIsLoading(false);
            setIsEditLoading(false);
          });
      }
    }
  }, []);

  const handleGenerate = async (targetPrompt?: string) => {
    const textToUse = targetPrompt || prompt;
    if (!textToUse.trim()) {
      setErrorMessage("Veuillez décrire votre produit ou choisir un modèle ci-dessous.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToUse,
          currency,
          pageType,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedFunnel(json.data);
      } else {
        const localPage = await generateSmartFunnel(textToUse, currency, pageType);
        setGeneratedFunnel(localPage);
      }
    } catch (err) {
      console.warn("Erreur réseau, utilisation du générateur local:", err);
      const localPage = await generateSmartFunnel(textToUse, currency, pageType);
      setGeneratedFunnel(localPage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchTemplate = async (templatePrompt: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const page = await generateSmartFunnel(templatePrompt, currency, pageType);
      setGeneratedFunnel(page);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditLoading && !generatedFunnel) {
    return (
      <div className="min-h-screen bg-[#06080E] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-600/30 animate-pulse">
          T
        </div>
        <div className="space-y-1 text-center">
          <h2 className="font-extrabold text-base tracking-tight text-white">
            Ouverture du Studio Tuneliva...
          </h2>
          <p className="text-xs text-slate-400">Chargement de votre tunnel de vente en cours.</p>
        </div>
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (generatedFunnel) {
    return (
      <FunnelEditor
        initialData={generatedFunnel}
        onBackToPrompt={() => setGeneratedFunnel(null)}
        onSave={(updatedData) => {
          setGeneratedFunnel(updatedData);
          alert("Votre tunnel a été enregistré avec succès !");
        }}
      />
    );
  }

  const currentCreative = SHOWCASE_CREATIVES[activeCreativeIndex];

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Halo lumineux décoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-indigo-600/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* 1. NAVBAR */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-base">
            T
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent block">
              Tuneliva
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
              Donnez vie à vos tunnels de vente
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Afrique • Diaspora • International</span>
          </div>

          <a
            href="/blog"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/50 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>📚 Blog</span>
          </a>

          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mes Commandes</span>
          </a>
        </div>
      </header>

      {/* 2. ZONE HÉRO PRINCIPALE & BARRE DE GÉNÉRATION */}
      <section className="relative z-10 px-4 pt-10 pb-16 max-w-4xl mx-auto text-center space-y-8 w-full">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-emerald-500/10 text-indigo-300 border border-white/10 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Pour l'Afrique, la Diaspora et les Vendeurs Internationaux</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            Donnez vie à vos tunnels &amp; pages de conversion{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              en 10 secondes
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Pour les <strong>formateurs</strong>, <strong>créateurs</strong>, <strong>organisateurs d'événements</strong>, <strong>startups</strong>, <strong>artisans</strong> et <strong>entreprises</strong>.
            Générez des pages haute conversion avec encaissement combiné <strong>Mobile Money &amp; Cartes Bancaires</strong>, redirection multicanale (Zoom, Téléchargement, Calendly) et <strong>COD</strong> pour les boutiques physiques.
          </p>
        </div>

        {/* BARRE DE PROMPT */}
        <div className="w-full max-w-2xl mx-auto space-y-3">
          <div className="p-2.5 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500 transition-all space-y-2 text-left">
            {/* TYPE DE PAGE À CRÉER */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
                Type :
              </span>
              {[
                { id: "sales", label: "🚀 Page de Vente", desc: "Produit ou Service" },
                { id: "event_booking", label: "🎟️ Événement & Billetterie", desc: "Pass VIP & Live" },
                { id: "digital_product", label: "🎓 Formation & Coaching", desc: "Accès Immédiat" },
                { id: "app_launch", label: "📱 Lancement d'App", desc: "Waitlist & Bêta" },
                { id: "capture", label: "🧲 Page de Capture", desc: "Opt-in Lead" },
                { id: "checkout", label: "🛒 Commande Directe", desc: "Paiement 1-clic" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPageType(t.id as FunnelPageType)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    pageType === t.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                      : "bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Décrivez votre projet (ex: Masterclass Stratégie & IA 2026 avec pass Standard et VIP, ou Lancement application mobile fintech avec liste d'attente, ou Formation Produits Digitaux...)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
            />

            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 px-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 font-semibold w-full sm:w-auto"
              >
                <option value="XOF">FCFA (Bénin, Côte d'Ivoire, Sénégal, Togo)</option>
                <option value="XAF">FCFA (Cameroun, Gabon, Congo)</option>
                <option value="GNF">GNF (Guinée)</option>
                <option value="EUR">Euro (€ - Diaspora & Europe)</option>
                <option value="USD">Dollar ($ - International)</option>
              </select>

              <button
                onClick={() => handleGenerate()}
                disabled={isLoading}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Création du tunnel...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Générer ma Page de Vente</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {errorMessage}
            </p>
          )}
        </div>

        {/* BANDEAU DES PAIEMENTS ACCEPTÉS (MOMO + CARTES) */}
        <div className="pt-2 pb-4 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="font-bold text-slate-300">Paiements pris en charge :</span>
          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20">MTN MoMo</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">Moov Money</span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">Orange Money</span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">Wave</span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">Cartes Visa & Mastercard</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Espèces à la livraison</span>
        </div>
      </section>

      {/* 3. DÉMARRAGE DIRECT AVEC LES 4 MODÈLES PRÊTS À L'EMPLOI (SANS IA REQUISE) */}
      <section className="py-10 px-4 max-w-5xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            🚀 Démarrez directement avec un modèle pro (Sans IA requise)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {STARTER_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <button
                key={tmpl.id}
                onClick={() => handleLaunchTemplate(tmpl.prompt)}
                className="p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-indigo-500/60 transition-all text-left space-y-2 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {tmpl.name}
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-white/10 text-slate-300">
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{tmpl.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION : CRÉATIVES ÉPOUSTOUFLANTS (SLIDER DYNAMIQUE) */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
            DESIGNS ÉLITE 2026
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Des créatives spectaculaires générées en quelques clics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Chaque tunnel est pensé pour capter l'attention et maximiser le passage à l'action.
          </p>
        </div>

        {/* CARROUSEL / SHOWCASE INTERACTIF */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold text-white"
                style={{ backgroundColor: currentCreative.color }}
              >
                {currentCreative.theme}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {currentCreative.stats}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentCreative.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentCreative.subtitle}
            </p>

            <button
              onClick={() => handleLaunchTemplate(currentCreative.prompt)}
              className="py-3 px-5 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: currentCreative.color }}
            >
              <span>Générer ce type de page</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* CONTRÔLES DU SLIDER */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              {SHOWCASE_CREATIVES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCreativeIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeCreativeIndex === idx
                      ? "w-8 bg-indigo-500"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-video relative shadow-2xl border border-white/10 group">
            <img
              src={currentCreative.imageUrl}
              alt={currentCreative.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white">Aperçu en direct 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION : CAS D'USAGE (POUR QUI EST FAIT TUNELIVA ?) */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
            CAS D'USAGE CONCRETS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Une solution pensée pour votre secteur d'activité
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🛍️
            </div>
            <h3 className="font-extrabold text-base text-white">E-commerce & Vente Directe</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cosmétiques, montres, chaussures, miel, agroalimentaire. Formulaire de commande COD avec vérification du colis à la livraison.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              🛠️
            </div>
            <h3 className="font-extrabold text-base text-white">Artisans & Dépannage Urgent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serruriers, plombiers, électriciens, mécaniciens. Bouton d'appel immédiat, WhatsApp et zone géographique d'intervention.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              👑
            </div>
            <h3 className="font-extrabold text-base text-white">Infopreneurs & Diaspora</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formations en ligne, coaching, ebooks, conférences. Intégration vidéo VSL et double encaissement Cartes + Mobile Money.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-extrabold text-base text-white">Startups & Services</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applications mobiles, comparateurs, abonnements et lancements de produits tech avec vitesse de chargement record &lt; 800ms.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECTION : TÉMOIGNAGES CLIENTS */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            ILS FONT CONFIANCE À TUNELIVA
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Ce que disent nos vendeurs en Afrique et dans le monde
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="font-bold text-sm text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-200">
          <span>Tuneliva</span>
          <span>•</span>
          <span>Afrique</span>
          <span>•</span>
          <span>Diaspora</span>
          <span>•</span>
          <span>International</span>
        </div>
        <p>© {new Date().getFullYear()} Tuneliva. Tous droits réservés. Propulsé pour la performance et la liberté financière.</p>
      </footer>
    </div>
  );
}
