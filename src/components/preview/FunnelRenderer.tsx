"use client";

import React, { useState, useEffect } from "react";
import {
  FunnelPageData,
  HeroSection,
  FloatingTrustCardsSection,
  StepsSection,
  StatsSection,
  ProductShowcaseSection,
  VideoSection,
  ServiceAreaSection,
  PainPointsSection,
  FeaturesSection,
  SocialProofSection,
  PricingSection,
  OrderFormConfig,
  CaptureFormSection,
  ThankYouSection,
  FaqSection,
  CurrencyCode,
  FunnelSection,
  ProductItem,
  ProductVariant,
  TicketTier,
  SplitShowcaseSection,
  InteractiveSliderSection,
  BentoGridSection,
  SplitHighlightItem,
  SliderItem,
  BentoCardItem,
} from "@/types/page";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Flame,
  Trash2,
  Edit3,
  MapPin,
  PhoneCall,
  Check,
  Camera,
  Timer,
  Phone,
  Clock,
  Package,
  Video,
  GripVertical,
  Plus,
  CreditCard,
  Wallet,
  Zap,
  Award,
  TrendingUp,
  Layers,
  Repeat,
} from "lucide-react";

interface FunnelRendererProps {
  data: FunnelPageData;
  isEditable?: boolean;
  deviceMode?: "mobile" | "tablet" | "desktop";
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onUpdateSection?: (sectionId: string, updatedFields: Record<string, any>) => void;
  onDeleteSection?: (sectionId: string) => void;
  onMoveSection?: (index: number, direction: "up" | "down") => void;
  onReorderSections?: (fromIndex: number, toIndex: number) => void;
  onOrderSuccess?: (orderDetails: any) => void;
  onOpenSettings?: () => void;
  onOpenImagePicker?: (targetSectionId: string, itemIndex?: number) => void;
  onSwitchStep?: (targetStepIdOrSlug: string) => void;
  onInsertWidget?: (widgetId: string, atIndex: number) => void;
}

// Convertisseur intelligent d'URLs vidéo
function getEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}

// COMPOSANT D'ÉDITION DIRECTE DU TEXTE AU CLIC (WYSIWYG SUR CANEVAS)
function InlineText({
  value,
  onSave,
  className = "",
  isEditable = false,
  tag = "span",
  style,
}: {
  value: string;
  onSave?: (val: string) => void;
  className?: string;
  isEditable?: boolean;
  tag?: "span" | "h1" | "h2" | "h3" | "p";
  style?: React.CSSProperties;
}) {
  const safeWrapClass = "inline-block max-w-full break-words [overflow-wrap:anywhere]";

  if (!isEditable || !onSave) {
    const Component = tag;
    return (
      <Component className={`${safeWrapClass} ${className}`} style={style}>
        {value}
      </Component>
    );
  }

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.textContent || "";
        if (text !== value) {
          onSave(text);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      style={style}
      className={`${safeWrapClass} ${className} outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-500/10 rounded-md px-1 transition-all cursor-text hover:ring-1 hover:ring-indigo-400/40`}
      title="Cliquez pour modifier directement ce texte"
    >
      {value}
    </span>
  );
}

