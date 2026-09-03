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
} from "@/types/page";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  Star,
  ChevronDown,
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
}: {
  value: string;
  onSave?: (val: string) => void;
  className?: string;
  isEditable?: boolean;
  tag?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  if (!isEditable || !onSave) {
    const Component = tag;
    return <Component className={className}>{value}</Component>;
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
      className={`${className} outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-500/10 rounded-md px-1 transition-all cursor-text hover:ring-1 hover:ring-indigo-400/40`}
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
      <div
        draggable={isEditable}
        onDragStart={onDragCardStart}
        className="cursor-grab active:cursor-grabbing p-0.5 text-indigo-400 hover:text-white rounded hover:bg-white/10"
        title="Glisser pour déplacer cette colonne"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      <span className="text-[10px] text-indigo-400 font-mono font-bold mr-0.5">#{idx + 1}</span>

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
}: FunnelRendererProps) {
  const { theme, branding, sections } = data;
  const isDark = theme.isDarkTheme;
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

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

  const isMobile = deviceMode === "mobile";
  const isTablet = deviceMode === "tablet";

  // Grilles responsives strictes (zéro débordement)
  const grid3Cols = isMobile
    ? "grid-cols-1 space-y-3"
    : isTablet
    ? "grid-cols-1 sm:grid-cols-2 gap-4"
    : "grid-cols-1 md:grid-cols-3 gap-5";

  // STYLES ÉTUDIÉS SELON LE THÈME
  const cardBgClass = isDark
    ? "bg-[#0B1020]/90 border-white/10 text-white shadow-xl backdrop-blur-md"
    : "bg-white border-slate-200/90 text-slate-900 shadow-lg shadow-slate-200/60";

  const headingClass = isDark ? "text-white" : "text-slate-950 font-black";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-600";

  // Formulaire de commande
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState(branding?.address?.city || "Cotonou");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  // Prix et Devise
  const pricingSection = sections.find((s) => s.type === "pricing") as PricingSection | undefined;
  const currentPrice = pricingSection?.offer.salePrice || 22000;
  const currency = pricingSection?.offer.currency || "XOF";

  const formatMoney = (amount: number, curr: CurrencyCode) => {
    if (curr === "XOF" || curr === "XAF") {
      return `${amount.toLocaleString("fr-FR")} FCFA`;
    }
    if (curr === "EUR") return `${amount} €`;
    if (curr === "USD") return `$${amount}`;
    return `${amount} ${curr}`;
  };

  const handleCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Veuillez renseigner votre nom et votre numéro de téléphone.");
      return;
    }
    setOrderSubmitting(true);
    setTimeout(() => {
      setOrderSubmitting(false);
      setOrderDone(true);
      if (onOrderSuccess) {
        onOrderSuccess({
          customerName,
          customerPhone,
          customerCity,
          customerAddress,
          productName: data.projectName,
          amount: currentPrice,
          currency,
          paymentMethod: "cod",
        });
      }
    }, 800);
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

  const bgStyle = {
    backgroundColor: theme.pageBackground || (isDark ? "#07080D" : "#F8FAFC"),
    color: theme.textColor || (isDark ? "#F8FAFC" : "#0F172A"),
    fontFamily: theme.fontFamily,
  };

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300 relative selection:bg-indigo-500 selection:text-white overflow-x-clip"
      style={bgStyle}
    >
      {/* 1. BANNIÈRE D'URGENCE / PROMO ÉDITABLE */}
      {theme.bannerUrgencyText && (
        <div
          className="text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm"
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

      {/* 2. TOP BAR SERVICES & PAIEMENTS */}
      <div
        className={`px-4 sm:px-8 py-2 border-b text-xs flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto w-full ${
          isDark
            ? "border-white/10 text-slate-400 bg-slate-950/40"
            : "border-slate-200 text-slate-600 bg-slate-100/70"
        }`}
      >
        <div className="flex items-center gap-2 font-medium">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>Intervention & Livraison 24/7j • MoMo & Cartes Bancaires acceptés</span>
        </div>
        {branding?.phone && (
          <a
            href={`tel:${branding.phone}`}
            className="flex items-center gap-1.5 font-bold hover:underline"
            style={{ color: theme.primaryColor }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{branding.phone}</span>
          </a>
        )}
      </div>

      {/* 3. HEADER DE MARQUE */}
      <header
        className={`border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between max-w-5xl mx-auto w-full ${
          isDark ? "border-white/10 bg-[#07080D]/80" : "border-slate-200/80 bg-white/90 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          {branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.businessName}
              className="h-10 w-auto object-contain rounded-lg shadow-sm"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {(branding?.businessName || data.projectName || "T").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="truncate">
            <span className={`font-extrabold text-sm sm:text-base tracking-tight block truncate ${headingClass}`}>
              {branding?.businessName || data.projectName}
            </span>
            {branding?.tagline && (
              <span className={`text-[10px] sm:text-xs block -mt-0.5 truncate ${mutedTextClass}`}>
                {branding.tagline}
              </span>
            )}
          </div>
        </div>

        {branding?.whatsappNumber && (
          <button
            onClick={() => handleWhatsAppClick(branding.whatsappNumber!)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition-all shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className={isMobile ? "hidden" : "inline"}>WhatsApp Direct</span>
          </button>
        )}
      </header>

      {/* 4. CORPS DU TUNNEL (AVEC DRAG & DROP DES SECTIONS) */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 overflow-x-clip w-full box-border">
        {/* COMPTE À REBOURS PILL */}
        <div className="text-center">
          <div
            className={`inline-flex flex-col sm:flex-row items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm shadow-sm ${
              isDark
                ? "bg-rose-500/10 border-rose-500/25 text-rose-400"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Plus que 3 pièces / créneaux disponibles pour ce soir</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-600 text-white font-mono font-extrabold text-sm shadow-inner">
              <Timer className="w-3.5 h-3.5" />
              <span>{formatCountdown(secondsLeft)}</span>
            </div>
          </div>
        </div>

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
            paddingLeft:
              section.paddingLeftPx !== undefined
                ? `${section.paddingLeftPx}px`
                : section.paddingHorizontalPx !== undefined
                ? `${section.paddingHorizontalPx}px`
                : isMobile
                ? "16px"
                : "24px",
            paddingRight:
              section.paddingRightPx !== undefined
                ? `${section.paddingRightPx}px`
                : section.paddingHorizontalPx !== undefined
                ? `${section.paddingHorizontalPx}px`
                : isMobile
                ? "16px"
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
            marginLeft:
              section.marginLeftPx !== undefined
                ? `${section.marginLeftPx}px`
                : section.marginHorizontalPx !== undefined
                ? `${section.marginHorizontalPx}px`
                : undefined,
            marginRight:
              section.marginRightPx !== undefined
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
          };

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
                section.maxWidthClass || "max-w-4xl"
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
                  <div
                    draggable={isEditable}
                    onDragStart={(e) => {
                      if (!isEditable) return;
                      e.stopPropagation();
                      setDraggedSectionIdx(idx);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", `${idx}`);
                    }}
                    className="p-1 text-indigo-400 hover:text-white cursor-grab active:cursor-grabbing rounded hover:bg-white/10"
                    title="Attraper pour déplacer cette section par glisser-déposer"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

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
                isEditable,
                isSectionSelected: isSelected,
              })}
            </div>
          );
        })}
      </main>

      {/* 5. PIED DE PAGE */}
      <footer
        className={`border-t mt-16 py-12 px-6 text-xs ${
          branding?.footerBgColor
            ? ""
            : isDark
            ? "border-white/10 bg-slate-950/90 text-slate-400"
            : "border-slate-200 bg-slate-900 text-slate-300 shadow-inner"
        }`}
        style={{ backgroundColor: branding?.footerBgColor || undefined }}
      >
        <div className={`max-w-5xl mx-auto grid ${grid3Cols} gap-8 text-left`}>
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

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p>© {new Date().getFullYear()} {branding?.businessName || data.projectName}. Tous droits réservés.</p>
          <p className="flex items-center justify-center gap-1.5">
            <span>Propulsé avec rapidité par</span>
            <span className="font-bold text-indigo-400">Tuneliva</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function renderSectionContent(section: FunnelSection, ctx: any) {
  const {
    theme,
    cardBgClass,
    headingClass,
    mutedTextClass,
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

          <h1 className={`${titleSizeClass} font-black tracking-tight leading-tight sm:leading-tight max-w-3xl mx-auto px-2 ${headingClass}`}>
            <InlineText
              value={s.title}
              onSave={(val) => updateField("title", val)}
              isEditable={isEditable}
            />
          </h1>

          <p className={`text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2 ${mutedTextClass}`}>
            <InlineText
              value={s.subtitle}
              onSave={(val) => updateField("subtitle", val)}
              isEditable={isEditable}
            />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto w-full px-4">
            <a
              href="#commander"
              className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl font-bold text-white text-sm sm:text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <InlineText
                value={s.ctaText}
                onSave={(val) => updateField("ctaText", val)}
                isEditable={isEditable}
              />
            </a>
            {ctx.branding?.whatsappNumber && (
              <button
                onClick={() => handleWhatsAppClick(ctx.branding.whatsappNumber)}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl font-bold text-white text-sm sm:text-base bg-[#25D366] hover:bg-[#20ba59] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>WhatsApp</span>
              </button>
            )}
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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`}>
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
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isEditable && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                        <Camera className="w-4 h-4 text-yellow-300" />
                        <span>Changer photo</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className={`font-bold text-base sm:text-lg ${headingClass}`}>
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
                    <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${mutedTextClass}`}>
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

                <div className="space-y-3 pt-2 border-t border-slate-200/30">
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

                  <a
                    href="#commander"
                    className="block w-full py-3 px-4 rounded-xl text-center font-bold text-white text-xs sm:text-sm shadow-md transition-all hover:opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Commander cet exemplaire
                  </a>
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
              <h3 className={`font-bold text-base sm:text-lg ${headingClass}`}>
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
              <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}>
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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`}>
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
                <h3 className={`font-bold text-base sm:text-lg ${headingClass}`}>
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
                <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}>
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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`}>
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
                <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}>
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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`}>
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
                <h3 className={`font-bold text-base sm:text-lg ${headingClass}`}>
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
                <p className={`text-xs sm:text-sm leading-relaxed ${mutedTextClass}`}>
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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${mutedTextClass}`}>
                {s.totalReviewsText}
              </span>
            </div>
          </div>

          <div className={`grid ${grid3Cols}`}>
            {s.items.map((rev, idx) => (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 text-left relative group/card ${cardBgClass}`}
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

                <p className="text-xs sm:text-sm italic leading-relaxed pt-5">
                  "<InlineText
                    value={rev.comment}
                    onSave={(val) => {
                      const updated = [...s.items];
                      updated[idx] = { ...updated[idx], comment: val };
                      updateField("items", updated);
                    }}
                    isEditable={isEditable}
                  />"
                </p>
                <div className="flex items-center justify-between border-t border-slate-200/30 pt-3">
                  <div>
                    <div className={`font-bold text-xs sm:text-sm ${headingClass}`}>
                      <InlineText
                        value={rev.authorName}
                        onSave={(val) => {
                          const updated = [...s.items];
                          updated[idx] = { ...updated[idx], authorName: val };
                          updateField("items", updated);
                        }}
                        isEditable={isEditable}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400">{rev.authorLocation}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-bold">
                    Achat vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // ==========================================
    // 8. STATS SECTION
    // ==========================================
    case "stats": {
      const s = section as StatsSection;
      return (
        <section className={`rounded-3xl p-6 sm:p-8 border grid grid-cols-1 sm:grid-cols-3 gap-6 text-center ${cardBgClass}`}>
          {s.items.map((st, idx) => (
            <div key={st.id} className="space-y-1 relative group/card">
              <CardReorderToolbar
                idx={idx}
                total={s.items.length}
                onMoveLeft={() => reorderArray("items", idx, idx - 1)}
                onMoveRight={() => reorderArray("items", idx, idx + 1)}
                onDelete={() => deleteFromArray("items", idx)}
                isSectionSelected={isSectionSelected}
                isEditable={isEditable}
              />
              <div className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: theme.primaryColor }}>
                <InlineText
                  value={st.value}
                  onSave={(val) => {
                    const updated = [...s.items];
                    updated[idx] = { ...updated[idx], value: val };
                    updateField("items", updated);
                  }}
                  isEditable={isEditable}
                />
              </div>
              <div className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${mutedTextClass}`}>
                <InlineText
                  value={st.label}
                  onSave={(val) => {
                    const updated = [...s.items];
                    updated[idx] = { ...updated[idx], label: val };
                    updateField("items", updated);
                  }}
                  isEditable={isEditable}
                />
              </div>
            </div>
          ))}
        </section>
      );
    }

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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
          )}
          {s.subtitle && (
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${mutedTextClass}`}>
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
    // 10. ZONE D'INTERVENTION
    // ==========================================
    case "service_area": {
      const s = section as ServiceAreaSection;
      return (
        <section className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingClass}`}>
            <InlineText
              value={s.title}
              onSave={(val) => updateField("title", val)}
              isEditable={isEditable}
            />
          </h2>
          <p className={`text-xs sm:text-sm flex items-center justify-center gap-1.5 ${mutedTextClass}`}>
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <InlineText
              value={s.zoneText}
              onSave={(val) => updateField("zoneText", val)}
              isEditable={isEditable}
            />
          </p>

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
              src={s.mapImageUrl}
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
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
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

            <h3 className={`text-lg font-bold ${headingClass}`}>{s.offer.name}</h3>

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
                  <span className={mutedTextClass}>{feat}</span>
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

            <div className={`text-xs flex items-center justify-center gap-1.5 ${mutedTextClass}`}>
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
          <div className="space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
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

              {s.whatsappEnabled && s.codEnabled && (
                <div className="flex items-center gap-3 text-xs text-slate-400 uppercase tracking-wider">
                  <div className="h-px bg-slate-200/30 flex-1" />
                  <span>OU REMPLIR LE FORMULAIRE</span>
                  <div className="h-px bg-slate-200/30 flex-1" />
                </div>
              )}

              {s.codEnabled && (
                <form onSubmit={handleCodSubmit} className="space-y-3.5 text-left">
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

                  <button
                    type="submit"
                    disabled={ctx.orderSubmitting}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {ctx.orderSubmitting ? (
                      <span>Validation en cours...</span>
                    ) : (
                      <>
                        <span>CONFIRMER LA COMMANDE ({formatMoney(currentPrice, currency)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className={`flex items-center justify-center gap-2 text-xs pt-1 ${mutedTextClass}`}>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Paiement en espèces à la livraison après contrôle du colis</span>
                  </div>
                </form>
              )}
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
            <h2 className={`text-2xl sm:text-3xl font-bold ${headingClass}`}>
              <InlineText
                value={s.title}
                onSave={(val) => updateField("title", val)}
                isEditable={isEditable}
              />
            </h2>
            <p className={`text-xs sm:text-sm ${mutedTextClass}`}>
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
                    <div className={`p-4 pt-0 text-xs sm:text-sm leading-relaxed border-t border-slate-200/20 ${mutedTextClass}`}>
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

    default:
      return null;
  }
}
