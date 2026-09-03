"use client";

import React, { useState, useRef } from "react";
import {
  FunnelPageData,
  PricingSection,
  OrderFormConfig,
  HeroSection,
  PainPointsSection,
  FeaturesSection,
  SocialProofSection,
  FaqSection,
  ProductShowcaseSection,
  ProductItem,
  VideoSection,
  ServiceAreaSection,
  FunnelSection,
  SectionPadding,
  SectionSurfaceVariant,
  DesignPreset,
} from "@/types/page";
import { DESIGN_PRESETS } from "@/lib/design/presets";
import { FunnelRenderer } from "@/components/preview/FunnelRenderer";
import { ImagePickerModal } from "@/components/media/ImagePickerModal";
import {
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  Settings,
  X,
  Phone,
  Tag,
  Building2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
  Timer,
  Award,
  Package,
  Video,
  MapPin,
  Layers,
  GripVertical,
  PackageCheck,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

interface FunnelEditorProps {
  initialData: FunnelPageData;
  onSave?: (data: FunnelPageData) => void;
  onBackToPrompt?: () => void;
}

type DeviceMode = "mobile" | "tablet" | "desktop";
type EditorTab = "sections" | "inspector" | "design" | "branding";

const FONTS = ["Plus Jakarta Sans", "Inter", "Poppins", "Geist"] as const;

export function FunnelEditor({
  initialData,
  onSave,
  onBackToPrompt,
}: FunnelEditorProps) {
  const [funnelData, setFunnelData] = useState<FunnelPageData>(initialData);
  const [device, setDevice] = useState<DeviceMode>("mobile");
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>("sections");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    funnelData.sections[0]?.id || null
  );
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // ÉTAT DU GLISSER-DÉPOSER DES SECTIONS DANS LA SIDEBAR
  const [draggedSidebarIdx, setDraggedSidebarIdx] = useState<number | null>(null);
  const [dragOverSidebarIdx, setDragOverSidebarIdx] = useState<number | null>(null);

  // ACCORDÉONS DÉPLIABLES / PLIABLES
  const [openDesignCategory, setOpenDesignCategory] = useState<string | null>("passion");
  const [openInspectorAccordions, setOpenInspectorAccordions] = useState<{
    margins: boolean;
    surface: boolean;
    content: boolean;
  }>({
    margins: true,
    surface: true,
    content: true,
  });

  const toggleInspectorAccordion = (key: "margins" | "surface" | "content") => {
    setOpenInspectorAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // SÉLECTEUR D'IMAGES PROFESSIONNEL
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    sectionId: string;
    itemIndex?: number;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedSection = funnelData.sections.find((s) => s.id === selectedSectionId) || null;

  const handleUpdateSection = (sectionId: string, fields: Record<string, any>) => {
    setFunnelData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? ({ ...sec, ...fields } as FunnelSection) : sec
      ),
    }));
  };

  const updateSelectedSection = (fields: Record<string, any>) => {
    if (!selectedSectionId) return;
    handleUpdateSection(selectedSectionId, fields);
  };

  const handleReorderSections = (fromIdx: number, toIdx: number) => {
    if (
      fromIdx === toIdx ||
      fromIdx < 0 ||
      toIdx < 0 ||
      fromIdx >= funnelData.sections.length ||
      toIdx >= funnelData.sections.length
    )
      return;
    const updated = [...funnelData.sections];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setFunnelData((prev) => ({ ...prev, sections: updated }));
  };

  const applyPreset = (presetKey: DesignPreset) => {
    const p = DESIGN_PRESETS[presetKey];
    if (!p) return;
    setFunnelData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        preset: presetKey,
        ...p.theme,
      },
    }));
  };

  const openImagePicker = (sectionId: string, itemIndex?: number) => {
    setImagePickerTarget({ sectionId, itemIndex });
    setShowImagePicker(true);
  };

  const handleImageSelected = (newUrl: string) => {
    if (!imagePickerTarget) return;
    const { sectionId, itemIndex } = imagePickerTarget;

    setFunnelData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;

        if (sec.type === "hero") {
          return { ...sec, imageUrl: newUrl };
        }
        if (sec.type === "service_area") {
          return { ...sec, mapImageUrl: newUrl };
        }
        if (sec.type === "product_showcase" && typeof itemIndex === "number") {
          const updatedItems = [...(sec as ProductShowcaseSection).items];
          if (updatedItems[itemIndex]) {
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], imageUrl: newUrl };
          }
          return { ...sec, items: updatedItems };
        }
        return sec;
      }),
    }));
  };

  const handlePageBackgroundChange = (bg: string, isDark: boolean) => {
    setFunnelData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        pageBackground: bg,
        isDarkTheme: isDark,
        textColor: isDark ? "#F8FAFC" : "#0F172A",
      },
    }));
  };

  const handleFontChange = (font: (typeof FONTS)[number]) => {
    setFunnelData((prev) => ({
      ...prev,
      theme: { ...prev.theme, fontFamily: font },
    }));
  };

  const handleBrandingChange = (key: string, value: any) => {
    setFunnelData((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [key]: value,
      },
    }));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= funnelData.sections.length) return;

    const updated = [...funnelData.sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setFunnelData((prev) => ({ ...prev, sections: updated }));
  };

  const deleteSection = (sectionId: string) => {
    setFunnelData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const currentVideoCount = funnelData.sections.filter((s) => s.type === "video").length;

  const getSectionIcon = (type: FunnelSection["type"]) => {
    switch (type) {
      case "hero":
        return "🚀";
      case "product_showcase":
        return "🛍️";
      case "video":
        return "🎥";
      case "service_area":
        return "📍";
      case "floating_cards":
        return "🛡️";
      case "steps":
        return "🔢";
      case "stats":
        return "📊";
      case "pain_points":
        return "🛑";
      case "features":
        return "💎";
      case "social_proof":
        return "💬";
      case "pricing":
        return "🏷️";
      case "order_form":
        return "📝";
      case "faq":
        return "❓";
      case "thank_you":
        return "🎉";
      default:
        return "📄";
    }
  };

  const addSection = (type: FunnelSection["type"]) => {
    let newSec: FunnelSection;
    const randId = Math.random().toString(36).substring(2, 7);

    switch (type) {
      case "video":
        if (currentVideoCount >= 2) {
          alert(
            "Limite de 2 vidéos atteinte ! Pour préserver un chargement ultra-rapide (<800ms) sur mobile, 2 vidéos suffisent amplement."
          );
          return;
        }
        newSec = {
          id: `video-${randId}`,
          type: "video",
          badgeText: "DÉMONSTRATION EN VIDÉO",
          title: "Voyez le produit en action réelle",
          subtitle: "Une vidéo courte pour dissiper tous vos doutes :",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        };
        break;
      case "service_area":
        newSec = {
          id: `area-${randId}`,
          type: "service_area",
          title: "Notre zone de livraison & d'intervention",
          subtitle: "Zone de couverture garantie",
          zoneText:
            funnelData.branding?.address?.serviceZone ||
            "Cotonou, Calavi, Porto-Novo et villes environnantes",
          mapImageUrl:
            "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80",
        };
        break;
      case "product_showcase":
        newSec = {
          id: `showcase-${randId}`,
          type: "product_showcase",
          badgeText: "⭐ NOS MEILLEURES SÉLECTIONS",
          title: "Choisissez votre pack idéal",
          subtitle: "Sélectionnez l'exemplaire adapté à votre besoin avec réduction immédiate :",
          items: [
            {
              id: `prod-${randId}-1`,
              name: "Pack Découverte (1 Pièce)",
              price: 18000,
              regularPrice: 25000,
              badge: "Économique",
              imageUrl:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
              description: "Idéal pour essayer et tester la qualité supérieure.",
              features: ["1 Produit officiel", "Garantie 30j", "Livraison 24h"],
            },
            {
              id: `prod-${randId}-2`,
              name: "Pack Duo Privilège (2 Pièces)",
              price: 29000,
              regularPrice: 50000,
              badge: "Meilleur Choix",
              imageUrl:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
              description: "Le choix préféré de 78% de nos clients. Économie maximale !",
              features: [
                "2 Produits officiels",
                "Accessoires offerts",
                "Livraison gratuite express",
              ],
            },
          ],
        };
        break;
      case "floating_cards":
        newSec = {
          id: `cards-${randId}`,
          type: "floating_cards",
          cards: [
            {
              id: `c-${randId}-1`,
              icon: "timer",
              title: "Livraison Express 24h",
              description: "Livraison rapide directement à votre adresse.",
            },
            {
              id: `c-${randId}-2`,
              icon: "check",
              title: "Contrôle à la Réception",
              description: "Vous inspectez le colis avant tout paiement.",
            },
            {
              id: `c-${randId}-3`,
              icon: "shield",
              title: "Garantie 30 Jours",
              description: "Remboursement ou échange sans discussion.",
            },
          ],
        };
        break;
      case "steps":
        newSec = {
          id: `steps-${randId}`,
          type: "steps",
          badgeText: "PROCESSUS SIMPLE",
          title: "Comment ça marche ?",
          subtitle: "3 étapes rapides pour recevoir votre colis :",
          items: [
            {
              id: `st-${randId}-1`,
              stepNumber: 1,
              title: "Commande ou WhatsApp",
              description: "Remplissez le formulaire ou contactez-nous par WhatsApp.",
            },
            {
              id: `st-${randId}-2`,
              stepNumber: 2,
              title: "Confirmation Rapide",
              description: "Notre équipe vous appelle pour valider la livraison.",
            },
            {
              id: `st-${randId}-3`,
              stepNumber: 3,
              title: "Livraison & Règlement",
              description: "Vous payez en espèces après vérification de votre produit.",
            },
          ],
        };
        break;
      case "stats":
        newSec = {
          id: `stats-${randId}`,
          type: "stats",
          badgeText: "IMPACT RÉEL",
          items: [
            { id: `s-${randId}-1`, value: "1 500+", label: "Clients livrés" },
            { id: `s-${randId}-2`, value: "99%", label: "Avis positifs" },
            { id: `s-${randId}-3`, value: "24h", label: "Délai moyen" },
          ],
        };
        break;
      case "social_proof":
        newSec = {
          id: `review-${randId}`,
          type: "social_proof",
          badgeText: "💬 TÉMOIGNAGES",
          title: "Ce que disent nos clients",
          ratingAverage: 5,
          totalReviewsText: "5/5 étoiles",
          items: [
            {
              id: `r-${randId}-1`,
              authorName: "Client Vérifié",
              authorLocation: "Cotonou",
              rating: 5,
              comment: "Produit fantastique et livraison ultra rapide !",
            },
          ],
        };
        break;
      case "faq":
        newSec = {
          id: `faq-${randId}`,
          type: "faq",
          badgeText: "❓ FAQ",
          title: "Questions Fréquentes",
          subtitle: "Vos réponses en toute transparence :",
          items: [
            {
              id: `q-${randId}-1`,
              question: "Quel est le délai de livraison ?",
              answer: "Livraison sous 24h à 48h selon votre quartier.",
            },
          ],
        };
        break;
      case "thank_you":
        newSec = {
          id: `thank-${randId}`,
          type: "thank_you",
          title: "Merci pour votre confiance !",
          subtitle: "Votre commande est bien reçue.",
          instructions: [
            "Notre coursier va vous appeler sous peu pour convenir de l'heure exacte.",
            "Vous pourrez contrôler l'article avant de lui régler le montant.",
          ],
          whatsappSupportNumber: funnelData.branding?.whatsappNumber,
        };
        break;
      default:
        alert("Section non disponible.");
        return;
    }

    setFunnelData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
    setSelectedSectionId(newSec.id);
    setActiveTab("inspector");
    setShowAddSectionModal(false);
  };

  const scrollTo = (direction: "top" | "bottom") => {
    if (!scrollContainerRef.current) return;
    if (direction === "top") {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSave = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/funnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(funnelData),
      });

      if (res.ok) {
        const result = await res.json();
        const savedSlug = result.funnel?.slug || funnelData.slug || "offre-speciale";
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const fullUrl = `${origin}/p/${savedSlug}`;
        setPublishedUrl(fullUrl);
        setShowPublishModal(true);

        if (typeof window !== "undefined") {
          localStorage.setItem(`tuneliva_funnel_${savedSlug}`, JSON.stringify(funnelData));
        }
      }
    } catch (e) {
      console.error("Erreur publication tunnel:", e);
    } finally {
      setIsPublishing(false);
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F43F5E", "#E11D48", "#10B981", "#EAB308", "#6366F1"],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    if (onSave) {
      onSave(funnelData);
    }
  };

  const THEME_GROUPS = [
    {
      id: "passion",
      title: "🌸 Beauté, Passion & Glamour (3)",
      presets: ["rose_glamour", "bordeaux_velours", "rouge_passion"] as DesignPreset[],
    },
    {
      id: "nature",
      title: "🌿 Terroir & Nature (2)",
      presets: ["vert_sauge", "ambre_karite"] as DesignPreset[],
    },
    {
      id: "business",
      title: "💼 Tech, Business & Services (6)",
      presets: [
        "clean_pro_navy",
        "luxury_gold",
        "fintech_mint",
        "saas_indigo",
        "bleu_ocean",
        "violet_mystique",
      ] as DesignPreset[],
    },
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 flex flex-col font-sans">
      {/* 1. TOP BAR DU STUDIO */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080D]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToPrompt && (
            <button
              onClick={onBackToPrompt}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              ← Accueil
            </button>
          )}
          <div>
            <h1 className="text-sm font-extrabold text-white truncate max-w-[170px] sm:max-w-xs">
              {funnelData.branding?.businessName || funnelData.projectName}
            </h1>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Glisser-Déposer & Édition Directe Actifs
            </span>
          </div>
        </div>

        {/* Sélecteur Mobile / Tablette / Desktop */}
        <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-1 gap-1">
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              device === "mobile"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="Aperçu Mobile 375px (1 colonne stricte, aucun débordement)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile 375px</span>
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              device === "tablet"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablette</span>
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              device === "desktop"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/dashboard"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white hover:border-emerald-500/50 transition-all cursor-pointer"
            title="Voir les commandes reçues et le chiffre d'affaires"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Commandes</span>
          </a>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Panneau Studio</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Enregistré !</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. ZONE PRINCIPALE : PANNEAU & CANEVAS */}
      <div className="flex-1 flex relative overflow-hidden">
        {showSettings && (
          <aside className="w-84 sm:w-92 border-r border-white/10 bg-[#07080D] flex flex-col shrink-0 z-30 shadow-2xl">
            {/* TABS ÉPURÉS ET DESIGN */}
            <div className="p-2 border-b border-white/10 grid grid-cols-4 gap-1 text-[11px] font-bold">
              <button
                onClick={() => setActiveTab("inspector")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate ${
                  activeTab === "inspector"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Inspecteur
              </button>
              <button
                onClick={() => setActiveTab("sections")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate ${
                  activeTab === "sections"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate ${
                  activeTab === "design"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Thèmes
              </button>
              <button
                onClick={() => setActiveTab("branding")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate ${
                  activeTab === "branding"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Pied de page
              </button>
            </div>

            <div className="flex-1 p-3.5 space-y-4 overflow-y-auto text-xs">
              {/* ========================================================================= */}
              {/* ONGLET INSPECTEUR */}
              {/* ========================================================================= */}
              {activeTab === "inspector" && (
                <div className="space-y-3.5">
                  {selectedSection ? (
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">
                          Bloc : {selectedSection.type.replace("_", " ")}
                        </span>
                        <button
                          onClick={() => deleteSection(selectedSection.id)}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>

                      {/* 1. ACCORDÉON : MARGES & ESPACEMENTS */}
                      <div className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden">
                        <button
                          onClick={() => toggleInspectorAccordion("margins")}
                          className="w-full p-3 flex items-center justify-between font-bold text-xs text-white hover:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>📏</span>
                            <span>Marges & Espacements</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              openInspectorAccordions.margins ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openInspectorAccordions.margins && (
                          <div className="p-3 pt-0 space-y-3 border-t border-white/5">
                            {/* Hauteur / Padding Vertical */}
                            <div className="space-y-1 pt-2">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-slate-300">Padding Haut & Bas</span>
                                <span className="text-indigo-400 font-mono text-xs">
                                  {selectedSection.paddingVerticalPx ?? 36}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="140"
                                step="5"
                                value={selectedSection.paddingVerticalPx ?? 36}
                                onChange={(e) =>
                                  updateSelectedSection({ paddingVerticalPx: Number(e.target.value) })
                                }
                                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                              />
                            </div>

                            {/* Padding Horizontal */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-slate-300">Padding Gauche & Droite</span>
                                <span className="text-cyan-400 font-mono text-xs">
                                  {selectedSection.paddingHorizontalPx ?? (device === "mobile" ? 16 : 24)}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="8"
                                max="60"
                                step="2"
                                value={selectedSection.paddingHorizontalPx ?? (device === "mobile" ? 16 : 24)}
                                onChange={(e) =>
                                  updateSelectedSection({ paddingHorizontalPx: Number(e.target.value) })
                                }
                                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                              />
                            </div>

                            {/* Marge Externe Verticale */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-slate-300">Espacement Extérieur (Margin)</span>
                                <span className="text-amber-400 font-mono text-xs">
                                  {selectedSection.marginVerticalPx ?? 0}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="80"
                                step="4"
                                value={selectedSection.marginVerticalPx ?? 0}
                                onChange={(e) =>
                                  updateSelectedSection({ marginVerticalPx: Number(e.target.value) })
                                }
                                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                              />
                            </div>

                            {/* Arrondi des Angles */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-slate-300">Arrondi des Coins</span>
                                <span className="text-emerald-400 font-mono text-xs">
                                  {selectedSection.borderRadiusPx ?? 24}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="44"
                                step="2"
                                value={selectedSection.borderRadiusPx ?? 24}
                                onChange={(e) =>
                                  updateSelectedSection({ borderRadiusPx: Number(e.target.value) })
                                }
                                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                              />
                            </div>

                            {/* Largeur Maximale */}
                            <div className="space-y-1">
                              <label className="block text-[11px] font-semibold text-slate-300">
                                Largeur du Conteneur
                              </label>
                              <div className="grid grid-cols-4 gap-1">
                                {[
                                  { id: "max-w-2xl", label: "Étroit" },
                                  { id: "max-w-4xl", label: "Normal" },
                                  { id: "max-w-5xl", label: "Large" },
                                  { id: "max-w-full", label: "Plein" },
                                ].map((w) => (
                                  <button
                                    key={w.id}
                                    onClick={() => updateSelectedSection({ maxWidthClass: w.id })}
                                    className={`py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                      (selectedSection.maxWidthClass || "max-w-4xl") === w.id
                                        ? "border-indigo-500 bg-indigo-600/20 text-white"
                                        : "border-white/10 bg-slate-900 text-slate-400"
                                    }`}
                                  >
                                    {w.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. ACCORDÉON : ARRIÈRE-PLAN HARMONIEUX */}
                      <div className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden">
                        <button
                          onClick={() => toggleInspectorAccordion("surface")}
                          className="w-full p-3 flex items-center justify-between font-bold text-xs text-white hover:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>🎨</span>
                            <span>Arrière-Plan & Style</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              openInspectorAccordions.surface ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openInspectorAccordions.surface && (
                          <div className="p-3 pt-0 space-y-2 border-t border-white/5">
                            <span className="text-[10px] text-slate-400 block pt-1">
                              Variations harmonieuses garanties toujours esthétiques :
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: "default", name: "Neutre", desc: "Transparent" },
                                { id: "subtle", name: "Encart Subtil", desc: "Pastel / Voile doux" },
                                { id: "card_elevated", name: "Carte Élevée", desc: "Relief avec ombre" },
                                { id: "brand_tint", name: "Teinte Marque", desc: "Nuance 5% du thème" },
                              ].map((v) => (
                                <button
                                  key={v.id}
                                  onClick={() =>
                                    updateSelectedSection({
                                      sectionSurfaceVariant: v.id as SectionSurfaceVariant,
                                    })
                                  }
                                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                    (selectedSection.sectionSurfaceVariant || "default") === v.id
                                      ? "border-indigo-500 bg-indigo-600/20 text-white"
                                      : "border-white/10 bg-slate-900 text-slate-400 hover:text-white"
                                  }`}
                                >
                                  <span className="font-bold text-[11px] block">{v.name}</span>
                                  <span className="text-[9px] text-slate-400 block">{v.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. ACCORDÉON : CONTENUS SPÉCIFIQUES */}
                      <div className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden">
                        <button
                          onClick={() => toggleInspectorAccordion("content")}
                          className="w-full p-3 flex items-center justify-between font-bold text-xs text-white hover:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>✍️</span>
                            <span>Médias & Détails</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              openInspectorAccordions.content ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openInspectorAccordions.content && (
                          <div className="p-3 pt-0 space-y-3 border-t border-white/5">
                            {selectedSection.type === "service_area" && (
                              <div className="space-y-2 pt-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Villes & Zone d'Intervention
                                </label>
                                <textarea
                                  rows={2}
                                  value={(selectedSection as ServiceAreaSection).zoneText || ""}
                                  onChange={(e) => updateSelectedSection({ zoneText: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                />
                                <button
                                  onClick={() => openImagePicker(selectedSection.id)}
                                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-indigo-500"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-yellow-400" />
                                  <span>Changer la carte géographique</span>
                                </button>
                              </div>
                            )}

                            {selectedSection.type === "hero" && (
                              <div className="space-y-2 pt-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Photo Principale
                                </label>
                                <button
                                  onClick={() => openImagePicker(selectedSection.id)}
                                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                  <span>Choisir une photo (Banque ou PC)</span>
                                </button>
                              </div>
                            )}

                            {selectedSection.type === "video" && (
                              <div className="space-y-2 pt-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Lien Vidéo YouTube / Vimeo
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  value={(selectedSection as VideoSection).videoUrl || ""}
                                  onChange={(e) => updateSelectedSection({ videoUrl: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                />
                              </div>
                            )}

                            <span className="text-[10px] text-slate-400 block pt-1 leading-snug">
                              Astuce : Cliquez directement sur n'importe quel texte ou bouton sur la page de droite pour l'éditer en direct !
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs">
                        Cliquez sur n'importe quel bloc sur l'écran pour l'inspecter et modifier ses réglages.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* ONGLET SECTIONS AVEC GLISSER-DÉPOSER FLUIDE */}
              {/* ========================================================================= */}
              {activeTab === "sections" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                      Arborescence ({funnelData.sections.length})
                    </span>
                    <button
                      onClick={() => setShowAddSectionModal(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un bloc</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    💡 Glissez-déposez les blocs avec l'icône <GripVertical className="w-3 h-3 inline" /> pour réorganiser l'ordre en 1 seconde.
                  </p>

                  <div className="space-y-2">
                    {funnelData.sections.map((sec, idx) => {
                      const isDragged = draggedSidebarIdx === idx;
                      const isOver = dragOverSidebarIdx === idx;
                      const isSelected = selectedSectionId === sec.id;

                      return (
                        <div
                          key={sec.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggedSidebarIdx(idx);
                            e.dataTransfer.setData("text/plain", `${idx}`);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverSidebarIdx(idx);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const from = Number(e.dataTransfer.getData("text/plain"));
                            if (!isNaN(from)) {
                              handleReorderSections(from, idx);
                            }
                            setDraggedSidebarIdx(null);
                            setDragOverSidebarIdx(null);
                          }}
                          onDragEnd={() => {
                            setDraggedSidebarIdx(null);
                            setDragOverSidebarIdx(null);
                          }}
                          onClick={() => {
                            setSelectedSectionId(sec.id);
                            setActiveTab("inspector");
                          }}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                            isDragged ? "opacity-30 scale-95" : ""
                          } ${
                            isOver ? "border-indigo-500 ring-2 ring-indigo-500 bg-indigo-600/20" : ""
                          } ${
                            isSelected
                              ? "bg-indigo-600/15 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                              : "bg-slate-950 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span
                              className="text-slate-500 hover:text-white cursor-grab active:cursor-grabbing p-0.5"
                              title="Glisser pour réorganiser"
                            >
                              <GripVertical className="w-4 h-4" />
                            </span>
                            <span className="text-base">{getSectionIcon(sec.type)}</span>
                            <span className="font-bold text-white text-xs capitalize truncate">
                              {sec.type.replace("_", " ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSection(idx, "up");
                              }}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Monter"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSection(idx, "down");
                              }}
                              disabled={idx === funnelData.sections.length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Descendre"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSection(sec.id);
                              }}
                              className="p-1 text-rose-400 hover:text-rose-300 ml-0.5 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* ONGLET THÈMES */}
              {/* ========================================================================= */}
              {activeTab === "design" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-200 block uppercase tracking-wider text-[11px]">
                      👑 Identités Visuelles (11 Thèmes)
                    </label>

                    {THEME_GROUPS.map((group) => {
                      const isOpen = openDesignCategory === group.id;
                      return (
                        <div
                          key={group.id}
                          className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenDesignCategory(isOpen ? null : group.id)}
                            className="w-full p-3 flex items-center justify-between font-bold text-xs text-white hover:bg-white/5 cursor-pointer"
                          >
                            <span>{group.title}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="p-2.5 pt-0 space-y-2 border-t border-white/5">
                              {group.presets.map((presetKey) => {
                                const preset = DESIGN_PRESETS[presetKey];
                                const isCurrent = funnelData.theme.preset === preset.id;
                                return (
                                  <div
                                    key={preset.id}
                                    onClick={() => applyPreset(preset.id)}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                                      isCurrent
                                        ? "border-indigo-500 bg-indigo-600/15 shadow-md ring-1 ring-indigo-500/50"
                                        : "border-white/5 bg-slate-900 hover:border-white/20"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-white text-xs">{preset.name}</span>
                                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-slate-300">
                                        {preset.badge}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-snug">
                                      {preset.description}
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-1">
                                      <span
                                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: preset.theme.primaryColor }}
                                      />
                                      <span
                                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: preset.theme.accentColor }}
                                      />
                                      <span
                                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                        style={{ backgroundColor: preset.theme.pageBackground }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                      Mode Visuel Global
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePageBackgroundChange("#07080D", true)}
                        className={`p-3 rounded-xl border font-bold text-center cursor-pointer ${
                          funnelData.theme.isDarkTheme
                            ? "border-indigo-500 bg-slate-900 text-white"
                            : "border-white/5 bg-slate-950 text-slate-400"
                        }`}
                      >
                        🌙 Dark Mode 2026
                      </button>
                      <button
                        onClick={() => handlePageBackgroundChange("#F8FAFC", false)}
                        className={`p-3 rounded-xl border font-bold text-center text-slate-900 bg-white cursor-pointer ${
                          !funnelData.theme.isDarkTheme
                            ? "border-indigo-500 ring-2 ring-indigo-500/30 font-extrabold"
                            : "border-slate-300"
                        }`}
                      >
                        ☀️ Mode Clair Pur
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                      Typographie
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONTS.map((font) => (
                        <button
                          key={font}
                          onClick={() => handleFontChange(font)}
                          className={`p-2.5 rounded-xl border font-semibold text-center cursor-pointer ${
                            funnelData.theme.fontFamily === font
                              ? "border-indigo-500 bg-slate-900 text-white"
                              : "border-white/5 bg-slate-950 text-slate-400 hover:text-white"
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* ONGLET PIED DE PAGE */}
              {/* ========================================================================= */}
              {activeTab === "branding" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Couleur de fond du Pied de page
                    </label>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { label: "Défaut", color: "" },
                        { label: "Sombre", color: "#0A0D18" },
                        { label: "Bordeaux", color: "#1E060D" },
                        { label: "Bleu Nuit", color: "#051124" },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleBrandingChange("footerBgColor", item.color)}
                          className={`py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            (funnelData.branding?.footerBgColor || "") === item.color
                              ? "border-indigo-500 bg-indigo-600/20 text-white"
                              : "border-white/10 bg-slate-950 text-slate-400"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Nom de la marque / Entreprise
                    </label>
                    <input
                      type="text"
                      value={funnelData.branding?.businessName || ""}
                      onChange={(e) => handleBrandingChange("businessName", e.target.value)}
                      placeholder="Ex: Ivoire Luxe Boutique"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Téléphone d'appel direct
                    </label>
                    <input
                      type="text"
                      value={funnelData.branding?.phone || ""}
                      onChange={(e) => handleBrandingChange("phone", e.target.value)}
                      placeholder="+229 01 53 29 52 82"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-orange-400 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Numéro WhatsApp Vendeur *
                    </label>
                    <input
                      type="text"
                      value={funnelData.branding?.whatsappNumber || ""}
                      onChange={(e) => handleBrandingChange("whatsappNumber", e.target.value)}
                      placeholder="+229 97 00 00 00"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/10 text-emerald-400 font-bold text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* MODAL D'AJOUT DE SECTION AVEC SERVICE_AREA, VIDÉO & SHOWCASE */}
        {showAddSectionModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-white">Ajouter un Bloc de Vente Pro</h3>
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <button
                  onClick={() => addSection("product_showcase")}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 text-left space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-xs text-white block flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-indigo-400" />
                    <span>📦 Exemplaires Produits</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">Packs & Meilleur Choix</span>
                </button>

                <button
                  onClick={() => addSection("video")}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-yellow-500 text-left space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-xs text-white block flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-yellow-400" />
                    <span>🎥 Vidéo / VSL ({currentVideoCount}/2 max)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">Démonstration produit</span>
                </button>

                <button
                  onClick={() => addSection("service_area")}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-cyan-500 text-left space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-xs text-white block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>📍 Zone d'Intervention</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">Carte & villes couvertes</span>
                </button>

                <button
                  onClick={() => addSection("floating_cards")}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 hover:border-indigo-500 text-left space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-xs text-white block">🛡️ Cartes de Confiance</span>
                  <span className="text-[10px] text-slate-400 block">3 piliers rassurants</span>
                </button>

                <button
                  onClick={() => addSection("steps")}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 hover:border-indigo-500 text-left space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-xs text-white block">🔢 Comment ça marche ?</span>
                  <span className="text-[10px] text-slate-400 block">Étapes 1, 2, 3 simples</span>
                </button>

                <button
                  onClick={() => addSection("social_proof")}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 hover:border-indigo-500 text-left space-y-1 cursor-pointer"
                >
                  <span className="font-bold text-xs text-white block">💬 Témoignages Clients</span>
                  <span className="text-[10px] text-slate-400 block">Avis 5 étoiles vérifiés</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <ImagePickerModal
          isOpen={showImagePicker}
          onClose={() => {
            setShowImagePicker(false);
            setImagePickerTarget(null);
          }}
          onSelectImage={handleImageSelected}
          title="Sélectionner ou Téléverser une Photo"
        />

        {/* 3. CANEVAS DE PRÉVISUALISATION AVEC DRAG & DROP DES SECTIONS */}
        <div className="flex-1 bg-[#040407] p-2 sm:p-6 flex items-start justify-center overflow-hidden relative">
          <div className="absolute right-4 bottom-6 z-30 flex flex-col gap-2">
            <button
              onClick={() => scrollTo("top")}
              className="p-2.5 rounded-full bg-slate-900/90 border border-white/10 text-slate-300 hover:text-white shadow-xl hover:scale-110 transition-all cursor-pointer"
              title="Remonter en haut"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo("bottom")}
              className="p-2.5 rounded-full bg-indigo-600 text-white shadow-xl hover:scale-110 transition-all cursor-pointer"
              title="Descendre vers le formulaire de commande"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className={`w-full transition-all duration-300 rounded-3xl overflow-y-auto shadow-2xl border border-white/10 max-h-[calc(100vh-90px)] ${
              device === "mobile"
                ? "max-w-[390px] ring-8 ring-slate-900"
                : device === "tablet"
                ? "max-w-[768px] ring-8 ring-slate-900"
                : "max-w-5xl"
            }`}
          >
            {device === "mobile" && (
              <div className="sticky top-0 z-30 bg-black px-4 py-2 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-white">9:41</span>
                <div className="w-20 h-4 rounded-full bg-slate-900 mx-auto" />
                <span>5G • 100%</span>
              </div>
            )}

            <FunnelRenderer
              data={funnelData}
              isEditable={true}
              deviceMode={device}
              selectedSectionId={selectedSectionId}
              onSelectSection={(id) => {
                setSelectedSectionId(id);
                setShowSettings(true);
                setActiveTab("inspector");
              }}
              onUpdateSection={handleUpdateSection}
              onMoveSection={moveSection}
              onReorderSections={handleReorderSections}
              onDeleteSection={deleteSection}
              onOpenSettings={() => {
                setShowSettings(true);
                setActiveTab("inspector");
              }}
              onOpenImagePicker={openImagePicker}
            />
          </div>
        </div>
      </div>

      {/* MODAL DE SUCCÈS DE PUBLICATION */}
      {showPublishModal && publishedUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl shadow-inner">
              🎉
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Votre Page de Vente est en Ligne !</h3>
              <p className="text-xs text-slate-400">
                Votre tunnel est maintenant actif et prêt à recevoir des commandes partout dans le monde.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-2 text-left">
              <span className="text-xs font-mono text-indigo-400 truncate select-all">
                {publishedUrl}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  alert("Lien copié dans le presse-papiers !");
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 cursor-pointer shadow-sm"
              >
                Copier
              </button>
            </div>

            <div className="space-y-2">
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ouvrir la Page Client Finale</span>
              </a>

              <button
                onClick={() => {
                  const msg = encodeURIComponent(`Découvrez notre offre spéciale ici : ${publishedUrl}`);
                  window.open(`https://wa.me/?text=${msg}`, "_blank");
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Partager sur mon Statut WhatsApp</span>
              </button>

              <a
                href="/dashboard"
                target="_blank"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>Voir mon Tableau de Bord des Commandes →</span>
              </a>
            </div>

            <button
              onClick={() => setShowPublishModal(false)}
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold cursor-pointer pt-2"
            >
              Fermer cette fenêtre
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