// BARRE D'OUTILS DIRECTIONNELLE (4 DIRECTIONS HAUT, BAS, GAUCHE, DROITE + DRAG)
function CardReorderToolbar({
  idx,
  total,
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDragCardStart,
  isSectionSelected,
  isEditable,
}: {
  idx: number;
  total: number;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onDragCardStart?: (e: React.DragEvent) => void;
  isSectionSelected?: boolean;
  isEditable?: boolean;
}) {
  if (!isEditable) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-2.5 left-2.5 z-30 flex items-center gap-1 bg-slate-950/95 border border-white/20 rounded-xl px-2 py-1 shadow-2xl backdrop-blur-md transition-all ${
        isSectionSelected
          ? "opacity-100 ring-2 ring-indigo-500/80 shadow-indigo-500/20"
          : "opacity-0 group-hover/card:opacity-100"
      }`}
    >
      <span className="text-[10px] text-indigo-400 font-mono font-bold px-1">#{idx + 1}</span>

      {onMoveLeft && (
        <button
          onClick={onMoveLeft}
          disabled={idx === 0}
          className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
          title="Déplacer vers la gauche (←)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      )}

      {onMoveRight && (
        <button
          onClick={onMoveRight}
          disabled={idx === total - 1}
          className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
          title="Déplacer vers la droite (→)"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}

      {onMoveUp && (
        <button
          onClick={onMoveUp}
          disabled={idx === 0}
          className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
          title="Monter en haut (↑)"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      )}

      {onMoveDown && (
        <button
          onClick={onMoveDown}
          disabled={idx === total - 1}
          className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-20 cursor-pointer"
          title="Descendre en bas (↓)"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer ml-0.5"
          title="Supprimer cet élément"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function CanvasDropZone({
  index,
  onDropWidget,
  isEditable,
  primaryColor,
}: {
  index: number;
  onDropWidget?: (widgetId: string, atIndex: number) => void;
  isEditable?: boolean;
  primaryColor: string;
}) {
  const [isOver, setIsOver] = useState(false);
  if (!isEditable) return null;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        if (!isOver) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const widgetId =
          e.dataTransfer.getData("application/tuneliva-widget") ||
          e.dataTransfer.getData("text/plain");
        if (widgetId && onDropWidget) {
          onDropWidget(widgetId, index);
        }
      }}
      className={`transition-all duration-200 flex items-center justify-center my-1 rounded-2xl ${
        isOver
          ? "py-4 border-2 border-dashed shadow-xl scale-[1.01]"
          : "py-1 opacity-0 hover:opacity-100 hover:py-2.5"
      }`}
      style={{
        borderColor: isOver ? primaryColor : "rgba(255,255,255,0.2)",
        backgroundColor: isOver ? `${primaryColor}18` : "transparent",
      }}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm"
        style={{
          backgroundColor: isOver ? primaryColor : "rgba(15,23,42,0.9)",
          color: "#ffffff",
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{isOver ? `Déposer le widget ici (Position ${index + 1})` : "Glisser un widget ici"}</span>
      </div>
    </div>
  );
}

export function FunnelRenderer({
  data,
  isEditable = false,
  deviceMode = "desktop",
  selectedSectionId,
  onSelectSection,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
  onReorderSections,
  onOrderSuccess,
  onOpenSettings,
  onOpenImagePicker,
  onSwitchStep,
  onInsertWidget,
}: FunnelRendererProps) {
  const { theme, branding, sections } = data;
  const isDark = theme.isDarkTheme;
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [detailModalProduct, setDetailModalProduct] = useState<ProductItem | null>(null);
  const [modalSelectedVariant, setModalSelectedVariant] = useState<Record<string, string>>({});

  useEffect(() => {
    if (detailModalProduct) {
      setModalSelectedVariant(detailModalProduct.selectedVariant || {});
    }
  }, [detailModalProduct]);

  // État de glisser-déposer de sections
  const [draggedSectionIdx, setDraggedSectionIdx] = useState<number | null>(null);
  const [dragOverSectionIdx, setDragOverSectionIdx] = useState<number | null>(null);

  // Compte à rebours dynamique
  const [secondsLeft, setSecondsLeft] = useState(6944);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // État des sliders interactifs & Déroulement vertical
  const [activeSliderIndices, setActiveSliderIndices] = useState<Record<string, number>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowScrollTop(window.scrollY > 350);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNextOrOffer = () => {
    const orderEl = document.getElementById("commander") || document.getElementById("offre");
    if (orderEl) {
      orderEl.scrollIntoView({ behavior: "smooth" });
    } else if (typeof window !== "undefined") {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [isClientMobile, setIsClientMobile] = useState(false);
  const [isClientTablet, setIsClientTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsClientMobile(window.innerWidth < 640);
        setIsClientTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const layoutWidth = theme.pageLayoutWidth || "boxed";
  const headerMaxClass =
    layoutWidth === "fluid"
      ? "w-full max-w-[96%] xl:max-w-[1550px] mx-auto"
      : layoutWidth === "canvas"
      ? "w-full px-4 sm:px-8"
      : "max-w-6xl mx-auto w-full";

  const isMobile = deviceMode === "mobile" || (!isEditable && isClientMobile);
  const isTablet = deviceMode === "tablet" || (!isEditable && isClientTablet);

  // Grilles responsives strictes (zéro débordement)
  const grid3Cols = isMobile
    ? "grid-cols-1 gap-4"
    : isTablet
    ? "grid-cols-1 sm:grid-cols-2 gap-4"
    : "grid-cols-1 md:grid-cols-3 gap-5";

  // STYLES ÉTUDIÉS SELON LE THÈME ET LE CARD STYLE
  const cardStyle = theme.cardStyle || (isDark ? "glass" : "elevated");
  const cardBgClass =
    cardStyle === "glass"
      ? isDark
        ? "bg-[#0B1020]/75 backdrop-blur-xl border border-white/10 text-white shadow-2xl"
        : "bg-white/80 backdrop-blur-xl border border-slate-200/80 text-slate-900 shadow-xl shadow-indigo-100/40"
      : cardStyle === "glowing_border"
      ? isDark
        ? "bg-[#0A1024]/85 backdrop-blur-xl border text-white shadow-2xl transition-all"
        : "bg-white border text-slate-900 shadow-xl"
      : isDark
      ? "bg-[#0B1020]/90 border-white/10 text-white shadow-xl backdrop-blur-md"
      : "bg-white border-slate-200/90 text-slate-900 shadow-lg shadow-slate-200/60";

  const headingClass = isDark ? "text-white" : "text-slate-950 font-black";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-600";

  const bgStyle: React.CSSProperties = {
    backgroundColor: theme.pageBackground || (isDark ? "#07080D" : "#FFFFFF"),
    backgroundImage: theme.backgroundGradient || undefined,
    backgroundAttachment: "fixed",
    fontFamily: theme.fontFamily ? `${theme.fontFamily}, sans-serif` : undefined,
  };

  // Formulaire de commande & Inscription
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCity, setCustomerCity] = useState(branding?.address?.city || "Cotonou");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  // Sélecteurs spécifiques (Billetterie / App / Digital)
  const [selectedTicketTierId, setSelectedTicketTierId] = useState(
    data.eventDetails?.ticketTiers?.[0]?.id || "tier-std"
  );
  const [selectedAppPlatform, setSelectedAppPlatform] = useState<"ios" | "android" | "web">("ios");

  // Prix et Devise
  const pricingSection = sections.find((s) => s.type === "pricing") as PricingSection | undefined;
  const currentPrice = pricingSection?.offer.salePrice || 22000;
  const currency = pricingSection?.offer.currency || "XOF";

  // Calcul du prix actif (dynamique selon billet si billetterie)
  const selectedTicket = data.eventDetails?.ticketTiers?.find(
    (t) => t.id === selectedTicketTierId
  );
  const activePrice = selectedTicket ? selectedTicket.price : currentPrice;

  const formatMoney = (amount: number, curr: CurrencyCode) => {
    if (curr === "XOF" || curr === "XAF") {
      return `${amount.toLocaleString("fr-FR")} FCFA`;
    }
    if (curr === "EUR") return `${amount} €`;
    if (curr === "USD") return `$${amount}`;
    return `${amount} ${curr}`;
  };

  // Moyens de paiement et données de transaction
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cod" | "momo" | "card">("cod");
  const [selectedMomoOperator, setSelectedMomoOperator] = useState<string>("Wave");
  const [momoPhone, setMomoPhone] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleCodSubmit = (e: React.FormEvent) => {
    handlePaymentSubmit(e, "cod");
  };

  const handlePaymentSubmit = async (e: React.FormEvent, method: "cod" | "momo" | "card") => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Veuillez renseigner votre nom et votre numéro de téléphone.");
      return;
    }

    const isDigitalOrEvent = [
      "event_booking",
      "app_launch",
      "digital_product",
      "service",
    ].includes(data.pageType);

    if (isDigitalOrEvent && !customerEmail) {
      alert("Veuillez renseigner votre adresse email pour recevoir vos accès ou billets.");
      return;
    }

    setOrderSubmitting(true);

    if (method === "momo" || method === "card") {
      try {
        const res = await fetch("/api/payment/fedapay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funnelSlug: data.slug,
            productName: selectedTicket ? `${data.projectName} - ${selectedTicket.name}` : data.projectName,
            customerName,
            customerPhone: momoPhone || customerPhone,
            customerEmail,
            customerCity: isDigitalOrEvent ? "En ligne" : customerCity,
            customerAddress: isDigitalOrEvent ? "" : customerAddress,
            amount: activePrice,
            currency,
          }),
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.checkoutUrl) {
            window.location.href = resData.checkoutUrl;
            return;
          }
        }
      } catch (err) {
        console.error("Erreur création paiement FedaPay:", err);
      }
    }

    setTimeout(() => {
      setOrderSubmitting(false);
      setOrderDone(true);
      if (onOrderSuccess) {
        onOrderSuccess({
          customerName,
          customerPhone,
          customerEmail,
          customerCity: isDigitalOrEvent ? "En ligne" : customerCity,
          customerAddress: isDigitalOrEvent ? "" : customerAddress,
          productName: selectedTicket ? `${data.projectName} - ${selectedTicket.name}` : data.projectName,
          amount: activePrice,
          currency,
          paymentMethod: method,
          ticketTier: selectedTicket?.name,
          platform: selectedAppPlatform,
          paymentDetails:
            method === "momo"
              ? { operator: selectedMomoOperator, phone: momoPhone || customerPhone }
              : method === "card"
              ? { cardHolder, last4: cardNumber.slice(-4) || "4242" }
              : undefined,
        });
      }
    }, 850);
  };

  const handleWhatsAppClick = (whatsappNumber: string) => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Bonjour ${branding?.businessName || ""} ! Je souhaite commander "${data.projectName}" au prix de ${formatMoney(
        currentPrice,
        currency
      )}. Pouvez-vous me confirmer les modalités de livraison ?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  const renderHeader = () => {
    const variant = branding?.headerVariant || "classic";

    if (variant === "centered_minimal") {
      return (
        <header
          className={`border-b backdrop-blur-md px-4 sm:px-8 py-4 sm:py-5 ${headerMaxClass} transition-all ${
            isDark ? "bg-[#07080D]/95 text-white" : "bg-white/95 text-slate-900 shadow-sm"
          }`}
          style={{
            borderColor: `${theme.primaryColor}25`,
            borderBottomWidth: "1.5px",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Gauche: Assurance discrète */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4" style={{ color: theme.primaryColor }} />
              <span>Garantie Qualité & Authenticité</span>
            </div>

            {/* Centre: Logo & Marque centré luxe */}
            <div className="flex flex-col items-center justify-center text-center mx-auto">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.businessName}
                  className="h-10 sm:h-12 w-auto object-contain rounded-xl shadow-md mb-1"
                />
              ) : (
                <div
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg mb-1 ring-4 ring-offset-2 ring-offset-black/50"
                  style={{
                    backgroundColor: theme.primaryColor,
                    boxShadow: `0 0 20px ${theme.primaryColor}40`,
                  }}
                >
                  {(branding?.businessName || data.projectName || "T").slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className={`font-black text-sm sm:text-lg tracking-widest uppercase block ${headingClass}`}>
                {branding?.businessName || data.projectName}
              </span>
              {branding?.tagline && (
                <span className={`text-[10px] sm:text-xs tracking-wider block text-slate-400 font-medium`}>
                  {branding.tagline}
                </span>
              )}
            </div>

            {/* Droite: Contact WhatsApp */}
            <div className="shrink-0">
              {branding?.whatsappNumber ? (
                <button
                  onClick={() => handleWhatsAppClick(branding.whatsappNumber!)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-transform hover:scale-105 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span className={isMobile ? "hidden" : "inline"}>Service Client</span>
                </button>
              ) : branding?.phone ? (
                <a
                  href={`tel:${branding.phone}`}
                  className="flex items-center gap-1.5 text-xs font-bold hover:underline"
                  style={{ color: theme.primaryColor }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{branding.phone}</span>
                </a>
              ) : null}
            </div>
          </div>
        </header>
      );
    }

    if (variant === "split_banner") {
      return (
        <div className="w-full">
          {/* Top Urgency Flash Bar */}
          <div
            className="px-3 sm:px-6 py-2 text-xs font-black text-white flex flex-wrap items-center justify-between gap-2 shadow-md"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <div className={`flex items-center gap-2 ${headerMaxClass} justify-between`}>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="tracking-wide uppercase text-[11px] sm:text-xs">
                  {theme.bannerUrgencyText || "⚡ Vente Flash Exclusive • Stock Limité • Expédition Immédiate"}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-black/30 px-2.5 py-0.5 rounded-full text-[11px] font-mono">
                <Timer className="w-3 h-3" />
                <span>Offre expire dans {formatCountdown(secondsLeft)}</span>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <header
            className={`border-b px-3 sm:px-8 py-3 flex items-center justify-between ${headerMaxClass} transition-colors ${
              isDark ? "bg-[#07080D]/90 text-white" : "bg-white/95 text-slate-900 shadow-sm"
            }`}
            style={{ borderColor: `${theme.primaryColor}30` }}
          >
            <div className="flex items-center gap-3">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.businessName}
                  className="h-8 sm:h-10 w-auto object-contain rounded-lg"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {(branding?.businessName || data.projectName || "T").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className={`font-black text-sm sm:text-base block truncate ${headingClass}`}>
                  {branding?.businessName || data.projectName}
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Boutique certifiée 2026</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-xl border border-white/5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Expédition suivie 24h</span>
              </div>
              {branding?.whatsappNumber && (
                <button
                  onClick={() => handleWhatsAppClick(branding.whatsappNumber!)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span className={isMobile ? "hidden" : "inline"}>WhatsApp Direct</span>
                </button>
              )}
            </div>
          </header>
        </div>
      );
    }

    if (variant === "floating_pill") {
      return (
        <div className="sticky top-2 z-40 px-3 sm:px-6 w-full max-w-5xl mx-auto py-2">
          <header
            className={`rounded-full border backdrop-blur-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-2xl transition-all ${
              isDark ? "bg-slate-950/85 text-white border-white/15" : "bg-white/90 text-slate-900 border-slate-200/90 shadow-slate-300/40"
            }`}
            style={{
              boxShadow: `0 8px 30px ${theme.primaryColor}20`,
            }}
          >
            <div className="flex items-center gap-2.5 truncate">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.businessName}
                  className="h-7 sm:h-8 w-auto object-contain rounded-full"
                />
              ) : (
                <div
                  className="w-7 sm:h-8 w-7 sm:w-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {(branding?.businessName || data.projectName || "T").slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className={`font-black text-xs sm:text-sm truncate ${headingClass}`}>
                {branding?.businessName || data.projectName}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Livraison 24h & Paiement à la réception</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#commander"
                className="px-3.5 py-1.5 rounded-full text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Commander
              </a>
              {branding?.whatsappNumber && (
                <button
                  onClick={() => handleWhatsAppClick(branding.whatsappNumber!)}
                  className="p-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] transition-all cursor-pointer"
                  title="WhatsApp direct"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                </button>
              )}
            </div>
          </header>
        </div>
      );
    }

    // Default "classic"
    return (
      <div className="w-full">
        <div
          className={`px-3 sm:px-8 py-1.5 sm:py-2 border-b text-[11px] sm:text-xs flex flex-wrap items-center justify-between gap-2 ${headerMaxClass} transition-colors ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
          style={{
            backgroundColor: isDark ? `${theme.primaryColor}18` : `${theme.primaryColor}0A`,
            borderColor: `${theme.primaryColor}30`,
          }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" style={{ color: theme.primaryColor }} />
            <span className="truncate">Livraison 24h • Paiement à la réception ou Mobile Money</span>
          </div>
          {branding?.phone && (
            <a
              href={`tel:${branding.phone}`}
              className="flex items-center gap-1.5 font-bold hover:underline"
              style={{ color: theme.primaryColor }}
            >
              <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{branding.phone}</span>
            </a>
          )}
        </div>

        <header
          className={`border-b backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between ${headerMaxClass} transition-colors ${
            isDark ? "bg-[#07080D]/90" : "bg-white/95 shadow-sm"
          }`}
          style={{
            borderColor: `${theme.primaryColor}25`,
            borderBottomWidth: "1.5px",
          }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.businessName}
                className="h-8 sm:h-10 w-auto object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow-md shrink-0"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {(branding?.businessName || data.projectName || "T").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="truncate">
              <span className={`font-extrabold text-xs sm:text-base tracking-tight block truncate ${headingClass}`}>
                {branding?.businessName || data.projectName}
              </span>
              {branding?.tagline && (
                <span className={`text-[9px] sm:text-xs block -mt-0.5 truncate ${mutedTextClass}`}>
                  {branding.tagline}
                </span>
              )}
            </div>
          </div>

          {branding?.whatsappNumber && (
            <button
              onClick={() => handleWhatsAppClick(branding.whatsappNumber!)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] sm:text-xs font-bold shadow-md shadow-emerald-900/20 transition-all shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className={isMobile ? "hidden" : "inline"}>WhatsApp Direct</span>
            </button>
          )}
        </header>
      </div>
    );
  };

  const renderFooter = () => {
    const variant = branding?.footerVariant || "modern_3cols";
    const footerBg =
      branding?.footerBgColor ||
      (isDark ? `${theme.primaryColor}14` : `${theme.primaryColor}08`);

    if (variant === "centered_luxury") {
      return (
        <footer
          className="border-t mt-16 py-10 sm:py-14 px-4 sm:px-8 text-center transition-colors"
          style={{
            backgroundColor: footerBg,
            borderTopColor: `${theme.primaryColor}40`,
            borderTopWidth: "2px",
          }}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Monogramme ou Logo centré */}
            <div className="flex justify-center">
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.businessName}
                  className="h-12 w-auto object-contain rounded-2xl shadow-lg"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl ring-4 ring-offset-2 ring-offset-black/50"
                  style={{
                    backgroundColor: theme.primaryColor,
                    boxShadow: `0 0 25px ${theme.primaryColor}50`,
                  }}
                >
                  {(branding?.businessName || data.projectName || "T").slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-black text-base sm:text-lg uppercase tracking-widest text-white">
                {branding?.businessName || data.projectName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                {branding?.tagline || "L'excellence au service de votre satisfaction au quotidien."}
              </p>
            </div>

            {/* Ruban de 4 badges de réassurance */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Paiement Sécurisé
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                Livraison Rapide 24h
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Garantie 30 Jours
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                Satisfaction 100%
              </span>
            </div>

            {/* Contacts & Adresse */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-2">
              {branding?.phone && (
                <a href={`tel:${branding.phone}`} className="flex items-center gap-1.5 hover:underline font-bold">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>{branding.phone}</span>
                </a>
              )}
              {branding?.whatsappNumber && (
                <button
                  onClick={() => handleWhatsAppClick(branding.whatsappNumber!)}
                  className="flex items-center gap-1.5 hover:underline font-bold text-emerald-400 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{branding.whatsappNumber}</span>
                </button>
              )}
              {branding?.address && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{branding.address.fullAddress || `${branding.address.city}, ${branding.address.country}`}</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-6 text-[11px] text-slate-500">
              <p>© {new Date().getFullYear()} {branding?.businessName || data.projectName}. Tous droits réservés.</p>
              <p className="mt-1 flex items-center justify-center gap-1">
                <span>Conçu et propulsé avec rapidité par</span>
                <span className="font-bold text-indigo-400">Tuneliva</span>
              </p>
            </div>
          </div>
        </footer>
      );
    }

    if (variant === "compact_reassurance") {
      return (
        <footer
          className="border-t mt-16 py-8 px-4 sm:px-8 transition-colors text-slate-300"
          style={{
            backgroundColor: footerBg,
            borderTopColor: `${theme.primaryColor}40`,
            borderTopWidth: "2px",
          }}
        >
          <div className={`${headerMaxClass} space-y-6`}>
            {/* Grille de 4 cartes réassurance horizontales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Livraison 24h</h4>
                  <p className="text-[10px] text-slate-400">Expédition suivie express</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Paiement Réception</h4>
                  <p className="text-[10px] text-slate-400">Vérifiez avant de régler</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Garantie 30 Jours</h4>
                  <p className="text-[10px] text-slate-400">Satisfait ou remboursé</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Support 7j/7</h4>
                  <p className="text-[10px] text-slate-400">Assistance WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Bottom copyright line */}
            <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
              <div>
                <span className="font-bold text-white">{branding?.businessName || data.projectName}</span>
                {branding?.address && (
                  <span className="ml-2">({branding.address.city}, {branding.address.country})</span>
                )}
                <span className="ml-2">• © {new Date().getFullYear()} Tous droits réservés</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Propulsé par</span>
                <span className="font-bold text-indigo-400">Tuneliva</span>
              </div>
            </div>
          </div>
        </footer>
      );
    }

    // Default "modern_3cols"
    return (
      <footer
        className={`border-t mt-16 py-8 sm:py-12 px-4 sm:px-6 text-[11px] sm:text-xs transition-colors ${
          branding?.footerBgColor
            ? ""
            : isDark
            ? "text-slate-300"
            : "text-slate-700 shadow-inner"
        }`}
        style={{
          backgroundColor: footerBg,
          borderTopColor: `${theme.primaryColor}40`,
          borderTopWidth: "2px",
        }}
      >
        <div className={`${headerMaxClass} grid ${grid3Cols} gap-6 sm:gap-8 text-left`}>
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm sm:text-base">
              {branding?.businessName || data.projectName}
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs">
              {branding?.tagline || "Votre satisfaction et la qualité supérieure sont nos priorités absolues."}
            </p>
            {branding?.address && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{branding.address.fullAddress || `${branding.address.city}, ${branding.address.country}`}</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Garanties & Confiance</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Paiement sécurisé à la livraison ou Mobile Money</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Garantie Satisfait ou Remboursé 30j</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Expédition express suivie sous 24h</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Assistance Client</h4>
            {branding?.phone && (
              <div className="flex items-center gap-2 text-white font-semibold">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{branding.phone}</span>
              </div>
            )}
            {branding?.whatsappNumber && (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{branding.whatsappNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className={`border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center ${headerMaxClass}`}>
          <p>© {new Date().getFullYear()} {branding?.businessName || data.projectName}. Tous droits réservés.</p>
          <p className="flex items-center justify-center gap-1.5">
            <span>Propulsé avec rapidité par</span>
            <span className="font-bold text-indigo-400">Tuneliva</span>
          </p>
        </div>
      </footer>
    );
  };

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300 relative selection:bg-indigo-500 selection:text-white overflow-x-clip"
      style={bgStyle}
    >
      {/* 0. EFFETS D'AMBIANCE & LUMINESCENCE (AMBIENT MESH GLOW ORBS) */}
      {theme.ambientGlow !== false && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          {/* Orbe zénithal principal (Haut Centré) */}
          <div
            className="absolute -top-36 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1100px] h-[480px] rounded-full blur-[130px] opacity-75 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.glowColor || theme.primaryColor}35 0%, ${theme.glowColor || theme.primaryColor}10 40%, transparent 70%)`,
            }}
          />
          {/* Orbe d'accent secondaire (Flottant à droite) */}
          <div
            className="absolute top-[28%] -right-24 w-[480px] sm:w-[680px] h-[450px] rounded-full blur-[150px] opacity-50 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.accentColor || theme.primaryColor}30 0%, transparent 65%)`,
            }}
          />
          {/* Orbe tertiaire subtil (Flottant en bas à gauche) */}
          <div
            className="absolute top-[62%] -left-28 w-[450px] sm:w-[600px] h-[420px] rounded-full blur-[150px] opacity-40 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.primaryColor}25 0%, transparent 65%)`,
            }}
          />
        </div>
      )}

      {/* 1. BANNIÈRE D'URGENCE / PROMO ÉDITABLE */}
      {theme.bannerUrgencyText && (
        <div
          className="relative z-20 text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm"
          style={{
            background: isDark
              ? "linear-gradient(90deg, #F59E0B, #EA580C, #6366F1)"
              : "linear-gradient(90deg, #EA580C, #C2410C)",
          }}
        >
          <Flame className="w-4 h-4 animate-pulse text-yellow-300 shrink-0" />
          <InlineText
            value={theme.bannerUrgencyText}
            onSave={(val) => {
              if (onUpdateSection) {
                // mise à jour du texte
              }
            }}
            isEditable={isEditable}
          />
        </div>
      )}

      {/* 2 & 3. EN-TÊTE DU SITE / TUNNEL (AVEC 4 VARIATIONS VISUELLES) */}
      <div className="relative z-20">{renderHeader()}</div>

      {/* 4. CORPS DU TUNNEL (AVEC DRAG & DROP DES SECTIONS ET DROP ZONES) */}
      <main
        className={`relative z-10 ${
          layoutWidth === "fluid"
            ? "w-full max-w-[96%] xl:max-w-[1550px] mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-12 space-y-10 sm:space-y-16 overflow-x-clip box-border"
            : layoutWidth === "canvas"
            ? "w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-8 sm:space-y-12 overflow-x-clip box-border"
            : "max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 space-y-10 sm:space-y-14 overflow-x-clip w-full box-border"
        }`}
      >
        {/* Drop Zone tout en haut de la page */}
        <CanvasDropZone
          index={0}
          onDropWidget={onInsertWidget}
          isEditable={isEditable}
          primaryColor={theme.primaryColor}
        />

        {sections.map((section, idx) => {
          const isSelected = selectedSectionId === section.id;
          const isBeingDragged = draggedSectionIdx === idx;
          const isDragOver = dragOverSectionIdx === idx;

          // Arrière-plan de surface harmonieux
          let surfaceClass = "";
          if (section.sectionSurfaceVariant === "subtle") {
            surfaceClass = isDark
              ? "bg-slate-900/40 border border-white/5 shadow-md"
              : "bg-slate-100/80 border border-slate-200/70 shadow-sm";
          } else if (section.sectionSurfaceVariant === "card_elevated") {
            surfaceClass = isDark
              ? "bg-[#0B1020]/90 border border-white/10 shadow-2xl"
              : "bg-white border border-slate-200 shadow-xl shadow-slate-200/60";
          } else if (section.sectionSurfaceVariant === "brand_tint") {
            surfaceClass = "border shadow-lg";
          }

          // Bridage adaptatif pour mobile (garantie zéro débordement et zéro écrasement)
          const customPaddingStyle: React.CSSProperties = {
            paddingTop:
              section.paddingTopPx !== undefined
                ? `${section.paddingTopPx}px`
                : section.paddingVerticalPx !== undefined
                ? `${section.paddingVerticalPx}px`
                : "36px",
            paddingBottom:
              section.paddingBottomPx !== undefined
                ? `${section.paddingBottomPx}px`
                : section.paddingVerticalPx !== undefined
                ? `${section.paddingVerticalPx}px`
                : "36px",
            paddingLeft: isMobile
              ? `${Math.min(section.paddingLeftPx ?? section.paddingHorizontalPx ?? 16, 20)}px`
              : section.paddingLeftPx !== undefined
              ? `${section.paddingLeftPx}px`
              : section.paddingHorizontalPx !== undefined
              ? `${section.paddingHorizontalPx}px`
              : "24px",
            paddingRight: isMobile
              ? `${Math.min(section.paddingRightPx ?? section.paddingHorizontalPx ?? 16, 20)}px`
              : section.paddingRightPx !== undefined
              ? `${section.paddingRightPx}px`
              : section.paddingHorizontalPx !== undefined
              ? `${section.paddingHorizontalPx}px`
              : "24px",
            marginTop:
              section.marginTopPx !== undefined
                ? `${section.marginTopPx}px`
                : section.marginVerticalPx !== undefined
                ? `${section.marginVerticalPx}px`
                : undefined,
            marginBottom:
              section.marginBottomPx !== undefined
                ? `${section.marginBottomPx}px`
                : section.marginVerticalPx !== undefined
                ? `${section.marginVerticalPx}px`
                : undefined,
            marginLeft: isMobile
              ? undefined
              : section.marginLeftPx !== undefined
              ? `${section.marginLeftPx}px`
              : section.marginHorizontalPx !== undefined
              ? `${section.marginHorizontalPx}px`
              : undefined,
            marginRight: isMobile
              ? undefined
              : section.marginRightPx !== undefined
              ? `${section.marginRightPx}px`
              : section.marginHorizontalPx !== undefined
              ? `${section.marginHorizontalPx}px`
              : undefined,
            borderRadius: section.borderRadiusPx !== undefined ? `${section.borderRadiusPx}px` : undefined,
            backgroundColor:
              section.customBgColor ||
              (section.sectionSurfaceVariant === "brand_tint"
                ? `${theme.primaryColor}0D`
                : undefined),
            borderColor:
              section.sectionSurfaceVariant === "brand_tint"
                ? `${theme.primaryColor}33`
                : undefined,
            color: section.customTextColor || undefined,
          };

          const defaultSectionWidth =
            layoutWidth === "fluid"
              ? "w-full max-w-[96%] xl:max-w-[1440px] px-2 sm:px-6"
              : layoutWidth === "canvas"
              ? "w-full px-4 sm:px-8"
              : "w-full max-w-5xl xl:max-w-6xl px-3 sm:px-6";

          return (
            <div
              key={section.id}
              onClick={() => onSelectSection?.(section.id)}
              onDragOver={(e) => {
                if (!isEditable) return;
                if (e.dataTransfer.types.includes("text/plain")) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverSectionIdx !== idx) setDragOverSectionIdx(idx);
                }
              }}
              onDragLeave={() => {
                if (dragOverSectionIdx === idx) setDragOverSectionIdx(null);
              }}
              onDrop={(e) => {
                if (!isEditable) return;
                const rawIdx = e.dataTransfer.getData("text/plain");
                if (rawIdx !== "") {
                  e.preventDefault();
                  e.stopPropagation();
                  const fromIdx = Number(rawIdx);
                  if (!isNaN(fromIdx) && fromIdx !== idx && onReorderSections) {
                    onReorderSections(fromIdx, idx);
                  }
                }
                setDraggedSectionIdx(null);
                setDragOverSectionIdx(null);
              }}
              className={`relative group/section transition-all cursor-pointer overflow-x-clip w-full box-border ${
                section.maxWidthClass || defaultSectionWidth
              } mx-auto ${surfaceClass} ${
                isBeingDragged ? "opacity-30 scale-95" : ""
              } ${
                isDragOver
                  ? "border-t-4 border-indigo-500 shadow-2xl shadow-indigo-500/50 -translate-y-1 ring-2 ring-indigo-500/40"
                  : ""
              } ${
                isSelected
                  ? "ring-2 ring-indigo-500 shadow-2xl bg-indigo-500/[0.02]"
                  : "hover:ring-1 hover:ring-indigo-500/40"
              }`}
              style={customPaddingStyle}
            >
              {/* BARRE D'OUTILS DE SECTION (TOUJOURS VISIBLE SI SÉLECTIONNÉE) */}
              {isEditable && (
                <div
                  className={`absolute top-2 right-2 z-30 flex items-center gap-1 bg-slate-900/95 border border-slate-700/90 rounded-xl p-1 shadow-2xl backdrop-blur-md transition-opacity ${
                    isSelected ? "opacity-100 ring-2 ring-indigo-500" : "opacity-0 group-hover/section:opacity-100"
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-300 px-1.5 uppercase">
                    {section.type.replace("_", " ")}
                  </span>

                  {onMoveSection && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSection(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Monter la section"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveSection(idx, "down");
                        }}
                        disabled={idx === sections.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Descendre la section"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {onOpenSettings && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSection?.(section.id);
                        onOpenSettings();
                      }}
                      className="p-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      title="Inspecter"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onDeleteSection && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Supprimer cette section ?")) {
                          onDeleteSection(section.id);
                        }
                      }}
                      className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* RENDU DU CONTENU AVEC BARRETTES DE DÉPLACEMENT PARTOUT */}
              {renderSectionContent(section, {
                theme,
                branding,
                isDark,
                cardBgClass,
                headingClass,
                mutedTextClass,
                isMobile,
                isTablet,
                grid3Cols,
                currentPrice,
                currency,
                formatMoney,
                handleWhatsAppClick,
                handleCodSubmit,
                customerName,
                setCustomerName,
                customerPhone,
                setCustomerPhone,
                customerCity,
                setCustomerCity,
                customerAddress,
                setCustomerAddress,
                orderSubmitting,
                orderDone,
                openFaqId,
                setOpenFaqId,
                data,
                onUpdateSection,
                onOpenImagePicker,
                secondsLeft,
                formatCountdown,
                onSwitchStep,
                detailModalProduct,
                setDetailModalProduct,
                isEditable,
                isSectionSelected: isSelected,
                handlePaymentSubmit,
                selectedPaymentMethod,
                setSelectedPaymentMethod,
                selectedMomoOperator,
                setSelectedMomoOperator,
                momoPhone,
                setMomoPhone,
                cardHolder,
                setCardHolder,
                cardNumber,
                setCardNumber,
                cardExpiry,
                setCardExpiry,
                cardCvc,
                setCardCvc,
                customerEmail,
                setCustomerEmail,
                selectedTicketTierId,
                setSelectedTicketTierId,
                selectedAppPlatform,
                setSelectedAppPlatform,
                activePrice,
                activeSliderIndices,
                setActiveSliderIndices,
                scrollToNextOrOffer,
              })}

              {/* Drop Zone après chaque section */}
              <CanvasDropZone
                index={idx + 1}
                onDropWidget={onInsertWidget}
                isEditable={isEditable}
                primaryColor={theme.primaryColor}
              />
            </div>
          );
        })}
      </main>

      {/* 5. PIED DE PAGE (3 VARIATIONS DE DESIGN AVEC TYPO ADAPTÉE) */}
      {renderFooter()}

      {/* BOUTON FLOTTANT DE RETOUR EN HAUT (SCROLL TO TOP) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/50 border border-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center backdrop-blur-md"
          title="Retourner en haut de la page"
          aria-label="Retourner en haut"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* MODAL FICHE PRODUIT DÉTAILLÉE & VARIANTES */}
      {detailModalProduct && (
        <div
          onClick={() => setDetailModalProduct(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1020] border border-white/15 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl text-slate-100 relative"
          >
            <button
              type="button"
              onClick={() => setDetailModalProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
            >
              ✕
            </button>

            {(() => {
              const modalSelectedOpt = Object.values(modalSelectedVariant)[0];
              const modalActiveImg =
                (modalSelectedOpt && detailModalProduct.variantImages?.[modalSelectedOpt]) ||
                detailModalProduct.imageUrl;

              return (
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-video bg-black/40 border border-white/10 relative">
                    <img
                      src={modalActiveImg}
                      alt={detailModalProduct.name}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    {detailModalProduct.badge && (
                      <span
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {detailModalProduct.badge}
                      </span>
                    )}
                    {modalSelectedOpt && detailModalProduct.variantImages?.[modalSelectedOpt] && (
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/70 text-indigo-300 border border-indigo-400/30 backdrop-blur-sm">
                        📸 {modalSelectedOpt}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {detailModalProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2 shrink-0">
                        <span
                          className="text-xl sm:text-2xl font-black"
                          style={{ color: theme.primaryColor }}
                        >
                          {formatMoney(detailModalProduct.price, currency)}
                        </span>
                        {detailModalProduct.regularPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatMoney(detailModalProduct.regularPrice, currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {detailModalProduct.description}
                    </p>
                  </div>

                  {/* VARIANTES DU PRODUIT */}
                  {detailModalProduct.variants && detailModalProduct.variants.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                        <span>Options & Variantes :</span>
                        <span className="text-[10px] font-normal text-indigo-300">Cliquez pour voir la photo</span>
                      </h4>
                      {detailModalProduct.variants.map((v, i) => (
                        <div key={i} className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-slate-400">
                            {v.name} :
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {v.options.map((opt, optIdx) => {
                              const isOptSelected =
                                modalSelectedVariant[v.name] === opt ||
                                (!modalSelectedVariant[v.name] && optIdx === 0);
                              const hasVariantImg = !!detailModalProduct.variantImages?.[opt];

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    setModalSelectedVariant((prev) => ({ ...prev, [v.name]: opt }));
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isOptSelected
                                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30"
                                      : "bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-white/30"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {hasVariantImg && (
                                    <span className="text-[10px]" title="Photo dédiée disponible">📸</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* CARACTÉRISTIQUES / POINTS FORTS */}
            {detailModalProduct.features && detailModalProduct.features.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Points Forts & Spécifications :
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {detailModalProduct.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-white/10">
              <a
                href="#commander"
                onClick={() => setDetailModalProduct(null)}
                className="block w-full py-3.5 px-4 rounded-xl text-center font-black text-white text-xs sm:text-sm shadow-xl transition-transform hover:scale-[1.02] cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Commander ce produit maintenant
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderSectionContent(section: FunnelSection, ctx: any) {
  const {
    theme,
    isDark,
    cardBgClass,
    headingClass,
    mutedTextClass,
    isMobile,
    isTablet,
    grid3Cols,
    currentPrice,
    currency,
    formatMoney,
    handleWhatsAppClick,
    handleCodSubmit,
    data,
    onUpdateSection,
    onOpenImagePicker,
    isEditable,
    isSectionSelected,
  } = ctx;

  const updateField = (fieldKey: string, value: any) => {
    if (onUpdateSection) {
      onUpdateSection(section.id, { [fieldKey]: value });
    }
  };

  const reorderArray = (arrayKey: string, fromIdx: number, toIdx: number) => {
    const list = [...(section as any)[arrayKey]];
    if (toIdx < 0 || toIdx >= list.length) return;
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    updateField(arrayKey, list);
  };

  const deleteFromArray = (arrayKey: string, targetIdx: number) => {
    const list = [...(section as any)[arrayKey]];
    list.splice(targetIdx, 1);
    updateField(arrayKey, list);
  };

  const customTitleStyle: React.CSSProperties = (section as any).customTitleColor
    ? { color: (section as any).customTitleColor }
    : {};
  const customTextStyle: React.CSSProperties = (section as any).customTextColor
    ? { color: (section as any).customTextColor }
    : {};

  switch (section.type) {
    // ==========================================
    // 1. HERO SECTION
    // ==========================================
    case "hero": {
      const s = section as HeroSection;
      const titleSizeClass =
        s.titleSize === "sm"
          ? "text-2xl sm:text-3xl"
          : s.titleSize === "lg"
          ? "text-4xl sm:text-6xl"
          : s.titleSize === "xl"
          ? "text-4xl sm:text-7xl"
          : "text-3xl sm:text-5xl";

      return (
        <section className="text-center space-y-6 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <InlineText
              value={s.badgeText}
              onSave={(val) => updateField("badgeText", val)}
              isEditable={isEditable}
            />
          </div>

          <h1
            className={`${titleSizeClass} font-black tracking-tight leading-tight sm:leading-tight max-w-3xl mx-auto px-2 ${headingClass}`}
            style={{ color: s.customTitleColor || undefined }}
          >
            <InlineText
              value={s.title}
              onSave={(val) => updateField("title", val)}
              isEditable={isEditable}
            />
          </h1>

          <p
            className={`text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2 ${mutedTextClass}`}
            style={{ color: s.customTextColor || undefined }}
          >
            <InlineText
              value={s.subtitle}
              onSave={(val) => updateField("subtitle", val)}
              isEditable={isEditable}
            />
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-lg mx-auto w-full px-4">
            {/* BOUTON PRINCIPAL 1 */}
            <a
              href={
                s.ctaTargetStepSlug
                  ? (isEditable ? `#step-${s.ctaTargetStepSlug}` : `/p/${data.slug}/${s.ctaTargetStepSlug}`)
                  : (s.ctaLink || "#commander")
              }
              onClick={(e) => {
                if (isEditable && s.ctaTargetStepSlug && ctx.onSwitchStep) {
                  e.preventDefault();
                  ctx.onSwitchStep(s.ctaTargetStepSlug);
                }
              }}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-white text-xs sm:text-sm uppercase tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <InlineText
                value={s.ctaText}
                onSave={(val) => updateField("ctaText", val)}
                isEditable={isEditable}
              />
            </a>

            {/* BOUTON SECONDAIRE 2 (WHATSAPP OU PAGE DU TUNNEL) */}
            {ctx.branding?.whatsappNumber ? (
              <button
                onClick={() => handleWhatsAppClick(ctx.branding.whatsappNumber)}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-white text-xs sm:text-sm uppercase tracking-wide bg-[#25D366] hover:bg-[#20ba59] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>
                  <InlineText
                    value={s.secondaryCtaText || "WhatsApp Direct"}
                    onSave={(val) => updateField("secondaryCtaText", val)}
                    isEditable={isEditable}
                  />
                </span>
              </button>
            ) : s.secondaryCtaText ? (
              <a
                href={
                  s.secondaryCtaTargetStepSlug
                    ? (isEditable ? `#step-${s.secondaryCtaTargetStepSlug}` : `/p/${data.slug}/${s.secondaryCtaTargetStepSlug}`)
                    : (s.secondaryCtaLink || "#commander")
                }
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold border-2 border-white/20 hover:border-white/40 text-white text-xs sm:text-sm uppercase tracking-wide bg-slate-900/60 hover:bg-slate-800 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <InlineText
                  value={s.secondaryCtaText}
                  onSave={(val) => updateField("secondaryCtaText", val)}
                  isEditable={isEditable}
                />
              </a>
            ) : null}
          </div>

          {s.ctaSubtext && (
            <p className={`text-xs text-center ${mutedTextClass}`}>
              <InlineText
                value={s.ctaSubtext}
                onSave={(val) => updateField("ctaSubtext", val)}
                isEditable={isEditable}
              />
            </p>
          )}

          <div
            onClick={(e) => {
              if (isEditable && onOpenImagePicker) {
                e.stopPropagation();
                onOpenImagePicker(s.id);
              }
            }}
            className="relative rounded-3xl overflow-hidden border border-slate-200/20 shadow-2xl bg-slate-900/60 max-w-2xl mx-auto aspect-video sm:aspect-[16/10] group cursor-pointer"
          >
            <img
              src={s.imageUrl}
              alt={s.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

            {isEditable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenImagePicker?.(s.id);
                }}
                className="absolute bottom-3.5 right-3.5 px-4 py-2 rounded-xl bg-black/85 hover:bg-black text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-xl group-hover:scale-105 transition-all"
              >
                <Camera className="w-4 h-4 text-yellow-400" />
                <span>Changer la photo (PC ou Banque)</span>
              </button>
            )}
          </div>

          <div className={`pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm ${mutedTextClass}`}>
            {s.trustPoints.map((tp, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <InlineText
                  value={tp}
                  onSave={(val) => {
                    const updated = [...s.trustPoints];
                    updated[idx] = val;
                    updateField("trustPoints", updated);
                  }}
                  isEditable={isEditable}
                />
              </div>
            ))}
          </div>

          {/* BOUTON DE DÉROULEMENT VERTICAL FLUIDE (SCROLL DOWN) */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={ctx.scrollToNextOrOffer}
              className="px-4 py-2 rounded-full border border-white/20 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer flex items-center gap-2 text-xs font-semibold hover:scale-105 active:scale-95"
              title="Dérouler la page vers la suite de l'offre"
            >
              <span>Découvrir la suite</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-indigo-400" />
            </button>
          </div>
        </section>
      );
    }

    // ==========================================
    // 2. SHOWCASE PRODUITS / PACKS (AVEC 4 DIRECTIONS)
    // ==========================================
    case "product_showcase": {
      const s = section as ProductShowcaseSection;
      return (
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2
              className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}
              style={{ color: s.customTitleColor || undefined }}
            >
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p
              className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`}
              style={{ color: s.customTextColor || undefined }}
            >
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className={`grid ${grid3Cols}`}>
            {s.items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border text-left flex flex-col justify-between space-y-4 transition-all hover:scale-[1.02] relative group/card ${cardBgClass}`}
              >
                {/* BARRETTES DE DÉPLACEMENT 4 DIRECTIONS */}
                <CardReorderToolbar
                  idx={idx}
                  total={s.items.length}
                  onMoveLeft={() => reorderArray("items", idx, idx - 1)}
                  onMoveRight={() => reorderArray("items", idx, idx + 1)}
                  onMoveUp={() => reorderArray("items", idx, idx - 1)}
                  onMoveDown={() => reorderArray("items", idx, idx + 1)}
                  onDelete={() => deleteFromArray("items", idx)}
                  isSectionSelected={isSectionSelected}
                  isEditable={isEditable}
                />

                {item.badge && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-md z-10"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <InlineText
                      value={item.badge}
                      onSave={(val) => {
                        const updated = [...s.items];
                        updated[idx] = { ...updated[idx], badge: val };
                        updateField("items", updated);
                      }}
                      isEditable={isEditable}
                    />
                  </div>
                )}

                {(() => {
                  const itemSelectedOpt = item.selectedVariant ? Object.values(item.selectedVariant)[0] : undefined;
                  const activeItemImg = (itemSelectedOpt && item.variantImages?.[itemSelectedOpt]) || item.imageUrl;

                  return (
                    <div className="space-y-3 pt-6">
                      <div
                        onClick={(e) => {
                          if (isEditable && onOpenImagePicker) {
                            e.stopPropagation();
                            onOpenImagePicker(s.id, idx);
                          }
                        }}
                        className="rounded-2xl overflow-hidden aspect-square relative bg-slate-900 group cursor-pointer"
                      >
                        <img
                          src={activeItemImg}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        {itemSelectedOpt && item.variantImages?.[itemSelectedOpt] && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/75 text-indigo-300 border border-indigo-400/30">
                            📸 {itemSelectedOpt}
                          </span>
                        )}
                        {isEditable && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                            <Camera className="w-4 h-4 text-yellow-300" />
                            <span>Changer photo</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className={`font-bold text-base sm:text-lg ${headingClass}`} style={customTitleStyle}>
                          <InlineText
                            value={item.name}
                            onSave={(val) => {
                              const updated = [...s.items];
                              updated[idx] = { ...updated[idx], name: val };
                              updateField("items", updated);
                            }}
                            isEditable={isEditable}
                          />
                        </h3>
                        <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${mutedTextClass}`} style={customTextStyle}>
                          <InlineText
                            value={item.description}
                            onSave={(val) => {
                              const updated = [...s.items];
                              updated[idx] = { ...updated[idx], description: val };
                              updateField("items", updated);
                            }}
                            isEditable={isEditable}
                          />
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* VARIANTES DU PRODUIT (COULEURS, TAILLES, MODÈLES) */}
                {item.variants && item.variants.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/20 text-left">
                    {item.variants.map((v, vIdx) => (
                      <div key={vIdx} className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          {v.name} :
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {v.options.map((opt, oIdx) => {
                            const isOptSelected =
                              (item.selectedVariant && item.selectedVariant[v.name] === opt) ||
                              (!item.selectedVariant?.[v.name] && oIdx === 0);
                            const hasOptImg = !!item.variantImages?.[opt];

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = [...s.items];
                                  const cur = updated[idx].selectedVariant || {};
                                  updated[idx] = {
                                    ...updated[idx],
                                    selectedVariant: { ...cur, [v.name]: opt },
                                  };
                                  updateField("items", updated);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                  isOptSelected
                                    ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                                    : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                                }`}
                              >
                                <span>{opt}</span>
                                {hasOptImg && (
                                  <span className="text-[8px]" title="Photo dédiée disponible">📸</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-200/30">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black" style={{ color: theme.primaryColor }}>
                        {formatMoney(item.price, currency)}
                      </span>
                      {item.regularPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatMoney(item.regularPrice, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href="#commander"
                    className="block w-full py-3 px-4 rounded-xl text-center font-bold text-white text-xs sm:text-sm shadow-md transition-all hover:opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Commander cet article
                  </a>

                  {/* BOUTON DÉTAILS DU PRODUIT */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      ctx.setDetailModalProduct?.(item);
                    }}
                    className="w-full py-1 text-center text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>🔍 Voir les détails & caractéristiques</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================
    // 3. CARTES FLOTTANTES DE CONFIANCE
    // ==========================================
    case "floating_cards": {
      const s = section as FloatingTrustCardsSection;
      return (
        <section className={`grid ${grid3Cols} max-w-4xl mx-auto`}>
          {s.cards.map((card, idx) => (
            <div
              key={card.id}
              className={`p-6 rounded-3xl border text-center space-y-3 transition-all hover:scale-[1.02] relative group/card ${cardBgClass}`}
            >
              <CardReorderToolbar
                idx={idx}
                total={s.cards.length}
                onMoveLeft={() => reorderArray("cards", idx, idx - 1)}
                onMoveRight={() => reorderArray("cards", idx, idx + 1)}
                onMoveUp={() => reorderArray("cards", idx, idx - 1)}
                onMoveDown={() => reorderArray("cards", idx, idx + 1)}
                onDelete={() => deleteFromArray("cards", idx)}
                isSectionSelected={isSectionSelected}
                isEditable={isEditable}
              />

              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-bold text-white shadow-md pt-1"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {card.icon === "timer" ? (
                  <Timer className="w-6 h-6" />
                ) : card.icon === "shield" ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <Check className="w-6 h-6" />
                )}
              </div>
              <h3 className={`font-bold text-base sm:text-lg ${headingClass}`} style={customTitleStyle}>
                <InlineText
                  value={card.title}
                  onSave={(val) => {
                    const updated = [...s.cards];
                    updated[idx] = { ...updated[idx], title: val };
                    updateField("cards", updated);
                  }}
                  isEditable={isEditable}
                />
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`} style={customTextStyle}>
                <InlineText
                  value={card.description}
                  onSave={(val) => {
                    const updated = [...s.cards];
                    updated[idx] = { ...updated[idx], description: val };
                    updateField("cards", updated);
                  }}
                  isEditable={isEditable}
                />
              </p>
            </div>
          ))}
        </section>
      );
    }

    // ==========================================
    // 4. COMMENT ÇA MARCHE ? (ÉTAPES 1, 2, 3)
    // ==========================================
    case "steps": {
      const s = section as StepsSection;
      return (
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className={`grid ${grid3Cols}`}>
            {s.items.map((step, idx) => (
              <div
                key={step.id}
                className={`p-6 rounded-3xl border text-center space-y-3 transition-all hover:scale-[1.02] relative group/card ${cardBgClass}`}
              >
                <CardReorderToolbar
                  idx={idx}
                  total={s.items.length}
                  onMoveLeft={() => reorderArray("items", idx, idx - 1)}
                  onMoveRight={() => reorderArray("items", idx, idx + 1)}
                  onMoveUp={() => reorderArray("items", idx, idx - 1)}
                  onMoveDown={() => reorderArray("items", idx, idx + 1)}
                  onDelete={() => deleteFromArray("items", idx)}
                  isSectionSelected={isSectionSelected}
                  isEditable={isEditable}
                />

                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center mx-auto text-sm shadow-inner">
                  {step.stepNumber}
                </div>
                <div
                  className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${headingClass}`} style={customTitleStyle}>
                  <InlineText
                    value={step.title}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], title: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`} style={customTextStyle}>
                  <InlineText
                    value={step.description}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], description: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================
    // STATISTIQUES SOCIALES (100% RESPONSIVE MOBILE)
    // ==========================================
    case "stats": {
      const s = section as StatsSection;
      return (
        <section className="space-y-4 text-center w-full max-w-4xl mx-auto px-2">
          {s.badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </div>
          )}

          <div className={`grid ${isMobile ? "grid-cols-1 gap-3.5" : "grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"} w-full`}>
            {(s.items || []).map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-4 sm:p-6 rounded-2xl border text-center transition-all ${cardBgClass}`}
              >
                <span
                  className="text-3xl sm:text-4xl font-black font-mono tracking-tight block"
                  style={{ color: theme.primaryColor }}
                >
                  <InlineText
                    value={item.value}
                    onSave={(val) => {
                      const updated = [...(s.items || [])];
                      updated[idx] = { ...updated[idx], value: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </span>
                <span className={`text-xs sm:text-sm font-semibold block mt-1 ${mutedTextClass}`} style={customTextStyle}>
                  <InlineText
                    value={item.label}
                    onSave={(val) => {
                      const updated = [...(s.items || [])];
                      updated[idx] = { ...updated[idx], label: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================
    // 5. POINTS DE DOULEUR
    // ==========================================
    case "pain_points": {
      const s = section as PainPointsSection;
      return (
        <section
          className={`rounded-3xl p-6 sm:p-8 border space-y-6 text-center ${
            ctx.isDark
              ? "bg-rose-950/20 border-rose-900/30 text-white"
              : "bg-rose-50/70 border-rose-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-500 tracking-wider uppercase">
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className={`grid ${grid3Cols}`}>
            {s.items.map((item, idx) => (
              <div
                key={item.id}
                className={`rounded-2xl p-5 border space-y-2 shadow-sm text-left relative group/card ${
                  ctx.isDark
                    ? "bg-slate-900/80 border-white/5 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <CardReorderToolbar
                  idx={idx}
                  total={s.items.length}
                  onMoveLeft={() => reorderArray("items", idx, idx - 1)}
                  onMoveRight={() => reorderArray("items", idx, idx + 1)}
                  onMoveUp={() => reorderArray("items", idx, idx - 1)}
                  onMoveDown={() => reorderArray("items", idx, idx + 1)}
                  onDelete={() => deleteFromArray("items", idx)}
                  isSectionSelected={isSectionSelected}
                  isEditable={isEditable}
                />

                <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
                  ✕
                </div>
                <h3 className="font-bold text-sm sm:text-base text-rose-600">
                  <InlineText
                    value={item.title}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], title: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`} style={customTextStyle}>
                  <InlineText
                    value={item.description}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], description: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================
    // 6. CARACTÉRISTIQUES
    // ==========================================
    case "features": {
      const s = section as FeaturesSection;
      return (
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className={`grid ${grid3Cols}`}>
            {s.items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border text-left space-y-3 transition-all hover:scale-[1.02] relative group/card ${cardBgClass}`}
              >
                <CardReorderToolbar
                  idx={idx}
                  total={s.items.length}
                  onMoveLeft={() => reorderArray("items", idx, idx - 1)}
                  onMoveRight={() => reorderArray("items", idx, idx + 1)}
                  onMoveUp={() => reorderArray("items", idx, idx - 1)}
                  onMoveDown={() => reorderArray("items", idx, idx + 1)}
                  onDelete={() => deleteFromArray("items", idx)}
                  isSectionSelected={isSectionSelected}
                  isEditable={isEditable}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md shrink-0 pt-1"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {idx + 1}
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${headingClass}`} style={customTitleStyle}>
                  <InlineText
                    value={item.title}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], title: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`} style={customTextStyle}>
                  <InlineText
                    value={item.description}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], description: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================
    // 7. AVIS CLIENTS
    // ==========================================
    case "social_proof": {
      const s = section as SocialProofSection;
      const defaultReviews = [
        {
          id: "r-1",
          authorName: "Amina Kouamé",
          authorLocation: "Abidjan, Cocody",
          rating: 5,
          comment: "Produit fantastique et livraison ultra rapide en 24h ! J'ai pu vérifier la qualité avant de payer le livreur.",
        },
        {
          id: "r-2",
          authorName: "Marc Dossou",
          authorLocation: "Cotonou, Haie Vive",
          rating: 5,
          comment: "Très sérieux et conforme aux photos. C'est rassurant de pouvoir régler en espèces après vérification.",
        },
        {
          id: "r-3",
          authorName: "Fatou Sylla",
          authorLocation: "Dakar, Plateau",
          rating: 5,
          comment: "Assistance WhatsApp très réactive et colis bien emballé. Je recommande vivement les yeux fermés !",
        },
      ];
      const itemsToRender = s.items && s.items.length >= 3 ? s.items : (s.items && s.items.length > 0 ? [...s.items, ...defaultReviews].slice(0, 3) : defaultReviews);

      return (
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
                style={customTitleStyle}
              />
            </h2>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${mutedTextClass}`} style={customTextStyle}>
                {s.totalReviewsText || "5/5 étoiles sur plus de 350 avis vérifiés"}
              </span>
            </div>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"} w-full max-w-6xl mx-auto`}>
            {itemsToRender.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 text-left relative group/card ${cardBgClass}`}
              >
                <CardReorderToolbar
                  idx={idx}
                  total={itemsToRender.length}
                  onMoveLeft={() => reorderArray("items", idx, idx - 1)}
                  onMoveRight={() => reorderArray("items", idx, idx + 1)}
                  onMoveUp={() => reorderArray("items", idx, idx - 1)}
                  onMoveDown={() => reorderArray("items", idx, idx + 1)}
                  onDelete={() => deleteFromArray("items", idx)}
                  isSectionSelected={isSectionSelected}
                  isEditable={isEditable}
                />

                <div className="space-y-2 pt-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm italic leading-relaxed" style={customTextStyle}>
                    "<InlineText
                      value={rev.comment}
                      onSave={(val) => {
                        const updated = [...itemsToRender];
                        updated[idx] = { ...updated[idx], comment: val };
                        updateField("items", updated);
                      }}
                      isEditable={isEditable}
                    />"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/10 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[11px]"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <span className={`font-bold block ${headingClass}`} style={customTitleStyle}>
                        <InlineText
                          value={rev.authorName}
                          onSave={(val) => {
                            const updated = [...itemsToRender];
                            updated[idx] = { ...updated[idx], authorName: val };
                            updateField("items", updated);
                          }}
                          isEditable={isEditable}
                        />
                      </span>
                      <span className={`text-[10px] block ${mutedTextClass}`} style={customTextStyle}>
                        <InlineText
                          value={rev.authorLocation}
                          onSave={(val) => {
                            const updated = [...itemsToRender];
                            updated[idx] = { ...updated[idx], authorLocation: val };
                            updateField("items", updated);
                          }}
                          isEditable={isEditable}
                        />
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold shrink-0">
                    Avis vérifié ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================

    // ==========================================
    // 9. SECTION VIDÉO
    // ==========================================
    case "video": {
      const s = section as VideoSection;
      const embedUrl = getEmbedUrl(s.videoUrl);

      return (
        <section className="space-y-5 text-center max-w-3xl mx-auto">
          {s.badgeText && (
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
          )}
          {s.title && (
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
          )}
          {s.subtitle && (
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          )}

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/20 bg-black aspect-video group">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={s.title || "Vidéo"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-6">
                <Video className="w-12 h-12 text-slate-600" />
                <p className="text-xs">Collez l'URL de votre vidéo YouTube ou Vimeo dans l'inspecteur.</p>
              </div>
            )}
          </div>
        </section>
      );
    }

    // ==========================================
    // 10. ZONE D'INTERVENTION (GOOGLE MAPS INTERACTIF)
    // ==========================================
    case "service_area": {
      const s = section as ServiceAreaSection;
      const isGoogleMaps = (s.mapMode || "google_maps") === "google_maps";
      const mapQuery = s.mapAddress || s.zoneText || "Cotonou, Bénin";
      const mapZoom = s.mapZoom || 13;
      const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
        mapQuery
      )}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;

      return (
        <section className="space-y-4 text-center max-w-3xl mx-auto">
          {s.badgeText && (
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
          )}
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingClass}`} style={customTitleStyle}>
            <InlineText
              value={s.title}
              onSave={(val) => updateField("title", val)}
              isEditable={isEditable}
            />
          </h2>
          <p className={`text-xs sm:text-sm flex items-center justify-center gap-1.5 ${mutedTextClass}`} style={customTextStyle}>
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <InlineText
              value={s.zoneText}
              onSave={(val) => updateField("zoneText", val)}
              isEditable={isEditable}
            />
          </p>

          {isGoogleMaps ? (
            <div className="rounded-3xl overflow-hidden border border-slate-200/30 shadow-2xl aspect-[16/9] relative bg-slate-900 group">
              <iframe
                src={googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                title={`Zone d'intervention Google Maps - ${mapQuery}`}
              />
              <div className="absolute bottom-3 left-3 pointer-events-none z-10">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/85 text-white text-xs font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{s.subtitle || s.zoneText || "Zone de couverture garantie"}</span>
                </span>
              </div>
              {isEditable && (
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      ctx.onSelectSection?.(s.id);
                      ctx.onOpenSettings?.();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/85 hover:bg-black text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-lg"
                    title="Régler l'adresse ou le zoom dans l'inspecteur"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>📍 Régler la carte ({mapQuery})</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={(e) => {
                if (isEditable && onOpenImagePicker) {
                  e.stopPropagation();
                  onOpenImagePicker(s.id);
                }
              }}
              className="rounded-3xl overflow-hidden border border-slate-200/30 shadow-lg aspect-[16/9] relative bg-slate-900 group cursor-pointer"
            >
              <img
                src={s.mapImageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80"}
                alt="Carte zone"
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-4">
                <span className="px-4 py-2 rounded-xl bg-black/80 text-white text-xs font-bold backdrop-blur-md">
                  📍 {s.subtitle || "Zone de couverture garantie"}
                </span>
              </div>
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenImagePicker?.(s.id);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Changer la carte</span>
                </button>
              )}
            </div>
          )}
        </section>
      );
    }

    // ==========================================
    // 11. TARIFS / OFFRE ANCRÉE
    // ==========================================
    case "pricing": {
      const s = section as PricingSection;
      return (
        <section
          id="tarifs"
          className={`rounded-3xl p-6 sm:p-10 border shadow-2xl relative overflow-hidden space-y-6 text-center ${
            ctx.isDark
              ? "bg-gradient-to-b from-[#0C1226] to-[#060914] border-white/10"
              : "bg-white border-2 border-indigo-500/30 shadow-xl"
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className={`max-w-md mx-auto rounded-3xl p-6 border space-y-5 text-center shadow-xl ${cardBgClass}`}>
            {s.offer.stockLeft && (
              <div className="inline-block px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold animate-pulse">
                ⚠️ Plus que {s.offer.stockLeft} pièces en stock !
              </div>
            )}

            <h3 className={`text-lg font-bold ${headingClass}`} style={customTitleStyle}>{s.offer.name}</h3>

            <div className="space-y-1">
              <div className="text-slate-400 line-through text-sm">
                Prix régulier : {formatMoney(s.offer.regularPrice, s.offer.currency)}
              </div>
              <div className="text-3xl sm:text-4xl font-black" style={{ color: theme.primaryColor }}>
                {formatMoney(s.offer.salePrice, s.offer.currency)}
              </div>
              <div className="text-xs text-emerald-600 font-bold">
                Économisez {formatMoney(s.offer.regularPrice - s.offer.salePrice, s.offer.currency)} aujourd'hui
              </div>
            </div>

            <div className="text-left space-y-2 pt-2 border-t border-slate-200/30 text-xs sm:text-sm">
              {s.offer.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className={mutedTextClass} style={customTextStyle}>{feat}</span>
                </div>
              ))}
            </div>

            <a
              href="#commander"
              className="block w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all text-center"
              style={{ backgroundColor: theme.primaryColor }}
            >
              COMMANDER MAINTENANT
            </a>

            <div className={`text-xs flex items-center justify-center gap-1.5 ${mutedTextClass}`} style={customTextStyle}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{s.guaranteeText}</span>
            </div>
          </div>
        </section>
      );
    }

    // ==========================================
    // 12. FORMULAIRE DE COMMANDE
    // ==========================================
    case "order_form": {
      const s = section as OrderFormConfig;
      return (
        <section
          id="commander"
          className={`rounded-3xl p-6 sm:p-8 border space-y-6 shadow-2xl text-center ${cardBgClass}`}
        >
          {/* COMPTE À REBOURS D'URGENCE INTÉGRÉ AU FORMULAIRE DE COMMANDE */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold shadow-sm bg-rose-500/10 border-rose-500/30 text-rose-400 mx-auto">
            <span>⚡ Offre limitée : plus que 3 pièces en stock !</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[11px] shadow-inner">
              <Timer className="w-3 h-3" />
              <span>{ctx.formatCountdown ? ctx.formatCountdown(ctx.secondsLeft || 7200) : "01:45:20"}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          {ctx.orderDone ? (
            <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-2xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Commande Confirmée avec Succès !</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Votre commande pour <strong>{data.projectName}</strong> ({formatMoney(currentPrice, currency)}) est bien enregistrée.
                Notre équipe logistique vous contacte par téléphone ou WhatsApp pour la livraison.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-5">
              {s.whatsappEnabled && (
                <button
                  onClick={() => handleWhatsAppClick(s.whatsappNumber)}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 cursor-pointer text-sm sm:text-base"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Commander directement sur WhatsApp</span>
                </button>
              )}

              {(() => {
                const isDigitalOrEvent = [
                  "event_booking",
                  "app_launch",
                  "digital_product",
                  "service",
                ].includes(data.pageType);

                const isCodActive = !isDigitalOrEvent && s.codEnabled !== false;
                const isMomoActive = isDigitalOrEvent ? true : !!s.momoEnabled;
                const isCardActive = isDigitalOrEvent ? true : !!s.cardEnabled;

                const activeMethods: ("cod" | "momo" | "card")[] = [];
                if (isCodActive) activeMethods.push("cod");
                if (isMomoActive) activeMethods.push("momo");
                if (isCardActive) activeMethods.push("card");

                if (activeMethods.length === 0) activeMethods.push(isDigitalOrEvent ? "momo" : "cod");

                const currentMethod: "cod" | "momo" | "card" =
                  ctx.selectedPaymentMethod && activeMethods.includes(ctx.selectedPaymentMethod)
                    ? ctx.selectedPaymentMethod
                    : activeMethods[0];

                return (
                  <div className="space-y-4">
                    {/* SÉLECTEUR D'ONGLETS DE PAIEMENT SI PLUS D'UN MOYEN AUTORISÉ */}
                    {activeMethods.length > 1 && (
                      <div className={`grid ${activeMethods.length === 2 ? "grid-cols-2" : "grid-cols-3"} gap-1 sm:gap-2 p-1 rounded-2xl bg-slate-900/90 border border-white/10`}>
                        {isCodActive && (
                          <button
                            type="button"
                            onClick={() => ctx.setSelectedPaymentMethod?.("cod")}
                            className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 text-center ${
                              currentMethod === "cod"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <span className="text-sm">💵</span>
                            <span className="text-[10px] sm:text-xs">À la livraison</span>
                          </button>
                        )}
                        {isMomoActive && (
                          <button
                            type="button"
                            onClick={() => ctx.setSelectedPaymentMethod?.("momo")}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                              currentMethod === "momo"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <span className="text-sm">📱</span>
                            <span className="text-[10px] sm:text-xs">Mobile Money</span>
                          </button>
                        )}
                        {isCardActive && (
                          <button
                            type="button"
                            onClick={() => ctx.setSelectedPaymentMethod?.("card")}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                              currentMethod === "card"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <span className="text-sm">💳</span>
                            <span className="text-[10px] sm:text-xs">Carte Bancaire</span>
                          </button>
                        )}
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        if (ctx.handlePaymentSubmit) {
                          ctx.handlePaymentSubmit(e, currentMethod);
                        } else {
                          handleCodSubmit(e);
                        }
                      }}
                      className="space-y-3.5 text-left"
                    >
                      {/* SÉLECTION DE CATÉGORIE DE BILLET SI ÉVÉNEMENT */}
                      {data.pageType === "event_booking" && data.eventDetails?.ticketTiers && data.eventDetails.ticketTiers.length > 0 && (
                        <div className="space-y-2">
                          <label className={`block text-xs font-bold ${headingClass}`}>
                            🎟️ Catégorie de Billet / Accès :
                          </label>
                          <div className="grid grid-cols-1 gap-2">
                            {data.eventDetails.ticketTiers.map((tier: TicketTier) => {
                              const isSelected = (ctx.selectedTicketTierId || data.eventDetails!.ticketTiers![0].id) === tier.id;
                              return (
                                <button
                                  key={tier.id}
                                  type="button"
                                  onClick={() => ctx.setSelectedTicketTierId?.(tier.id)}
                                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-indigo-500 bg-indigo-600/15 ring-2 ring-indigo-500/40 shadow-sm"
                                      : "border-white/10 bg-slate-950/60 hover:border-white/20"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">{tier.name}</span>
                                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                                      {formatMoney(tier.price, currency)}
                                    </span>
                                  </div>
                                  {tier.features && tier.features.length > 0 && (
                                    <p className="text-[10px] text-slate-400 mt-1">
                                      ✓ {tier.features.join(" • ")}
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${headingClass}`}>
                          Nom complet ou Prénom *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Jean Kouassi"
                          value={ctx.customerName}
                          onChange={(e) => ctx.setCustomerName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                            ctx.isDark
                              ? "bg-slate-950 border-white/10 text-white"
                              : "bg-slate-50 border-slate-300 text-slate-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold mb-1 ${headingClass}`}>
                          Numéro de Téléphone (WhatsApp de préférence) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Ex: +229 01 53 29 52 82"
                          value={ctx.customerPhone}
                          onChange={(e) => ctx.setCustomerPhone(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                            ctx.isDark
                              ? "bg-slate-950 border-white/10 text-white"
                              : "bg-slate-50 border-slate-300 text-slate-900"
                          }`}
                        />
                      </div>

                      {/* EMAIL REQUIS POUR ÉVÉNEMENTS, PRODUITS DIGITAUX ET APPLICATIONS */}
                      {isDigitalOrEvent ? (
                        <div className="space-y-1.5">
                          <label className={`block text-xs font-semibold ${headingClass}`}>
                            Adresse Email (pour réception des billets ou accès VIP) *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="votre@email.com"
                            value={ctx.customerEmail}
                            onChange={(e) => ctx.setCustomerEmail?.(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                              ctx.isDark
                                ? "bg-slate-950 border-white/10 text-white"
                                : "bg-slate-50 border-slate-300 text-slate-900"
                            }`}
                          />
                          <p className="text-[10px] text-indigo-400">
                            ✨ Vos accès personnels et confirmation vous seront envoyés immédiatement à cette adresse.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className={`block text-xs font-semibold mb-1 ${headingClass}`}>
                              Ville de livraison *
                            </label>
                            <select
                              value={ctx.customerCity}
                              onChange={(e) => ctx.setCustomerCity(e.target.value)}
                              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                                ctx.isDark
                                  ? "bg-slate-950 border-white/10 text-white"
                                  : "bg-slate-50 border-slate-300 text-slate-900"
                              }`}
                            >
                              {s.cities.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={`block text-xs font-semibold mb-1 ${headingClass}`}>
                              Quartier ou Adresse précise
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Haie Vive, en face de la pharmacie"
                              value={ctx.customerAddress}
                              onChange={(e) => ctx.setCustomerAddress(e.target.value)}
                              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${
                                ctx.isDark
                                  ? "bg-slate-950 border-white/10 text-white"
                                  : "bg-slate-50 border-slate-300 text-slate-900"
                              }`}
                            />
                          </div>
                        </>
                      )}

                      {/* SPÉCIFIQUE MOBILE MONEY */}
                      {currentMethod === "momo" && (
                        <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-500/30">
                          <label className={`block text-xs font-bold text-indigo-300`}>
                            Sélectionnez votre Opérateur Mobile Money :
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { name: "Wave", badge: "Wave", color: "bg-cyan-500/25 border-cyan-400 text-cyan-300" },
                              { name: "Orange", badge: "Orange", color: "bg-orange-500/25 border-orange-400 text-orange-300" },
                              { name: "MTN", badge: "MTN", color: "bg-yellow-500/25 border-yellow-400 text-yellow-300" },
                              { name: "Moov", badge: "Moov", color: "bg-emerald-500/25 border-emerald-400 text-emerald-300" },
                            ].map((op) => (
                              <button
                                key={op.name}
                                type="button"
                                onClick={() => ctx.setSelectedMomoOperator?.(op.name)}
                                className={`py-2.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                                  ctx.selectedMomoOperator === op.name
                                    ? `${op.color} ring-2 ring-white/40 scale-105 shadow-md`
                                    : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                                }`}
                              >
                                {op.badge}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            📱 Un prompt sécurisé de confirmation sera envoyé sur votre numéro {ctx.customerPhone || "Mobile Money"} pour valider le paiement.
                          </p>
                        </div>
                      )}

                      {/* SPÉCIFIQUE CARTE BANCAIRE */}
                      {currentMethod === "card" && (
                        <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-500/30">
                          <div className="flex items-center justify-between">
                            <label className={`block text-xs font-bold text-indigo-300`}>
                              Détails de la Carte Bancaire :
                            </label>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <span>Visa</span>
                              <span>•</span>
                              <span>Mastercard</span>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Nom sur la carte"
                            value={ctx.cardHolder}
                            onChange={(e) => ctx.setCardHolder?.(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Numéro de carte (16 chiffres)"
                            maxLength={19}
                            value={ctx.cardNumber}
                            onChange={(e) => ctx.setCardNumber?.(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono tracking-wider"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="MM / AA"
                              maxLength={5}
                              value={ctx.cardExpiry}
                              onChange={(e) => ctx.setCardExpiry?.(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs text-center font-mono"
                            />
                            <input
                              type="password"
                              placeholder="CVC"
                              maxLength={4}
                              value={ctx.cardCvc}
                              onChange={(e) => ctx.setCardCvc?.(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs text-center font-mono"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={ctx.orderSubmitting}
                        className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {ctx.orderSubmitting ? (
                          <span>Traitement en cours...</span>
                        ) : (
                          <>
                            <span>
                              {data.pageType === "event_booking"
                                ? `RÉSERVER MON BILLET (${formatMoney(ctx.activePrice || currentPrice, currency)})`
                                : data.pageType === "digital_product"
                                ? `ACCÉDER À LA FORMATION (${formatMoney(ctx.activePrice || currentPrice, currency)})`
                                : data.pageType === "app_launch"
                                ? `REJOINDRE LA LISTE D'ATTENTE (${formatMoney(ctx.activePrice || currentPrice, currency)})`
                                : currentMethod === "momo"
                                ? `PAYER AVEC ${(ctx.selectedMomoOperator || "MOMO").toUpperCase()} (${formatMoney(currentPrice, currency)})`
                                : currentMethod === "card"
                                ? `PAYER PAR CARTE (${formatMoney(currentPrice, currency)})`
                                : `CONFIRMER LA COMMANDE (${formatMoney(currentPrice, currency)})`}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className={`flex items-center justify-center gap-2 text-xs pt-1 ${mutedTextClass}`}>
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {isDigitalOrEvent
                            ? "Accès sécurisé et confirmation immédiate délivrés par Email & WhatsApp"
                            : currentMethod === "momo"
                            ? "Paiement Mobile Money instantané et 100% sécurisé"
                            : currentMethod === "card"
                            ? "Paiement crypté SSL 256-bit garanti"
                            : "Paiement en espèces à la livraison après contrôle du colis"}
                        </span>
                      </div>
                    </form>
                  </div>
                );
              })()}
            </div>
          )}
        </section>
      );
    }

    // ==========================================
    // 13. FAQ ACCORDÉON
    // ==========================================
    case "faq": {
      const s = section as FaqSection;
      return (
        <section className="space-y-4 max-w-2xl mx-auto text-center">
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
              <InlineText
                value={s.badgeText}
                onSave={(val) => updateField("badgeText", val)}
                isEditable={isEditable}
              />
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold ${headingClass}`} style={customTitleStyle}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm ${mutedTextClass}`} style={customTextStyle}>
              <InlineText
                value={s.subtitle}
                onSave={(val) => updateField("subtitle", val)}
                isEditable={isEditable}
              />
            </p>
          </div>

          <div className="space-y-2.5 text-left">
            {s.items.map((item, idx) => {
              const isOpen = ctx.openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border overflow-hidden transition-colors relative group/card ${cardBgClass}`}
                >
                  <CardReorderToolbar
                    idx={idx}
                    total={s.items.length}
                    onMoveUp={() => reorderArray("items", idx, idx - 1)}
                    onMoveDown={() => reorderArray("items", idx, idx + 1)}
                    onDelete={() => deleteFromArray("items", idx)}
                    isSectionSelected={isSectionSelected}
                    isEditable={isEditable}
                  />

                  <button
                    onClick={() => ctx.setOpenFaqId(isOpen ? null : item.id)}
                    className={`w-full p-4 pt-5 text-left flex items-center justify-between gap-3 text-xs sm:text-base font-semibold transition-colors cursor-pointer ${headingClass}`}
                    style={customTitleStyle}
                  >
                    <span>
                      <InlineText
                        value={item.question}
                        onSave={(val) => {
                          const updated = [...s.items];
                          updated[idx] = { ...updated[idx], question: val };
                          updateField("items", updated);
                        }}
                        isEditable={isEditable}
                      />
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className={`p-4 pt-0 text-xs sm:text-sm leading-relaxed border-t border-slate-200/20 ${mutedTextClass}`} style={customTextStyle}>
                      <InlineText
                        value={item.answer}
                        onSave={(val) => {
                          const updated = [...s.items];
                          updated[idx] = { ...updated[idx], answer: val };
                          updateField("items", updated);
                        }}
                        isEditable={isEditable}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    // ==========================================
    // 14. SUPER BLOC SPLIT (IMAGE GAUCHE / DROITE RÉVERSIBLE)
    // ==========================================
    case "split_showcase": {
      const s = section as SplitShowcaseSection;
      const isImageLeft = s.layoutDirection === "image_left";

      return (
        <section className="relative w-full space-y-6">
          {isEditable && isSectionSelected && (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-xs mb-4 shadow-xl">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Super Bloc Split : {isImageLeft ? "Image à Gauche" : "Image à Droite"}
              </span>
              <button
                type="button"
                onClick={() => updateField("layoutDirection", isImageLeft ? "image_right" : "image_left")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{isImageLeft ? "Inverser (Image à Droite →)" : "Inverser (← Image à Gauche)"}</span>
              </button>
            </div>
          )}

          <div className={`grid ${isMobile ? "grid-cols-1 gap-6" : "grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14"} items-center w-full`}>
            {/* Colonne Image (Span 5 sur 12) */}
            <div
              className={`${isMobile ? "w-full" : "lg:col-span-5"} relative group/img ${
                !isMobile && isImageLeft ? "lg:order-1" : !isMobile ? "lg:order-2" : ""
              }`}
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 w-full">
                <img
                  src={s.imageUrl || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80"}
                  alt={s.imageAlt || s.title}
                  className="w-full h-auto max-h-[380px] sm:max-h-[500px] object-cover rounded-3xl transition-transform duration-500 group-hover/img:scale-105"
                />

                {/* Floating Metric Pill */}
                {s.metricBadge && (
                  <div
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-2.5 sm:p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: isDark ? "rgba(11, 16, 32, 0.9)" : "rgba(255, 255, 255, 0.95)",
                      borderColor: `${theme.primaryColor}40`,
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate">{s.metricBadge.label}</div>
                      <div className="text-lg sm:text-2xl font-black font-mono tracking-tight truncate" style={{ color: theme.primaryColor }}>
                        {s.metricBadge.value}
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                )}

                {/* Image Picker Button */}
                {isEditable && onOpenImagePicker && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenImagePicker(s.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/85 hover:bg-black text-white border border-white/20 shadow-xl cursor-pointer"
                    title="Changer l'image"
                  >
                    <Camera className="w-4 h-4 text-yellow-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Colonne Contenu & Arguments (Span 7 sur 12) */}
            <div
              className={`${isMobile ? "w-full space-y-4" : "lg:col-span-7 space-y-6"} ${
                !isMobile && isImageLeft ? "lg:order-2" : !isMobile ? "lg:order-1" : ""
              }`}
            >
              <div className="space-y-2.5 sm:space-y-3">
                {s.badgeText && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-sm border max-w-full"
                    style={{
                      backgroundColor: `${theme.primaryColor}1A`,
                      color: theme.primaryColor,
                      borderColor: `${theme.primaryColor}40`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      <InlineText
                        value={s.badgeText}
                        onSave={(val) => updateField("badgeText", val)}
                        isEditable={isEditable}
                      />
                    </span>
                  </span>
                )}

                <h2
                  className="text-xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight break-words"
                  style={customTitleStyle}
                >
                  <InlineText
                    value={s.title}
                    onSave={(val) => updateField("title", val)}
                    isEditable={isEditable}
                  />
                </h2>

                <p
                  className="text-xs sm:text-sm sm:leading-relaxed leading-normal break-words"
                  style={customTextStyle}
                >
                  <InlineText
                    value={s.subtitle}
                    onSave={(val) => updateField("subtitle", val)}
                    isEditable={isEditable}
                  />
                </p>
              </div>

              {/* Highlights List */}
              {s.highlights && s.highlights.length > 0 && (
                <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 w-full">
                  {s.highlights.map((hl, hlIdx) => (
                    <div
                      key={hl.id || hlIdx}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${cardBgClass} flex items-start gap-3 w-full`}
                    >
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center text-white shadow-sm mt-0.5"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className={`text-xs sm:text-sm font-bold break-words leading-tight ${headingClass}`} style={customTitleStyle}>
                          <InlineText
                            value={hl.title}
                            onSave={(val) => {
                              const updated = [...s.highlights];
                              updated[hlIdx] = { ...updated[hlIdx], title: val };
                              updateField("highlights", updated);
                            }}
                            isEditable={isEditable}
                          />
                        </h4>
                        <p className={`text-[11px] sm:text-xs leading-relaxed break-words ${mutedTextClass}`} style={customTextStyle}>
                          <InlineText
                            value={hl.description}
                            onSave={(val) => {
                              const updated = [...s.highlights];
                              updated[hlIdx] = { ...updated[hlIdx], description: val };
                              updateField("highlights", updated);
                            }}
                            isEditable={isEditable}
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action CTA */}
              {s.ctaText && (
                <div className="pt-2 w-full">
                  <a
                    href={s.ctaLink || "#commander"}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor || theme.primaryColor})`,
                      boxShadow: `0 10px 25px ${theme.primaryColor}40`,
                    }}
                  >
                    <span>{s.ctaText}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    // ==========================================
    // 15. SLIDER / CARROUSEL INTERACTIF
    // ==========================================
    case "interactive_slider": {
      const s = section as InteractiveSliderSection;
      const items = s.items || [];
      const currentIdx = ctx.activeSliderIndices?.[s.id] || 0;
      const activeItem = items[currentIdx] || items[0];

      const handleNext = () => {
        if (items.length <= 1) return;
        ctx.setActiveSliderIndices?.((prev: any) => ({
          ...prev,
          [s.id]: (currentIdx + 1) % items.length,
        }));
      };

      const handlePrev = () => {
        if (items.length <= 1) return;
        ctx.setActiveSliderIndices?.((prev: any) => ({
          ...prev,
          [s.id]: (currentIdx - 1 + items.length) % items.length,
        }));
      };

      return (
        <section className="relative w-full space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            {s.badgeText && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border"
                style={{
                  backgroundColor: `${theme.primaryColor}1A`,
                  color: theme.primaryColor,
                  borderColor: `${theme.primaryColor}40`,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <InlineText
                  value={s.badgeText}
                  onSave={(val) => updateField("badgeText", val)}
                  isEditable={isEditable}
                />
              </span>
            )}
            <h2
              className="text-2xl sm:text-4xl font-black tracking-tight break-words"
              style={customTitleStyle}
            >
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            {s.subtitle && (
              <p className="text-sm sm:text-base leading-relaxed break-words" style={customTextStyle}>
                <InlineText
                  value={s.subtitle}
                  onSave={(val) => updateField("subtitle", val)}
                  isEditable={isEditable}
                />
              </p>
            )}
          </div>

          {/* Slider Container */}
          <div className="relative max-w-4xl mx-auto">
            {activeItem && (
              <div
                className={`p-6 sm:p-10 rounded-3xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${cardBgClass}`}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor || theme.primaryColor})`,
                  }}
                />

                {s.sliderType === "testimonials" && (
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                )}

                {activeItem.tag && (
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border"
                    style={{
                      backgroundColor: `${theme.primaryColor}1A`,
                      color: theme.primaryColor,
                      borderColor: `${theme.primaryColor}30`,
                    }}
                  >
                    {activeItem.tag}
                  </span>
                )}

                <p className={`text-base sm:text-xl font-medium italic leading-relaxed mb-6 break-words ${mutedTextClass}`} style={customTextStyle}>
                  "{activeItem.description}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {activeItem.imageUrl ? (
                      <img
                        src={activeItem.imageUrl}
                        alt={activeItem.title}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border-2"
                        style={{ borderColor: theme.primaryColor }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {activeItem.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className={`text-sm sm:text-base font-bold truncate ${headingClass}`}>
                        {activeItem.title}
                      </h4>
                      {activeItem.subtitle && (
                        <p className="text-xs text-slate-400 font-medium truncate">
                          {activeItem.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2 rounded-xl border border-white/15 bg-slate-900/80 hover:bg-slate-800 text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
                      title="Précédent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2 rounded-xl border border-white/15 bg-slate-900/80 hover:bg-slate-800 text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
                      title="Suivant"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Dots */}
            {items.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {items.map((it, dotIdx) => (
                  <button
                    key={it.id || dotIdx}
                    type="button"
                    onClick={() =>
                      ctx.setActiveSliderIndices?.((prev: any) => ({
                        ...prev,
                        [s.id]: dotIdx,
                      }))
                    }
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === currentIdx
                        ? "w-6"
                        : "w-2 bg-slate-600/50 hover:bg-slate-500"
                    }`}
                    style={
                      dotIdx === currentIdx
                        ? { backgroundColor: theme.primaryColor }
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    // ==========================================
    // 16. GRILLE BENTO MODERNE
    // ==========================================
    case "bento_grid": {
      const s = section as BentoGridSection;
      const cards = s.cards || [];

      return (
        <section className="relative w-full space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            {s.badgeText && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border"
                style={{
                  backgroundColor: `${theme.primaryColor}1A`,
                  color: theme.primaryColor,
                  borderColor: `${theme.primaryColor}40`,
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                <InlineText
                  value={s.badgeText}
                  onSave={(val) => updateField("badgeText", val)}
                  isEditable={isEditable}
                />
              </span>
            )}
            <h2
              className="text-2xl sm:text-4xl font-black tracking-tight break-words"
              style={customTitleStyle}
            >
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            {s.subtitle && (
              <p className="text-sm sm:text-base leading-relaxed break-words" style={customTextStyle}>
                <InlineText
                  value={s.subtitle}
                  onSave={(val) => updateField("subtitle", val)}
                  isEditable={isEditable}
                />
              </p>
            )}
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"} w-full`}>
            {cards.map((c, cIdx) => {
              const isWide = !isMobile && c.colSpan === "col-span-2";
              return (
                <div
                  key={c.id || cIdx}
                  className={`rounded-3xl p-5 sm:p-7 border relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between ${
                    isWide ? "md:col-span-2" : "col-span-1"
                  } ${cardBgClass}`}
                >
                  <div
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: theme.primaryColor }}
                  />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      {c.tag && (
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border"
                          style={{
                            backgroundColor: `${theme.primaryColor}18`,
                            color: theme.primaryColor,
                            borderColor: `${theme.primaryColor}35`,
                          }}
                        >
                          <InlineText
                            value={c.tag}
                            onSave={(val) => {
                              const updated = [...cards];
                              updated[cIdx] = { ...updated[cIdx], tag: val };
                              updateField("cards", updated);
                            }}
                            isEditable={isEditable}
                          />
                        </span>
                      )}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <Award className="w-4 h-4" />
                      </div>
                    </div>

                    {c.metric && (
                      <div
                        className="text-3xl sm:text-4xl font-black font-mono tracking-tight"
                        style={{ color: theme.primaryColor }}
                      >
                        <InlineText
                          value={c.metric}
                          onSave={(val) => {
                            const updated = [...cards];
                            updated[cIdx] = { ...updated[cIdx], metric: val };
                            updateField("cards", updated);
                          }}
                          isEditable={isEditable}
                        />
                      </div>
                    )}

                    <h3 className={`text-base sm:text-lg font-black break-words ${headingClass}`} style={customTitleStyle}>
                      <InlineText
                        value={c.title}
                        onSave={(val) => {
                          const updated = [...cards];
                          updated[cIdx] = { ...updated[cIdx], title: val };
                          updateField("cards", updated);
                        }}
                        isEditable={isEditable}
                      />
                    </h3>

                    <p className={`text-xs sm:text-sm leading-relaxed break-words ${mutedTextClass}`} style={customTextStyle}>
                      <InlineText
                        value={c.description}
                        onSave={(val) => {
                          const updated = [...cards];
                          updated[cIdx] = { ...updated[cIdx], description: val };
                          updateField("cards", updated);
                        }}
                        isEditable={isEditable}
                      />
                    </p>
                  </div>

                  {c.imageUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-md relative group/bentoimg">
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-full h-36 sm:h-44 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {isEditable && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenImagePicker?.(s.id, cIdx);
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover/bentoimg:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-sm cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-yellow-400" />
                          <span>Changer l'image</span>
                        </button>
                      )}
                    </div>
                  )}

                  {!c.imageUrl && isEditable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenImagePicker?.(s.id, cIdx);
                      }}
                      className="mt-4 w-full py-2.5 rounded-2xl border border-dashed border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Ajouter une image</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
