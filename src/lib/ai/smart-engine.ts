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
  if (p.includes("formation") || p.includes("cours") || p.includes("business") || p.includes("ebook") || p.includes("coaching") || p.includes("tiktok") || p.includes("academie")) {
    return CURATED_STOCK_IMAGES.coaching_education[Math.floor(Math.random() * CURATED_STOCK_IMAGES.coaching_education.length)];
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
  if (p.includes("momo") || p.includes("transfert") || p.includes("finance") || p.includes("crypto") || p.includes("banque")) {
    return "fintech_mint";
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

  // 1. TENTATIVE OPENROUTER
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://tuneliva.app",
          "X-Title": "Tuneliva AI Funnel Builder",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "system",
              content: `Tu es un directeur marketing élite. Tu génères un tunnel de vente JSON d'exception. Rédige un titre de Hero épique et percutant (pas le texte brut du prompt). Réponds UNIQUEMENT par le JSON brut.`,
            },
            {
              role: "user",
              content: `Génère le tunnel complet pour ce prompt : "${prompt}". Devise : ${currency}. Crée un titre ultra vendeur.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content?.trim() || "";
        const cleanJson = extractJsonFromString(content);
        if (cleanJson?.sections?.length) {
          const hero = cleanJson.sections.find((s: any) => s.type === "hero");
          if (hero) hero.imageUrl = hero.imageUrl || stockImage;
          cleanJson.theme = { preset: detectedPreset, ...presetConfig };
          return cleanJson;
        }
      }
    } catch (e) {
      console.warn("OpenRouter fallback:", e);
    }
  }

  // 2. TENTATIVE GROQ
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Tu es un expert copywriting. Génère un JSON brut de tunnel de vente avec un titre accrocheur professionnel.",
            },
            { role: "user", content: `Prompt : "${prompt}". Devise : ${currency}.` },
          ],
          temperature: 0.6,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content?.trim() || "";
        const cleanJson = extractJsonFromString(content);
        if (cleanJson?.sections?.length) {
          const hero = cleanJson.sections.find((s: any) => s.type === "hero");
          if (hero) hero.imageUrl = hero.imageUrl || stockImage;
          cleanJson.theme = { preset: detectedPreset, ...presetConfig };
          return cleanJson;
        }
      }
    } catch (e) {
      console.warn("Groq fallback:", e);
    }
  }

  // 3. GÉNÉRATEUR LOCAL HAUTE PERFORMANCE AVEC COPYWRITING PUNCHY
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
  preset: DesignPreset
): FunnelPageData {
  const p = prompt.trim();

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

  const { productName, headline, subtitle } = extractCleanProductAndHeadline(p);
  const presetConfig = DESIGN_PRESETS[preset].theme;

  return {
    projectName: productName,
    slug: "offre-speciale",
    pageType,
    metaTitle: `${productName} | Édition Officielle 2026`,
    metaDescription: `${headline}. Livraison express à ${city} et paiement sécurisé à la livraison.`,
    branding: {
      businessName: productName,
      tagline: "Qualité Certifiée & Service d'Excellence",
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
    theme: {
      preset,
      ...presetConfig,
    },
    sections: [
      // 1. HERO SECTION AVEC UN VRAI TITRE VENDEUR (PAS LE TEXTE DU PROMPT)
      {
        id: "hero-1",
        type: "hero",
        badgeText: "⭐ ARRIVAGE & SÉLECTION OFFICIELLE 2026",
        title: headline,
        subtitle: subtitle,
        ctaText: "COMMANDER MAINTENANT",
        ctaSubtext: `📦 Livraison express sous 24h à ${city} • Vérification avant paiement`,
        secondaryCtaText: "WhatsApp",
        imageUrl: stockImage,
        trustPoints: [
          "Paiement 100% à la livraison",
          "Garantie satisfait ou remboursé 30j",
          "Assistance WhatsApp 7j/7",
        ],
      },

      // 2. CARTES FLOTTANTES DE CONFIANCE
      {
        id: "floating-1",
        type: "floating_cards",
        cards: [
          {
            id: "c-1",
            icon: "timer",
            title: "Livraison Express 24h",
            description: `Nous vous livrons rapidement où que vous soyez à ${city} et ses environs.`,
          },
          {
            id: "c-2",
            icon: "check",
            title: "Contrôle à la Réception",
            description: "Vous ouvrez et inspectez votre colis avant de régler au coursier.",
          },
          {
            id: "c-3",
            icon: "shield",
            title: "Produit 100% Garanti",
            description: "Matériaux certifiés conformes avec garantie d'échange sans discussion.",
          },
        ],
      },

      // 3. SHOWCASE EXEMPLAIRES / PACKS
      {
        id: "showcase-1",
        type: "product_showcase",
        badgeText: "⭐ NOS OFFRES EN VEDETTE",
        title: "Sélectionnez votre formule idéale",
        subtitle: `Choisissez l'exemplaire adapté à votre besoin avec réduction immédiate à ${city} :`,
        items: [
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
        ],
      },

      // 4. STATISTIQUES SOCIALES
      {
        id: "stats-1",
        type: "stats",
        badgeText: "IMPACT RÉEL",
        items: [
          { id: "st-1", value: "1 400+", label: "Clients livrés" },
          { id: "st-2", value: "98.7%", label: "Satisfaction client" },
          { id: "st-3", value: "24h", label: "Délai moyen d'expédition" },
        ],
      },

      // 5. COMMENT ÇA MARCHE ?
      {
        id: "steps-1",
        type: "steps",
        badgeText: "PROCESSUS SIMPLE",
        title: "Comment ça marche ?",
        subtitle: "3 étapes rapides pour recevoir votre colis en toute sérénité :",
        items: [
          {
            id: "step-1",
            stepNumber: 1,
            title: "Commande ou WhatsApp",
            description: "Remplissez le formulaire en 30 secondes ou cliquez pour échanger sur WhatsApp.",
          },
          {
            id: "step-2",
            stepNumber: 2,
            title: "Confirmation & Expédition",
            description: "Notre équipe vous appelle pour valider le lieu et l'heure exacte de livraison.",
          },
          {
            id: "step-3",
            stepNumber: 3,
            title: "Contrôle & Règlement en Espèces",
            description: "Vous recevez votre produit, vous vérifiez et vous payez en toute sécurité.",
          },
        ],
      },

      // 6. ZONE DE LIVRAISON / COUVERTURE
      {
        id: "area-1",
        type: "service_area",
        title: "Notre zone de livraison & d'intervention",
        subtitle: "Zone de couverture garantie avec expédition suivie",
        zoneText: `${city}, Calavi, Porto-Novo et communes environnantes`,
        mapImageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80",
      },

      // 7. AVIS CLIENTS
      {
        id: "reviews-1",
        type: "social_proof",
        badgeText: "💬 TÉMOIGNAGES VÉRIFIÉS",
        title: "Ce que disent nos clients",
        ratingAverage: 5,
        totalReviewsText: "5/5 étoiles sur plus de 320 avis",
        items: [
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
        ],
      },

      // 8. FORMULAIRE DE COMMANDE DIRECTE COD
      {
        id: "order-1",
        type: "order_form",
        title: "Formulaire de Commande Express",
        subtitle: "Remplissez ce formulaire court pour recevoir votre colis sous 24h :",
        whatsappEnabled: true,
        whatsappNumber: "+22997000000",
        codEnabled: true,
        onlinePaymentEnabled: true,
        cities: [city, "Calavi", "Porto-Novo", "Autre"],
      },

      // 9. FAQ ACCORDÉON
      {
        id: "faq-1",
        type: "faq",
        badgeText: "❓ FAQ",
        title: "Questions Fréquentes",
        subtitle: "Toutes les réponses à vos questions en toute transparence :",
        items: [
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
        ],
      },
    ],
  };
}
