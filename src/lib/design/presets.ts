// ==============================================================================
// 🎨 TUNELIVA - COLLECTION COMPLÈTE DE 11 PRESETS DE DESIGN DE CLASSE MONDIALE
// ==============================================================================
import { DesignPreset, ThemeConfig } from "@/types/page";

export interface PresetDetails {
  id: DesignPreset;
  name: string;
  badge: string;
  description: string;
  theme: Omit<ThemeConfig, "preset">;
}

export const DESIGN_PRESETS: Record<DesignPreset, PresetDetails> = {
  // 1. ROSE POUDRÉ & GLAMOUR (Féminin, Beauté, Cosmétique, Lingerie)
  rose_glamour: {
    id: "rose_glamour",
    name: "Rose Poudré & Glamour",
    badge: "🌸 Beauté & Passion Féminine",
    description: "Teintes roses poudrées, élégance féminine et douceur pour cosmétiques, soins et mode.",
    theme: {
      primaryColor: "#F43F5E", // Rose éclatant
      accentColor: "#FB7185", // Rose poudré doux
      pageBackground: "#FFF1F2", // Fond rosé très doux en mode clair
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(244, 63, 94, 0.20)",
      textColor: "#881337", // Prune profond
      textMutedColor: "#9F1239",
      fontFamily: "Poppins",
      isDarkTheme: false,
      bannerUrgencyText: "💖 OFFRE BEAUTÉ DU MOMENT : -40% DE RÉDUCTION JUSQU'À CE SOIR SEULEMENT !",
      countdownMinutes: 120,
    },
  },

  // 2. BORDEAUX ROYAL & VELOURS (Mode de luxe, Parfums, Lingerie, Soirée)
  bordeaux_velours: {
    id: "bordeaux_velours",
    name: "Bordeaux Royal & Velours",
    badge: "🍷 Luxe Sensuel & Prestige",
    description: "Ambiance pourpre et bordeaux voluptueuse avec touches dorées pour parfums et haute couture.",
    theme: {
      primaryColor: "#E11D48", // Rubis vibrant
      accentColor: "#F59E0B", // Or chaud
      pageBackground: "#130408", // Bordeaux très sombre profond
      cardBackground: "#240710", // Cartes velours
      cardBorderColor: "rgba(225, 29, 72, 0.30)",
      textColor: "#FFF1F2",
      textMutedColor: "#FDA4AF",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "🔥 ÉDITION PRIVILÈGE LIMITÉE : SEULEMENT 5 FLACONS RESTANTS EN STOCK !",
      countdownMinutes: 90,
    },
  },

  // 3. ROUGE PASSION & ÉNERGIE (High Impact, Événements, Promos Chocs)
  rouge_passion: {
    id: "rouge_passion",
    name: "Rouge Passion & Énergie",
    badge: "🔥 Vente Flash & Urgence",
    description: "Rouge incendiaire captivant l'attention instantanément pour les promotions explosives.",
    theme: {
      primaryColor: "#DC2626", // Rouge vif énergique
      accentColor: "#F97316", // Orange feu
      pageBackground: "#0A0506",
      cardBackground: "#180A0C",
      cardBorderColor: "rgba(220, 38, 38, 0.25)",
      textColor: "#FFFFFF",
      textMutedColor: "#FCA5A5",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "⚡ VENTE FLASH EXCLUSIVE : LIQUIDATION DU STOCK D'ICI MINUIT !",
      countdownMinutes: 60,
    },
  },

  // 4. VERT NATURE & SAUGE BIO (Miel, Tisanes, Huiles, Détox, Bien-être)
  vert_sauge: {
    id: "vert_sauge",
    name: "Vert Sauge & Forêt Bio",
    badge: "🌿 Nature & Pureté Terroir",
    description: "Vert végétal et blanc pur inspirant la santé, les produits bio et le respect du corps.",
    theme: {
      primaryColor: "#059669", // Vert émeraude végétal
      accentColor: "#10B981", // Menthe fraîche
      pageBackground: "#F2FBF7", // Blanc cassé verdoyant
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(5, 150, 105, 0.18)",
      textColor: "#064E3B", // Vert forêt profond
      textMutedColor: "#047857",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: false,
      bannerUrgencyText: "🌿 100% PUR ET NATUREL RÉCOLTÉ AU NORD DU BÉNIN SANS COLORANT NI CONSERVATEUR",
      countdownMinutes: 140,
    },
  },

  // 5. AMBRE SOLAIRE & KARITÉ (Cosmétique Africaine, Cuir, Terroir)
  ambre_karite: {
    id: "ambre_karite",
    name: "Ambre Solaire & Karité",
    badge: "🍯 Terroir & Chaleur d'Afrique",
    description: "Palette miel et caramel chaleureuse idéale pour beurres de karité, huiles et artisanat.",
    theme: {
      primaryColor: "#D97706", // Ambre doré
      accentColor: "#F59E0B", // Miel
      pageBackground: "#FFFDF9", // Crème douce
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(217, 119, 6, 0.20)",
      textColor: "#451A03", // Terre cuite foncée
      textMutedColor: "#78350F",
      fontFamily: "Poppins",
      isDarkTheme: false,
      bannerUrgencyText: "⭐ FABRICATION ARTISANALE AUTHENTIQUE • SATISFACTION GARANTIE",
      countdownMinutes: 110,
    },
  },

  // 6. VIOLET MYSTIQUE & PARFUMERIE (Senteurs, Spiritualité, Nuit)
  violet_mystique: {
    id: "violet_mystique",
    name: "Violet Mystique & Encens",
    badge: "🔮 Bien-être & Senteurs",
    description: "Ambiance feutrée violette et améthyste pour relaxation, bougies et soins de nuit.",
    theme: {
      primaryColor: "#7C3AED", // Violet électrique
      accentColor: "#A855F7", // Lilas lumineux
      pageBackground: "#0B0616", // Nuit violette
      cardBackground: "#140C28",
      cardBorderColor: "rgba(124, 58, 237, 0.25)",
      textColor: "#F5F3FF",
      textMutedColor: "#C4B5FD",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "✨ VIVEZ UNE EXPÉRIENCE SENSORIELLE INÉDITE AVEC NOS PRODUITS SÉLECTIONNÉS",
      countdownMinutes: 150,
    },
  },

  // 7. BLEU OCÉAN & CYAN (Tech, Gadgets, Électronique, Solutions Web)
  bleu_ocean: {
    id: "bleu_ocean",
    name: "Bleu Océan & Cyan",
    badge: "🌊 Fraîcheur & High-Tech",
    description: "Bleu roi et cyan cristallin pour gadgets, écouteurs sans fil et technologie.",
    theme: {
      primaryColor: "#0284C7", // Bleu ciel azur
      accentColor: "#06B6D4", // Cyan
      pageBackground: "#040B14",
      cardBackground: "#081628",
      cardBorderColor: "rgba(2, 132, 199, 0.25)",
      textColor: "#F0F9FF",
      textMutedColor: "#7DD3FC",
      fontFamily: "Inter",
      isDarkTheme: true,
      bannerUrgencyText: "🚀 DERNIÈRE GÉNÉRATION BLUETOOTH 5.4 AVEC RÉDUCTION DE BRUIT ACTIVE",
      countdownMinutes: 100,
    },
  },

  // 8. BLEU PRO & ORANGE SOLAIRE (Serrurier, Artisans, Services Locaux)
  clean_pro_navy: {
    id: "clean_pro_navy",
    name: "Bleu Pro & Orange Solaire",
    badge: "🛡️ Confiance & Local",
    description: "Fond marine puissant en tête et corps blanc éclatant avec boutons orange d'action rapide.",
    theme: {
      primaryColor: "#EA580C",
      accentColor: "#22C55E",
      pageBackground: "#F8FAFC",
      cardBackground: "#FFFFFF",
      cardBorderColor: "rgba(15, 23, 42, 0.08)",
      textColor: "#0F172A",
      textMutedColor: "#475569",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: false,
      bannerUrgencyText: "⚡ INTERVENTION EXPRESS SOUS 15 MINUTES À COTONOU ET ENVIRONS",
      countdownMinutes: 120,
    },
  },

  // 9. OR ROYAL & NOIR CARBONE (Académie, Prestige, Lancement VIP)
  luxury_gold: {
    id: "luxury_gold",
    name: "Or Royal & Noir Carbone",
    badge: "👑 Prestige & High-Ticket",
    description: "Ambiance luxe haut de gamme avec bordures dorées rayonnantes et typographie prestige.",
    theme: {
      primaryColor: "#EAB308",
      accentColor: "#F59E0B",
      pageBackground: "#08080A",
      cardBackground: "#111115",
      cardBorderColor: "rgba(234, 179, 8, 0.22)",
      textColor: "#FBFBFC",
      textMutedColor: "#A1A1AA",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "⚠️ DÉJÀ 82% DES PLACES RÉSERVÉES POUR CETTE SESSION EXCLUSIVE !",
      countdownMinutes: 90,
    },
  },

  // 10. FINTECH MINT & OBSIDIAN (Mobile Money, Crypto, Finance)
  fintech_mint: {
    id: "fintech_mint",
    name: "Fintech Mint & Obsidian",
    badge: "⚡ Performance & MoMo",
    description: "Fond noir bleuté ultra-profond avec boutons émeraude néon et badges d'opérateurs.",
    theme: {
      primaryColor: "#10B981",
      accentColor: "#00F5A0",
      pageBackground: "#040711",
      cardBackground: "#0A1024",
      cardBorderColor: "rgba(16, 185, 129, 0.18)",
      textColor: "#FFFFFF",
      textMutedColor: "#94A3B8",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "🔥 OFFRE SPÉCIALE : -35% DE RÉDUCTION JUSQU'À CE SOIR SEULEMENT !",
      countdownMinutes: 115,
    },
  },

  // 11. INDIGO ÉLECTRIQUE & NUIT (SaaS, Startup Silicon Valley)
  saas_indigo: {
    id: "saas_indigo",
    name: "Indigo Électrique & Nuit",
    badge: "🚀 Startup 2026",
    description: "Le look épuré des plus grandes startups avec accents violets et typographie géométrique.",
    theme: {
      primaryColor: "#6366F1",
      accentColor: "#FACC15",
      pageBackground: "#070B16",
      cardBackground: "#0F172A",
      cardBorderColor: "rgba(99, 102, 241, 0.20)",
      textColor: "#F8FAFC",
      textMutedColor: "#94A3B8",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "⭐ DÉJÀ ADOPTÉ PAR PLUS DE 1 200 CLIENTS SATISFAITS CETTE SEMAINE !",
      countdownMinutes: 140,
    },
  },
};
