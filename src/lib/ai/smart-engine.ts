// ==============================================================================
// 🧠 MOTEUR MULTI-IA TUNELIVA & COPYWRITING HAUTE CONVERSION
// ==============================================================================

import {
  FunnelPageData,
  CurrencyCode,
  FunnelPageType,
  FunnelSection,
  DesignPreset,
} from "@/types/page";
import { DESIGN_PRESETS } from "@/lib/design/presets";

const CURATED_STOCK_IMAGES = {
  cosmetics: [
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608248597359-20f77d337f7a?w=800&auto=format&fit=crop&q=80",
  ],
  smartwatch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
  ],
  honey_food: [
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&auto=format&fit=crop&q=80",
  ],
  artisan_locksmith: [
    "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
  ],
  coaching_education: [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
  ],
  fintech: [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
  ],
};


// ==============================================================================
// 🎨 SENIOR UI/UX CREATIVE DIRECTOR - PALETTES & ARCHETYPES SUR MESURE
// ==============================================================================

export interface SeniorDesignArchetype {
  id: string;
  name: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    pageBackground: string;
    backgroundGradient?: string;
    glowColor?: string;
    ambientGlow?: boolean;
    cardStyle: "flat" | "elevated" | "glass" | "glowing_border";
    backgroundStyle: "solid" | "mesh_gradient" | "radial_glow" | "aurora";
    cardBackground: string;
    cardBorderColor: string;
    textColor: string;
    textMutedColor: string;
    fontFamily: "Plus Jakarta Sans" | "Inter" | "Poppins" | "Geist";
    isDarkTheme: boolean;
    bannerUrgencyText?: string;
    countdownMinutes?: number;
    pageLayoutWidth?: "boxed" | "fluid" | "canvas";
  };
  headerVariant: "classic" | "centered_minimal" | "split_banner" | "floating_pill";
  footerVariant: "modern_3cols" | "centered_luxury" | "compact_reassurance";
}

export const SENIOR_DESIGN_ARCHETYPES: SeniorDesignArchetype[] = [
  // 1. EDITORIAL MINIMAL LUXE (Blanc épuré, typographie élégante, accents cobalt)
  {
    id: "editorial_minimal_white",
    name: "Editorial Minimal Luxe",
    theme: {
      primaryColor: "#2563EB",
      accentColor: "#0284C7",
      pageBackground: "#FAFAFA",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37, 99, 235, 0.08) 0%, transparent 70%), #FAFAFA",
      glowColor: "#2563EB",
      ambientGlow: false,
      cardStyle: "elevated",
      backgroundStyle: "solid",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(15, 23, 42, 0.08)",
      textColor: "#0F172A",
      textMutedColor: "#64748B",
      fontFamily: "Inter",
      isDarkTheme: false,
      bannerUrgencyText: "✨ OFFRE PRIVILÈGE DU JOUR : LIVRAISON GRATUITE DISPONIBLE",
      countdownMinutes: 120,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "floating_pill",
    footerVariant: "modern_3cols",
  },

  // 2. OBSIDIAN CYBER EMERALD (Fond noir absolu, halo émeraude néon et verre dépoli)
  {
    id: "obsidian_cyber_emerald",
    name: "Obsidian Cyber Emerald",
    theme: {
      primaryColor: "#10B981",
      accentColor: "#06B6D4",
      pageBackground: "#040711",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.20) 0%, transparent 65%), radial-gradient(circle at 90% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 50%), #040711",
      glowColor: "#10B981",
      ambientGlow: true,
      cardStyle: "glass",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#080F1E",
      cardBorderColor: "rgba(16, 185, 129, 0.25)",
      textColor: "#FFFFFF",
      textMutedColor: "#94A3B8",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "⚡ ARRIVAGE OFFICIEL : CONTRÔLEZ VOTRE COLIS AVANT DE PAYER",
      countdownMinutes: 95,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "split_banner",
    footerVariant: "compact_reassurance",
  },

  // 3. TERRACOTTA & OR CHAUD (Chaleur africaine, terre cuite et ambre solaire)
  {
    id: "african_terracotta_gold",
    name: "African Terracotta & Warm Gold",
    theme: {
      primaryColor: "#EA580C",
      accentColor: "#F59E0B",
      pageBackground: "#120B07",
      backgroundGradient: "radial-gradient(ellipse 75% 50% at 30% -5%, rgba(234, 88, 12, 0.22) 0%, transparent 60%), radial-gradient(ellipse 65% 45% at 85% 15%, rgba(245, 158, 11, 0.18) 0%, transparent 60%), #120B07",
      glowColor: "#EA580C",
      ambientGlow: true,
      cardStyle: "glowing_border",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#1B120C",
      cardBorderColor: "rgba(234, 88, 12, 0.25)",
      textColor: "#FFFDF9",
      textMutedColor: "#FED7AA",
      fontFamily: "Poppins",
      isDarkTheme: true,
      bannerUrgencyText: "🔥 ÉDITION PRESTIGE : STOCK LIMITÉ POUR LES PREMIERS COMMANDITAIRES",
      countdownMinutes: 110,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "centered_minimal",
    footerVariant: "centered_luxury",
  },

  // 4. BORDEAUX VELOURS & ROSE CHAMPAGNE (Glamour, cosmétique & parfumerie haut de gamme)
  {
    id: "velvet_bordeaux_rose",
    name: "Velvet Bordeaux & Champagne Rose",
    theme: {
      primaryColor: "#F43F5E",
      accentColor: "#FB7185",
      pageBackground: "#0F050A",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(244, 63, 94, 0.22) 0%, transparent 70%), #0F050A",
      glowColor: "#F43F5E",
      ambientGlow: true,
      cardStyle: "glowing_border",
      backgroundStyle: "aurora",
      cardBackground: "#180A12",
      cardBorderColor: "rgba(244, 63, 94, 0.25)",
      textColor: "#FFFFFF",
      textMutedColor: "#FDA4AF",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "✨ FORMULE D'EXCEPTION : SATISFAIT OU 100% REMBOURSÉ SOUS 30 JOURS",
      countdownMinutes: 105,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "classic",
    footerVariant: "centered_luxury",
  },

  // 5. HIGH-TECH SAPPHIRE & ICE BLUE (Fintech, gadgets, technologie et précision)
  {
    id: "sapphire_ice_blue",
    name: "Sapphire High-Tech & Ice Blue",
    theme: {
      primaryColor: "#3B82F6",
      accentColor: "#38BDF8",
      pageBackground: "#050914",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59, 130, 246, 0.24) 0%, transparent 70%), #050914",
      glowColor: "#3B82F6",
      ambientGlow: true,
      cardStyle: "glass",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#0A1224",
      cardBorderColor: "rgba(59, 130, 246, 0.25)",
      textColor: "#FFFFFF",
      textMutedColor: "#93C5FD",
      fontFamily: "Geist",
      isDarkTheme: true,
      bannerUrgencyText: "⚡ TECHNOLOGIE CERTIFIÉE 2026 : GARANTIE CONSTRUCTEUR 1 AN INCLUSE",
      countdownMinutes: 80,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "floating_pill",
    footerVariant: "modern_3cols",
  },

  // 6. BOTANICAL SAGE & FOREST (Naturel, bio, santé & bien-être)
  {
    id: "botanical_sage_cream",
    name: "Botanical Sage & Forest Cream",
    theme: {
      primaryColor: "#059669",
      accentColor: "#10B981",
      pageBackground: "#F5F8F6",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 150, 105, 0.10) 0%, transparent 70%), #F5F8F6",
      glowColor: "#059669",
      ambientGlow: false,
      cardStyle: "elevated",
      backgroundStyle: "solid",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(5, 150, 105, 0.12)",
      textColor: "#064E3B",
      textMutedColor: "#4B5563",
      fontFamily: "Inter",
      isDarkTheme: false,
      bannerUrgencyText: "🌿 100% NATUREL & SANS ADDITIF : RÉCOLTE FRAÎCHE GARANTIE",
      countdownMinutes: 140,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "centered_minimal",
    footerVariant: "modern_3cols",
  },

  // 7. MONOCHROME BRUTALIST & SOLAR AMBER (Haute énergie, impact visuel fort)
  {
    id: "monochrome_solar_amber",
    name: "Monochrome Modern & Solar Amber",
    theme: {
      primaryColor: "#F59E0B",
      accentColor: "#E11D48",
      pageBackground: "#090A0F",
      backgroundGradient: "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(245, 158, 11, 0.20) 0%, transparent 65%), #090A0F",
      glowColor: "#F59E0B",
      ambientGlow: true,
      cardStyle: "glowing_border",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#11141E",
      cardBorderColor: "rgba(245, 158, 11, 0.22)",
      textColor: "#FFFFFF",
      textMutedColor: "#CBD5E1",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "🚀 DERNIÈRE OPPORTUNITÉ : EXPÉDITION PRIORITAIRE SOUS 12H",
      countdownMinutes: 60,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "split_banner",
    footerVariant: "compact_reassurance",
  },
  // 8. EARLY EDUCATION & CREATIVE LEARNING (Inspiré Image 1 : Crème pastel, émeraude, lilas & jaune solaire)
  {
    id: "early_education_playful",
    name: "Early Education & Creative Learning",
    theme: {
      primaryColor: "#10B981",
      accentColor: "#8B5CF6",
      pageBackground: "#FAF9F6",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.12) 0%, transparent 65%), radial-gradient(circle at 90% 25%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), #FAF9F6",
      glowColor: "#10B981",
      ambientGlow: true,
      cardStyle: "elevated",
      backgroundStyle: "solid",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(16, 185, 129, 0.15)",
      textColor: "#0F2A4A",
      textMutedColor: "#475569",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: false,
      bannerUrgencyText: "🎉 INSCRIPTIONS OUVERTES : ATELIERS & ACTIVITÉS INTERACTIVES 2026",
      countdownMinutes: 180,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "floating_pill",
    footerVariant: "modern_3cols",
  },

  // 9. MODERN AI SAAS & SUNSET GLOW (Inspiré Image 2 : Ivoire chaud, corail fiery, cyan & orbes 3D)
  {
    id: "modern_saas_sunset",
    name: "Modern AI SaaS & Sunset Glow",
    theme: {
      primaryColor: "#F95738",
      accentColor: "#06B6D4",
      pageBackground: "#FAFAF9",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249, 87, 56, 0.14) 0%, transparent 65%), radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.10) 0%, transparent 55%), #FAFAF9",
      glowColor: "#F95738",
      ambientGlow: true,
      cardStyle: "elevated",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(249, 87, 56, 0.15)",
      textColor: "#0F172A",
      textMutedColor: "#64748B",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: false,
      bannerUrgencyText: "⚡ ESSAI GRATUIT SANS ENGAGEMENT : DÉPLOYEZ EN MOINS DE 60 SECONDES",
      countdownMinutes: 90,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "floating_pill",
    footerVariant: "modern_3cols",
  },

  // 10. ARTISAN EXPRESS & DÉPANNAGE PRO (Intervention urgente, réassurance forte)
  {
    id: "artisan_emergency_amber",
    name: "Artisan Express & Dépannage Pro",
    theme: {
      primaryColor: "#EA580C",
      accentColor: "#0284C7",
      pageBackground: "#070B14",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(234, 88, 12, 0.20) 0%, transparent 65%), #070B14",
      glowColor: "#EA580C",
      ambientGlow: true,
      cardStyle: "glowing_border",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#0F172A",
      cardBorderColor: "rgba(234, 88, 12, 0.25)",
      textColor: "#FFFFFF",
      textMutedColor: "#94A3B8",
      fontFamily: "Inter",
      isDarkTheme: true,
      bannerUrgencyText: "🚨 INTERVENTION SOUS 15 MINUTES : APPEL DIRECT & WHATSAPP 24/7",
      countdownMinutes: 45,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "split_banner",
    footerVariant: "compact_reassurance",
  },

  // 11. SOLIDARITÉ & CROWDFUNDING D'IMPACT (Causes, ONG, levée de fonds)
  {
    id: "crowdfund_solidarity_hope",
    name: "Solidarité & Crowdfunding d'Impact",
    theme: {
      primaryColor: "#16A34A",
      accentColor: "#EA580C",
      pageBackground: "#F8FAF9",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(22, 163, 74, 0.12) 0%, transparent 65%), #F8FAF9",
      glowColor: "#16A34A",
      ambientGlow: true,
      cardStyle: "elevated",
      backgroundStyle: "solid",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(22, 163, 74, 0.15)",
      textColor: "#064E3B",
      textMutedColor: "#4B5563",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: false,
      bannerUrgencyText: "💚 OBJECTIF ATTEINT À 74% : SOUTENEZ NOTRE MISSION COMMUNAUTAIRE",
      countdownMinutes: 240,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "centered_minimal",
    footerVariant: "modern_3cols",
  },

  // 12. CABINET & PRISE DE RENDEZ-VOUS ZEN (Consultants, salons, santé)
  {
    id: "reservation_wellness_clinic",
    name: "Cabinet & Prise de Rendez-vous Zen",
    theme: {
      primaryColor: "#0D9488",
      accentColor: "#38BDF8",
      pageBackground: "#F8FAFC",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(13, 148, 136, 0.10) 0%, transparent 65%), #F8FAFC",
      glowColor: "#0D9488",
      ambientGlow: true,
      cardStyle: "glass",
      backgroundStyle: "solid",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(13, 148, 136, 0.12)",
      textColor: "#134E4A",
      textMutedColor: "#64748B",
      fontFamily: "Inter",
      isDarkTheme: false,
      bannerUrgencyText: "🌿 CRÉNEAUX DISPONIBLES CETTE SEMAINE : RÉSERVATION SANS AVANCE",
      countdownMinutes: 120,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "centered_minimal",
    footerVariant: "modern_3cols",
  },

  // 13. SITE VITRINE & AGENCE PRESTIGE (Services corporate, architectes, SaaS)
  {
    id: "corporate_elite_vitrine",
    name: "Site Vitrine & Agence Prestige",
    theme: {
      primaryColor: "#2563EB",
      accentColor: "#F59E0B",
      pageBackground: "#0B0F19",
      backgroundGradient: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37, 99, 235, 0.18) 0%, transparent 70%), #0B0F19",
      glowColor: "#2563EB",
      ambientGlow: true,
      cardStyle: "glass",
      backgroundStyle: "mesh_gradient",
      cardBackground: "#111827",
      cardBorderColor: "rgba(37, 99, 235, 0.22)",
      textColor: "#FFFFFF",
      textMutedColor: "#94A3B8",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "✨ CONCEPTION SUR-MESURE & ACCOMPAGNEMENT STRATÉGIQUE HAUT DE GAMME",
      countdownMinutes: 150,
      pageLayoutWidth: "fluid",
    },
    headerVariant: "floating_pill",
    footerVariant: "modern_3cols",
  },

];


