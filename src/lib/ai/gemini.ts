// ==============================================================================
// 🚀 TUNELIVA - MOTEUR D'IA GÉNÉRATIVE DE PAGES (Google Gemini Flash)
// ==============================================================================
import { GoogleGenAI } from "@google/genai";
import { FunnelPageData, CurrencyCode } from "@/types/page";

const SYSTEM_PROMPT = `
Tu es l'IA experte en copywriting et conception de tunnels de vente de Tuneliva, une plateforme SaaS de classe mondiale inspirée des meilleurs standards de conversion de 2026.
Tu crées des pages de vente ultra-performantes, adaptées au marché africain (Bénin, Côte d'Ivoire, Sénégal, Cameroun, Nigéria, etc.) et à l'international.

Ton style de copywriting :
- Titres percutants, orientés bénéfices et élimination de la douleur.
- Ton direct, chaleureux, rassurant et crédible.
- Arguments concrets : rapidité de livraison, garantie satisfait ou remboursé, paiement à la livraison ou par Mobile Money.
- Aucune tournure de phrase "traduction Google" ou marketing américain agressif des années 2010. Du français moderne, fluide et efficace.

Tu dois impérativement répondre UNIQUEMENT par un objet JSON valide conforme à l'interface FunnelPageData TypeScript. Aucun texte avant ou après le JSON.
`;

