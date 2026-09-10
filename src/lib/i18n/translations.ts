// ==============================================================================
// 🌍 TUNELIVA - TRADUCTIONS MULTILINGUES (FRANÇAIS & ENGLISH)
// Les 2 langues majeures du business et des passerelles de paiement africaines & internationales
// ==============================================================================

export type LanguageCode = "fr" | "en";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
];

export const TRANSLATIONS: Record<LanguageCode, {
  header: {
    tagline: string;
    regions: string;
    blog: string;
    myOrders: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    promptPlaceholder: string;
    generateBtn: string;
    generatingBtn: string;
    freeGuarantee: string;
  };
  templates: {
    title: string;
    subtitle: string;
    useTemplate: string;
  };
  features: {
    title: string;
    momoTitle: string;
    momoDesc: string;
    codTitle: string;
    codDesc: string;
    whatsappTitle: string;
    whatsappDesc: string;
    speedTitle: string;
    speedDesc: string;
  };
  footer: {
    copyright: string;
    rights: string;
  };
}> = {
  fr: {
    header: {
      tagline: "Donnez vie à vos tunnels de vente",
      regions: "Afrique • Diaspora • International",
      blog: "📚 Blog",
      myOrders: "Mes Commandes",
    },
    hero: {
      badge: "Pour l'Afrique, la Diaspora et les Vendeurs Internationaux",
      titlePart1: "Donnez vie à vos tunnels & pages de conversion ",
      titleHighlight: "en quelques secondes",
      subtitle: "L'IA génère des pages ultrarapides adaptées à votre audience : Mobile Money (Wave, MTN, Orange, Moov), paiement à la livraison (COD), devises locales et intégration WhatsApp.",
      promptPlaceholder: "Décrivez votre offre (ex: Crème visage éclat bio avec livraison rapide à Abidjan et paiement à la livraison)...",
      generateBtn: "Générer mon Tunnel IA →",
      generatingBtn: "Création de votre page par l'IA...",
      freeGuarantee: "Gratuit • Sans carte requise • Prêt en 15 secondes",
    },
    templates: {
      title: "Modèles d'Élite Prêts à Déployer",
      subtitle: "Sélectionnez un tunnel haute conversion adapté à votre secteur d'activité",
      useTemplate: "Utiliser ce modèle →",
    },
    features: {
      title: "Pourquoi Tuneliva Convertit 3x Plus ?",
      momoTitle: "Paiements Mobile Money Locaux",
      momoDesc: "Encaissez par MTN MoMo, Wave, Moov Money et Orange sans friction.",
      codTitle: "Paiement à la Livraison (COD)",
      codDesc: "Le moyen préféré des acheteurs africains : commandez d'abord, réglez au coursier.",
      whatsappTitle: "Intégration WhatsApp 1-Clic",
      whatsappDesc: "Recevez les commandes et relancez directement les clients sur WhatsApp.",
      speedTitle: "Vitesse Flash & 100% Mobile",
      speedDesc: "Pages chargées en moins de 1,2 seconde, optimisées pour 3G/4G et smartphone.",
    },
    footer: {
      copyright: "Tuneliva — Tunnels de Vente & E-Commerce Haute Performance.",
      rights: "Tous droits réservés.",
    },
  },
  en: {
    header: {
      tagline: "Bring your high-converting sales funnels to life",
      regions: "Africa • Diaspora • Global Markets",
      blog: "📚 Blog",
      myOrders: "My Orders",
    },
    hero: {
      badge: "For Africa, the Diaspora & Global Entrepreneurs",
      titlePart1: "Launch high-converting sales funnels & landing pages ",
      titleHighlight: "in seconds with AI",
      subtitle: "AI creates ultra-fast sales pages tailored to your audience: Mobile Money (Wave, MTN, Orange, Moov), Cash on Delivery (COD), local currencies and WhatsApp integration.",
      promptPlaceholder: "Describe your offer (e.g., Organic skincare cream with express delivery in Lagos and cash on delivery)...",
      generateBtn: "Generate My AI Funnel →",
      generatingBtn: "AI is crafting your sales funnel...",
      freeGuarantee: "100% Free • No Credit Card Required • Live in 15s",
    },
    templates: {
      title: "Elite Ready-to-Deploy Templates",
      subtitle: "Choose a high-converting sales funnel crafted for your business industry",
      useTemplate: "Use this template →",
    },
    features: {
      title: "Why Tuneliva Converts 3x More Customers?",
      momoTitle: "Native Mobile Money Payments",
      momoDesc: "Accept payments with MTN MoMo, Wave, Moov Money, and Orange seamlessly.",
      codTitle: "Cash on Delivery (COD)",
      codDesc: "The #1 preferred checkout in emerging markets: inspect first, pay the courier.",
      whatsappTitle: "1-Click WhatsApp Ordering",
      whatsappDesc: "Receive customer leads and follow up instantly on WhatsApp.",
      speedTitle: "Ultra-Fast Mobile Speed",
      speedDesc: "Pages load in under 1.2s, optimized for smartphones and mobile data.",
    },
    footer: {
      copyright: "Tuneliva — High-Converting E-Commerce & Sales Funnel Builder.",
      rights: "All rights reserved.",
    },
  },
};
