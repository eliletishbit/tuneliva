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
  } else {
    // SALES (Landing page complète haute conversion)
    sections = [
      // 1. HERO SECTION AVEC UN VRAI TITRE VENDEUR
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

      // 2. SUPER BLOC SPLIT (IMAGE GAUCHE / ARGUMENTS DROITE)
      {
        id: "split-1",
        type: "split_showcase",
        layoutDirection: "image_left",
        badgeText: "⭐ CONCEPTION SUPÉRIEURE",
        title: `Pourquoi ${productName} fait toute la différence`,
        subtitle: "Une fabrication soignée qui allie durabilité, confort et performance pour votre quotidien :",
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

      // 3. CARTES FLOTTANTES DE CONFIANCE
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
            description: "30 jours de garantie satisfait ou remboursé sans discussion.",
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

      // 5. SLIDER INTERACTIF DE TÉMOIGNAGES
      {
        id: "slider-1",
        type: "interactive_slider",
        badgeText: "💬 AVIS CLIENTS 5 ÉTOILES",
        title: "Ce que nos clients racontent",
        subtitle: "Découvrez les retours d'expérience de personnes qui ont déjà sauté le pas :",
        sliderType: "testimonials",
        items: reviewsItems.map((r: any, i: number) => ({
          id: `sl-${i + 1}`,
          title: r.authorName,
          subtitle: `${r.authorLocation} • Achat Vérifié`,
          description: r.comment,
          rating: 5,
          tag: "Client Vérifié",
          imageUrl: r.authorName.includes("Amina")
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
            : r.authorName.includes("Marc")
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
        })),
      },

      // 6. COMMENT ÇA MARCHE ?
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

      // 7. GRILLE BENTO MODERNE
      {
        id: "bento-1",
        type: "bento_grid",
        badgeText: "🏆 EXCELLENCE TUNELIVA",
        title: "La sérénité totale à chaque commande",
        subtitle: "Un service pensé pour vous apporter une sécurité maximale :",
        cards: [
          {
            id: "bc-1",
            colSpan: "col-span-2",
            tag: "CONTRÔLE TOTAL",
            metric: "0 Avance",
            title: "Paiement 100% à la Livraison",
            description: `Vous ne réglez rien en ligne si vous préférez ! Vous ouvrez et inspectez votre colis devant le livreur à ${city} avant de régler.`,
            imageUrl: stockImage,
          },
          {
            id: "bc-2",
            colSpan: "col-span-1",
            tag: "RAPIDITÉ",
            metric: "24h",
            title: "Expédition Express",
            description: "Notre livreur vous contacte rapidement pour convenir de l'horaire idéal.",
          },
          {
            id: "bc-3",
            colSpan: "col-span-1",
            tag: "CONFIANCE",
            metric: "30 Jours",
            title: "Garantie Satisfait ou Remboursé",
            description: "Un souci ou une question ? Notre service client vous échange ou vous rembourse sans tracas.",
          },
          {
            id: "bc-4",
            colSpan: "col-span-2",
            tag: "ASSISTANCE 7J/7",
            metric: "< 15 min",
            title: "Support WhatsApp Réactif",
            description: "Des conseillers dévoués pour vous répondre en direct à la moindre question.",
          },
        ],
      },

      // 8. ZONE DE LIVRAISON / COUVERTURE
      {
        id: "area-1",
        type: "service_area",
        title: "Notre zone de livraison & d'intervention",
        subtitle: "Zone de couverture garantie avec expédition suivie",
        zoneText: `${city}, communes et environs immédiats`,
        mapImageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80",
      },

      // 9. FORMULAIRE DE COMMANDE DIRECTE COD
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

      // 10. FAQ ACCORDÉON
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