export async function generateFunnelPage(
  prompt: string,
  userCurrency: CurrencyCode = "XOF"
): Promise<FunnelPageData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nGénère la structure JSON complète du tunnel pour ce produit/service : "${prompt}". La devise principale est ${userCurrency}. Assure-toi que les prix soient des nombres entiers cohérents (ex: 15000 ou 25000 pour FCFA).`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text?.trim() || "";
      if (responseText) {
        const parsedData = JSON.parse(responseText) as FunnelPageData;
        return parsedData;
      }
    } catch (error) {
      console.warn("Erreur API Gemini (ou clé invalide), bascule vers le template contextuel enrichi:", error);
    }
  }

  // Fallback contextuel ultra-qualitatif (si pas encore de clé API renseignée)
  return getSmartFallbackFunnel(prompt, userCurrency);
}

// Fallback dynamique intelligent analysant les mots-clés du prompt
function getSmartFallbackFunnel(prompt: string, currency: CurrencyCode): FunnelPageData {
  const lower = prompt.toLowerCase();

  // Détection de catégorie
  let isFashionOrGadget = lower.includes("montre") || lower.includes("chaussure") || lower.includes("sac") || lower.includes("basket") || lower.includes("téléphone") || lower.includes("écouteur");
  let isBeauty = lower.includes("crème") || lower.includes("sérum") || lower.includes("visage") || lower.includes("peau") || lower.includes("savon") || lower.includes("bio");
  let isCourse = lower.includes("formation") || lower.includes("cours") || lower.includes("livre") || lower.includes("ebook") || lower.includes("coaching");

  let defaultName = "Produit Exclusif";
  let defaultPrice = currency === "EUR" ? 39 : currency === "USD" ? 45 : 22000;
  let regularPrice = currency === "EUR" ? 69 : currency === "USD" ? 75 : 35000;
  let imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"; // Montre / Tech

  if (isBeauty) {
    defaultName = "Sérum Éclat & Jeunesse Bio";
    imageUrl = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80";
  } else if (isFashionOrGadget) {
    defaultName = "Montre Chrono Sport Connectée";
    imageUrl = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80";
  } else if (isCourse) {
    defaultName = "Programme Accélération Vente & E-commerce";
    imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80";
  } else if (prompt.length > 5) {
    defaultName = prompt.slice(0, 40);
  }

  return {
    projectName: defaultName,
    slug: "offre-exclusive",
    pageType: "sales",
    metaTitle: `${defaultName} | Édition Limitée & Livraison Rapide`,
    metaDescription: `Découvrez ${defaultName}. Commandez aujourd'hui avec paiement à la livraison ou Mobile Money sécurisé.`,
    branding: {
      businessName: defaultName,
      tagline: "Excellence & Authenticité Garanties",
      whatsappNumber: "+22997000000",
      address: { city: "Cotonou", country: "Bénin" },
    },
    theme: {
      preset: "saas_indigo",
      primaryColor: "#6366F1",
      accentColor: "#10B981",
      pageBackground: "#07080D",
      cardBackground: "#10131E",
      cardBorderColor: "rgba(99, 102, 241, 0.20)",
      textColor: "#F8FAFC",
      textMutedColor: "#94A3B8",
      fontFamily: "Plus Jakarta Sans",
      isDarkTheme: true,
      bannerUrgencyText: "🔥 OFFRE PROMOTIONNELLE : -40% DE RÉDUCTION JUSQU'À CE SOIR SEULEMENT !",
    },
    sections: [
      {
        id: "hero-1",
        type: "hero",
        badgeText: "⭐ NOUVELLE COLLECTION 2026",
        title: `Révélez votre style et gagnez en efficacité avec ${defaultName}`,
        subtitle: "Conçu pour ceux qui exigent la meilleure qualité sans compromis. Déjà adopté par plus de 1 200 clients satisfaits.",
        ctaText: "COMMANDER MAINTENANT (PAIEMENT À LA LIVRAISON)",
        ctaSubtext: "📦 Expédition express 24h/48h • Garantie 100% Satisfait ou Remboursé",
        imageUrl,
        trustPoints: [
          "Paiement à la livraison disponible",
          "Livraison rapide et soignée",
          "Service client WhatsApp 7j/7",
        ],
      },
      {
        id: "pain-1",
        type: "pain_points",
        badgeText: "🛑 EN AVEZ-VOUS ASSEZ ?",
        title: "Pourquoi continuer à perdre votre temps et votre argent ?",
        subtitle: "La plupart des alternatives sur le marché déçoivent rapidement. Voici ce que vous vivez au quotidien :",
        items: [
          {
            id: "p-1",
            title: "Des produits fragiles qui tombent en panne après 2 semaines",
            description: "Vous payez cher pour des imitations de mauvaise qualité sans aucune garantie réelle ni service après-vente.",
          },
          {
            id: "p-2",
            title: "Des délais de livraison interminables et non respectés",
            description: "Vous attendez des semaines entières sans savoir où se trouve votre colis ou s'il arrivera en bon état.",
          },
          {
            id: "p-3",
            title: "Le manque total de suivi et d'assistance client",
            description: "Une fois l'argent payé, les vendeurs deviennent injoignables en cas de question ou de souci.",
          },
        ],
      },
      {
        id: "feat-1",
        type: "features",
        badgeText: "💎 LA SOLUTION SUPÉRIEURE",
        title: "Tout ce dont vous avez toujours rêvé, réuni en un seul produit",
        subtitle: "Chaque détail a été pensé pour vous offrir une expérience d'utilisation fluide, durable et élégante.",
        items: [
          {
            id: "f-1",
            title: "Qualité de Fabrication Premium",
            description: "Matériaux haut de gamme résistants aux chocs, à l'eau et à l'usure du quotidien.",
          },
          {
            id: "f-2",
            title: "Autonomie & Performance Record",
            description: "Profitez d'une efficacité maximale sans interruption grâce à notre technologie de pointe.",
          },
          {
            id: "f-3",
            title: "Garantie Totale 30 Jours",
            description: "Si vous n'êtes pas bluffé à 100% lors de la réception, nous vous remboursons sans poser de questions.",
          },
        ],
      },
      {
        id: "reviews-1",
        type: "social_proof",
        badgeText: "💬 AVIS VÉRIFIÉS",
        title: "Ce que nos clients disent de nous",
        ratingAverage: 4.9,
        totalReviewsText: "4.9/5 basé sur 384 avis clients",
        items: [
          {
            id: "r-1",
            authorName: "Koffi A.",
            authorLocation: "Cotonou, Bénin",
            rating: 5,
            comment: "Commandé hier matin, reçu aujourd'hui à 14h devant mon bureau. La qualité est encore plus belle en vrai que sur les photos. Je recommande !",
          },
          {
            id: "r-2",
            authorName: "Aminata D.",
            authorLocation: "Abidjan, Côte d'Ivoire",
            rating: 5,
            comment: "J'avais peur au début mais j'ai choisi le paiement à la livraison. Le livreur était très courtois. Produit conforme et service au top.",
          },
          {
            id: "r-3",
            authorName: "Mamadou S.",
            authorLocation: "Dakar, Sénégal",
            rating: 5,
            comment: "Franchement le rapport qualité-prix est imbattable. J'en ai repris un deuxième pour offrir à mon frère.",
          },
        ],
      },
      {
        id: "pricing-1",
        type: "pricing",
        badgeText: "🏷️ PRIX EXCEPTIONNEL",
        title: "Profitez du tarif promo avant rupture de stock",
        subtitle: "Cette offre spéciale est valable dans la limite des 15 pièces restantes disponibles en stock.",
        guaranteeText: "🛡️ Garantie de remboursement intégrale de 30 jours sans risque",
        offer: {
          id: "offer-1",
          name: "Pack Complet Édition Limitée",
          isPopular: true,
          regularPrice,
          salePrice: defaultPrice,
          currency,
          features: [
            `${defaultName} Certifié Original`,
            "Boîte de protection et accessoires inclus",
            "Guide d'utilisation en français",
            "Livraison sécurisée avec suivi WhatsApp",
            "Garantie remplacement immédiat en cas de défaut",
          ],
          stockLeft: 14,
        },
      },
      {
        id: "order-1",
        type: "order_form",
        title: "Remplissez ce formulaire pour commander",
        subtitle: "Vous ne payez RIEN maintenant si vous choisissez le paiement à la livraison !",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: true,
        onlinePaymentEnabled: true,
        cities: ["Cotonou", "Abomey-Calavi", "Porto-Novo", "Abidjan", "Dakar", "Lomé", "Douala", "Autre"],
      },
      {
        id: "faq-1",
        type: "faq",
        badgeText: "❓ VOS QUESTIONS",
        title: "Foire Aux Questions",
        subtitle: "Tout ce que vous devez savoir avant de passer commande en toute tranquillité :",
        items: [
          {
            id: "q-1",
            question: "Quand et comment vais-je recevoir mon colis ?",
            answer: "Les commandes sont expédiées sous 24h. Notre service de livraison vous contacte par téléphone ou WhatsApp avant de passer pour convenir du lieu et de l'heure exacte.",
          },
          {
            id: "q-2",
            question: "Comment puis-je payer ?",
            answer: "Vous avez le choix : soit vous payez en espèces au livreur lors de la remise du colis (Paiement à la livraison), soit vous réglez directement par Mobile Money (MTN, Moov, Orange, Wave) ou Carte Bancaire.",
          },
          {
            id: "q-3",
            question: "Et si le produit ne me convient pas ?",
            answer: "Vous bénéficiez d'une garantie satisfait ou remboursé de 30 jours. Contactez simplement notre support WhatsApp pour un échange ou un remboursement immédiat.",
          },
        ],
      },
    ],
  };
}
