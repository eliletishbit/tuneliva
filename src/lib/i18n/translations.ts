// ==============================================================================
// 🌍 TUNELIVA - TRADUCTIONS MULTILINGUES COMPLÈTES (FRANÇAIS & ENGLISH)
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

export interface TranslationSchema {
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
    typeLabel: string;
    promptPlaceholder: string;
    generateBtn: string;
    generatingBtn: string;
    freeGuarantee: string;
  };
  pageTypes: Record<string, { label: string; desc: string }>;
  currencies: Record<string, string>;
  paymentsStrip: {
    label: string;
    cod: string;
    cards: string;
  };
  starterTemplates: {
    sectionTitle: string;
    items: Array<{
      id: string;
      name: string;
      badge: string;
      desc: string;
      prompt: string;
    }>;
  };
  creativesShowcase: {
    badge: string;
    title: string;
    subtitle: string;
    ctaBtn: string;
    livePreviewBadge: string;
    items: Array<{
      id: string;
      title: string;
      subtitle: string;
      theme: string;
      stats: string;
      imageUrl: string;
      color: string;
      prompt: string;
    }>;
  };
  useCases: {
    badge: string;
    title: string;
    ecommerceTitle: string;
    ecommerceDesc: string;
    artisanTitle: string;
    artisanDesc: string;
    infopreneurTitle: string;
    infopreneurDesc: string;
    startupsTitle: string;
    startupsDesc: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    freePlan: {
      title: string;
      price: string;
      period: string;
      badge: string;
      desc: string;
      features: string[];
      cta: string;
    };
    proPlan: {
      title: string;
      price: string;
      period: string;
      badge: string;
      desc: string;
      features: string[];
      cta: string;
    };
    faqNoteTitle: string;
    faqNoteBody: string;
  };
  testimonials: {
    badge: string;
    title: string;
    items: Array<{
      name: string;
      role: string;
      text: string;
      rating: number;
    }>;
  };
  footer: {
    regions: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationSchema> = {
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
      subtitle: "Pour les formateurs, créateurs, organisateurs d'événements, startups, artisans et commerçants. Générez des pages haute conversion avec encaissement combiné Mobile Money (Wave, MTN, Orange, Moov) & Cartes Bancaires, paiement à la livraison (COD) et intégration WhatsApp.",
      typeLabel: "Type :",
      promptPlaceholder: "Décrivez votre offre (ex: Crème visage éclat bio avec livraison rapide à Abidjan et paiement à la livraison)...",
      generateBtn: "Générer mon Tunnel IA →",
      generatingBtn: "Création de votre page par l'IA...",
      freeGuarantee: "Gratuit • Sans carte requise • Prêt en 15 secondes",
    },
    pageTypes: {
      sales: { label: "🚀 Page de Vente", desc: "Produit ou Service" },
      event_booking: { label: "🎟️ Événement & Billetterie", desc: "Pass VIP & Live" },
      digital_product: { label: "🎓 Formation & Coaching", desc: "Accès Immédiat" },
      app_launch: { label: "📱 Lancement d'App", desc: "Waitlist & Bêta" },
      capture: { label: "🧲 Page de Capture", desc: "Opt-in Lead" },
      checkout: { label: "🛒 Commande Directe", desc: "Paiement 1-clic" },
    },
    currencies: {
      XOF: "FCFA (Bénin, Côte d'Ivoire, Sénégal, Togo)",
      XAF: "FCFA (Cameroun, Gabon, Congo)",
      GNF: "GNF (Guinée)",
      EUR: "Euro (€ - Diaspora & Europe)",
      USD: "Dollar ($ - International)",
    },
    paymentsStrip: {
      label: "Paiements pris en charge :",
      cod: "Espèces à la livraison (COD)",
      cards: "Cartes Visa & Mastercard",
    },
    starterTemplates: {
      sectionTitle: "🚀 Démarrez directement avec un modèle pro (Sans IA requise)",
      items: [
        {
          id: "momoopti_fintech",
          name: "MomoOpti – Fintech & SaaS",
          badge: "Comparateur MoMo",
          desc: "Simulateur de taux Mobile Money, grille de tarifs transparente et API marchands.",
          prompt: "MomoOpti choisir le bon reseau Mobile Money pour payer moins comparateur MTN Moov Wave",
        },
        {
          id: "event_masterclass",
          name: "The Art of Agentic AI (v0app)",
          badge: "Live Masterclass VIP",
          desc: "Conférence en direct Zoom, speaker bio, 3 modules et billetterie VIP.",
          prompt: "The Art of Agentic AI Live Masterclass 2026 avec pass Standard et VIP en direct sur Zoom v0app",
        },
        {
          id: "creator_hub",
          name: "Creator Hub – Plateforme Créateurs",
          badge: "Produits Digitaux",
          desc: "Vente de formations et coaching avec encaissement hybride MoMo & Cartes et relance WhatsApp.",
          prompt: "Creator Hub la plateforme tout-en-un pour créateurs et infopreneurs monétisation produits digitaux",
        },
        {
          id: "visual_ai_studio",
          name: "Visual AI Studio (Ideogram)",
          badge: "Studio Graphique IA",
          desc: "Design épuré et aéré haute définition pour outils créatifs, mockups et intégration API.",
          prompt: "Visual AI Studio donnez vie à vos idées en haute définition Ideogram studio ia",
        },
        {
          id: "service_artisan",
          name: "Artisan & Prestataire Pro",
          badge: "PME & Dépannage",
          desc: "Cabinet, serrurerie, plomberie avec appel direct et WhatsApp 24/7.",
          prompt: "Serrurier d'urgence à Cotonou intervention sous 15 minutes",
        },
        {
          id: "ecommerce_light",
          name: "Boutique & E-commerce",
          badge: "Produit Physique",
          desc: "Produits physiques, packs en vedette et option paiement à la livraison.",
          prompt: "Boutique Cosmétique Bio & Sérum Éclat avec livraison express",
        },
      ],
    },
    creativesShowcase: {
      badge: "DESIGNS ÉLITE 2026",
      title: "Des créatives spectaculaires générées en quelques clics",
      subtitle: "Chaque tunnel est pensé pour capter l'attention et maximiser le passage à l'action.",
      ctaBtn: "Générer ce type de page",
      livePreviewBadge: "Aperçu en direct 2026",
      items: [
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
      ],
    },
    useCases: {
      badge: "CAS D'USAGE CONCRETS",
      title: "Une solution pensée pour votre secteur d'activité",
      ecommerceTitle: "E-commerce & Vente Directe",
      ecommerceDesc: "Cosmétiques, mode, électronique, agroalimentaire. Formulaire COD ultra rapide avec contrôle du colis à la réception.",
      artisanTitle: "Artisans & Dépannage Urgent",
      artisanDesc: "Serruriers, plombiers, électriciens, garagistes. Bouton d'appel téléphonique immédiat, WhatsApp et zone d'intervention.",
      infopreneurTitle: "Infopreneurs, Formateurs & Diaspora",
      infopreneurDesc: "Formations en ligne, coaching, ebooks, conférences Zoom. Intégration vidéo et double encaissement Cartes + Mobile Money.",
      startupsTitle: "Startups & Services SaaS",
      startupsDesc: "Applications web/mobile, comparateurs, réservations et lancements avec vitesse record < 800ms.",
    },
    pricing: {
      badge: "TARIFS CLAIRS & TRANSPARENTS",
      title: "Lancez-vous gratuitement, payez seulement si vous gagnez",
      subtitle: "Aucun abonnement mensuel obligatoire pour démarrer. Vous testez et vendez en toute liberté.",
      freePlan: {
        title: "Offre Découverte",
        price: "0 FCFA",
        period: "Gratuit à vie pour démarrer",
        badge: "Idéal pour Débuter",
        desc: "3 Tunnels de vente offerts pour lancer et tester vos offres immédiatement sans frais fixes.",
        features: [
          "3 Tunnels de vente complets offerts à vie",
          "Paiements Mobile Money (MTN, Wave, Moov, Orange) & Cartes",
          "Paiement à la livraison (COD) & WhatsApp 1-clic",
          "Virement automatique instantané sur votre MoMo à chaque vente",
          "Commission modeste de 4.5% par vente (vous ne payez que si vous vendez)",
        ],
        cta: "Créer mes 3 Tunnels Gratuits →",
      },
      proPlan: {
        title: "Pack Pro Illimité",
        price: "10 000 FCFA",
        period: "/ mois (ou 99 000 FCFA / an)",
        badge: "Recommandé aux Vendeurs Actifs",
        desc: "Pour les e-commerçants et créateurs qui dépassent 3 tunnels et veulent maximiser leur rentabilité.",
        features: [
          "Tunnels de vente illimités (aucune restriction)",
          "Commission réduite à 2% seulement sur vos ventes",
          "Noms de domaine personnalisés illimités (boutique.com)",
          "Sous-compte FedaPay marchand dédié avec split instantané",
          "Génération vidéo TikTok automatique pour vos produits",
          "Support prioritaire WhatsApp 24/7",
        ],
        cta: "Passer à Tuneliva Pro →",
      },
      faqNoteTitle: "💡 Quota et Transparence : Comment ça fonctionne ?",
      faqNoteBody: "Chaque utilisateur bénéficie de 3 créations de tunnels 100% gratuites à vie. Vous n'avez pas de frais mensuels : une commission de 4.5% s'applique uniquement lorsque vous encaissez une commande en ligne. Au-delà de 3 tunnels cumulés ou pour réduire la commission à 2%, vous pouvez activer le Plan Pro illimité en un clic.",
    },
    testimonials: {
      badge: "ILS FONT CONFIANCE À TUNELIVA",
      title: "Ce que disent nos vendeurs en Afrique et dans le monde",
      items: [
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
      ],
    },
    footer: {
      regions: "Tuneliva • Afrique • Diaspora • International",
      copyright: "Tuneliva. Tous droits réservés. Propulsé pour la performance et la liberté financière.",
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
      subtitle: "For educators, creators, event organizers, startups, local artisans and merchants. Generate high-converting pages with combined Mobile Money (Wave, MTN, Orange, Moov) & Credit Cards, Cash on Delivery (COD), and direct WhatsApp ordering.",
      typeLabel: "Page Type:",
      promptPlaceholder: "Describe your product or offer (e.g. Organic glowing skin cream with express delivery in Nairobi and cash on delivery)...",
      generateBtn: "Generate My AI Funnel →",
      generatingBtn: "AI is crafting your sales page...",
      freeGuarantee: "100% Free • No Credit Card Required • Ready in 15s",
    },
    pageTypes: {
      sales: { label: "🚀 Sales Funnel", desc: "Physical or Digital Product" },
      event_booking: { label: "🎟️ Event & Ticketing", desc: "Live Masterclass & Passes" },
      digital_product: { label: "🎓 Course & Coaching", desc: "Instant Access" },
      app_launch: { label: "📱 App Launch", desc: "Waitlist & Beta" },
      capture: { label: "🧲 Lead Capture", desc: "Opt-in & Email List" },
      checkout: { label: "🛒 Direct Checkout", desc: "1-Click Payment" },
    },
    currencies: {
      XOF: "FCFA (Benin, Ivory Coast, Senegal, Togo)",
      XAF: "FCFA (Cameroon, Gabon, Congo)",
      GNF: "GNF (Guinea)",
      EUR: "Euro (€ - Diaspora & Europe)",
      USD: "US Dollar ($ - Global)",
    },
    paymentsStrip: {
      label: "Accepted Payment Gateways:",
      cod: "Cash on Delivery (COD)",
      cards: "Visa & Mastercard Cards",
    },
    starterTemplates: {
      sectionTitle: "🚀 Start instantly with a pre-built pro template (No AI prompt needed)",
      items: [
        {
          id: "momoopti_fintech",
          name: "MomoOpti – Fintech & SaaS",
          badge: "MoMo Comparator",
          desc: "Mobile Money rate simulator, transparent pricing tier and merchant API checkout.",
          prompt: "MomoOpti fintech mobile money fee comparator MTN Moov Wave lower merchant costs",
        },
        {
          id: "event_masterclass",
          name: "The Art of Agentic AI (v0app)",
          badge: "Live Masterclass VIP",
          desc: "Live Zoom conference, speaker bio, 3 core modules and VIP ticketing checkout.",
          prompt: "The Art of Agentic AI Live Masterclass 2026 with Standard and VIP pass live on Zoom",
        },
        {
          id: "creator_hub",
          name: "Creator Hub – Digital Assets",
          badge: "Digital Products",
          desc: "Courses & coaching sales funnel with hybrid MoMo & Card checkout plus WhatsApp recovery.",
          prompt: "Creator Hub all-in-one platform for creators and infopreneurs digital product monetization",
        },
        {
          id: "visual_ai_studio",
          name: "Visual AI Studio (Ideogram)",
          badge: "AI Graphics Studio",
          desc: "Clean high-definition minimal design for creative tools, mockups and API integrations.",
          prompt: "Visual AI Studio bring your ideas to life in high definition modern AI studio",
        },
        {
          id: "service_artisan",
          name: "Pro Artisan & Contractor",
          badge: "Local SME & Repair",
          desc: "Emergency locksmith, plumbing, technician with direct mobile calling and WhatsApp 24/7.",
          prompt: "Emergency locksmith 24/7 service on-site in 15 minutes free quote",
        },
        {
          id: "ecommerce_light",
          name: "E-commerce & Retail Store",
          badge: "Physical Goods",
          desc: "Physical goods, bundle packs with Cash on Delivery and courier verification.",
          prompt: "Organic Skin Glow Serum online store with express delivery and cash on delivery",
        },
      ],
    },
    creativesShowcase: {
      badge: "ELITE 2026 DESIGNS",
      title: "Spectacular creative funnels generated in a few clicks",
      subtitle: "Each sales page is engineered to capture buyer attention and maximize conversions.",
      ctaBtn: "Generate This Layout",
      livePreviewBadge: "2026 Live Preview",
      items: [
        {
          id: "momo",
          title: "MomoOpti – Fintech MoMo",
          subtitle: "Real-time fee comparator • MTN / Moov / Wave",
          theme: "Fintech Mint & Obsidian",
          stats: "Average savings: +14.2%",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80",
          color: "#00F5A0",
          prompt: "MomoOpti choose best mobile money provider save fees comparator MTN Moov Wave",
        },
        {
          id: "masterclass",
          title: "The Art of Agentic AI (v0app)",
          subtitle: "Live Masterclass 2026 • 3-hour intensive Zoom training",
          theme: "Midnight Navy & Electric Violet",
          stats: "+3,482 certified attendees",
          imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
          color: "#8B5CF6",
          prompt: "The Art of Agentic AI Live Masterclass 2026 with Standard and VIP passes",
        },
        {
          id: "creator",
          title: "Creator Hub – Monetization",
          subtitle: "All-in-one infopreneur suite • MoMo & Cards",
          theme: "Deep Carbon & Neon Magenta",
          stats: "Conversion multiplier: 3.4x",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
          color: "#EC4899",
          prompt: "Creator Hub all-in-one platform for creators digital products monetization",
        },
        {
          id: "visual_ai",
          title: "Visual AI Studio (Ideogram)",
          subtitle: "AI Creative Studio • 4K Rendering & High Precision Typography",
          theme: "Minimalist Pastel Mesh",
          stats: "Inference latency: 2.8s",
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
          color: "#6366F1",
          prompt: "Visual AI Studio modern high definition AI art generator",
        },
        {
          id: "artisan",
          title: "Emergency Locksmith Service",
          subtitle: "15-min fast response • Direct phone call & WhatsApp",
          theme: "Pro Navy & Safety Orange",
          stats: "Conversion rate: 24.8%",
          imageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1000&auto=format&fit=crop&q=80",
          color: "#EA580C",
          prompt: "Emergency locksmith 15 minute arrival free phone quote",
        },
        {
          id: "serum",
          title: "Anti-Blemish Glow Serum",
          subtitle: "Cash on delivery • Express city courier",
          theme: "Pure Light E-Commerce",
          stats: "+340 orders / week",
          imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&auto=format&fit=crop&q=80",
          color: "#10B981",
          prompt: "Organic glow facial serum express courier cash on delivery",
        },
      ],
    },
    useCases: {
      badge: "TARGET USE CASES",
      title: "A battle-tested solution built for your industry",
      ecommerceTitle: "E-commerce & Direct Sales",
      ecommerceDesc: "Cosmetics, fashion, gadgets, food & beverages. Ultra-fast Cash on Delivery checkout with parcel inspection on arrival.",
      artisanTitle: "Contractors & Emergency Repairs",
      artisanDesc: "Locksmiths, plumbers, electricians, mechanics. Direct tap-to-call button, WhatsApp chat, and designated service areas.",
      infopreneurTitle: "Infopreneurs, Coaches & Diaspora",
      infopreneurDesc: "Online courses, digital coaching, ebooks, live webinars. Video VSL integration with dual MoMo & Card processing.",
      startupsTitle: "Tech Startups & SaaS Products",
      startupsDesc: "Web & mobile apps, comparators, booking funnels, and product launches with sub-800ms loading speeds.",
    },
    pricing: {
      badge: "TRANSPARENT PRICING",
      title: "Start 100% free, pay only when you make money",
      subtitle: "No mandatory monthly fees to get started. Build, launch and sell with total peace of mind.",
      freePlan: {
        title: "Starter Plan",
        price: "$0 / 0 FCFA",
        period: "Free for life to start",
        badge: "Perfect for Beginners",
        desc: "3 complete sales funnels included forever to test and launch your products without fixed costs.",
        features: [
          "3 Complete sales funnels included free for life",
          "Accept Mobile Money (MTN, Wave, Moov, Orange) & Credit Cards",
          "Cash on Delivery (COD) & 1-click WhatsApp checkout",
          "Automated instant payout to your Mobile Money upon each sale",
          "Low 4.5% commission per sale (you only pay when you sell)",
        ],
        cta: "Create My 3 Free Funnels →",
      },
      proPlan: {
        title: "Pro Unlimited Plan",
        price: "10,000 FCFA / $18",
        period: "/ month (or $150 / year)",
        badge: "Recommended for Scaling Sellers",
        desc: "For growing merchants and creators who need more than 3 funnels and want higher margins.",
        features: [
          "Unlimited sales funnels (no limits whatsoever)",
          "Reduced commission of only 2% per sale",
          "Unlimited custom domains (yourstore.com)",
          "Dedicated FedaPay merchant sub-account with instant split",
          "Automated TikTok marketing video generator for your products",
          "24/7 Priority VIP support on WhatsApp",
        ],
        cta: "Upgrade to Tuneliva Pro →",
      },
      faqNoteTitle: "💡 Quotas & Transparency: How does it work?",
      faqNoteBody: "Every user gets 3 free funnel creations for life. There are no mandatory monthly subscriptions: a 4.5% platform fee only applies when a customer successfully pays online. Beyond 3 lifetime funnels or to reduce fees to 2%, you can upgrade to the Pro Unlimited plan at any time in 1 click.",
    },
    testimonials: {
      badge: "TRUSTED BY SELLERS",
      title: "What merchants in Africa and worldwide say about us",
      items: [
        {
          name: "Koffi Mensah",
          role: "E-commerce Merchant (Cotonou & Lomé)",
          text: "Before Tuneliva, my customers dropped off due to complicated multi-step forms. With Cash on Delivery and 1-click WhatsApp, my orders tripled in just 2 weeks.",
          rating: 5,
        },
        {
          name: "Aïssatou Diallo",
          role: "Trainer & Consultant (Paris / Dakar)",
          text: "Selling from Europe into Africa, I needed to accept both international credit cards and local Mobile Money. Tuneliva handles both without any hassle.",
          rating: 5,
        },
        {
          name: "Stéphane Kouamé",
          role: "Master Electrician (Abidjan)",
          text: "In 5 minutes my emergency landing page was live with direct call and WhatsApp buttons. Clients call me straight from their phones.",
          rating: 5,
        },
      ],
    },
    footer: {
      regions: "Tuneliva • Africa • Diaspora • Global Markets",
      copyright: "Tuneliva. All rights reserved. Built for speed, conversions, and financial freedom.",
    },
  },
};
