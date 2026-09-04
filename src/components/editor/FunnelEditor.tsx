"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  FunnelPageData,
  PricingSection,
  OrderFormConfig,
  HeroSection,
  FloatingTrustCardsSection,
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
  FunnelStep,
  FunnelPageType,
  ProductVariant,
} from "@/types/page";
import { DESIGN_PRESETS } from "@/lib/design/presets";
import { createDefaultStepSections } from "@/lib/templates/funnel-steps";
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
  Upload,
  Package,
  Award,
  Video,
  MapPin,
  Layers,
  GripVertical,
  PackageCheck,
  ExternalLink,
  MessageCircle,
  Edit3,
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

interface PremiumWidgetDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: string;
  create: (randId: string, city: string) => FunnelSection;
}

const PREMIUM_WIDGETS: PremiumWidgetDef[] = [
  {
    id: "hero_sales",
    name: "Hero Vente Haute Conversion",
    icon: "🚀",
    desc: "Titre impact, sous-titre, image mockup & 2 boutons d'action symétriques",
    category: "Hero",
    create: (randId: string, city: string) => ({
      id: `hero-${randId}`,
      type: "hero",
      badgeText: "⭐ ARRIVAGE & SÉLECTION OFFICIELLE 2026",
      title: "L'Excellence et la Qualité Supérieure Réunies",
      subtitle: `La solution numéro 1 plébiscitée par des centaines de clients à ${city}. Commandez dès maintenant avant la fin de l'offre limitée.`,
      ctaText: "COMMANDER MAINTENANT",
      ctaSubtext: `📦 Livraison express 24h à ${city} • Vérification avant paiement`,
      secondaryCtaText: "WhatsApp",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      trustPoints: [
        "Paiement à la livraison après contrôle",
        "Garantie satisfait ou remboursé 30j",
        "Assistance WhatsApp 7j/7",
      ],
    }),
  },
  {
    id: "hero_capture",
    name: "Hero Capture & Lead Magnet",
    icon: "🧲",
    desc: "Formule cadeau offert avec promesse d'un guide gratuit",
    category: "Hero",
    create: (randId: string, city: string) => ({
      id: `hero-${randId}`,
      type: "hero",
      badgeText: "🎁 CADEAU EXCLUSIF OFFERT",
      title: "Recevez Votre Guide Gratuit en 30 Secondes",
      subtitle: `Accédez immédiatement aux conseils d'experts directement par WhatsApp et par Email à ${city}.`,
      ctaText: "RECEVOIR MON ACCÈS GRATUIT",
      ctaSubtext: "🔒 Confidentialité garantie • Aucun spam",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
      trustPoints: ["Accès direct par WhatsApp", "100% gratuit sans engagement", "Rejoint par +2 500 personnes"],
    }),
  },
  {
    id: "showcase_3packs",
    name: "Grille E-commerce 3 Packs",
    icon: "📦",
    desc: "3 colonnes de packs (Découverte, Duo Privilège, Trio VIP) avec prix remisés",
    category: "Produits",
    create: (randId: string, city: string) => ({
      id: `showcase-${randId}`,
      type: "product_showcase",
      badgeText: "⭐ OFFRES EN PROMOTION",
      title: "Choisissez Votre Formule Idéale",
      subtitle: `Bénéficiez de réductions dégressives avec livraison rapide à ${city} :`,
      items: [
        {
          id: `p-${randId}-1`,
          name: "Pack Découverte (1 Exemplaire)",
          price: 19000,
          regularPrice: 28000,
          badge: "Économique",
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
          description: "Parfait pour essayer et tester la qualité supérieure sans risque.",
          features: ["1 Produit certifié", "Garantie 30 jours", "Livraison 24h"],
        },
        {
          id: `p-${randId}-2`,
          name: "Pack Duo Privilège (2 Exemplaires)",
          price: 32000,
          regularPrice: 56000,
          badge: "🔥 Meilleur Choix",
          imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
          description: "Le choix préféré de 78% de nos clients. Économie maximale !",
          features: ["2 Produits certifiés", "Cadeau offert", "Livraison gratuite express"],
        },
        {
          id: `p-${randId}-3`,
          name: "Pack Famille VIP (3 Exemplaires)",
          price: 44000,
          regularPrice: 84000,
          badge: "💎 Pack VIP",
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
          description: "Offrez-en à vos proches et réalisez une économie spectaculaire !",
          features: ["3 Produits certifiés", "2 Accessoires offerts", "Support WhatsApp VIP"],
        },
      ],
    }),
  },
  {
    id: "social_proof_3cards",
    name: "Trio Avis Clients Étoilés (3 Colonnes)",
    icon: "💬",
    desc: "3 colonnes de témoignages avec avis vérifiés, 5 étoiles et avatars",
    category: "Preuve Sociale",
    create: (randId: string, city: string) => ({
      id: `review-${randId}`,
      type: "social_proof",
      badgeText: "💬 TÉMOIGNAGES VÉRIFIÉS",
      title: "Ce que disent nos clients",
      ratingAverage: 5,
      totalReviewsText: "5/5 étoiles sur plus de 350 avis vérifiés",
      items: [
        {
          id: `r-${randId}-1`,
          authorName: "Amina Kouamé",
          authorLocation: `${city}`,
          rating: 5,
          comment: "Commandé hier à 14h, reçu ce matin à 10h. Le produit est magnifique et conforme aux photos !",
        },
        {
          id: `r-${randId}-2`,
          authorName: "Marc Dossou",
          authorLocation: `${city}`,
          rating: 5,
          comment: "J'ai apprécié de pouvoir vérifier l'article avant de donner l'argent au livreur. Très sérieux !",
        },
        {
          id: `r-${randId}-3`,
          authorName: "Fatou Sylla",
          authorLocation: `${city}`,
          rating: 5,
          comment: "Service client WhatsApp très réactif et colis soigné. Je commanderai à nouveau sans hésiter.",
        },
      ],
    }),
  },
  {
    id: "floating_cards_trust",
    name: "Trio de Confiance & Réassurance",
    icon: "🛡️",
    desc: "3 cartes flottantes : Livraison 24h, Contrôle avant paiement, Garantie satisfait",
    category: "Confiance",
    create: (randId: string, city: string) => ({
      id: `floating-${randId}`,
      type: "floating_cards",
      cards: [
        {
          id: `c-${randId}-1`,
          icon: "timer",
          title: "Livraison Express 24h",
          description: `Nos coursiers vous livrent rapidement à votre domicile ou bureau à ${city}.`,
        },
        {
          id: `c-${randId}-2`,
          icon: "check",
          title: "Contrôle à la Réception",
          description: "Vous ouvrez et inspectez votre colis avant de régler le livreur.",
        },
        {
          id: `c-${randId}-3`,
          icon: "shield",
          title: "Garantie 30 Jours",
          description: "Satisfait ou remboursé sans aucune discussion en cas de moindre souci.",
        },
      ],
    }),
  },
  {
    id: "steps_order_process",
    name: "Processus Commande en 3 Étapes",
    icon: "🪜",
    desc: "Cartes 1-2-3 expliquant la commande, l'appel coursier et la livraison",
    category: "Processus",
    create: (randId: string) => ({
      id: `steps-${randId}`,
      type: "steps",
      badgeText: "SIMPLE & SÉCURISÉ",
      title: "Comment commander ?",
      subtitle: "3 étapes simples pour recevoir votre commande en toute sérénité :",
      items: [
        {
          id: `st-${randId}-1`,
          stepNumber: 1,
          title: "Remplissez le formulaire",
          description: "Indiquez votre nom, numéro WhatsApp et quartier de livraison.",
        },
        {
          id: `st-${randId}-2`,
          stepNumber: 2,
          title: "Confirmation d'Expédition",
          description: "Notre livreur vous contacte rapidement pour planifier l'heure de passage.",
        },
        {
          id: `st-${randId}-3`,
          stepNumber: 3,
          title: "Contrôle & Paiement en Espèces",
          description: "Vous recevez votre produit, vous vérifiez et vous payez en toute sécurité.",
        },
      ],
    }),
  },
  {
    id: "stats_counter",
    name: "Compteur d'Impact Chiffré",
    icon: "📊",
    desc: "3 métriques fortes (1 400+ livrés, 98.7% satisfaction, 24h chrono)",
    category: "Preuve Sociale",
    create: (randId: string) => ({
      id: `stats-${randId}`,
      type: "stats",
      badgeText: "IMPACT RÉEL",
      items: [
        { id: `st-${randId}-1`, value: "1 400+", label: "Clients livrés avec succès" },
        { id: `st-${randId}-2`, value: "98.7%", label: "Satisfaction certifiée" },
        { id: `st-${randId}-3`, value: "24h", label: "Délai moyen d'expédition" },
      ],
    }),
  },
  {
    id: "video_vsl",
    name: "Lecteur Vidéo VSL Immersif",
    icon: "🎬",
    desc: "Lecteur vidéo YouTube ou Vimeo dans un cadre moderne",
    category: "Médias",
    create: (randId: string) => ({
      id: `video-${randId}`,
      type: "video",
      badgeText: "DÉMONSTRATION EN VIDÉO",
      title: "Découvrez le produit en action",
      subtitle: "Regardez cette courte vidéo pour découvrir toute son efficacité au quotidien :",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }),
  },
  {
    id: "service_area_map",
    name: "Zone de Couverture & Livraison",
    icon: "📍",
    desc: "Zone d'intervention avec communes desservies et carte géographique",
    category: "Logistique",
    create: (randId: string, city: string) => ({
      id: `area-${randId}`,
      type: "service_area",
      title: "Notre zone de livraison & d'intervention",
      subtitle: "Zone de couverture garantie avec expédition suivie en main propre",
      zoneText: `${city}, communes et environs immédiats`,
      mapImageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80",
    }),
  },
  {
    id: "order_form_cod",
    name: "Formulaire Commande COD Express",
    icon: "🛒",
    desc: "Formulaire de commande avec champs nom, téléphone, ville et paiement à la livraison",
    category: "Conversion",
    create: (randId: string, city: string) => ({
      id: `order-${randId}`,
      type: "order_form",
      title: "Formulaire de Commande Express",
      subtitle: "Remplissez ce formulaire court pour recevoir votre colis sous 24h :",
      whatsappEnabled: true,
      whatsappNumber: "+22997000000",
      codEnabled: true,
      onlinePaymentEnabled: true,
      cities: [city, "Communes et environs", "Autre ville"],
    }),
  },
  {
    id: "faq_accordion",
    name: "FAQ Accordéon (4 Réponses Clés)",
    icon: "❓",
    desc: "Questions fréquentes éliminant les objections d'achat",
    category: "Réassurance",
    create: (randId: string, city: string) => ({
      id: `faq-${randId}`,
      type: "faq",
      badgeText: "❓ FAQ",
      title: "Questions Fréquentes",
      subtitle: "Toutes les réponses à vos questions en toute transparence :",
      items: [
        {
          id: `q-${randId}-1`,
          question: "Quand et comment puis-je payer ?",
          answer: "Vous ne payez rien à l'avance ! Vous payez en espèces directement au livreur une fois que vous avez reçu et contrôlé votre produit.",
        },
        {
          id: `q-${randId}-2`,
          question: "Quel est le délai de livraison ?",
          answer: `La livraison prend entre 12h et 24h à ${city} et ses environs. Notre coursier vous appelle avant de passer.`,
        },
        {
          id: `q-${randId}-3`,
          question: "Que se passe-t-il si l'article ne me convient pas ?",
          answer: "Vous disposez d'une garantie satisfait ou remboursé de 30 jours sans discussion.",
        },
        {
          id: `q-${randId}-4`,
          question: "Le produit est-il authentique ?",
          answer: "Absolument. Tous nos articles proviennent directement du fabricant officiel avec certification et garantie de conformité.",
        },
      ],
    }),
  },
  {
    id: "capture_form_optin",
    name: "Formulaire Opt-in WhatsApp & Email",
    icon: "⚡",
    desc: "Capture de coordonnées express sans friction",
    category: "Capture",
    create: (randId: string) => ({
      id: `capture-${randId}`,
      type: "capture_form",
      badgeText: "ACCÈS INSTANTANÉ",
      title: "Où devons-nous vous envoyer votre accès ?",
      subtitle: "Remplissez ce formulaire court pour recevoir votre cadeau par WhatsApp et par Email :",
      buttonText: "DÉBLOQUER MON ACCÈS MAINTENANT",
      collectName: true,
      collectPhone: true,
      collectEmail: true,
    }),
  },
  {
    id: "pricing_summary",
    name: "Récapitulatif Panier & Stock Restant",
    icon: "🏷️",
    desc: "Encart récapitulatif avec prix réduit, garantie 30j et alerte stock",
    category: "Conversion",
    create: (randId: string) => ({
      id: `pricing-${randId}`,
      type: "pricing",
      badgeText: "TARIF PROMOTIONNEL GARANTI",
      title: "Votre Récapitulatif de Commande",
      subtitle: "Profitez du tarif réduit garanti avant épuisement du stock :",
      offer: {
        id: `offer-${randId}`,
        name: "Édition Privilège Officielle 2026",
        salePrice: 22000,
        regularPrice: 35000,
        currency: "XOF" as const,
        features: [
          "Produit 100% certifié conforme",
          "Garantie satisfait ou remboursé 30 jours",
          "Assistance client dédiée 7j/7",
        ],
        stockLeft: 3,
      },
      guaranteeText: "Garantie 30 jours satisfait ou remboursé sans aucun justificatif",
    }),
  },
  {
    id: "features_gold",
    name: "Grille de Caractéristiques Premium",
    icon: "✨",
    desc: "3 colonnes de spécifications avec puces d'avantages majeurs",
    category: "Produits",
    create: (randId: string) => ({
      id: `feat-${randId}`,
      type: "features",
      badgeText: "TECHNOLOGIE & FINITIONS",
      title: "Conçu pour Dépasser Vos Attentes",
      subtitle: "Chaque détail a été pensé pour vous offrir une expérience d'exception :",
      items: [
        {
          id: `f-${randId}-1`,
          title: "Matériaux Certifiés Conformes",
          description: "Conception robuste et durable résistant à l'épreuve du temps et à un usage intensif.",
        },
        {
          id: `f-${randId}-2`,
          title: "Prise en Main Immédiate",
          description: "Utilisation simple et intuitive en moins de 2 minutes sans configuration complexe.",
        },
        {
          id: `f-${randId}-3`,
          title: "Efficacité Constatée dès le Jour 1",
          description: "Des résultats visibles et tangibles dès la première utilisation.",
        },
      ],
    }),
  },
  {
    id: "pain_points_solution",
    name: "Contraste Problèmes vs Solution",
    icon: "🎯",
    desc: "3 frustrations courantes résolues par votre offre",
    category: "Copywriting",
    create: (randId: string) => ({
      id: `pain-${randId}`,
      type: "pain_points",
      badgeText: "VOUS MÉRITEZ LE MEILLEUR",
      title: "En avez-vous assez des produits décevants ?",
      subtitle: "Voici pourquoi notre solution change définitivement la donne au quotidien :",
      items: [
        {
          id: `p-${randId}-1`,
          title: "Articles fragiles et décevants",
          description: "Notre article est fabriqué selon des standards stricts garantis 1 an.",
        },
        {
          id: `p-${randId}-2`,
          title: "Livraisons en retard sans aucun suivi",
          description: "Un coursier dédié vous appelle directement et vous livre sous 24h chrono.",
        },
        {
          id: `p-${randId}-3`,
          title: "Peur des arnaques en ligne",
          description: "Paiement 100% à la livraison : vous ne payez qu'après avoir inspecté le colis.",
        },
      ],
    }),
  },
  {
    id: "thank_you_confirmation",
    name: "Confirmation Festive & WhatsApp VIP",
    icon: "🎉",
    desc: "Remerciement chaleureux avec numéro de commande et lien WhatsApp",
    category: "Confirmation",
    create: (randId: string, city: string) => ({
      id: `thankyou-${randId}`,
      type: "thank_you",
      badgeText: "🎉 COMMANDE ENREGISTRÉE AVEC SUCCÈS",
      title: "Merci infiniment pour votre confiance !",
      subtitle: `Votre colis est actuellement en cours de préparation par notre équipe logistique à ${city}.`,
      orderNumber: `CMD-${Math.floor(100000 + Math.random() * 900000)}`,
      whatsappSupportNumber: "+22997000000",
      nextActionText: "Rejoindre notre Communauté WhatsApp VIP",
      nextActionUrl: "https://wa.me/22997000000",
      instructions: [
        "Votre livreur vous contactera par téléphone ou WhatsApp avant le passage",
        "Vous pourrez vérifier votre colis avant de régler",
        "Règlement possible en espèces ou Mobile Money",
      ],
    }),
  },
];

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
  const [detailedMargins, setDetailedMargins] = useState(false);

  // INITIALISATION DU PIPELINE MULTI-ÉTAPES DU TUNNEL
  const defaultHeroImage =
    initialData.sections.find((s) => s.type === "hero")?.imageUrl ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";

  const initialSteps: FunnelStep[] = initialData.steps || [
    {
      id: "step-1-capture",
      name: "1. 🧲 Page de Capture",
      slug: "capture",
      pageType: "capture",
      sections: createDefaultStepSections("capture", initialData.projectName, defaultHeroImage),
      nextStepSlug: "offre",
    },
    {
      id: "step-2-sales",
      name: "2. 🚀 Page de Vente",
      slug: "offre",
      pageType: "sales",
      sections: initialData.sections,
      nextStepSlug: "commande",
    },
    {
      id: "step-3-checkout",
      name: "3. 🛒 Commande & Checkout",
      slug: "commande",
      pageType: "checkout",
      sections: createDefaultStepSections("checkout", initialData.projectName, defaultHeroImage),
      nextStepSlug: "merci",
    },
    {
      id: "step-4-thankyou",
      name: "4. 🎉 Confirmation & Merci",
      slug: "merci",
      pageType: "thank_you",
      sections: createDefaultStepSections("thank_you", initialData.projectName, defaultHeroImage),
    },
  ];

  const [steps, setSteps] = useState<FunnelStep[]>(initialSteps);
  const [activeStepId, setActiveStepId] = useState<string>(
    initialData.activeStepId || "step-2-sales"
  );
  const [showAddStepModal, setShowAddStepModal] = useState(false);

  const handleSwitchStep = (targetStepId: string) => {
    const updatedSteps = steps.map((st) =>
      st.id === activeStepId ? { ...st, sections: funnelData.sections } : st
    );
    setSteps(updatedSteps);

    const targetStep = updatedSteps.find((st) => st.id === targetStepId);
    if (targetStep) {
      setActiveStepId(targetStepId);
      setFunnelData((prev) => ({
        ...prev,
        pageType: targetStep.pageType,
        sections: targetStep.sections,
        steps: updatedSteps,
        activeStepId: targetStepId,
      }));
      setSelectedSectionId(targetStep.sections[0]?.id || null);
    }
  };

  const handleAddStep = (pageType: FunnelPageType, stepName: string) => {
    const randId = Math.random().toString(36).substring(2, 6);
    const slug = stepName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "");
    const heroImg =
      funnelData.sections.find((s) => s.type === "hero")?.imageUrl || defaultHeroImage;
    const newSections = createDefaultStepSections(pageType, funnelData.projectName, heroImg);
    const newStep: FunnelStep = {
      id: `step-${randId}`,
      name: stepName,
      slug: slug || `step-${randId}`,
      pageType,
      sections: newSections,
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    setFunnelData((prev) => ({
      ...prev,
      pageType: newStep.pageType,
      sections: newStep.sections,
      steps: updatedSteps,
      activeStepId: newStep.id,
    }));
    setActiveStepId(newStep.id);
    setSelectedSectionId(newSections[0]?.id || null);
    setShowAddStepModal(false);
  };

  const handleDeleteStep = (stepIdToDelete: string) => {
    if (steps.length <= 1) {
      alert("Votre tunnel doit comporter au moins une page.");
      return;
    }
    if (!confirm("Voulez-vous vraiment supprimer cette page du tunnel ?")) return;

    const remainingSteps = steps.filter((st) => st.id !== stepIdToDelete);
    setSteps(remainingSteps);

    if (activeStepId === stepIdToDelete) {
      const nextActive = remainingSteps[0];
      setActiveStepId(nextActive.id);
      setFunnelData((prev) => ({
        ...prev,
        pageType: nextActive.pageType,
        sections: nextActive.sections,
        steps: remainingSteps,
        activeStepId: nextActive.id,
      }));
      setSelectedSectionId(nextActive.sections[0]?.id || null);
    } else {
      setFunnelData((prev) => ({
        ...prev,
        steps: remainingSteps,
      }));
    }
  };

  const handleRenameStep = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;
    const newName = prompt("Nouveau nom pour cette page :", step.name);
    if (newName && newName.trim()) {
      const updatedSteps = steps.map((s) =>
        s.id === stepId ? { ...s, name: newName.trim() } : s
      );
      setSteps(updatedSteps);
      setFunnelData((prev) => ({
        ...prev,
        steps: updatedSteps,
      }));
    }
  };



  // ACCORDÉONS DÉPLIABLES / PLIABLES
  const [openDesignCategory, setOpenDesignCategory] = useState<string | null>("passion");
  const [openInspectorAccordions, setOpenInspectorAccordions] = useState<{
    texts: boolean;
    widgets: boolean;
    margins: boolean;
    surface: boolean;
    content: boolean;
  }>({
    texts: true,
    widgets: false,
    margins: false,
    surface: false,
    content: true,
  });

  const toggleInspectorAccordion = (key: "texts" | "widgets" | "margins" | "surface" | "content") => {
    setOpenInspectorAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ÉTAT DU GLISSER-DÉPOSER DES SECTIONS DANS LA SIDEBAR
  const [draggedSidebarIdx, setDraggedSidebarIdx] = useState<number | null>(null);
  const [dragOverSidebarIdx, setDragOverSidebarIdx] = useState<number | null>(null);

  // COMPTEUR D'IMAGES IA SUR MESURE (MAX 3 PAR TUNNEL)
  const aiImagesCount = useMemo(() => {
    let count = 0;
    funnelData.sections.forEach((s: any) => {
      if (s.imageUrl?.includes("pollinations.ai")) count++;
      if (s.items && Array.isArray(s.items)) {
        s.items.forEach((it: any) => {
          if (it.imageUrl?.includes("pollinations.ai")) count++;
        });
      }
    });
    return count;
  }, [funnelData]);

  // INSERTION DE WIDGETS PREMIUM EN 1 CLIC
  const handleInsertWidget = (wDef: PremiumWidgetDef) => {
    const randId = Math.random().toString(36).substring(2, 6);
    const city = funnelData.branding?.address?.city || "Cotonou";
    const newSection = wDef.create(randId, city);
    setFunnelData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedSectionId(newSection.id);
    setActiveTab("inspector");
    setOpenInspectorAccordions((prev) => ({ ...prev, texts: true }));
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

  // IMPORTATION EN 1 CLIC DE 1 À 10 PRODUITS (AVEC VARIANTES & PHOTOS)
  const handleMultiProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (files.length === 0) return;

    const newItems: ProductItem[] = [];
    let processed = 0;

    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim();
        const capitalizedName =
          cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        newItems.push({
          id: `prod-up-${Date.now()}-${idx}`,
          name: capitalizedName || `Produit #${idx + 1}`,
          price: 15000 + idx * 2500,
          regularPrice: 20000 + idx * 3000,
          badge: idx === 0 ? "⭐ Top Vente" : idx === 1 ? "🔥 Populaire" : undefined,
          imageUrl: dataUrl,
          description: "Article authentique de qualité supérieure avec garantie d'échange et livraison express.",
          features: ["Qualité certifiée", "Garantie 30 jours", "Livraison suivie"],
          variants: [
            { name: "Couleur", options: ["Noir", "Or", "Argent"] },
            { name: "Taille", options: ["Standard", "Grande"] },
          ],
        });

        processed++;
        if (processed === files.length) {
          const curSec = funnelData.sections.find(
            (s) => s.id === selectedSectionId
          ) as ProductShowcaseSection;
          const updatedItems = [
            ...(curSec?.items || []),
            ...newItems,
          ].slice(0, 10);
          updateSelectedSection({ items: updatedItems });
          alert(`✅ ${newItems.length} produit(s) importé(s) avec succès avec variantes et photos !`);
        }
      };
      reader.readAsDataURL(file);
    });
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
    setFunnelData((prev) => {
      const updatedBranding = {
        ...prev.branding,
        [key]: value,
      };

      // Synchronisation automatique de la zone d'intervention & des villes du formulaire de commande
      let updatedSections = prev.sections;
      const cityName =
        key === "city"
          ? String(value || "")
          : key === "address" && typeof value === "object"
          ? String(value?.city || "")
          : "";

      if (cityName.trim()) {
        updatedSections = prev.sections.map((sec) => {
          if (sec.type === "service_area") {
            return {
              ...sec,
              zoneText: `${cityName.trim()}, communes et environs immédiats`,
            };
          }
          if (sec.type === "order_form") {
            return {
              ...sec,
              cities: [cityName.trim(), "Banlieue", "Région", "Autre"],
            };
          }
          return sec;
        });
      }

      return {
        ...prev,
        branding: updatedBranding,
        sections: updatedSections,
      };
    });
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
          badgeText: "💬 TÉMOIGNAGES VÉRIFIÉS",
          title: "Ce que disent nos clients",
          ratingAverage: 5,
          totalReviewsText: "5/5 étoiles sur plus de 350 avis",
          items: [
            {
              id: `r-${randId}-1`,
              authorName: "Amina Kouamé",
              authorLocation: "Abidjan",
              rating: 5,
              comment: "Produit fantastique et livraison ultra rapide en 24h ! Conforme à mes attentes.",
            },
            {
              id: `r-${randId}-2`,
              authorName: "Marc Dossou",
              authorLocation: "Cotonou",
              rating: 5,
              comment: "J'ai apprécié de pouvoir vérifier le produit avant de régler le coursier. Très pro !",
            },
            {
              id: `r-${randId}-3`,
              authorName: "Fatou Sylla",
              authorLocation: "Dakar",
              rating: 5,
              comment: "Colis soigné et service client WhatsApp au top. Je commanderai à nouveau sans hésiter.",
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
            {/* TABS ÉPURÉS ET DESIGN STUDIO */}
            <div className="p-2.5 border-b border-white/10 grid grid-cols-4 gap-1.5 text-[11px] font-bold">
              <button
                onClick={() => setActiveTab("inspector")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  activeTab === "inspector"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Inspecter le bloc actif"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">Inspecteur</span>
              </button>
              <button
                onClick={() => setActiveTab("sections")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  activeTab === "sections"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Arborescence & Réorganisation des Blocs"
              >
                <span>📑</span>
                <span className="hidden sm:inline">Blocs</span>
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  activeTab === "design"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Palette de Couleurs & Thèmes"
              >
                <span>🎨</span>
                <span className="hidden sm:inline">Thèmes</span>
              </button>
              <button
                onClick={() => setActiveTab("branding")}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  activeTab === "branding"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title="Identité, Coordonnées & Pied de Page"
              >
                <span>🏢</span>
                <span className="hidden sm:inline">Identité</span>
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

                      {/* IMPORT RAPIDE DE 1 À 10 PRODUITS EN 1 CLIC */}
                      {selectedSection.type === "product_showcase" && (
                        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-white block">
                                Importer des Produits en 1 Clic
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Importez 1 à 10 photos avec variantes & prix
                              </span>
                            </div>
                          </div>

                          <label className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25 transition-all">
                            <Upload className="w-4 h-4" />
                            <span>Choisir 1 à 10 Photos Produits</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleMultiProductUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {/* ACCORDÉON 1 : 📝 TEXTES & TITRES DU BLOC (ÉDITION DIRECTE AU CLIC) */}
                      <div className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden">
                        <button
                          onClick={() => toggleInspectorAccordion("texts")}
                          className="w-full p-3 flex items-center justify-between font-bold text-xs text-white hover:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>📝</span>
                            <span>Textes & Titres du Bloc</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              openInspectorAccordions.texts ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openInspectorAccordions.texts && (
                          <div className="p-3 pt-0 space-y-3.5 border-t border-white/5">
                            {/* BADGE / SURTITRE */}
                            {(selectedSection as any).badgeText !== undefined && (
                              <div className="space-y-1 pt-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Badge / Surtitre
                                </label>
                                <input
                                  type="text"
                                  value={(selectedSection as any).badgeText || ""}
                                  onChange={(e) => updateSelectedSection({ badgeText: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                  placeholder="⭐ Surtitre..."
                                />
                              </div>
                            )}

                            {/* TITRE PRINCIPAL */}
                            {(selectedSection as any).title !== undefined && (
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Titre de la Section
                                </label>
                                <input
                                  type="text"
                                  value={(selectedSection as any).title || ""}
                                  onChange={(e) => updateSelectedSection({ title: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold"
                                  placeholder="Titre accrocheur..."
                                />
                              </div>
                            )}

                            {/* SOUS-TITRE / DESCRIPTION */}
                            {(selectedSection as any).subtitle !== undefined && (
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-300">
                                  Sous-titre / Description
                                </label>
                                <textarea
                                  rows={2}
                                  value={(selectedSection as any).subtitle || ""}
                                  onChange={(e) => updateSelectedSection({ subtitle: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                  placeholder="Description persuasive..."
                                />
                              </div>
                            )}

                            {/* SPÉCIFIQUE HERO : BOUTONS D'ACTION (CTA) */}
                            {selectedSection.type === "hero" && (
                              <div className="space-y-2 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Boutons d'Action (Hero)
                                </span>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400">Bouton Principal (CTA)</label>
                                  <input
                                    type="text"
                                    value={(selectedSection as HeroSection).ctaText || ""}
                                    onChange={(e) => updateSelectedSection({ ctaText: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400">Sous-texte de Réassurance</label>
                                  <input
                                    type="text"
                                    value={(selectedSection as HeroSection).ctaSubtext || ""}
                                    onChange={(e) => updateSelectedSection({ ctaSubtext: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400">Bouton Secondaire (WhatsApp)</label>
                                  <input
                                    type="text"
                                    value={(selectedSection as HeroSection).secondaryCtaText || ""}
                                    onChange={(e) => updateSelectedSection({ secondaryCtaText: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                                  />
                                </div>
                              </div>
                            )}

                            {/* SPÉCIFIQUE SHOWCASE PRODUITS */}
                            {selectedSection.type === "product_showcase" && (
                              <div className="space-y-2.5 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Produits & Offres ({(selectedSection as ProductShowcaseSection).items.length})
                                </span>
                                {(selectedSection as ProductShowcaseSection).items.map((prod, pIdx) => (
                                  <div key={prod.id || pIdx} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-extrabold text-white">Offre #{pIdx + 1}</span>
                                      <input
                                        type="text"
                                        placeholder="Badge"
                                        value={prod.badge || ""}
                                        onChange={(e) => {
                                          const updated = [...(selectedSection as ProductShowcaseSection).items];
                                          updated[pIdx] = { ...updated[pIdx], badge: e.target.value };
                                          updateSelectedSection({ items: updated });
                                        }}
                                        className="w-28 px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-indigo-300 text-[10px]"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Nom de l'offre"
                                      value={prod.name}
                                      onChange={(e) => {
                                        const updated = [...(selectedSection as ProductShowcaseSection).items];
                                        updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                                        updateSelectedSection({ items: updated });
                                      }}
                                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[9px] text-slate-400 block">Prix promo</label>
                                        <input
                                          type="number"
                                          value={prod.price}
                                          onChange={(e) => {
                                            const updated = [...(selectedSection as ProductShowcaseSection).items];
                                            updated[pIdx] = { ...updated[pIdx], price: Number(e.target.value) };
                                            updateSelectedSection({ items: updated });
                                          }}
                                          className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs font-mono"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[9px] text-slate-400 block">Prix barré</label>
                                        <input
                                          type="number"
                                          value={prod.regularPrice || ""}
                                          onChange={(e) => {
                                            const updated = [...(selectedSection as ProductShowcaseSection).items];
                                            updated[pIdx] = { ...updated[pIdx], regularPrice: Number(e.target.value) };
                                            updateSelectedSection({ items: updated });
                                          }}
                                          className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs font-mono"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* SPÉCIFIQUE CARTES FLOTTANTES */}
                            {selectedSection.type === "floating_cards" && (
                              <div className="space-y-2 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Cartes de Réassurance
                                </span>
                                {(selectedSection as FloatingTrustCardsSection).cards.map((c, cIdx) => (
                                  <div key={c.id || cIdx} className="p-2 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                                    <label className="text-[10px] text-slate-400 font-bold block">Carte #{cIdx + 1} - Titre</label>
                                    <input
                                      type="text"
                                      value={c.title}
                                      onChange={(e) => {
                                        const updated = [...(selectedSection as FloatingTrustCardsSection).cards];
                                        updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                                        updateSelectedSection({ cards: updated });
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs font-bold"
                                    />
                                    <textarea
                                      rows={1}
                                      value={c.description}
                                      onChange={(e) => {
                                        const updated = [...(selectedSection as FloatingTrustCardsSection).cards];
                                        updated[cIdx] = { ...updated[cIdx], description: e.target.value };
                                        updateSelectedSection({ cards: updated });
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-[11px]"
                                      placeholder="Description..."
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* SPÉCIFIQUE AVIS CLIENTS */}
                            {selectedSection.type === "social_proof" && (
                              <div className="space-y-2 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Avis Clients (3 Colonnes)
                                </span>
                                {(selectedSection as SocialProofSection).items.map((rev, rIdx) => (
                                  <div key={rev.id || rIdx} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input
                                        type="text"
                                        placeholder="Nom"
                                        value={rev.authorName}
                                        onChange={(e) => {
                                          const updated = [...(selectedSection as SocialProofSection).items];
                                          updated[rIdx] = { ...updated[rIdx], authorName: e.target.value };
                                          updateSelectedSection({ items: updated });
                                        }}
                                        className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Ville"
                                        value={rev.authorLocation}
                                        onChange={(e) => {
                                          const updated = [...(selectedSection as SocialProofSection).items];
                                          updated[rIdx] = { ...updated[rIdx], authorLocation: e.target.value };
                                          updateSelectedSection({ items: updated });
                                        }}
                                        className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs"
                                      />
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={rev.comment}
                                      onChange={(e) => {
                                        const updated = [...(selectedSection as SocialProofSection).items];
                                        updated[rIdx] = { ...updated[rIdx], comment: e.target.value };
                                        updateSelectedSection({ items: updated });
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs"
                                      placeholder="Commentaire de l'acheteur..."
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* SPÉCIFIQUE FAQ */}
                            {selectedSection.type === "faq" && (
                              <div className="space-y-2 pt-2 border-t border-white/5">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Questions / Réponses
                                </span>
                                {(selectedSection as FaqSection).items.map((q, qIdx) => (
                                  <div key={q.id || qIdx} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
                                    <input
                                      type="text"
                                      placeholder="Question..."
                                      value={q.question}
                                      onChange={(e) => {
                                        const updated = [...(selectedSection as FaqSection).items];
                                        updated[qIdx] = { ...updated[qIdx], question: e.target.value };
                                        updateSelectedSection({ items: updated });
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs font-bold"
                                    />
                                    <textarea
                                      rows={2}
                                      placeholder="Réponse transparente..."
                                      value={q.answer}
                                      onChange={(e) => {
                                        const updated = [...(selectedSection as FaqSection).items];
                                        updated[qIdx] = { ...updated[qIdx], answer: e.target.value };
                                        updateSelectedSection({ items: updated });
                                      }}
                                      className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ACCORDÉON 2 : 🧩 BIBLIOTHÈQUE DE WIDGETS PREMIUM (16 WIDGETS) */}
                      <div className="rounded-2xl border border-white/10 bg-slate-950 overflow-hidden">
                        <button
                          onClick={() => toggleInspectorAccordion("widgets")}
                          className="w-full p-3 flex items-center justify-between font-bold text-xs text-white hover:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>🧩</span>
                            <span>Widgets Préconfigurés (16)</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              openInspectorAccordions.widgets ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openInspectorAccordions.widgets && (
                          <div className="p-3 pt-0 space-y-2 border-t border-white/5 max-h-80 overflow-y-auto">
                            <span className="text-[10px] text-slate-400 block pt-1">
                              Cliquez sur un widget pour l'insérer instantanément sur votre page :
                            </span>
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {PREMIUM_WIDGETS.map((widget) => (
                                <button
                                  key={widget.id}
                                  type="button"
                                  onClick={() => handleInsertWidget(widget)}
                                  className="p-2.5 rounded-xl border border-white/5 bg-slate-900/90 hover:bg-slate-800 hover:border-indigo-500/40 text-left transition-all cursor-pointer flex items-center gap-3 group"
                                >
                                  <span className="text-xl p-2 rounded-lg bg-slate-950 border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                                    {widget.icon}
                                  </span>
                                  <div className="truncate flex-1">
                                    <span className="font-extrabold text-xs text-white block group-hover:text-indigo-400 transition-colors">
                                      {widget.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block truncate">
                                      {widget.desc}
                                    </span>
                                  </div>
                                  <Plus className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. ACCORDÉON : MARGES & ESPACEMENTS */}
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
                          <div className="p-3 pt-0 space-y-3.5 border-t border-white/5">
                            {/* BASCULE SIMPLE / AVANCÉ */}
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">
                                Mode d'espacement
                              </span>
                              <button
                                onClick={() => setDetailedMargins(!detailedMargins)}
                                className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                              >
                                {detailedMargins ? "Basculer en Mode Paires" : "Détailler les 4 côtés"}
                              </button>
                            </div>

                            {!detailedMargins ? (
                              <>
                                {/* 1. PADDING VERTICAL (HAUT & BAS) */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-semibold">
                                    <span className="text-slate-300">↕️ Padding Haut & Bas</span>
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
                                      updateSelectedSection({
                                        paddingVerticalPx: Number(e.target.value),
                                        paddingTopPx: undefined,
                                        paddingBottomPx: undefined,
                                      })
                                    }
                                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                                  />
                                </div>

                                {/* 2. PADDING HORIZONTAL (GAUCHE & DROITE) */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-semibold">
                                    <span className="text-slate-300">↔️ Padding Gauche & Droite</span>
                                    <span className="text-cyan-400 font-mono text-xs">
                                      {selectedSection.paddingHorizontalPx ?? (device === "mobile" ? 16 : 24)}px
                                    </span>
                                  </div>
                                  <input
                                    type="range"
                                    min="8"
                                    max="80"
                                    step="2"
                                    value={selectedSection.paddingHorizontalPx ?? (device === "mobile" ? 16 : 24)}
                                    onChange={(e) =>
                                      updateSelectedSection({
                                        paddingHorizontalPx: Number(e.target.value),
                                        paddingLeftPx: undefined,
                                        paddingRightPx: undefined,
                                      })
                                    }
                                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                                  />
                                </div>

                                {/* 3. MARGE EXTERNE VERTICALE (HAUT & BAS) */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-semibold">
                                    <span className="text-slate-300">↕️ Marge Externe Haut & Bas</span>
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
                                      updateSelectedSection({
                                        marginVerticalPx: Number(e.target.value),
                                        marginTopPx: undefined,
                                        marginBottomPx: undefined,
                                      })
                                    }
                                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                                  />
                                </div>

                                {/* 4. MARGE EXTERNE HORIZONTALE (GAUCHE & DROITE) */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-semibold">
                                    <span className="text-slate-300">↔️ Marge Externe Gauche & Droite</span>
                                    <span className="text-amber-300 font-mono text-xs">
                                      {selectedSection.marginHorizontalPx ?? 0}px
                                    </span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="80"
                                    step="4"
                                    value={selectedSection.marginHorizontalPx ?? 0}
                                    onChange={(e) =>
                                      updateSelectedSection({
                                        marginHorizontalPx: Number(e.target.value),
                                        marginLeftPx: undefined,
                                        marginRightPx: undefined,
                                      })
                                    }
                                    className="w-full accent-amber-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                                  />
                                </div>
                              </>
                            ) : (
                              /* MODE AVANCÉ : CONTRÔLE INDIVIDUEL DES 4 CÔTÉS */
                              <div className="space-y-3 pt-1">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Marges Internes Côté par Côté (Padding)
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Haut (Top)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="200"
                                      value={selectedSection.paddingTopPx ?? selectedSection.paddingVerticalPx ?? 36}
                                      onChange={(e) => updateSelectedSection({ paddingTopPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Bas (Bottom)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="200"
                                      value={selectedSection.paddingBottomPx ?? selectedSection.paddingVerticalPx ?? 36}
                                      onChange={(e) => updateSelectedSection({ paddingBottomPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Gauche (Left)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="120"
                                      value={selectedSection.paddingLeftPx ?? selectedSection.paddingHorizontalPx ?? 24}
                                      onChange={(e) => updateSelectedSection({ paddingLeftPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Droite (Right)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="120"
                                      value={selectedSection.paddingRightPx ?? selectedSection.paddingHorizontalPx ?? 24}
                                      onChange={(e) => updateSelectedSection({ paddingRightPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                </div>

                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block pt-2">
                                  Marges Externes Côté par Côté (Margin)
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Haut (Margin Top)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="150"
                                      value={selectedSection.marginTopPx ?? selectedSection.marginVerticalPx ?? 0}
                                      onChange={(e) => updateSelectedSection({ marginTopPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Bas (Margin Bottom)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="150"
                                      value={selectedSection.marginBottomPx ?? selectedSection.marginVerticalPx ?? 0}
                                      onChange={(e) => updateSelectedSection({ marginBottomPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Gauche (Margin Left)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={selectedSection.marginLeftPx ?? selectedSection.marginHorizontalPx ?? 0}
                                      onChange={(e) => updateSelectedSection({ marginLeftPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block">Droite (Margin Right)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={selectedSection.marginRightPx ?? selectedSection.marginHorizontalPx ?? 0}
                                      onChange={(e) => updateSelectedSection({ marginRightPx: Number(e.target.value) })}
                                      className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Arrondi des Angles */}
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-slate-300">Arrondi des Coins</span>
                                <span className="text-emerald-400 font-mono text-xs">
                                  {selectedSection.borderRadiusPx ?? 24}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="50"
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

                            {/* COULEURS PERSONNALISÉES DU TITRE & DU TEXTE */}
                            <div className="pt-3 border-t border-white/5 space-y-3">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                Couleurs Spécifiques du Texte
                              </span>

                              {/* Couleur du Titre */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className="text-slate-300">Couleur du Titre</span>
                                  {selectedSection.customTitleColor && (
                                    <button
                                      type="button"
                                      onClick={() => updateSelectedSection({ customTitleColor: undefined })}
                                      className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                                    >
                                      Réinitialiser
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={selectedSection.customTitleColor || "#ffffff"}
                                    onChange={(e) => updateSelectedSection({ customTitleColor: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                                  />
                                  <div className="flex items-center gap-1.5 overflow-x-auto">
                                    {["#ffffff", "#000000", "#4F46E5", "#F59E0B", "#EF4444", "#EC4899", "#10B981"].map((c) => (
                                      <button
                                        key={c}
                                        type="button"
                                        onClick={() => updateSelectedSection({ customTitleColor: c })}
                                        className="w-5 h-5 rounded-full border border-white/20 shrink-0 cursor-pointer transition-transform hover:scale-110"
                                        style={{ backgroundColor: c }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Couleur du Texte / Sous-titre */}
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className="text-slate-300">Couleur du Texte / Description</span>
                                  {selectedSection.customTextColor && (
                                    <button
                                      type="button"
                                      onClick={() => updateSelectedSection({ customTextColor: undefined })}
                                      className="text-[9px] text-rose-400 hover:underline cursor-pointer"
                                    >
                                      Réinitialiser
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={selectedSection.customTextColor || "#94A3B8"}
                                    onChange={(e) => updateSelectedSection({ customTextColor: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                                  />
                                  <div className="flex items-center gap-1.5 overflow-x-auto">
                                    {["#F8FAFC", "#94A3B8", "#64748B", "#0F172A", "#FCD34D", "#86EFAC"].map((c) => (
                                      <button
                                        key={c}
                                        type="button"
                                        onClick={() => updateSelectedSection({ customTextColor: c })}
                                        className="w-5 h-5 rounded-full border border-white/20 shrink-0 cursor-pointer transition-transform hover:scale-110"
                                        style={{ backgroundColor: c }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
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
                              <>
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

                                <div className="space-y-3 pt-3 border-t border-white/10">
                                  <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px] block">
                                    🔗 Liaisons & Actions des Boutons
                                  </span>

                                  {/* WIDGETS PRÉFABRIQUÉS */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-slate-300 block">
                                      ⚡ Widgets Préfabriqués en 1-Clic :
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const stepCheckout = steps.find(
                                            (st) => st.pageType === "checkout" || st.id.includes("commande")
                                          );
                                          updateSelectedSection({
                                            ctaText: "COMMANDER MAINTENANT",
                                            ctaTargetStepSlug: stepCheckout ? stepCheckout.slug || stepCheckout.id : undefined,
                                            ctaLink: stepCheckout ? undefined : "#commander",
                                          });
                                        }}
                                        className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500 text-[11px] font-bold text-left text-slate-200 hover:text-white transition-all cursor-pointer"
                                      >
                                        🛒 Vers Commande
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const stepThank = steps.find(
                                            (st) => st.pageType === "thank_you" || st.id.includes("merci")
                                          );
                                          updateSelectedSection({
                                            ctaText: "CONFIRMATION & MERCI",
                                            ctaTargetStepSlug: stepThank ? stepThank.slug || stepThank.id : undefined,
                                            ctaLink: stepThank ? undefined : "#merci",
                                          });
                                        }}
                                        className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500 text-[11px] font-bold text-left text-slate-200 hover:text-white transition-all cursor-pointer"
                                      >
                                        🎉 Vers Remerciement
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const stepSales = steps.find(
                                            (st) => st.pageType === "sales" || st.id.includes("offre")
                                          );
                                          updateSelectedSection({
                                            ctaText: "DÉCOUVRIR L'OFFRE",
                                            ctaTargetStepSlug: stepSales ? stepSales.slug || stepSales.id : undefined,
                                            ctaLink: stepSales ? undefined : "#offre",
                                          });
                                        }}
                                        className="p-2 rounded-xl bg-slate-900 hover:bg-amber-600/30 border border-white/10 hover:border-amber-500 text-[11px] font-bold text-left text-slate-200 hover:text-white transition-all cursor-pointer"
                                      >
                                        🚀 Vers Page Vente
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const stepCapture = steps.find(
                                            (st) => st.pageType === "capture" || st.id.includes("capture")
                                          );
                                          updateSelectedSection({
                                            ctaText: "ACCÉDER AU GUIDE",
                                            ctaTargetStepSlug: stepCapture ? stepCapture.slug || stepCapture.id : undefined,
                                            ctaLink: stepCapture ? undefined : "#capture",
                                          });
                                        }}
                                        className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-600/30 border border-white/10 hover:border-cyan-500 text-[11px] font-bold text-left text-slate-200 hover:text-white transition-all cursor-pointer"
                                      >
                                        🧲 Vers Capture
                                      </button>
                                    </div>
                                  </div>

                                  {/* SÉLECTEUR D'ÉTAPE PERSONNALISÉ */}
                                  <div className="space-y-1.5 pt-1">
                                    <label className="text-[10px] font-semibold text-slate-300 block">
                                      Destination du Bouton Principal (CTA 1) :
                                    </label>
                                    <select
                                      value={
                                        (selectedSection as HeroSection).ctaTargetStepSlug ||
                                        ((selectedSection as HeroSection).ctaLink?.startsWith("http")
                                          ? "custom_url"
                                          : "anchor")
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "anchor") {
                                          updateSelectedSection({ ctaTargetStepSlug: undefined, ctaLink: "#commander" });
                                        } else if (val === "custom_url") {
                                          updateSelectedSection({ ctaTargetStepSlug: undefined, ctaLink: "https://" });
                                        } else {
                                          updateSelectedSection({ ctaTargetStepSlug: val, ctaLink: undefined });
                                        }
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    >
                                      <optgroup label="Connecter à une Page du Tunnel">
                                        {steps.map((st) => (
                                          <option key={st.id} value={st.slug || st.id}>
                                            → {st.name} (/{st.slug || st.id})
                                          </option>
                                        ))}
                                      </optgroup>
                                      <optgroup label="Autre Action">
                                        <option value="anchor">Ancre Formulaire (#commander)</option>
                                        <option value="custom_url">Lien Externe (URL personnalisée)</option>
                                      </optgroup>
                                    </select>

                                    {!(selectedSection as HeroSection).ctaTargetStepSlug && (
                                      <input
                                        type="text"
                                        placeholder="Ex: #commander ou https://..."
                                        value={(selectedSection as HeroSection).ctaLink || ""}
                                        onChange={(e) => updateSelectedSection({ ctaLink: e.target.value })}
                                        className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs"
                                      />
                                    )}
                                  </div>

                                  {/* SÉLECTEUR BOUTON SECONDAIRE */}
                                  <div className="space-y-1.5 pt-1">
                                    <label className="text-[10px] font-semibold text-slate-300 block">
                                      Destination du Bouton Secondaire (CTA 2) :
                                    </label>
                                    <select
                                      value={
                                        (selectedSection as HeroSection).secondaryCtaTargetStepSlug ||
                                        "whatsapp"
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "whatsapp") {
                                          updateSelectedSection({
                                            secondaryCtaTargetStepSlug: undefined,
                                            secondaryCtaLink: undefined,
                                          });
                                        } else {
                                          updateSelectedSection({
                                            secondaryCtaTargetStepSlug: val,
                                            secondaryCtaLink: undefined,
                                          });
                                        }
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                                    >
                                      <option value="whatsapp">💬 WhatsApp Direct (Par défaut)</option>
                                      <optgroup label="Ou Lier à une Page du Tunnel">
                                        {steps.map((st) => (
                                          <option key={st.id} value={st.slug || st.id}>
                                            → {st.name} (/{st.slug || st.id})
                                          </option>
                                        ))}
                                      </optgroup>
                                    </select>
                                  </div>
                                </div>
                              </>
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
                    💡 Glissez-déposez les blocs avec <GripVertical className="w-3 h-3 inline text-slate-400" /> ou utilisez les flèches ↑ et ↓.
                  </p>

                  <div className="space-y-2">
                    {funnelData.sections.map((sec, idx) => {
                      const isSelected = selectedSectionId === sec.id;
                      const isDragged = draggedSidebarIdx === idx;
                      const isOver = dragOverSidebarIdx === idx;

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
                            e.dataTransfer.dropEffect = "move";
                            if (dragOverSidebarIdx !== idx) setDragOverSidebarIdx(idx);
                          }}
                          onDragLeave={() => {
                            if (dragOverSidebarIdx === idx) setDragOverSidebarIdx(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const rawIdx = e.dataTransfer.getData("text/plain");
                            if (rawIdx !== "") {
                              const fromIdx = Number(rawIdx);
                              if (!isNaN(fromIdx) && fromIdx !== idx) {
                                handleReorderSections(fromIdx, idx);
                              }
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
                            isDragged ? "opacity-30 scale-95 border-dashed border-indigo-400" : ""
                          } ${
                            isOver ? "border-indigo-500 ring-2 ring-indigo-500 bg-indigo-600/30 -translate-y-0.5" : ""
                          } ${
                            isSelected
                              ? "bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                              : "bg-slate-950/90 border-white/5 hover:border-white/20 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="text-slate-500 hover:text-white cursor-grab active:cursor-grabbing p-0.5 shrink-0"
                              title="Glisser pour réorganiser"
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </span>
                            <span className="w-5 h-5 rounded-full bg-slate-900 border border-white/10 text-indigo-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-base shrink-0">{getSectionIcon(sec.type)}</span>
                            <span className="font-bold text-white text-xs capitalize truncate">
                              {sec.type.replace("_", " ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSection(idx, "up");
                              }}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-20 cursor-pointer border border-white/5"
                              title="Monter ce bloc"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSection(idx, "down");
                              }}
                              disabled={idx === funnelData.sections.length - 1}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-20 cursor-pointer border border-white/5"
                              title="Descendre ce bloc"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSection(sec.id);
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer border border-rose-500/20"
                              title="Supprimer ce bloc"
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
          aiImagesCount={aiImagesCount}
        />

        {/* 3. CANEVAS DE PRÉVISUALISATION AVEC GESTIONNAIRE D'ÉTAPES DU TUNNEL */}
        <div className="flex-1 bg-[#040407] p-2 sm:p-6 flex flex-col items-center justify-start overflow-hidden relative">
          
          {/* BARRE DE PIPELINE HAUT DE GAMME (DESIGN STUDIO FRAMER / WEBFLOW) */}
          <div className="w-full max-w-6xl mb-3.5 p-2 sm:p-2.5 rounded-2xl bg-slate-950/95 border border-white/10 backdrop-blur-md shadow-2xl shrink-0 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-full">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-600/15 border border-indigo-500/25 shrink-0">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-black text-indigo-300 uppercase tracking-wider">
                  Tunnel ({steps.length} pages)
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {steps.map((st, i) => {
                  const isActive = st.id === activeStepId;
                  const stepIcon =
                    st.pageType === "capture"
                      ? "🧲"
                      : st.pageType === "sales"
                      ? "🚀"
                      : st.pageType === "checkout"
                      ? "🛒"
                      : st.pageType === "thank_you"
                      ? "🎉"
                      : "📄";

                  return (
                    <div key={st.id} className="flex items-center gap-1.5 shrink-0 group/step">
                      <div
                        onClick={() => handleSwitchStep(st.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400/50 ring-2 ring-indigo-500/30 shadow-indigo-600/30"
                            : "bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/25 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-sm">{stepIcon}</span>
                        <div className="text-left">
                          <span className="block leading-none">{st.name}</span>
                          <span
                            className={`text-[9px] font-mono block mt-0.5 ${
                              isActive ? "text-indigo-200" : "text-slate-500"
                            }`}
                          >
                            /{st.slug || st.id}
                          </span>
                        </div>

                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                        )}

                        {/* ACTIONS RAPIDES SUR L'ÉTAPE */}
                        <div className="flex items-center gap-1 ml-1 opacity-0 group-hover/step:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameStep(st.id);
                            }}
                            className="p-1 rounded hover:bg-black/30 text-slate-300 hover:text-white"
                            title="Renommer cette page"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          {steps.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStep(st.id);
                              }}
                              className="p-1 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-400"
                              title="Supprimer cette page du tunnel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {i < steps.length - 1 && (
                        <span className="text-slate-600 font-bold text-xs px-0.5">
                          →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowAddStepModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nouvelle Page</span>
            </button>
          </div>

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
            className={`w-full transition-all duration-300 rounded-3xl overflow-y-auto shadow-2xl border border-white/10 max-h-[calc(100vh-140px)] ${
              device === "mobile"
                ? "max-w-[390px] ring-8 ring-slate-900"
                : device === "tablet"
                ? "max-w-[768px] ring-8 ring-slate-900"
                : "max-w-6xl"
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
              onSwitchStep={(stepSlug) => {
                const target = steps.find((s) => s.slug === stepSlug || s.id === stepSlug);
                if (target) handleSwitchStep(target.id);
              }}
            />
          </div>
        </div>
      </div>

      {/* MODAL D'AJOUT D'UNE ÉTAPE AU TUNNEL */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-white">Ajouter une Page au Tunnel</h3>
              <button
                onClick={() => setShowAddStepModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                {
                  type: "capture" as FunnelPageType,
                  icon: "🧲",
                  title: "Page de Capture (Opt-in)",
                  desc: "Récoltez des emails & numéros WhatsApp avec un cadeau/guide offert.",
                },
                {
                  type: "sales" as FunnelPageType,
                  icon: "🚀",
                  title: "Page de Vente (Landing Page)",
                  desc: "Présentez l'offre complète avec preuves sociales, vidéo et packs.",
                },
                {
                  type: "checkout" as FunnelPageType,
                  icon: "🛒",
                  title: "Page de Commande / Checkout",
                  desc: "Formulaire express de livraison avec choix du pack et paiement COD / MoMo.",
                },
                {
                  type: "thank_you" as FunnelPageType,
                  icon: "🎉",
                  title: "Page de Confirmation & Remerciement",
                  desc: "Rassurez l'acheteur avec les consignes du coursier et WhatsApp.",
                },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleAddStep(item.type, `${item.icon} ${item.title}`)}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 hover:border-indigo-500 text-left space-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-white group-hover:text-indigo-300">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pl-6">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
