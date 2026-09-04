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

  // 1. TENTATIVE GROQ AVEC MODÈLES ULTRA-RAPIDES & VALIDÉS (openai/gpt-oss-120b & qwen/qwen3.8-27b)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groqModels = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];
    for (const model of groqModels) {
      try {
        const systemPrompt = `Tu es un directeur marketing élite et copywriter d'exception pour le e-commerce en Afrique francophone.
À partir du prompt de l'utilisateur, tu dois rédiger un texte de vente ultra-accrocheur et crédible.
RÉPONDS STRICTEMENT AVEC UN OBJET JSON (aucun texte autour) avec les clés :
{
  "productName": "Nom commercial percutant du produit",
  "headline": "Titre Hero ultra vendeur (évite le prompt brut, formule une promesse forte)",
  "subtitle": "Sous-titre persuasif détaillant le bénéfice majeur",
  "badgeText": "⭐ ARRIVAGE OFFICIEL 2026 – Stock limité",
  "trustPoints": ["Bénéfice concret 1", "Bénéfice concret 2", "Garantie ou livraison rapide"],
  "packs": [
    { "name": "Pack Découverte (1 Exemplaire)", "multiplier": 1, "badge": "Économique", "description": "Idéal pour essayer la qualité" },
    { "name": "Pack Duo Privilège (2 Exemplaires)", "multiplier": 1.7, "badge": "Meilleur Choix", "description": "Le choix préféré de nos clients" }
  ],
  "faq": [
    { "question": "Comment se déroule la livraison ?", "answer": "Livraison en 24h avec contrôle du colis avant tout paiement." },
    { "question": "Le produit est-il garanti ?", "answer": "Oui, 100% authentique avec garantie satisfait ou remboursé 30 jours." }
  ],
  "reviews": [
    { "author": "Amina K.", "city": "Cotonou", "comment": "Produit exceptionnel, livraison rapide et soignée !" },
    { "author": "Koffi M.", "city": "Lomé", "comment": "Conforme à la description, très satisfait de mon achat." }
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
  } else {
    // SALES (Landing page complète haute conversion)
    sections = [
      // 1. HERO SECTION AVEC UN VRAI TITRE VENDEUR (PAS LE TEXTE DU PROMPT)
      {
        id: "hero-1",
        type: "hero",
        badgeText: badgeText,
        title: headline,
        subtitle: subtitle,
        ctaText: "COMMANDER MAINTENANT",
        ctaSubtext: `📦 Livraison express sous 24h à ${city} • Vérification avant paiement`,
        secondaryCtaText: "WhatsApp",
        imageUrl: stockImage,
        trustPoints: trustPoints,
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
        items: showcaseItems,
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
        badgeText: "SIMPLE & SÉCURISÉ",
        title: "Comment commander ?",
        subtitle: "3 étapes rapides pour recevoir votre colis chez vous :",
        items: [
          {
            id: "s-1",
            stepNumber: 1,
            title: "Remplissez le formulaire",
            description: "Indiquez votre nom, numéro WhatsApp et lieu de livraison.",
          },
          {
            id: "s-2",
            stepNumber: 2,
            title: "Confirmation d'Expédition",
            description: "Notre livreur vous contacte rapidement pour planifier l'heure de passage.",
          },
          {
            id: "s-3",
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
        zoneText: `${city}, communes et environs immédiats`,
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
        items: reviewsItems,
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
        cities: [city, "Communes et environs", "Autre ville"],
      },

      // 9. FAQ ACCORDÉON
      {
        id: "faq-1",
        type: "faq",
        badgeText: "❓ FAQ",
        title: "Questions Fréquentes",
        subtitle: "Toutes les réponses à vos questions en toute transparence :",
        items: faqItems,
      },
    ];
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
    sections,
  };
}
