// ==============================================================================
// 🚀 TUNELIVA - SCHÉMA DE DONNÉES AVEC MARGES INTERNES/EXTERNES & SURFACE VARIANTS
// ==============================================================================

export type CurrencyCode = "XOF" | "XAF" | "GNF" | "GHS" | "NGN" | "EUR" | "USD";

export type FunnelPageType =
  | "sales"
  | "capture"
  | "checkout"
  | "confirmation"
  | "thank_you";

export type SectionPadding = "compact" | "normal" | "spacious" | "extra";

export type SectionSurfaceVariant = "default" | "subtle" | "card_elevated" | "brand_tint";

export type DesignPreset =
  | "fintech_mint"
  | "luxury_gold"
  | "clean_pro_navy"
  | "saas_indigo"
  | "rose_glamour"
  | "bordeaux_velours"
  | "rouge_passion"
  | "vert_sauge"
  | "ambre_karite"
  | "violet_mystique"
  | "bleu_ocean";

export interface BaseSectionProps {
  id: string;
  // Marges Internes (Padding)
  paddingVerticalPx?: number; // Haut & Bas (10 à 140px)
  paddingHorizontalPx?: number; // Gauche & Droite (8 à 80px)
  paddingTopPx?: number;
  paddingBottomPx?: number;
  paddingLeftPx?: number;
  paddingRightPx?: number;

  // Marges Externes (Margin)
  marginVerticalPx?: number; // Haut & Bas (0 à 80px)
  marginHorizontalPx?: number; // Gauche & Droite (0 à 80px)
  marginTopPx?: number;
  marginBottomPx?: number;
  marginLeftPx?: number;
  marginRightPx?: number;

  borderRadiusPx?: number; // Arrondi des angles (0 à 44px)
  maxWidthClass?: "max-w-2xl" | "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-full";
  titleSize?: "sm" | "base" | "lg" | "xl";
  sectionSurfaceVariant?: SectionSurfaceVariant;
  customBgColor?: string;
  customTextColor?: string;
  customTitleColor?: string;
}

export interface BrandingConfig {
  businessName: string;
  tagline?: string;
  logoUrl?: string;
  phone?: string;
  whatsappNumber?: string;
  headerLayout?: "standard" | "centered" | "minimal";
  footerBgColor?: string;
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  address?: {
    city: string;
    country: string;
    fullAddress?: string;
    serviceZone?: string;
  };
}

export interface HeroSection extends BaseSectionProps {
  type: "hero";
  badgeText: string;
  title: string;
  highlightWords?: string[];
  subtitle: string;
  ctaText: string;
  ctaSubtext?: string;
  ctaLink?: string;
  ctaTargetStepSlug?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  secondaryCtaTargetStepSlug?: string;
  imageUrl: string;
  trustPoints: string[];
}

export interface FloatingTrustCardsSection extends BaseSectionProps {
  type: "floating_cards";
  cards: {
    id: string;
    icon: "timer" | "check" | "shield" | "truck" | "star";
    title: string;
    description: string;
  }[];
}

export interface StepItem {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface StepsSection extends BaseSectionProps {
  type: "steps";
  badgeText: string;
  title: string;
  subtitle: string;
  items: StepItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface StatsSection extends BaseSectionProps {
  type: "stats";
  badgeText?: string;
  items: StatItem[];
}

export interface ProductVariant {
  name: string; // Ex: "Couleur", "Taille", "Modèle"
  options: string[]; // Ex: ["Noir", "Or", "Argent"] ou ["M", "L", "XL"]
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;
  badge?: string;
  imageUrl: string;
  description: string;
  features: string[];
  variants?: ProductVariant[];
  selectedVariant?: Record<string, string>;
  detailsHtml?: string;
  stockQty?: number;
}

export interface ProductShowcaseSection extends BaseSectionProps {
  type: "product_showcase";
  badgeText: string;
  title: string;
  subtitle: string;
  items: ProductItem[];
}

export interface VideoSection extends BaseSectionProps {
  type: "video";
  badgeText?: string;
  title?: string;
  subtitle?: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface ServiceAreaSection extends BaseSectionProps {
  type: "service_area";
  badgeText?: string;
  title: string;
  subtitle: string;
  zoneText: string;
  mapImageUrl: string;
}

export interface PainPointItem {
  id: string;
  title: string;
  description: string;
}

export interface PainPointsSection extends BaseSectionProps {
  type: "pain_points";
  badgeText: string;
  title: string;
  subtitle: string;
  items: PainPointItem[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface FeaturesSection extends BaseSectionProps {
  type: "features";
  badgeText: string;
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
}

export interface SocialProofSection extends BaseSectionProps {
  type: "social_proof";
  badgeText: string;
  title: string;
  ratingAverage: number;
  totalReviewsText: string;
  items: ReviewItem[];
}

export interface PricingOffer {
  id: string;
  name: string;
  isPopular?: boolean;
  regularPrice: number;
  salePrice: number;
  currency: CurrencyCode;
  features: string[];
  stockLeft?: number;
}

export interface PricingSection extends BaseSectionProps {
  type: "pricing";
  badgeText: string;
  title: string;
  subtitle: string;
  guaranteeText: string;
  offer: PricingOffer;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSection extends BaseSectionProps {
  type: "faq";
  badgeText: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface OrderFormConfig extends BaseSectionProps {
  type: "order_form";
  title: string;
  subtitle: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  cities: string[];
}

export interface CaptureFormSection extends BaseSectionProps {
  type: "capture_form";
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  collectPhone: boolean;
  collectName: boolean;
  collectEmail: boolean;
  redirectUrl?: string;
  targetStepSlug?: string;
}

export interface ThankYouSection extends BaseSectionProps {
  type: "thank_you";
  title: string;
  subtitle: string;
  instructions: string[];
  whatsappSupportNumber?: string;
  nextActionText?: string;
  nextActionUrl?: string;
  nextActionTargetStepSlug?: string;
}

export type FunnelSection =
  | HeroSection
  | FloatingTrustCardsSection
  | ProductShowcaseSection
  | VideoSection
  | ServiceAreaSection
  | StepsSection
  | StatsSection
  | PainPointsSection
  | FeaturesSection
  | SocialProofSection
  | PricingSection
  | OrderFormConfig
  | CaptureFormSection
  | ThankYouSection
  | FaqSection;

export interface ThemeConfig {
  preset: DesignPreset;
  primaryColor: string;
  accentColor: string;
  pageBackground: string;
  cardBackground: string;
  cardBorderColor: string;
  textColor: string;
  textMutedColor: string;
  fontFamily: "Plus Jakarta Sans" | "Inter" | "Poppins" | "Geist";
  isDarkTheme: boolean;
  bannerUrgencyText?: string;
  countdownMinutes?: number;
}

export interface FunnelStep {
  id: string;
  name: string; // Ex: "1. Capture", "2. Vente", "3. Commande", "4. Remerciement"
  slug: string; // Ex: "capture", "offre", "commande", "merci"
  pageType: FunnelPageType;
  sections: FunnelSection[];
  nextStepSlug?: string;
}

export interface FunnelPageData {
  projectName: string;
  slug: string;
  pageType: FunnelPageType;
  metaTitle: string;
  metaDescription: string;
  branding: BrandingConfig;
  theme: ThemeConfig;
  sections: FunnelSection[];
  steps?: FunnelStep[];
  activeStepId?: string;
}