export function resolveBespokeArchetype(prompt: string, aiDesign?: any): SeniorDesignArchetype {
  // 1. Si l'IA a généré un style sur-mesure explicite dans sa réponse Groq
  if (aiDesign && aiDesign.primaryColor) {
    const isDark = aiDesign.isDarkTheme !== false;
    const bg = aiDesign.pageBackground || (isDark ? "#070B19" : "#FAFAF9");
    const primary = aiDesign.primaryColor;
    const accent = aiDesign.accentColor || (isDark ? "#38BDF8" : "#F59E0B");

    return {
      id: `ai_bespoke_${Date.now()}`,
      name: "Direction Artistique IA Sur-Mesure",
      theme: {
        primaryColor: primary,
        accentColor: accent,
        pageBackground: bg,
        backgroundGradient: `radial-gradient(ellipse 80% 50% at 50% -10%, ${primary}25 0%, transparent 65%), ${bg}`,
        glowColor: primary,
        ambientGlow: true,
        cardStyle: aiDesign.cardStyle || (isDark ? "glass" : "elevated"),
        backgroundStyle: isDark ? "mesh_gradient" : "solid",
        cardBackground: isDark ? "#0E1528" : "#FFFFFF",
        cardBorderColor: `${primary}30`,
        textColor: isDark ? "#FFFFFF" : "#0F172A",
        textMutedColor: isDark ? "#94A3B8" : "#64748B",
        fontFamily: aiDesign.fontFamily || "Plus Jakarta Sans",
        isDarkTheme: isDark,
        bannerUrgencyText: "✨ ÉDITION OFFICIELLE 2026 : SATISFACTION 100% GARANTIE",
        countdownMinutes: 120,
        pageLayoutWidth: "fluid",
      },
      headerVariant: aiDesign.headerVariant || "floating_pill",
      footerVariant: aiDesign.footerVariant || "modern_3cols",
    };
  }

  // 2. Analyse sémantique ciblée des secteurs d'activité
  const p = prompt.toLowerCase();

  // Éducation, Cours pour enfants, Ateliers, Formation (Inspiré Image 1)
  if (p.includes("enfant") || p.includes("education") || p.includes("ecole") || p.includes("atelier") || p.includes("maternelle") || p.includes("activite") || p.includes("apprenant") || p.includes("eleve") || p.includes("cours")) {
    return SENIOR_DESIGN_ARCHETYPES.find((a) => a.id === "early_education_playful") || SENIOR_DESIGN_ARCHETYPES[0];
  }

  // SaaS, Marketing, Intelligence Artificielle, Tech, Automatisation (Inspiré Image 2)
  if (p.includes("saas") || p.includes("ia") || p.includes("marketing") || p.includes("automatisation") || p.includes("logiciel") || p.includes("crm") || p.includes("dashboard") || p.includes("tech") || p.includes("startup")) {
    return SENIOR_DESIGN_ARCHETYPES.find((a) => a.id === "modern_saas_sunset") || SENIOR_DESIGN_ARCHETYPES[0];
  }

  // Artisans, Dépannage urgent, Serrurerie, Plomberie, Climatisation
  if (p.includes("serrurier") || p.includes("artisan") || p.includes("plombier") || p.includes("depannage") || p.includes("urgence") || p.includes("reparation") || p.includes("electricien") || p.includes("garage")) {
    return SENIOR_DESIGN_ARCHETYPES.find((a) => a.id === "artisan_emergency_amber") || SENIOR_DESIGN_ARCHETYPES[0];
  }

  // Crowdfunding, Don, Association, Humanitaire, Levée de fonds
  if (p.includes("don") || p.includes("solidarite") || p.includes("ong") || p.includes("association") || p.includes("crowdfund") || p.includes("humanitaire") || p.includes("levee de fond") || p.includes("projet communautaire")) {
    return SENIOR_DESIGN_ARCHETYPES.find((a) => a.id === "crowdfund_solidarity_hope") || SENIOR_DESIGN_ARCHETYPES[0];
  }

  // Réservation, Rendez-vous, Salon, Coiffure, Clinique, Soin
  if (p.includes("rendez-vous") || p.includes("reservation") || p.includes("salon") || p.includes("coiffure") || p.includes("clinique") || p.includes("massage") || p.includes("therapie") || p.includes("dentiste")) {
    return SENIOR_DESIGN_ARCHETYPES.find((a) => a.id === "reservation_wellness_clinic") || SENIOR_DESIGN_ARCHETYPES[0];
  }

  // Site vitrine, Agence, Architecture, Conseil
  if (p.includes("vitrine") || p.includes("agence") || p.includes("consultant") || p.includes("conseil") || p.includes("architecte") || p.includes("portfolio")) {
    return SENIOR_DESIGN_ARCHETYPES.find((a) => a.id === "corporate_elite_vitrine") || SENIOR_DESIGN_ARCHETYPES[0];
  }

  // Fallback : Sélection équilibrée avec hash
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SENIOR_DESIGN_ARCHETYPES.length;
  return SENIOR_DESIGN_ARCHETYPES[index];
}

export function pickSurprisingSeniorArchetype(prompt: string): SeniorDesignArchetype {
  // Calcul d'un hash pseudo-aléatoire mais reproductible basé sur le prompt et l'heure actuelle
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SENIOR_DESIGN_ARCHETYPES.length;
  return SENIOR_DESIGN_ARCHETYPES[index];
}

export function resolveBestStockImage(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("serrurier") || p.includes("clé") || p.includes("serrure") || p.includes("dépannage") || p.includes("porte") || p.includes("artisan")) {
    return CURATED_STOCK_IMAGES.artisan_locksmith[0];
  }
  if (p.includes("sérum") || p.includes("visage") || p.includes("crème") || p.includes("beauté") || p.includes("savon") || p.includes("peau") || p.includes("cosmétique")) {
    return CURATED_STOCK_IMAGES.cosmetics[Math.floor(Math.random() * CURATED_STOCK_IMAGES.cosmetics.length)];
  }
  if (p.includes("montre") || p.includes("smartwatch") || p.includes("bracelet") || p.includes("chrono")) {
    return CURATED_STOCK_IMAGES.smartwatch[Math.floor(Math.random() * CURATED_STOCK_IMAGES.smartwatch.length)];
  }
  if (p.includes("chaussure") || p.includes("basket") || p.includes("sneaker") || p.includes("soulier")) {
    return CURATED_STOCK_IMAGES.shoes[Math.floor(Math.random() * CURATED_STOCK_IMAGES.shoes.length)];
  }
  if (p.includes("miel") || p.includes("épice") || p.includes("thé") || p.includes("aliment") || p.includes("café")) {
    return CURATED_STOCK_IMAGES.honey_food[Math.floor(Math.random() * CURATED_STOCK_IMAGES.honey_food.length)];
  }
  if (p.includes("formation") || p.includes("cours") || p.includes("business") || p.includes("ebook") || p.includes("coaching") || p.includes("tiktok") || p.includes("academie") || p.includes("masterclass") || p.includes("v0app")) {
    return CURATED_STOCK_IMAGES.coaching_education[Math.floor(Math.random() * CURATED_STOCK_IMAGES.coaching_education.length)];
  }
  if (p.includes("momo") || p.includes("transfert") || p.includes("finance") || p.includes("crypto") || p.includes("banque")) {
    return CURATED_STOCK_IMAGES.fintech[0];
  }
  if (p.includes("ideogram") || p.includes("visual ai") || p.includes("studio ia") || p.includes("visuel")) {
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";
  }
  return CURATED_STOCK_IMAGES.fashion[0];
}

export function detectPresetFromPrompt(prompt: string): DesignPreset {
  const p = prompt.toLowerCase();
  if (p.includes("serrurier") || p.includes("artisan") || p.includes("plombier") || p.includes("dépannage") || p.includes("urgence")) {
    return "clean_pro_navy";
  }
  if (p.includes("sérum") || p.includes("visage") || p.includes("femme") || p.includes("beauté") || p.includes("peau") || p.includes("teint")) {
    return "rose_glamour";
  }
  if (p.includes("parfum") || p.includes("luxe") || p.includes("lingerie") || p.includes("mode")) {
    return "bordeaux_velours";
  }
  if (p.includes("miel") || p.includes("karité") || p.includes("savon noir")) {
    return "ambre_karite";
  }
  if (p.includes("tisane") || p.includes("bio") || p.includes("naturel") || p.includes("herbe") || p.includes("détox")) {
    return "vert_sauge";
  }
  if (p.includes("academie") || p.includes("formation") || p.includes("digital") || p.includes("souveraineté") || p.includes("or") || p.includes("prestige")) {
    return "luxury_gold";
  }
  if (p.includes("momo") || p.includes("transfert") || p.includes("finance") || p.includes("crypto") || p.includes("banque") || p.includes("momoopti")) {
    return "fintech_mint";
  }
  if (p.includes("v0") || p.includes("v0app") || p.includes("agentic") || p.includes("masterclass") || p.includes("the art of")) {
    return "v0app_masterclass";
  }
  if (p.includes("creator") || p.includes("créateur") || p.includes("infopreneur") || p.includes("creator hub")) {
    return "creator_hub";
  }
  if (p.includes("ideogram") || p.includes("visual ai") || p.includes("visual") || p.includes("visuel") || p.includes("studio ia")) {
    return "visual_ai_studio";
  }
  return "saas_indigo";
}

