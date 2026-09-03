import { FunnelSection, FunnelStep, FunnelPageType } from "@/types/page";

export function createDefaultStepSections(
  type: FunnelPageType,
  productName: string,
  stockImage: string,
  city: string = "Cotonou",
  price: number = 22000
): FunnelSection[] {
  const rand = () => Math.random().toString(36).substring(2, 6);

  switch (type) {
    // ==========================================
    // 1. PAGE DE CAPTURE (LEAD MAGNET / OPT-IN)
    // ==========================================
    case "capture":
      return [
        {
          id: `hero-${rand()}`,
          type: "hero",
          badgeText: "🎁 CADEAU EXCLUSIF OFFERT",
          title: `Guide Gratuit : Les 5 Clés Secrètes pour Réussir avec ${productName}`,
          subtitle: `Téléchargez immédiatement votre guide pratique et recevez nos conseils d'experts directement par WhatsApp et par Email.`,
          ctaText: "RECEVOIR MON GUIDE GRATUIT",
          ctaSubtext: "🔒 Vos coordonnées restent 100% confidentielles • Aucun spam",
          imageUrl: stockImage,
          trustPoints: [
            "Accès immédiat par WhatsApp",
            "100% gratuit sans engagement",
            "Déjà plus de 2 500 téléchargements",
          ],
        },
        {
          id: `capture-form-${rand()}`,
          type: "capture_form",
          badgeText: "ACCÈS INSTANTANÉ",
          title: "Où devons-nous vous envoyer votre cadeau ?",
          subtitle: "Remplissez simplement ce court formulaire pour débloquer votre accès :",
          buttonText: "ACCÉDER MAINTENANT",
          collectName: true,
          collectPhone: true,
          collectEmail: true,
        },
        {
          id: `trust-${rand()}`,
          type: "floating_cards",
          cards: [
            {
              id: `c-${rand()}`,
              icon: "timer",
              title: "Réception en 30s",
              description: "Le lien de téléchargement vous est envoyé immédiatement.",
            },
            {
              id: `c-${rand()}`,
              icon: "shield",
              title: "Zéro Spam Garanti",
              description: "Vos données ne seront jamais cédées ni partagées.",
            },
            {
              id: `c-${rand()}`,
              icon: "check",
              title: "Conseils Testés",
              description: "Des méthodes concrètes applicables dès aujourd'hui.",
            },
          ],
        },
      ];

    // ==========================================
    // 2. PAGE DE VENTE (LANDING PAGE / SALES)
    // ==========================================
    case "sales":
      return [
        {
          id: `hero-${rand()}`,
          type: "hero",
          badgeText: "⭐ ARRIVAGE & SÉLECTION OFFICIELLE 2026",
          title: `${productName} – Performance & Qualité Supérieure Réunies`,
          subtitle: `La solution numéro 1 plébiscitée par des centaines de clients à ${city}. Commandez dès maintenant avant la fin de l'offre limitée.`,
          ctaText: "VOIR LES EXEMPLAIRES EN PROMO",
          ctaSubtext: `📦 Livraison express sous 24h à ${city} • Vérification avant paiement`,
          imageUrl: stockImage,
          trustPoints: [
            "Paiement à la livraison",
            "Garantie satisfait ou remboursé 30j",
            "Assistance WhatsApp 7j/7",
          ],
        },
        {
          id: `showcase-${rand()}`,
          type: "product_showcase",
          badgeText: "⭐ NOS EXEMPLAIRES EN PROMO",
          title: "Choisissez votre pack idéal",
          subtitle: `Sélectionnez l'exemplaire adapté à votre besoin avec réduction immédiate à ${city} :`,
          items: [
            {
              id: `p-${rand()}`,
              name: "Pack Découverte (1 Exemplaire)",
              price: price,
              regularPrice: Math.round(price * 1.5),
              badge: "Économique",
              imageUrl: stockImage,
              description: "Idéal pour essayer et tester la qualité supérieure sans risque.",
              features: ["1 Produit officiel", "Garantie 30 jours", "Livraison 24h"],
            },
            {
              id: `p-${rand()}`,
              name: "Pack Duo Privilège (2 Exemplaires)",
              price: Math.round(price * 1.7),
              regularPrice: price * 2,
              badge: "Meilleur Choix",
              imageUrl: stockImage,
              description: "Le choix préféré de 78% de nos clients. Économie maximale !",
              features: ["2 Produits officiels", "Accessoires offerts", "Livraison gratuite"],
            },
          ],
        },
        {
          id: `floating-${rand()}`,
          type: "floating_cards",
          cards: [
            {
              id: `c-${rand()}`,
              icon: "timer",
              title: "Livraison Express 24h",
              description: `Livraison rapide directement à votre adresse à ${city} et ses environs.`,
            },
            {
              id: `c-${rand()}`,
              icon: "check",
              title: "Contrôle à la Réception",
              description: "Vous ouvrez et vérifiez votre colis avant tout paiement au coursier.",
            },
            {
              id: `c-${rand()}`,
              icon: "shield",
              title: "Garantie 30 Jours",
              description: "Remboursement ou échange sans discussion.",
            },
          ],
        },
        {
          id: `steps-${rand()}`,
          type: "steps",
          badgeText: "PROCESSUS SIMPLE",
          title: "Comment se déroule la commande ?",
          subtitle: "3 étapes simples pour recevoir votre colis en toute tranquillité :",
          items: [
            {
              id: `st-${rand()}`,
              stepNumber: 1,
              title: "Choisissez votre pack",
              description: "Sélectionnez votre offre préférée en un clic.",
            },
            {
              id: `st-${rand()}`,
              stepNumber: 2,
              title: "Confirmation Rapide",
              description: "Notre équipe vous appelle pour convenir du lieu de livraison.",
            },
            {
              id: `st-${rand()}`,
              stepNumber: 3,
              title: "Réception & Règlement",
              description: "Vous contrôlez le produit et payez le coursier en espèces.",
            },
          ],
        },
      ];

    // ==========================================
    // 3. PAGE DE COMMANDE / CHECKOUT DIRECT
    // ==========================================
    case "checkout":
      return [
        {
          id: `order-hero-${rand()}`,
          type: "hero",
          badgeText: "🔐 COMMANDE SÉCURISÉE & CONFIRMÉE",
          title: `Finalisez votre commande de ${productName}`,
          subtitle: `Remplissez vos informations de livraison ci-dessous. Aucun prépaiement obligatoire : vous ne payez qu'après vérification du colis !`,
          ctaText: "PASSER DIRECTEMENT AU FORMULAIRE",
          imageUrl: stockImage,
          trustPoints: [
            "Paiement à la livraison",
            "Expédition sous 24h",
            "Colis discret et soigné",
          ],
        },
        {
          id: `pricing-${rand()}`,
          type: "pricing",
          badgeText: "OFFRE PROMOTIONNELLE",
          title: "Votre Récapitulatif de Commande",
          subtitle: "Profitez du tarif spécial garanti avant épuisement du stock :",
          offer: {
            id: `offer-${rand()}`,
            name: `${productName} – Pack Édition 2026`,
            salePrice: price,
            regularPrice: Math.round(price * 1.5),
            currency: "XOF",
            features: [
              "Produit 100% authentique",
              "Assistance WhatsApp dédiée",
              "Garantie 30 jours satisfait ou remboursé",
            ],
            stockLeft: 4,
          },
          guaranteeText: "Garantie 30 jours satisfait ou remboursé sans justificatif",
        },
        {
          id: `order-form-${rand()}`,
          type: "order_form",
          title: "Où devons-nous vous livrer ?",
          subtitle: "Complétez votre adresse pour recevoir votre colis en main propre :",
          whatsappEnabled: true,
          whatsappNumber: "+22997000000",
          codEnabled: true,
          onlinePaymentEnabled: true,
          cities: [city, "Calavi", "Porto-Novo", "Autre ville"],
        },
      ];

    // ==========================================
    // 4. PAGE DE CONFIRMATION / REMERCIEMENT
    // ==========================================
    case "confirmation":
    case "thank_you":
      return [
        {
          id: `thank-${rand()}`,
          type: "thank_you",
          title: "Félicitations ! Votre commande est validée 🎉",
          subtitle: `Merci pour votre confiance. Notre équipe logistique prépare déjà l'expédition de votre ${productName}.`,
          instructions: [
            "Notre coursier va vous appeler dans les prochaines heures pour convenir de l'heure exacte de livraison.",
            "Gardez votre téléphone à portée de main.",
            "Vous pourrez ouvrir et contrôler votre colis avant de remettre le montant au livreur.",
          ],
          whatsappSupportNumber: "+22997000000",
          nextActionText: "Contacter notre Service Client sur WhatsApp",
          nextActionUrl: "https://wa.me/22997000000",
        },
        {
          id: `floating-${rand()}`,
          type: "floating_cards",
          cards: [
            {
              id: `c-${rand()}`,
              icon: "timer",
              title: "Livraison sous 24h",
              description: `Nos coursiers sillonnent ${city} pour vous livrer au plus vite.`,
            },
            {
              id: `c-${rand()}`,
              icon: "check",
              title: "Vérification Gratuite",
              description: "Inspectez l'article avant tout paiement.",
            },
            {
              id: `c-${rand()}`,
              icon: "shield",
              title: "Support 7j/7",
              description: "Notre équipe reste joignable à tout moment.",
            },
          ],
        },
      ];

    default:
      return [];
  }
}

export function buildCompleteMultiPageFunnel(
  projectName: string,
  stockImage: string,
  city: string = "Cotonou",
  price: number = 22000
): FunnelStep[] {
  return [
    {
      id: "step-1-capture",
      name: "1. 🧲 Page de Capture",
      slug: "capture",
      pageType: "capture",
      sections: createDefaultStepSections("capture", projectName, stockImage, city, price),
      nextStepSlug: "offre",
    },
    {
      id: "step-2-sales",
      name: "2. 🚀 Page de Vente",
      slug: "offre",
      pageType: "sales",
      sections: createDefaultStepSections("sales", projectName, stockImage, city, price),
      nextStepSlug: "commande",
    },
    {
      id: "step-3-checkout",
      name: "3. 🛒 Commande & Checkout",
      slug: "commande",
      pageType: "checkout",
      sections: createDefaultStepSections("checkout", projectName, stockImage, city, price),
      nextStepSlug: "merci",
    },
    {
      id: "step-4-thankyou",
      name: "4. 🎉 Confirmation & Merci",
      slug: "merci",
      pageType: "thank_you",
      sections: createDefaultStepSections("thank_you", projectName, stockImage, city, price),
    },
  ];
}