// Nettoyeur et rédacteur de titres accrocheurs (Copywriting professionnel)
export function extractCleanProductAndHeadline(rawPrompt: string): {
  productName: string;
  headline: string;
  subtitle: string;
} {
  let p = rawPrompt.trim();

  // Supprime les formules conversationnelles ("Je vends...", "Boutique de...")
  p = p.replace(
    /^(je vends|nous vendons|vente de|achat de|je propose|nous proposons|boutique de|site de|tunnel pour|page pour|je veux une page pour|créer une page pour|offre de|service de)\s+/i,
    ""
  );

  // Supprime les mentions de prix à la fin pour garder le produit propre
  p = p.replace(/\s*(à|au prix de|\bpour\b)\s*\d+[\s\d]*(fcfa|cfa|f|€|\$|eur|usd).*$/i, "");
  p = p.replace(/\s*(avec livraison|livraison express|paiement à la livraison).*$/i, "");

  const product = p.charAt(0).toUpperCase() + p.slice(1);
  const shortProduct = product.length > 36 ? product.slice(0, 32) + "..." : product;

  const lower = rawPrompt.toLowerCase();
  let headline = `${shortProduct} – Performance & Qualité Supérieure`;
  let subtitle =
    "Commandez dès maintenant et bénéficiez de notre garantie satisfaction totale avec paiement sécurisé à la livraison.";

  if (lower.includes("miel") || lower.includes("bio") || lower.includes("naturel") || lower.includes("acacia")) {
    headline = `Le Pur ${shortProduct} : 100% Naturel, Cru & Récolté dans les Règles de l'Art`;
    subtitle =
      "Goûtez à l'authenticité d'un produit sauvage non chauffé sans additifs. Livraison rapide directement chez vous avec inspection avant paiement.";
  } else if (
    lower.includes("sérum") ||
    lower.includes("visage") ||
    lower.includes("tache") ||
    lower.includes("peau") ||
    lower.includes("beauté")
  ) {
    headline = "Révélez l'Éclat Naturel de Votre Peau : Zéro Imperfection en 14 Jours";
    subtitle =
      "Formule concentrée anti-taches et éclat immédiat. Testé dermatologiquement, satisfait ou 100% remboursé.";
  } else if (
    lower.includes("montre") ||
    lower.includes("connectée") ||
    lower.includes("sport") ||
    lower.includes("luxe")
  ) {
    headline = `${shortProduct} : L'Élégance Prestige & la Haute Technologie à Votre Poignet`;
    subtitle =
      "Écran AMOLED haute définition, suivi santé complet et étanchéité certifiée. Offre spéciale avec stock limité pour ce soir.";
  } else if (
    lower.includes("serrurier") ||
    lower.includes("dépannage") ||
    lower.includes("urgence") ||
    lower.includes("plombier")
  ) {
    headline = "Intervention d'Urgence en Moins de 15 Minutes : Devis Gratuit & Zéro Surprise";
    subtitle =
      "Artisan qualifié disponible 24h/24 et 7j/7 pour sécuriser vos ouvertures et réparations d'urgence. Tarifs transparents garantis.";
  } else if (
    lower.includes("formation") ||
    lower.includes("academie") ||
    lower.includes("digital") ||
    lower.includes("business")
  ) {
    headline = "Le Système Pas-à-Pas pour Bâtir Votre Liberté Financière avec les Produits Digitaux";
    subtitle =
      "Rejoignez plus de 1 200 entrepreneurs qui génèrent des revenus récurrents depuis l'Afrique et la diaspora.";
  }

  return { productName: shortProduct, headline, subtitle };
}

export async function generateSmartFunnel(
  prompt: string,
  currency: CurrencyCode = "XOF",
  pageType: FunnelPageType = "sales"
): Promise<FunnelPageData> {
  const stockImage = resolveBestStockImage(prompt);
  const detectedPreset = detectPresetFromPrompt(prompt);
  const presetConfig = DESIGN_PRESETS[detectedPreset].theme;

  // 1. TENTATIVE GROQ AVEC MODÈLES ULTRA-RAPIDES & VALIDÉS (openai/gpt-oss-120b & qwen/qwen3.8-27b)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groqModels = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];
    for (const model of groqModels) {
      try {
        const systemPrompt = `Tu es un Directeur Artistique UI/UX Senior et Copywriter d'Élite international.
Tu conçois des pages web et tunnels à très haute conversion, visuellement époustouflants et sur-mesure pour TOUS les usages (écoles/enfants, formations, SaaS moderne, artisans d'urgence, grossistes, e-commerce COD, réservations, événements et levée de fonds).

À partir de la demande de l'utilisateur, génère à la fois un COPYWRITING percutant et une DIRECTION ARTISTIQUE visuelle inédite et sur-mesure.

RÉPONDS STRICTEMENT AVEC UN OBJET JSON (aucun texte autour) contenant les clés :
{
  "productName": "Nom commercial accrocheur",
  "headline": "Titre Hero ultra vendeur avec promesse majeure",
  "subtitle": "Sous-titre persuasif détaillant le bénéfice clé",
  "badgeText": "Badge court percutant (ex: FAST. INTELLIGENT. FUTURE-READY ou APPRENTISSAGE LUDIQUE 2026 ou ARRIVAGE OFFICIEL)",
  "industry": "education" | "saas" | "artisan" | "ecommerce" | "event" | "crowdfund" | "booking" | "vitrine",
  "design": {
    "primaryColor": "#hex (ex: #10B981 émeraude, #F95738 corail, #EA580C orange artisan, #2563EB cobalt)",
    "accentColor": "#hex contrasté harmonieux",
    "pageBackground": "#hex (ex: #FAF9F6 crème doux, #FAFAF9 ivoire moderne, #070B19 nuit bleue, #040711 noir obsidienne)",
    "isDarkTheme": false,
    "cardStyle": "elevated" | "glass" | "glowing_border",
    "fontFamily": "Plus Jakarta Sans" | "Inter" | "Poppins" | "Geist",
    "headerVariant": "floating_pill" | "centered_minimal" | "split_banner",
    "footerVariant": "modern_3cols" | "centered_luxury" | "compact_reassurance"
  },
  "trustPoints": ["Bénéfice concret 1", "Bénéfice concret 2", "Garantie ou atout majeur"],
  "stats": [
    { "value": "50+", "label": "Activités / Indicateur 1" },
    { "value": "2M", "label": "Clients / Utilisateurs" },
    { "value": "98%", "label": "Satisfaction client" }
  ],
  "bentoCards": [
    { "title": "Titre Bento 1", "description": "Description concise", "tag": "Point Fort", "colSpan": "col-span-1" },
    { "title": "Titre Bento 2 (Large)", "description": "Bénéfice développé avec impact", "tag": "Performance", "colSpan": "col-span-2", "metric": "+35%" },
    { "title": "Titre Bento 3", "description": "Rassurance ou fonctionnalité", "tag": "Sécurité", "colSpan": "col-span-1" },
    { "title": "Titre Bento 4 (Large)", "description": "Détail de l'offre ou méthodologie", "tag": "Excellence", "colSpan": "col-span-2", "metric": "100%" }
  ],
  "steps": [
    { "stepNumber": 1, "title": "Étape 1", "description": "Explication claire" },
    { "stepNumber": 2, "title": "Étape 2", "description": "Action concrète" },
    { "stepNumber": 3, "title": "Étape 3", "description": "Résultat obtenu" }
  ],
  "packs": [
    { "name": "Pack Découverte (1 Exemplaire)", "multiplier": 1, "badge": "Économique", "description": "Idéal pour essayer la qualité" },
    { "name": "Pack Duo Privilège (2 Exemplaires)", "multiplier": 1.7, "badge": "Meilleur Choix", "description": "Le choix préféré de nos clients" }
  ],
  "faq": [
    { "question": "Question fréquente 1 ?", "answer": "Réponse transparente et rassurante." },
    { "question": "Question fréquente 2 ?", "answer": "Réponse claire et directe." }
  ],
  "reviews": [
    { "author": "Amina K.", "city": "Cotonou", "comment": "Produit/service remarquable, conforme à mes attentes !" },
    { "author": "Koffi M.", "city": "Lomé", "comment": "Excellente expérience, je recommande chaudement !" }
  ]
}`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Produit : "${prompt}". Devise : ${currency}. Génère les données marketing.` },
            ],
            temperature: 0.6,
            response_format: { type: "json_object" },
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const content = json.choices?.[0]?.message?.content?.trim() || "";
          const aiData = extractJsonFromString(content);

          if (aiData?.headline && aiData?.productName) {
            // Injection du copywriting IA dans la structure de tunnel
            return buildEliteDesignFunnel(
              prompt,
              currency,
              stockImage,
              pageType,
              detectedPreset,
              aiData
            );
          }
        }
      } catch (e) {
        console.warn(`Groq (${model}) fallback:`, e);
      }
    }
  }

  // 2. GÉNÉRATEUR LOCAL DÉTERMINISTE DE SECOURS (Réseau coupé ou panne)
  return buildEliteDesignFunnel(prompt, currency, stockImage, pageType, detectedPreset);
}

function extractJsonFromString(text: string): any {
  try {
    let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firstOpenBrace = clean.indexOf("{");
    const lastCloseBrace = clean.lastIndexOf("}");
    if (firstOpenBrace !== -1 && lastCloseBrace !== -1) {
      clean = clean.substring(firstOpenBrace, lastCloseBrace + 1);
      return JSON.parse(clean);
    }
  } catch (e) {
    console.error("Parsing JSON:", e);
  }
  return null;
}

function buildEliteDesignFunnel(
  prompt: string,
  currency: CurrencyCode,
  stockImage: string,
  pageType: FunnelPageType,
  preset: DesignPreset,
  aiData?: any
): FunnelPageData {
  const p = prompt.trim();
  const seniorArchetype = resolveBespokeArchetype(p, aiData?.design);
  const isCustomDesign = !p.toLowerCase().includes("momoopti") &&
                         !p.toLowerCase().includes("v0app") &&
                         !p.toLowerCase().includes("creator hub") &&
                         !p.toLowerCase().includes("ideogram");


  // Extraction de prix
  const priceMatch = p.match(/(\d+[\s\d]*)\s*(fcfa|cfa|f|€|\$|eur|usd)?/i);
  let salePrice = 22000;
  if (priceMatch) {
    const raw = priceMatch[1].replace(/\s/g, "");
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 100) salePrice = parsed;
  }
  const regularPrice = Math.round(salePrice * 1.5);

  // Extraction de ville
  let city = "Cotonou";
  if (/abidjan/i.test(p)) city = "Abidjan";
  else if (/dakar/i.test(p)) city = "Dakar";
  else if (/lom[eé]/i.test(p)) city = "Lomé";
  else if (/douala|yaound[eé]/i.test(p)) city = "Douala";
  else if (/paris/i.test(p)) city = "Paris";

  const fallback = extractCleanProductAndHeadline(p);
  const productName = aiData?.productName || fallback.productName;
  const headline = aiData?.headline || fallback.headline;
  const subtitle = aiData?.subtitle || fallback.subtitle;
  const badgeText = aiData?.badgeText || "⭐ ARRIVAGE & SÉLECTION OFFICIELLE 2026";
  const trustPoints = Array.isArray(aiData?.trustPoints) && aiData.trustPoints.length > 0
    ? aiData.trustPoints
    : [
        "Paiement 100% à la livraison",
        "Garantie satisfait ou remboursé 30j",
        "Assistance WhatsApp 7j/7",
      ];

  const showcaseItems = Array.isArray(aiData?.packs) && aiData.packs.length > 0
    ? aiData.packs.map((pk: any, idx: number) => ({
        id: `prod-${idx + 1}`,
        name: pk.name || `Pack ${idx + 1}`,
        price: Math.round(salePrice * (pk.multiplier || (idx === 0 ? 1 : 1.7))),
        regularPrice: Math.round(regularPrice * (pk.multiplier || (idx === 0 ? 1 : 1.7))),
        badge: pk.badge || (idx === 1 ? "Meilleur Choix" : "Économique"),
        imageUrl: stockImage,
        description: pk.description || "Idéal pour essayer la qualité supérieure.",
        features: [`${pk.name || "Pack officiel"}`, "Garantie 30 jours", "Livraison 24h"],
      }))
    : [
        {
          id: "prod-1",
          name: "Pack Découverte (1 Exemplaire)",
          price: salePrice,
          regularPrice: regularPrice,
          badge: "Économique",
          imageUrl: stockImage,
          description: "Idéal pour essayer et tester la qualité supérieure sans risque.",
          features: ["1 Produit certifié", "Garantie 30 jours", "Livraison 24h"],
        },
        {
          id: "prod-2",
          name: "Pack Duo Privilège (2 Exemplaires)",
          price: Math.round(salePrice * 1.7),
          regularPrice: regularPrice * 2,
          badge: "Meilleur Choix",
          imageUrl: stockImage,
          description: "Le choix préféré de 78% de nos clients. Économie maximale !",
          features: ["2 Produits certifiés", "Cadeau offert", "Livraison gratuite express"],
        },
      ];

  const reviewsItems = Array.isArray(aiData?.reviews) && aiData.reviews.length > 0
    ? aiData.reviews.map((r: any, idx: number) => ({
        id: `r-${idx + 1}`,
        authorName: r.author || "Client vérifié",
        authorLocation: r.city || city,
        rating: 5,
        comment: r.comment || "Produit de grande qualité, conforme à mes attentes.",
      }))
    : [
        {
          id: "r-1",
          authorName: "Amina K.",
          authorLocation: `${city}`,
          rating: 5,
          comment: "Commandé hier à 14h, reçu ce matin à 10h. Le produit est magnifique et conforme aux photos !",
        },
        {
          id: "r-2",
          authorName: "Marc D.",
          authorLocation: `${city}`,
          rating: 5,
          comment: "J'ai apprécié de pouvoir vérifier l'article avant de donner l'argent au livreur. Très sérieux !",
        },
        {
          id: "r-3",
          authorName: "Fatou S.",
          authorLocation: `${city}`,
          rating: 5,
          comment: "Excellent rapport qualité/prix et livraison très ponctuelle. Je recommanderai sans hésiter.",
        },
      ];

  const faqItems = Array.isArray(aiData?.faq) && aiData.faq.length > 0
    ? aiData.faq.map((q: any, idx: number) => ({
        id: `q-${idx + 1}`,
        question: q.question,
        answer: q.answer,
      }))
    : [
        {
          id: "q-1",
          question: "Quand et comment puis-je payer ?",
          answer: "Vous ne payez rien à l'avance ! Vous payez en espèces directement au livreur une fois que vous avez reçu et contrôlé votre produit.",
        },
        {
          id: "q-2",
          question: "Quel est le délai de livraison ?",
          answer: `La livraison prend entre 12h et 24h à ${city} et ses environs. Notre livreur vous appelle avant de passer.`,
        },
      ];

  const presetConfig = DESIGN_PRESETS[preset].theme;

  let sections: FunnelSection[] = [];

  if (pageType === "capture") {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🎁 ACCÈS IMMÉDIAT & CADEAU EXCLUSIF",
        title: `Guide & Conseils VIP : Réussissez avec ${productName}`,
        subtitle: `Téléchargez gratuitement votre guide pratique et recevez nos conseils d'experts directement par WhatsApp et Email.`,
        ctaText: "RECEVOIR MON CADEAU GRATUIT",
        ctaSubtext: "🔒 Zéro spam • Vos coordonnées restent 100% confidentielles",
        imageUrl: stockImage,
        trustPoints: [
          "Accès immédiat par WhatsApp en 30s",
          "100% gratuit et sans engagement",
          "Déjà plus de 2 500 membres actifs",
        ],
      },
      {
        id: "capture-1",
        type: "capture_form",
        badgeText: "⚡ INSCRIPTION EN 1 CLIC",
        title: "Où devons-nous vous envoyer votre accès ?",
        subtitle: "Remplissez ce court formulaire pour recevoir votre cadeau par WhatsApp et par Email :",
        buttonText: "ACCÉDER MAINTENANT",
        collectName: true,
        collectPhone: true,
        collectEmail: true,
      },
      {
        id: "floating-1",
        type: "floating_cards",
        cards: [
          {
            id: "c-1",
            icon: "timer",
            title: "Réception Express",
            description: "Votre lien de téléchargement vous est envoyé en moins de 30 secondes.",
          },
          {
            id: "c-2",
            icon: "shield",
            title: "100% Sécurisé",
            description: "Nous respectons votre vie privée : aucun spam ne vous sera jamais envoyé.",
          },
          {
            id: "c-3",
            icon: "check",
            title: "Méthodes Validées",
            description: "Des astuces concrètes et éprouvées directement applicables dès aujourd'hui.",
          },
        ],
      },
      {
        id: "faq-1",
        type: "faq",
        badgeText: "❓ QUESTIONS FRÉQUENTES",
        title: "Tout ce que vous devez savoir",
        subtitle: "Vos réponses en toute transparence :",
        items: [
          {
            id: "q-1",
            question: "Est-ce réellement 100% gratuit ?",
            answer: "Oui, absolument gratuit ! Aucun numéro de carte bancaire n'est requis. Nous vous envoyons directement le contenu par WhatsApp ou Email.",
          },
          {
            id: "q-2",
            question: "Quand vais-je recevoir mon cadeau ?",
            answer: "Instantanément après avoir validé le formulaire ci-dessus, notre système automatique vous transmet votre lien d'accès direct.",
          },
        ],
      },
    ];
  } else if (pageType === "checkout") {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🔐 FINALISATION DE COMMANDE SÉCURISÉE",
        title: `Votre commande de ${productName} est prête`,
        subtitle: `Complétez votre adresse de livraison ci-dessous. Aucun prépaiement obligatoire : vérifiez votre colis avant tout règlement !`,
        ctaText: "PASSER DIRECTEMENT AU FORMULAIRE",
        ctaSubtext: `📦 Livraison express 24h à ${city} • Paiement à la réception ou Mobile Money`,
        imageUrl: stockImage,
        trustPoints: [
          "Paiement à la livraison après vérification",
          "Expédition express sous 24h",
          "Garantie satisfait ou remboursé 30 jours",
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "TARIF PROMOTIONNEL GARANTI",
        title: "Récapitulatif de Votre Commande",
        subtitle: "Bénéficiez du tarif réduit garanti avant épuisement du stock :",
        offer: {
          id: "offer-1",
          name: `${productName} – Édition Officielle 2026`,
          salePrice,
          regularPrice,
          currency,
          features: [
            "Produit 100% certifié conforme",
            "Garantie satisfait ou remboursé 30j",
            "Assistance client dédiée 7j/7",
          ],
          stockLeft: 4,
        },
        guaranteeText: "Garantie 30 jours satisfait ou remboursé sans aucun justificatif",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Où devons-nous vous livrer ?",
        subtitle: "Remplissez simplement votre nom, téléphone et ville pour recevoir votre colis sous 24h :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: true,
        onlinePaymentEnabled: true,
        cities: [city, "Communes et environs", "Autre ville"],
      },
      {
        id: "floating-1",
        type: "floating_cards",
        cards: [
          {
            id: "c-1",
            icon: "check",
            title: "Contrôle à la Réception",
            description: "Vous ouvrez le paquet et contrôlez le produit avant de remettre l'argent au livreur.",
          },
          {
            id: "c-2",
            icon: "timer",
            title: "Livreur Dédié",
            description: `Le coursier vous appelle avant de passer à ${city} pour convenir de l'heure exacte.`,
          },
          {
            id: "c-3",
            icon: "shield",
            title: "Zéro Risque",
            description: "Si le produit ne vous convient pas, vous refusez la livraison sans payer un seul centime.",
          },
        ],
      },
    ];
  } else if (pageType === "thank_you") {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🎉 COMMANDE ENREGISTRÉE AVEC SUCCÈS",
        title: "Merci pour votre confiance !",
        subtitle: `Votre commande de ${productName} a bien été prise en compte par notre équipe logistique à ${city}.`,
        ctaText: "REJOINDRE NOTRE WHATSAPP VIP",
        ctaSubtext: "📱 Assistance dédiée et suivi de votre colis en direct",
        imageUrl: stockImage,
        trustPoints: [
          "Numéro de suivi enregistré",
          "Colis en cours de préparation",
          "Paiement à la réception du colis",
        ],
      },
      {
        id: "steps-1",
        type: "steps",
        badgeText: "PROCHAINES ÉTAPES",
        title: "Comment va se passer la livraison ?",
        subtitle: "Voici les 3 étapes pour recevoir votre colis en main propre :",
        items: [
          {
            id: "st-1",
            stepNumber: 1,
            title: "Préparation soignée",
            description: "Votre article est contrôlé et emballé dans un carton sécurisé et discret.",
          },
          {
            id: "st-2",
            stepNumber: 2,
            title: "Appel du livreur",
            description: "Notre livreur vous appellera par téléphone ou WhatsApp pour convenir de l'heure exacte.",
          },
          {
            id: "st-3",
            stepNumber: 3,
            title: "Vérification & Règlement",
            description: "Vous déballez votre commande, vérifiez sa conformité et payez en espèces ou Mobile Money.",
          },
        ],
      },
      {
        id: "reviews-1",
        type: "social_proof",
        badgeText: "💬 LA COMMUNAUTÉ VOUS RASSURE",
        title: "Vous êtes entre de très bonnes mains",
        ratingAverage: 5,
        totalReviewsText: "5/5 étoiles sur plus de 350 avis",
        items: reviewsItems,
      },
    ];
  } else if (pageType === "event_booking") {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🎟️ ÉVÉNEMENT MAJEUR & MASTERCLASS VIP",
        title: `${productName} : L'Événement Exclusif de l'Année`,
        subtitle: "Rejoignez des centaines de passionnés et professionnels pour une session intensive d'apprentissage, d'échange et de networking de haut niveau.",
        ctaText: "RÉSERVER MON BILLET MAINTENANT",
        ctaSubtext: "⚡ Nombre de places strictement limité pour garantir la qualité des échanges",
        imageUrl: stockImage,
        trustPoints: [
          "Accès en direct Zoom & Replay HD illimité",
          "Session questions/réponses privées avec les intervenants",
          "Certificat officiel de participation délivré",
        ],
      },
      {
        id: "floating-1",
        type: "floating_cards",
        cards: [
          {
            id: "c-1",
            icon: "timer",
            title: "Date & Horaires",
            description: "Samedi 25 Octobre 2026 • De 14h00 à 18h30 GMT+1 en direct interactif.",
          },
          {
            id: "c-2",
            icon: "check",
            title: "Intervenants Référents",
            description: "Des experts de renommée internationale partagent leurs meilleures stratégies concrètes.",
          },
          {
            id: "c-3",
            icon: "shield",
            title: "Replay & Ressources",
            description: "Accès intégral aux enregistrements vidéo HD, fiches pratiques et supports présentés.",
          },
        ],
      },
      {
        id: "steps-1",
        type: "steps",
        badgeText: "PROGRAMME DE L'ÉVÉNEMENT",
        title: "Le Déroulement Complet de la Session",
        subtitle: "Un contenu dense, orienté pratique et action immédiate :",
        items: [
          {
            id: "st-1",
            stepNumber: 1,
            title: "Module 1 : Les Fondations & Clés Stratégiques",
            description: "Comprendre les dynamiques actuelles et éviter les erreurs courantes qui coûtent cher.",
          },
          {
            id: "st-2",
            stepNumber: 2,
            title: "Module 2 : Études de Cas & Démonstrations En Direct",
            description: "Décorticage d'exemples réels et implémentation pas-à-pas sous vos yeux.",
          },
          {
            id: "st-3",
            stepNumber: 3,
            title: "Module 3 : Mastermind & Questions/Réponses",
            description: "Posez toutes vos questions en direct aux intervenants et développez votre réseau professionnel.",
          },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "TARIF BILLETTERIE OFFICIEL",
        title: "Choisissez Votre Formule d'Accès",
        subtitle: "Tarif spécial Early Bird garanti jusqu'à épuisement des billets :",
        offer: {
          id: "offer-std",
          name: "Pass Participant Officiel 2026",
          salePrice,
          regularPrice,
          currency,
          features: [
            "Accès direct à l'événement en direct",
            "Support de présentation PDF complet",
            "Accès au salon d'échange participant",
            "Certificat officiel de participation",
          ],
          stockLeft: 12,
        },
        guaranteeText: "Garantie 100% satisfait ou remboursé sous 48h si l'événement ne répond pas à vos attentes",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Réservez Votre Place Immédiatement",
        subtitle: "Paiement 100% sécurisé par Mobile Money ou Carte Bancaire. Vos billets électroniques vous seront envoyés par Email :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: false,
        momoEnabled: true,
        cardEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Billet Électronique (Envoi par Email)"],
      },
      {
        id: "faq-1",
        type: "faq",
        badgeText: "QUESTIONS BILLETTERIE",
        title: "Questions Fréquentes sur l'Événement",
        subtitle: "Tout ce qu'il faut savoir avant de réserver :",
        items: [
          {
            id: "q-1",
            question: "Et si je ne suis pas disponible à l'heure du direct ?",
            answer: "Aucun souci ! Tous les participants inscrits reçoivent l'enregistrement intégral en vidéo HD sous 24h avec accès à vie.",
          },
          {
            id: "q-2",
            question: "Comment vais-je recevoir mon lien d'accès ?",
            answer: "Dès votre paiement validé, vous recevrez une confirmation immédiate par email et par WhatsApp contenant votre lien de connexion personnel Zoom.",
          },
          {
            id: "q-3",
            question: "Quels sont les moyens de paiement acceptés ?",
            answer: "Vous pouvez régler facilement et en toute sécurité par Mobile Money (MTN, Moov, Wave, Orange) ou par Carte Bancaire Visa / Mastercard.",
          },
        ],
      },
    ];
  } else if (pageType === "app_launch") {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🚀 LANCEMENT BÊTA & ACCÈS ANTICIPÉ 2026",
        title: `${productName} : L'Innovation Que Vous Attendiez`,
        subtitle: "Gagnez du temps, simplifiez vos processus et rejoignez la nouvelle génération d'utilisateurs. Réservez votre accès en avant-première.",
        ctaText: "REJOINDRE LA LISTE D'ATTENTE VIP",
        ctaSubtext: "🎁 Avantages exclusifs réservés aux 500 premiers membres fondateurs",
        imageUrl: stockImage,
        trustPoints: [
          "Disponible prochainement sur iOS, Android et Web",
          "Zéro engagement • Aucun frais caché",
          "Accès prioritaire aux fonctionnalités bêta",
        ],
      },
      {
        id: "floating-1",
        type: "floating_cards",
        cards: [
          {
            id: "c-1",
            icon: "timer",
            title: "Gain de Temps x3",
            description: "Une interface fluide et intuitive pensée pour vous faire gagner de précieuses heures chaque semaine.",
          },
          {
            id: "c-2",
            icon: "shield",
            title: "Sécurité Maximale",
            description: "Chiffrement de bout en bout de vos données et respect strict de votre vie privée.",
          },
          {
            id: "c-3",
            icon: "check",
            title: "Synchronisation Cloud",
            description: "Retrouvez votre espace sur votre téléphone, tablette et ordinateur en temps réel.",
          },
        ],
      },
      {
        id: "features-1",
        type: "features",
        badgeText: "FONCTIONNALITÉS CLÉS",
        title: "Conçu pour répondre à vos besoins réels",
        subtitle: "Découvrez les piliers qui rendent cette application unique :",
        items: [
          {
            id: "f-1",
            title: "Automatisation Intelligente",
            description: "Laissez la technologie s'occuper des tâches répétitives pour vous concentrer sur ce qui compte.",
          },
          {
            id: "f-2",
            title: "Statistiques & Tableaux de Bord",
            description: "Visualisez vos indicateurs clés en un coup d'œil grâce à des graphiques clairs et personnalisables.",
          },
          {
            id: "f-3",
            title: "Intégrations Multi-Outils",
            description: "Connectez vos outils existants en quelques clics sans aucune ligne de code.",
          },
        ],
      },
      {
        id: "capture-1",
        type: "capture_form",
        badgeText: "ACCÈS PRIVILÉGIÉ",
        title: "Rejoignez la Liste d'Attente VIP",
        subtitle: "Inscrivez-vous pour être alerté en priorité lors de l'ouverture des accès :",
        buttonText: "REJOINDRE LES MEMBRES FONDATEURS",
        collectName: true,
        collectEmail: true,
        collectPhone: true,
      },
      {
        id: "faq-1",
        type: "faq",
        badgeText: "FOIRE AUX QUESTIONS",
        title: "Questions sur le Lancement",
        subtitle: "Tout ce que vous voulez savoir sur le projet :",
        items: [
          {
            id: "q-1",
            question: "Quand l'application sera-t-elle accessible au grand public ?",
            answer: "La phase bêta privée démarre dans les prochaines semaines pour les inscrits sur la liste d'attente, suivie du lancement officiel.",
          },
          {
            id: "q-2",
            question: "Quels sont les avantages d'être Membre Fondateur ?",
            answer: "Les membres fondateurs bénéficient d'un accès préférentiel gratuit, de badges exclusifs et d'un tarif bloqué à vie sur les options avancées.",
          },
        ],
      },
    ];
  } else if (pageType === "digital_product") {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🎓 FORMATION EN LIGNE & PRODUIT DIGITAL",
        title: headline,
        subtitle: subtitle || "Apprenez pas à pas avec une méthode concrète et éprouvée. Accédez instantanément à l'espace membre et téléchargez toutes les ressources.",
        ctaText: "ACCÉDER À LA FORMATION MAINTENANT",
        ctaSubtext: "⚡ Accès immédiat 24h/24 • Garantie 30 jours satisfait ou remboursé",
        imageUrl: stockImage,
        trustPoints: [
          "Accès à vie à tous les modules et mises à jour",
          "Fichiers, modèles et templates téléchargeables",
          "Support personnalisé pour répondre à vos questions",
        ],
      },
      {
        id: "floating-1",
        type: "floating_cards",
        cards: [
          {
            id: "c-1",
            icon: "check",
            title: "100% Concret",
            description: "Zéro blabla théorique : des tutoriels pas-à-pas filmés en haute définition applicables dès aujourd'hui.",
          },
          {
            id: "c-2",
            icon: "timer",
            title: "À Votre Rythme",
            description: "Progressez à votre convenance depuis votre smartphone, tablette ou ordinateur sans contrainte d'horaires.",
          },
          {
            id: "c-3",
            icon: "shield",
            title: "Garantie Totale",
            description: "Testez pendant 30 jours. Si vous n'êtes pas entièrement satisfait, vous êtes 100% remboursé.",
          },
        ],
      },
      {
        id: "steps-1",
        type: "steps",
        badgeText: "CURRICULUM DE LA FORMATION",
        title: "Le Programme Complet Pas à Pas",
        subtitle: "Tout ce dont vous avez besoin pour maîtriser le sujet de A à Z :",
        items: [
          {
            id: "st-1",
            stepNumber: 1,
            title: "Partie 1 : Les Fondations & Stratégie Gagnante",
            description: "Poser des bases solides et comprendre les mécanismes exacts du succès.",
          },
          {
            id: "st-2",
            stepNumber: 2,
            title: "Partie 2 : Mise en Application & Déploiement",
            description: "Copiez et adaptez nos modèles clés en main pour obtenir des résultats immédiats.",
          },
          {
            id: "st-3",
            stepNumber: 3,
            title: "Partie 3 : Optimisation & Passage à l'Échelle",
            description: "Automatiser et multiplier vos résultats sur le long terme avec nos stratégies avancées.",
          },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "OFFRE SPÉCIALE D'ACCÈS",
        title: "Rejoignez le Programme Aujourd'hui",
        subtitle: "Profitez du tarif promotionnel avant la fermeture prochaine des inscriptions :",
        offer: {
          id: "offer-digital",
          name: `${productName} – Accès Intégral VIP`,
          salePrice,
          regularPrice,
          currency,
          features: [
            "Accès illimité à tous les modules vidéo",
            "Mises à jour futures offertes à vie",
            "Templates et fiches de travail téléchargeables",
            "Groupe privé d'entraide et support prioritaire",
          ],
          stockLeft: 7,
        },
        guaranteeText: "Garantie 30 jours satisfait ou remboursé sans justification nécessaire",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Validez Votre Accès en 1 Clic",
        subtitle: "Paiement 100% sécurisé par Mobile Money ou Carte Bancaire. Vos identifiants vous sont délivrés instantanément :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: false,
        momoEnabled: true,
        cardEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Espace Membre Digital (Envoi instantané par Email)"],
      },
      {
        id: "faq-1",
        type: "faq",
        badgeText: "QUESTIONS FRÉQUENTES",
        title: "Toutes vos questions sur la formation",
        subtitle: "Transparence totale pour vous lancer en toute confiance :",
        items: [
          {
            id: "q-1",
            question: "L'accès est-il limité dans le temps ?",
            answer: "Non, vous bénéficiez d'un accès à vie à l'ensemble du contenu et à toutes les futures mises à jour ajoutées au programme.",
          },
          {
            id: "q-2",
            question: "Puis-je payer par Mobile Money ?",
            answer: "Oui, le règlement s'effectue en quelques secondes avec votre numéro MTN, Moov, Wave ou Orange, ou par Carte Bancaire.",
          },
        ],
      },
    ];
  } else if (p.toLowerCase().includes("momo") || p.toLowerCase().includes("momoopti") || p.toLowerCase().includes("comparateur")) {
    // 1. MOMOOPTI (FINTECH SAAS - OBSIDIAN & MINT)
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "⚡ MOMOOPTI • COMPARATEUR MOBILE MONEY N°1",
        title: "Choisir le bon réseau pour payer moins",
        subtitle: "Simulez instantanément vos commissions MTN MoMo, Moov Money, Wave et Celtiis. Économisez jusqu'à 45% sur chacun de vos transferts et encaissements.",
        ctaText: "SIMULER MES COMMISSIONS EN DIRECT",
        ctaSubtext: "📊 100% gratuit • Grilles tarifaires officielles 2026",
        secondaryCtaText: "WhatsApp Direct",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80",
        trustPoints: ["MTN MoMo", "Moov Money", "Wave Bénin & CI", "Celtiis Cash"],
      },
      {
        id: "split-1",
        type: "split_showcase",
        layoutDirection: "image_right",
        badgeText: "📊 ALGORITHME PRÉDICTIF",
        title: "Comparez les commissions en temps réel",
        subtitle: "Un simulateur transparent pensé pour les commerçants, agences et particuliers exigeants :",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80",
        imageAlt: "Simulateur MomoOpti",
        metricBadge: {
          value: "+14.2%",
          label: "Économie moyenne constatée",
        },
        highlights: [
          {
            id: "hl-1",
            title: "Calcul Intelligent Multi-Opérateurs",
            description: "Entrez un montant : notre moteur compare immédiatement les frais d'envoi et de retrait de chaque réseau.",
          },
          {
            id: "hl-2",
            title: "Zéro Frais Cachés ni Mauvaise Surprise",
            description: "Visualisez exactement ce que reçoit votre destinataire sans déduction imprévue.",
          },
          {
            id: "hl-3",
            title: "API Marchands & Intégration Simplifiée",
            description: "Intégrez le routage optimal des paiements dans votre site web ou système de caisse.",
          },
        ],
        ctaText: "TESTER LA SIMULATION",
        ctaLink: "#tarifs",
      },
      {
        id: "bento-1",
        type: "bento_grid",
        badgeText: "💎 AVANTAGES EXCLUSIFS",
        title: "Pourquoi des milliers d'utilisateurs font confiance à MomoOpti",
        subtitle: "Une technologie éprouvée pour garder le contrôle total de vos flux financiers :",
        cards: [
          {
            id: "bc-1",
            colSpan: "col-span-2",
            tag: "ACCÈS INSTANTANÉ",
            metric: "0 FCFA",
            title: "Simulateur 100% Libre & Gratuit",
            description: "Accédez à toutes les fonctionnalités de comparaison sans carte bancaire ni formalités administratives lourdes.",
            imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
          },
          {
            id: "bc-2",
            colSpan: "col-span-1",
            tag: "VITESSE",
            metric: "< 1s",
            title: "Calcul en Temps Réel",
            description: "Résultats instantanés synchronisés aux grilles de tous les opérateurs.",
          },
          {
            id: "bc-3",
            colSpan: "col-span-1",
            tag: "DISPONIBILITÉ",
            metric: "99.98%",
            title: "Haute Disponibilité",
            description: "Transactions et vérifications fluides 24h/24 sans coupure.",
          },
          {
            id: "bc-4",
            colSpan: "col-span-2",
            tag: "MULTI-OPÉRATEURS",
            metric: "5+ Réseaux",
            title: "MTN, Moov, Wave & Orange Connectés",
            description: "Basculez d'un compte à l'autre en un battement de cil. Évitez les frais excessifs grâce au routage intelligent du moins cher vers le plus rapide.",
            imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        id: "stats-1",
        type: "stats",
        badgeText: "IMPACT MESURÉ",
        items: [
          { id: "st-1", value: "24 800+", label: "Simulations effectuées" },
          { id: "st-2", value: "-45%", label: "Économie max constatée" },
          { id: "st-3", value: "4 Réseaux", label: "Connectés en direct" },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "OFFRE TRANSPARENTE",
        title: "Choisissez votre formule MomoOpti",
        subtitle: "Bénéficiez des alertes de surcoût et de l'accès API prioritaire :",
        offer: {
          id: "offer-momo",
          name: "MomoOpti Pro & API Marchand 2026",
          salePrice: 15000,
          regularPrice: 30000,
          currency: "XOF",
          features: [
            "Simulateur illimité pour tous les montants",
            "Alertes hausses de tarifs opérateurs en direct",
            "Clé API développeur (jusqu'à 10 000 requêtes/mois)",
            "Assistance WhatsApp VIP 7j/7",
          ],
          stockLeft: 8,
        },
        guaranteeText: "Garantie 30 jours satisfait ou remboursé sans justificatif",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Activez votre compte MomoOpti Pro",
        subtitle: "Réglez en direct par Mobile Money ou Carte Bancaire et recevez vos accès par email :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: false,
        momoEnabled: true,
        cardEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Accès Immédiat en Ligne"],
      },
      {
        id: "faq-1",
        type: "faq",
        badgeText: "FAQ",
        title: "Questions Fréquentes sur MomoOpti",
        subtitle: "Tout ce qu'il faut savoir sur notre simulateur :",
        items: [
          {
            id: "q-1",
            question: "Les grilles tarifaires sont-elles toujours fiables ?",
            answer: "Oui, notre équipe met à jour les barèmes dès qu'un opérateur (MTN, Moov, Wave, Celtiis) publie une nouvelle grille officielle.",
          },
          {
            id: "q-2",
            question: "Puis-je intégrer le calcul sur mon propre site ou application ?",
            answer: "Absolument ! La formule Pro inclut un accès API REST documenté et simple à intégrer en quelques minutes.",
          },
        ],
      },
    ];
  } else if (p.toLowerCase().includes("v0app") || (p.toLowerCase().includes("masterclass") && p.toLowerCase().includes("ai")) || p.toLowerCase().includes("agentic")) {
    // 2. V0APP (LIVE EVENT / MASTERCLASS AGENTIC AI)
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "🔴 DIRECT EXCLUSIF • SAMEDI 25 OCTOBRE 2026",
        title: "The Art of Agentic AI – Live Masterclass 2026",
        subtitle: "3 heures intensives pour concevoir, orchestrer et monétiser des systèmes d'agents IA autonomes sans théorie superflue.",
        ctaText: "RÉSERVER MA PLACE EN DIRECT",
        ctaSubtext: "⚡ 50 places exclusives pour garantir des échanges directs de qualité",
        secondaryCtaText: "WhatsApp Direct",
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
        trustPoints: ["+3 482 participants certifiés", "Accès Zoom direct + Replay 4K à vie", "Templates & Prompts offerts"],
      },
      {
        id: "split-1",
        type: "split_showcase",
        layoutDirection: "image_left",
        badgeText: "🎤 INTERVENANT RÉFÉRENT",
        title: "Apprenez auprès d'un praticien de terrain",
        subtitle: "Une approche pragmatique axée sur le code réel et les applications concrètes à forte valeur commerciale :",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Intervenant Masterclass",
        metricBadge: {
          value: "4.98/5",
          label: "Satisfaction moyenne participants",
        },
        highlights: [
          {
            id: "hl-1",
            title: "Architecture Multi-Agents Moderne",
            description: "Comment coordonner des subagents spécialisés, gérer la mémoire et prévenir les dérives de contexte.",
          },
          {
            id: "hl-2",
            title: "Démonstrations en Direct Pas-à-Pas",
            description: "Création d'un système complet sous vos yeux avec intégration d'outils externes et exécution réelle.",
          },
          {
            id: "hl-3",
            title: "Salon d'Échange VIP & Réseau",
            description: "Session questions-réponses privées pour résoudre directement les blocages de vos projets.",
          },
        ],
        ctaText: "DÉCOUVRIR LE PROGRAMME",
        ctaLink: "#programme",
      },
      {
        id: "steps-1",
        type: "steps",
        badgeText: "LE PROGRAMME DE LA SESSION",
        title: "3 Modules pour Maîtriser les Agents IA",
        subtitle: "Un contenu dense, actionnable et orienté résultat immédiat :",
        items: [
          {
            id: "st-1",
            stepNumber: 1,
            title: "Module 1 : Fondations & Outillage MCP",
            description: "Comprendre les protocoles de communication et outiller vos agents pour agir dans le monde réel.",
          },
          {
            id: "st-2",
            stepNumber: 2,
            title: "Module 2 : Orchestration & Workflows Commerciaux",
            description: "Concevoir des pipelines autonomes capables de traiter des tâches complexes de bout en bout.",
          },
          {
            id: "st-3",
            stepNumber: 3,
            title: "Module 3 : Monétisation & Déploiement Client",
            description: "Vendre des solutions agentiques à des entreprises ou automatiser vos propres processus.",
          },
        ],
      },
      {
        id: "stats-1",
        type: "stats",
        badgeText: "AUTORITÉ & COMMUNAUTÉ",
        items: [
          { id: "st-1", value: "3 482+", label: "Participants formés" },
          { id: "st-2", value: "4.98/5", label: "Note des participants" },
          { id: "st-3", value: "100%", label: "Replay HD & Code inclus" },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "BILLETTERIE OFFICIELLE",
        title: "Réservez votre place pour le direct",
        subtitle: "Tarif spécial Early Bird garanti jusqu'à épuisement des billets :",
        offer: {
          id: "offer-event",
          name: "Pass Masterclass VIP + Replay 4K",
          salePrice: 25000,
          regularPrice: 50000,
          currency: "XOF",
          features: [
            "Accès au direct interactif Zoom",
            "Replay vidéo 4K à vie sans limitation",
            "Pack complet de prompts et code source",
            "Certificat de participation officiel",
            "Accès au groupe privé des alumni",
          ],
          stockLeft: 14,
        },
        guaranteeText: "Garantie 100% satisfait ou remboursé sous 48h si la masterclass ne vous apporte pas entière satisfaction",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Validez votre inscription",
        subtitle: "Règlement sécurisé par Mobile Money ou Carte Bancaire. Vos identifiants Zoom vous sont transmis par email :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: false,
        momoEnabled: true,
        cardEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Billet Électronique (Envoi instantané par Email)"],
      },
    ];
  } else if (p.toLowerCase().includes("creator") || p.toLowerCase().includes("créateur") || p.toLowerCase().includes("infopreneur")) {
    // 3. CREATOR HUB (PLATEFORME CRÉATEURS & MONÉTISATION)
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "⚡ LA SUITE TOUT-EN-UN DES CRÉATEURS D'ÉLITE",
        title: "Monétisez votre audience sans barrière technique",
        subtitle: "Vendez vos formations, coachings, templates et fichiers avec encaissement instantané Mobile Money et Cartes Bancaires en un clic.",
        ctaText: "LANCER MON TUNNEL DE VENTE",
        ctaSubtext: "🚀 Configuration en 2 minutes • Zéro frais d'abonnement mensuel",
        secondaryCtaText: "WhatsApp",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
        trustPoints: ["Encaissement MoMo & Cartes", "Livraison automatique 24/7", "Zéro commission cachée"],
      },
      {
        id: "bento-1",
        type: "bento_grid",
        badgeText: "🔥 ARSENAL COMPLET DU CRÉATEUR",
        title: "Tout ce dont vous avez besoin pour vendre plus",
        subtitle: "Conçu pour maximiser vos revenus en Afrique et à l'international :",
        cards: [
          {
            id: "bc-1",
            colSpan: "col-span-2",
            tag: "ENCAISSEMENT HYBRIDE",
            metric: "100%",
            title: "Mobile Money & Cartes Réunis",
            description: "Vos abonnés en Afrique paient par MTN, Moov ou Wave. Vos clients de la diaspora paient par Carte Bancaire. Vous encaissez tout au même endroit.",
            imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
          },
          {
            id: "bc-2",
            colSpan: "col-span-1",
            tag: "LIVRAISON",
            metric: "30s",
            title: "Livraison Automatique",
            description: "Vos clients reçoivent immédiatement leurs accès par email et WhatsApp, même pendant votre sommeil.",
          },
          {
            id: "bc-3",
            colSpan: "col-span-1",
            tag: "SÉCURITÉ",
            metric: "0 Fuite",
            title: "Protection Anti-Piratage",
            description: "Liens de téléchargement sécurisés et vidéos protégées contre le vol de contenu.",
          },
          {
            id: "bc-4",
            colSpan: "col-span-2",
            tag: "RELANCE AUTOMATISÉE",
            metric: "3.4x",
            title: "Relance Intelligente WhatsApp & Upsell",
            description: "Recouvrez automatiquement les paniers abandonnés via messages WhatsApp personnalisés et boostez votre panier moyen grâce aux offres complémentaires en 1 clic.",
            imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        id: "split-1",
        type: "split_showcase",
        layoutDirection: "image_right",
        badgeText: "💬 CONVERSIONS WHATSAPP",
        title: "Transformez vos abonnés en acheteurs engagés",
        subtitle: "Ne laissez plus aucun prospect repartir sans réponse grâce au bouton direct WhatsApp :",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Intégration WhatsApp Creator Hub",
        metricBadge: {
          value: "3.4x",
          label: "Multiplicateur de conversion moyen",
        },
        highlights: [
          {
            id: "hl-1",
            title: "Relances Amicales des Paniers Inachevés",
            description: "Contactez en un clic les visiteurs qui ont entamé leur commande sans finaliser.",
          },
          {
            id: "hl-2",
            title: "Message de Commande Pré-Rempli",
            description: "Le client clique et vous envoie directement le récapitulatif sans devoir rédiger un pavé.",
          },
          {
            id: "hl-3",
            title: "Paiement en Ligne ou Mobile Money Local",
            description: "Laissez vos clients choisir leur moyen de règlement préféré sans friction.",
          },
        ],
        ctaText: "COMMENCER À ENCAISSER",
        ctaLink: "#tarifs",
      },
      {
        id: "stats-1",
        type: "stats",
        badgeText: "STATISTIQUES DE LA COMMUNAUTÉ",
        items: [
          { id: "st-1", value: "+180M FCFA", label: "Encaissés par nos créateurs" },
          { id: "st-2", value: "98.4%", label: "Satisfaction utilisateurs" },
          { id: "st-3", value: "30s", label: "Temps moyen de livraison" },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "FORMULE DU CRÉATEUR",
        title: "Lancez votre empire de produits digitaux",
        subtitle: "Bénéficiez de la suite complète sans aucun abonnement récurrent imposé :",
        offer: {
          id: "offer-creator",
          name: "Pack Créateur Digital Indépendant 2026",
          salePrice: 19000,
          regularPrice: 38000,
          currency: "XOF",
          features: [
            "Tunnels de vente illimités pour tous vos produits",
            "Encaissement hybride Mobile Money + Cartes Bancaires",
            "Module de relance WhatsApp automatique",
            "Hébergement ultra-rapide et nom de domaine offert",
            "Assistance 7j/7 pour vos lancements",
          ],
          stockLeft: 9,
        },
        guaranteeText: "Garantie 30 jours satisfait ou remboursé sans aucune condition",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Débloquez vos accès immédiats",
        subtitle: "Réglez en direct par Mobile Money ou Carte Bancaire et commencez à vendre dans l'heure :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: false,
        momoEnabled: true,
        cardEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Accès Immédiat en Ligne"],
      },
    ];
  } else if (p.toLowerCase().includes("ideogram") || p.toLowerCase().includes("visual ai") || p.toLowerCase().includes("studio ia") || p.toLowerCase().includes("visuel ia")) {
    // 4. VISUAL AI STUDIO (IDEOGRAM STUDIO - HAUT DE GAMME, ÉPURÉ & AÉRÉ)
    sections = [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "✨ STUDIO CRÉATIF IA NOUVELLE GÉNÉRATION",
        title: "Donnez vie à vos idées en haute définition",
        subtitle: "Générez des visuels publicitaires percutants, des chartes graphiques et des mockups professionnels avec une précision typographique inédite.",
        ctaText: "COMMENCER GRATUITEMENT",
        ctaSubtext: "🎨 50 crédits de création offerts sans engagement ni carte bancaire",
        secondaryCtaText: "WhatsApp",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
        trustPoints: ["Rendu photoréaliste 4K", "Typographie intégrée parfaite", "Licence commerciale incluse"],
      },
      {
        id: "bento-1",
        type: "bento_grid",
        badgeText: "⚡ LES PILIERS DE L'EXCELLENCE VISUELLE",
        title: "La précision au service de vos marques",
        subtitle: "Une technologie pensée pour les graphistes, agences et créateurs exigeants :",
        cards: [
          {
            id: "bc-1",
            colSpan: "col-span-2",
            tag: "QUALITÉ NATIVE",
            metric: "4K UHD",
            title: "Textures Ultra-Réalistes",
            description: "Des rendus nets et précis adaptés à l'impression grand format comme aux campagnes publicitaires sur les réseaux sociaux.",
            imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
          },
          {
            id: "bc-2",
            colSpan: "col-span-1",
            tag: "TYPOGRAPHIE",
            metric: "100%",
            title: "Slogans & Logos Nettes",
            description: "Notre modèle respecte fidèlement les mots et textes que vous inscrivez dans votre visuel.",
          },
          {
            id: "bc-3",
            colSpan: "col-span-1",
            tag: "VITESSE",
            metric: "< 3s",
            title: "Génération Instantanée",
            description: "Moins de 3 secondes pour exporter votre composition finale prête à diffuser.",
          },
          {
            id: "bc-4",
            colSpan: "col-span-2",
            tag: "WORKFLOW COMPLET",
            metric: "100%",
            title: "De l'Idée au Déploiement en 15 Minutes",
            description: "Apprenez à combiner v0, Supabase et Tuneliva pour créer et expédier des applications web complètes sans écrire de boilerplate inutile.",
            imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        id: "split-1",
        type: "split_showcase",
        layoutDirection: "image_left",
        badgeText: "🚀 API & INTÉGRATION",
        title: "Connectez le moteur de rendu à vos outils",
        subtitle: "Automatisez la création de bannières publicitaires et de visuels e-commerce à l'échelle :",
        imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Intégration API Visual AI Studio",
        metricBadge: {
          value: "99.99%",
          label: "Disponibilité de l'infrastructure",
        },
        highlights: [
          {
            id: "hl-1",
            title: "SDK Développeurs Prêt à l'Emploi",
            description: "Des bibliothèques simples pour Python, Node.js et cURL avec documentation interactive.",
          },
          {
            id: "hl-2",
            title: "Contrôle Stylistique Granulaire",
            description: "Ajustez la lumière, l'angle de vue et la palette chromatique avec des paramètres simples.",
          },
          {
            id: "hl-3",
            title: "Droits Commerciaux Intégrals",
            description: "Toutes vos créations vous appartiennent à 100% pour vos opérations marketing.",
          },
        ],
        ctaText: "VOIR LES PLANS",
        ctaLink: "#tarifs",
      },
      {
        id: "stats-1",
        type: "stats",
        badgeText: "PERFORMANCE DU MOTEUR",
        items: [
          { id: "st-1", value: "1.2M+", label: "Images générées ce mois" },
          { id: "st-2", value: "2.8s", label: "Temps moyen d'inférence" },
          { id: "st-3", value: "100%", label: "Droits commerciaux inclus" },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "ABONNEMENT PRO",
        title: "Passez à la vitesse supérieure",
        subtitle: "Débloquez la génération haute résolution illimitée :",
        offer: {
          id: "offer-visual",
          name: "Visual AI Studio Pro 2026",
          salePrice: 12000,
          regularPrice: 24000,
          currency: "XOF",
          features: [
            "1 000 générations haute définition par mois",
            "Résolution 4K native sans filigrane",
            "File d'attente prioritaire ultra-rapide",
            "Accès complet à l'API développeur",
            "Licence commerciale pour revente et diffusion",
          ],
          stockLeft: 11,
        },
        guaranteeText: "Garantie 14 jours satisfait ou remboursé sans discussion",
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Activez votre forfait Studio Pro",
        subtitle: "Réglez en toute sécurité par Mobile Money ou Carte Bancaire pour créditer votre compte instantanément :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: false,
        momoEnabled: true,
        cardEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Activation Instantanée en Ligne"],
      },
    ];
  } else {
    // SENIOR UI/UX DYNAMIC ARCHITECTURAL VARIATIONS (Surprise, diversité et équilibre visuel)

    // Si l'IA a généré des cartes Bento personnalisées, les utiliser en priorité
    const customBentoCards = Array.isArray(aiData?.bentoCards) && aiData.bentoCards.length > 0
      ? aiData.bentoCards.map((bc: any, idx: number) => ({
          id: `bc-${idx + 1}`,
          colSpan: bc.colSpan === "col-span-2" ? "col-span-2" : "col-span-1",
          tag: bc.tag || "AVANTAGE",
          metric: bc.metric || (idx === 0 ? "100%" : undefined),
          title: bc.title || `Atout ${idx + 1}`,
          description: bc.description || "Conçu pour vous offrir le maximum d'efficacité et de satisfaction.",
          imageUrl: idx === 0 ? stockImage : undefined,
        }))
      : null;

    // Si l'IA a généré des statistiques clés, les intégrer
    const customStatsItems = Array.isArray(aiData?.stats) && aiData.stats.length > 0
      ? aiData.stats.map((st: any, idx: number) => ({
          id: `st-${idx + 1}`,
          value: st.value || "100%",
          label: st.label || "Satisfaction garantie",
        }))
      : null;

    let layoutHash = 0;
    for (let i = 0; i < p.length; i++) {
      layoutHash = (layoutHash << 5) - layoutHash + p.charCodeAt(i);
      layoutHash |= 0;
    }
    const layoutChoice = Math.abs(layoutHash) % 3;

    if (layoutChoice === 0) {
      // ARCHITECTURE 1 : PRODUCT SPOTLIGHT, BENTO GRID & DUAL PACKS
      sections = [
        {
          id: "hero-1",
          type: "hero",
          badgeText: badgeText,
          title: headline,
          subtitle: subtitle,
          ctaText: "COMMANDER MAINTENANT",
          ctaSubtext: `📦 Livraison express sous 24h à ${city} • Vérification avant paiement`,
          secondaryCtaText: "WhatsApp Direct",
          imageUrl: stockImage,
          trustPoints: trustPoints,
        },
        {
          id: "bento-1",
          type: "bento_grid",
          badgeText: "💎 CONÇU POUR L'EXCELLENCE",
          title: `Ce qui rend ${productName} véritablement unique`,
          subtitle: "Chaque détail a été pensé pour vous apporter une satisfaction absolue :",
          cards: customBentoCards || [
            {
              id: "bc-1",
              colSpan: "col-span-2",
              tag: "QUALITÉ SUPÉRIEURE",
              metric: "100%",
              title: "Matériaux Nobles & Durabilité Maximale",
              description: `Profitez d'un produit robuste pensé pour un usage quotidien sans compromis.`,
              imageUrl: stockImage,
            },
            {
              id: "bc-2",
              colSpan: "col-span-1",
              tag: "SÉCURITÉ",
              metric: "0 Risque",
              title: "Contrôle Avant Paiement",
              description: "Ouvrez votre colis, vérifiez son état et ne réglez que si vous êtes 100% conquis.",
            },
            {
              id: "bc-3",
              colSpan: "col-span-1",
              tag: "RAPIDITÉ",
              metric: "24h",
              title: "Livraison Locale Express",
              description: `Notre livreur dédié vous appelle et vous livre en main propre à ${city}.`,
            },
            {
              id: "bc-4",
              colSpan: "col-span-2",
              tag: "GARANTIE TOTALE",
              metric: "30 Jours",
              title: "Satisfait ou 100% Remboursé",
              description: "Notre équipe locale vous accompagne 7j/7 sur WhatsApp pour toute question ou échange.",
              imageUrl: stockImage,
            },
          ],
        },
        {
          id: "split-1",
          type: "split_showcase",
          layoutDirection: "image_right",
          badgeText: "⭐ CONCEPTION CERTIFIÉE",
          title: "Une expérience d'usage incomparable",
          subtitle: "Pourquoi nos clients ne jurent plus que par ce modèle :",
          imageUrl: stockImage,
          imageAlt: productName,
          metricBadge: {
            value: "99.2%",
            label: "Clients Conquis",
          },
          highlights: [
            {
              id: "hl-1",
              title: "Finition Soignée & Précision Artisanale",
              description: "Chaque composant répond aux standards les plus stricts du marché.",
            },
            {
              id: "hl-2",
              title: "Prise en Main Immédiate",
              description: "Facile, intuitif et agréable dès la toute première utilisation.",
            },
            {
              id: "hl-3",
              title: "Service Après-Vente Réactif",
              description: "Des conseillers disponibles par message direct pour vous assister.",
            },
          ],
          ctaText: "JE COMMANDE MAINTENANT",
          ctaLink: "#commander",
        },
        {
          id: "packs-1",
          type: "product_showcase",
          badgeText: "🎁 OFFRE PROMOTIONNELLE",
          title: "Choisissez la Formule Idéale",
          subtitle: "Profitez de nos tarifs préférentiels valables jusqu'à épuisement du stock :",
          items: showcaseItems,
        },
        {
          id: "slider-1",
          type: "interactive_slider",
          badgeText: "💬 AVIS CLIENTS VÉRIFIÉS",
          title: "Témoignages de nos Acheteurs",
          subtitle: "Retours authentiques après livraison et test en conditions réelles :",
          sliderType: "testimonials",
          items: reviewsItems.map((r: any, i: number) => ({
            id: `sl-${i + 1}`,
            title: r.authorName,
            subtitle: `${r.authorLocation} • Acheteur Certifié`,
            description: r.comment,
            rating: 5,
            tag: "Avis Contrôlé",
            imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          })),
        },
        {
          id: "order-1",
          type: "order_form",
          title: "Finalisez votre Commande Express",
          subtitle: "Remplissez ce formulaire en 30 secondes pour recevoir votre colis sous 24h :",
          whatsappEnabled: true,
          whatsappNumber: "+22997000000",
          codEnabled: true,
          onlinePaymentEnabled: true,
          cities: [city, "Communes et environs", "Autre ville"],
        },
        {
          id: "faq-1",
          type: "faq",
          badgeText: "❓ FAQ",
          title: "Questions Fréquentes",
          subtitle: "Toutes les réponses à vos questions en toute clarté :",
          items: faqItems,
        },
      ];
    } else if (layoutChoice === 1) {
      // ARCHITECTURE 2 : DIRECT RESPONSE, REASSURANCE PILLS & 3-STEP UNBOXING
      sections = [
        {
          id: "hero-1",
          type: "hero",
          badgeText: "🔥 ÉDITION LIMITÉE 2026 – DERNIERS EXEMPLAIRES",
          title: headline,
          subtitle: subtitle,
          ctaText: "BÉNÉFICIER DU TARIF PROMO",
          ctaSubtext: `⚡ Expédition directe sous 24h à ${city} • Inspection du colis offerte`,
          secondaryCtaText: "WhatsApp",
          imageUrl: stockImage,
          trustPoints: trustPoints,
        },
        {
          id: "floating-1",
          type: "floating_cards",
          cards: [
            {
              id: "c-1",
              icon: "timer",
              title: "Livraison Éclair 24h",
              description: `Notre coursier vous livre à votre domicile ou bureau à ${city}.`,
            },
            {
              id: "c-2",
              icon: "check",
              title: "Contrôle à la Réception",
              description: "Vous ouvrez et examinez votre article avant de donner l'argent.",
            },
            {
              id: "c-3",
              icon: "shield",
              title: "Garantie Tranquillité",
              description: "30 jours complets pour tester votre produit en toute liberté.",
            },
          ],
        },
        {
          id: "steps-1",
          type: "steps",
          badgeText: "PROCESSUS 100% SIMPLE",
          title: "Comment se déroule votre commande ?",
          subtitle: "3 étapes fluides et transparentes jusqu'à vos mains :",
          items: [
            {
              id: "s-1",
              stepNumber: 1,
              title: "Remplissez le formulaire",
              description: "Indiquez votre nom, numéro de téléphone et ville de livraison.",
            },
            {
              id: "s-2",
              stepNumber: 2,
              title: "Appel de courtoisie du livreur",
              description: "Nous convenons avec vous de l'heure exacte de passage selon vos disponibilités.",
            },
            {
              id: "s-3",
              stepNumber: 3,
              title: "Inspection & Paiement en Espèces ou MoMo",
              description: "Vous prenez en main le produit, vous constatez la qualité, et vous réglez en toute confiance.",
            },
          ],
        },
        {
          id: "packs-1",
          type: "product_showcase",
          badgeText: "OFFRES SPÉCIALES",
          title: "Sélectionnez votre Pack",
          subtitle: "Économisez jusqu'à 40% sur le pack recommandé :",
          items: showcaseItems,
        },
        {
          id: "reviews-1",
          type: "social_proof",
          badgeText: "AVIS CLIENTS",
          title: "Ils l'ont testé et approuvé",
          ratingAverage: 5,
          totalReviewsText: "Note de 4.9/5 sur plus de 450 avis enregistrés",
          items: reviewsItems,
        },
        {
          id: "area-1",
          type: "service_area",
          title: "Zone d'expédition & de livraison",
          subtitle: "Livreurs actifs sur l'ensemble de la région",
          zoneText: `${city} et toutes les communes périphériques`,
          mapMode: "google_maps",
          mapAddress: city,
          mapZoom: 13,
          mapImageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80",
        },
        {
          id: "order-1",
          type: "order_form",
          title: "Commandez en 1 Seul Clic",
          subtitle: "Remplissez ce formulaire court pour lancer l'expédition :",
          whatsappEnabled: true,
          whatsappNumber: "+22997000000",
          codEnabled: true,
          onlinePaymentEnabled: true,
          cities: [city, "Communes et environs", "Autre ville"],
        },
        {
          id: "faq-1",
          type: "faq",
          badgeText: "QUESTIONS & RÉPONSES",
          title: "Besoin d'un renseignement ?",
          subtitle: "Voici les réponses aux questions les plus posées :",
          items: faqItems,
        },
      ];
    } else {
      // ARCHITECTURE 3 : EDITORIAL AUTHORITY, STATS IMPACT & SPLIT SHOWCASE
      sections = [
        {
          id: "hero-1",
          type: "hero",
          badgeText: badgeText,
          title: headline,
          subtitle: subtitle,
          ctaText: "COMMANDER EN TOUTE SÉCURITÉ",
          ctaSubtext: `🛡️ Garantie 30 jours • Paiement à la réception du colis`,
          secondaryCtaText: "WhatsApp VIP",
          imageUrl: stockImage,
          trustPoints: trustPoints,
        },
        {
          id: "split-1",
          type: "split_showcase",
          layoutDirection: "image_left",
          badgeText: "⭐ CONCEPTION SUPÉRIEURE",
          title: `Pourquoi ${productName} fait toute la différence`,
          subtitle: "Une fabrication soignée qui allie durabilité, confort et performance :",
          imageUrl: stockImage,
          imageAlt: productName,
          metricBadge: {
            value: "99.4%",
            label: "Taux de Satisfaction Client",
          },
          highlights: [
            {
              id: "hl-1",
              title: "Finition Irréprochable & Matériaux Certifiés",
              description: "Chaque exemplaire subit un contrôle qualité rigoureux avant toute expédition.",
            },
            {
              id: "hl-2",
              title: "Confort & Prise en Main Immédiate",
              description: "Pensé pour répondre parfaitement à vos besoins dès les premières secondes d'usage.",
            },
            {
              id: "hl-3",
              title: "Assistance VIP & Garantie 30 Jours Incluses",
              description: "Notre équipe locale vous accompagne en toute sérénité à chaque étape.",
            },
          ],
          ctaText: "COMMANDER MAINTENANT",
          ctaLink: "#commander",
        },
        {
          id: "stats-1",
          type: "stats",
          badgeText: "IMPACT RÉEL",
          items: [
            { id: "st-1", value: "1 850+", label: "Commandes honorées" },
            { id: "st-2", value: "99.1%", label: "Clients satisfaits" },
            { id: "st-3", value: "12-24h", label: "Délai moyen de livraison" },
          ],
        },
        {
          id: "bento-1",
          type: "bento_grid",
          badgeText: "🏆 EXCELLENCE TUNELIVA",
          title: "La sérénité absolue à chaque étape",
          subtitle: "Un engagement sans compromis pour votre satisfaction :",
          cards: [
            {
              id: "bc-1",
              colSpan: "col-span-2",
              tag: "CONTRÔLE TOTAL",
              metric: "0 FCFA Avance",
              title: "Paiement 100% à la Livraison",
              description: `Vous ouvrez et inspectez votre colis devant le livreur à ${city} avant de régler.`,
              imageUrl: stockImage,
            },
            {
              id: "bc-2",
              colSpan: "col-span-1",
              tag: "RAPIDITÉ",
              metric: "24h",
              title: "Expédition Express",
              description: "Le livreur vous appelle pour convenir du meilleur moment.",
            },
            {
              id: "bc-3",
              colSpan: "col-span-1",
              tag: "CONFIANCE",
              metric: "30 Jours",
              title: "Garantie Totale",
              description: "Satisfait ou remboursé sans tracas ni question inutile.",
            },
            {
              id: "bc-4",
              colSpan: "col-span-2",
              tag: "ASSISTANCE 7J/7",
              metric: "< 10 min",
              title: "Support WhatsApp Immédiat",
              description: "Des conseillers dévoués pour répondre en direct à chacune de vos demandes.",
            },
          ],
        },
        {
          id: "slider-1",
          type: "interactive_slider",
          badgeText: "💬 AVIS CLIENTS 5 ÉTOILES",
          title: "Ce que nos clients en disent",
          subtitle: "Découvrez les retours authentiques de nos clients :",
          sliderType: "testimonials",
          items: reviewsItems.map((r: any, i: number) => ({
            id: `sl-${i + 1}`,
            title: r.authorName,
            subtitle: `${r.authorLocation} • Achat Vérifié`,
            description: r.comment,
            rating: 5,
            tag: "Client Vérifié",
            imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          })),
        },
        {
          id: "order-1",
          type: "order_form",
          title: "Formulaire de Commande Express",
          subtitle: "Remplissez ce formulaire pour recevoir votre colis sous 24h :",
          whatsappEnabled: true,
          whatsappNumber: "+22997000000",
          codEnabled: true,
          onlinePaymentEnabled: true,
          cities: [city, "Communes et environs", "Autre ville"],
        },
        {
          id: "faq-1",
          type: "faq",
          badgeText: "❓ FAQ",
          title: "Questions Fréquentes",
          subtitle: "Toutes les réponses pour commander en toute tranquillité :",
          items: faqItems,
        },
      ];
    }
  }

  return {
    projectName: productName,
    slug: "offre-speciale",
    pageType,
    metaTitle: `${productName} | Édition Officielle 2026`,
    metaDescription: `${headline}. Livraison express à ${city} et paiement sécurisé à la livraison.`,
    branding: {
      businessName: productName,
      tagline: "Qualité Certifiée & Service d'Excellence",
      headerVariant: isCustomDesign ? seniorArchetype.headerVariant : "classic",
      footerVariant: isCustomDesign ? seniorArchetype.footerVariant : "modern_3cols",
      whatsappNumber: "+22997000000",
      phone: "+229 01 53 29 52 82",
      socialLinks: {
        whatsapp: "https://wa.me/22997000000",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
      },
      address: {
        city,
        country: "Bénin",
        fullAddress: `Centre Commercial, Haie Vive, ${city}`,
        serviceZone: `Zone d'intervention : ${city}, Calavi, Porto-Novo et environs`,
      },
    },
    theme: isCustomDesign
      ? {
          preset: seniorArchetype.id as any,
          ...seniorArchetype.theme,
          pageLayoutWidth: "fluid",
        }
      : {
          preset,
          ...presetConfig,
          pageLayoutWidth: "fluid",
        },
    sections,
    eventDetails:
      pageType === "event_booking"
        ? {
            eventDate: "Samedi 25 Octobre 2026",
            eventTime: "14h00 - 18h30 GMT+1",
            eventLocation: "En direct sur Zoom & Replay Privé",
            eventType: "online",
            ticketTiers: [
              {
                id: "tier-std",
                name: "Pass Standard (Live + Fiches)",
                price: salePrice,
                regularPrice,
                features: ["Accès au direct interactif", "Support PDF récapitulatif", "Session questions/réponses"],
                isPopular: false,
              },
              {
                id: "tier-vip",
                name: "Pass VIP (Live + Replay à Vie + Coaching Privé)",
                price: Math.round(salePrice * 1.8),
                regularPrice: Math.round(regularPrice * 2),
                features: [
                  "Tous les accès du Pass Standard",
                  "Replay vidéo HD illimité à vie",
                  "Session de coaching privé en petit groupe",
                  "Accès au salon d'échange VIP",
                ],
                isPopular: true,
              },
            ],
          }
        : undefined,
    appLaunchDetails:
      pageType === "app_launch"
        ? {
            releaseDateText: "Novembre 2026",
            supportedPlatforms: ["ios", "android", "web"],
            currentWaitlistCount: 1420,
            totalGoalCount: 2000,
            perks: ["Accès bêta anticipé", "Statut Membre Fondateur à vie", "Fonctionnalités avancées débloquées"],
          }
        : undefined,
  };
}
