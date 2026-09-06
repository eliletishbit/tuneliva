"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FunnelPageData, FunnelStep } from "@/types/page";
import { FunnelRenderer } from "@/components/preview/FunnelRenderer";
import { Loader2, CheckCircle2 } from "lucide-react";

interface PublicFunnelClientProps {
  slug: string;
  stepSlug?: string;
  initialFunnel: FunnelPageData | null;
  orderSuccessQuery?: boolean;
}

export function PublicFunnelClient({
  slug,
  stepSlug,
  initialFunnel,
  orderSuccessQuery = false,
}: PublicFunnelClientProps) {
  const router = useRouter();
  const [funnelData, setFunnelData] = useState<FunnelPageData | null>(initialFunnel);
  const [activeStep, setActiveStep] = useState<FunnelStep | null>(null);
  const [loading, setLoading] = useState(!initialFunnel);
  const [notFound, setNotFound] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(orderSuccessQuery);

  useEffect(() => {
    async function fetchClientSide() {
      if (initialFunnel) {
        setFunnelData(initialFunnel);
        if (initialFunnel.steps && initialFunnel.steps.length > 0) {
          if (stepSlug) {
            const matched = initialFunnel.steps.find(
              (s) => s.slug === stepSlug || s.id === stepSlug
            );
            setActiveStep(matched || initialFunnel.steps[0]);
          } else {
            const step = initialFunnel.activeStepId
              ? initialFunnel.steps.find((s) => s.id === initialFunnel.activeStepId) ||
                initialFunnel.steps[0]
              : initialFunnel.steps[0];
            setActiveStep(step);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/funnels?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data: FunnelPageData = await res.json();
          setFunnelData(data);
          if (data.steps && data.steps.length > 0) {
            if (stepSlug) {
              const matched = data.steps.find(
                (s) => s.slug === stepSlug || s.id === stepSlug
              );
              setActiveStep(matched || data.steps[0]);
            } else {
              const step = data.activeStepId
                ? data.steps.find((s) => s.id === data.activeStepId) || data.steps[0]
                : data.steps[0];
              setActiveStep(step);
            }
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Erreur chargement tunnel:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchClientSide();
  }, [slug, stepSlug, initialFunnel]);

  const handleOrderSuccess = async (orderDetails: any) => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelSlug: slug,
          productName: orderDetails.productName || funnelData?.projectName,
          customerName: orderDetails.customerName,
          customerPhone: orderDetails.customerPhone,
          customerCity: orderDetails.customerCity,
          customerAddress: orderDetails.customerAddress,
          totalAmount: orderDetails.amount,
          currency: orderDetails.currency,
          paymentMethod: orderDetails.paymentMethod,
        }),
      });

      // Déclenchement de l'événement Facebook Pixel Purchase si configuré
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          value: orderDetails.amount,
          currency: orderDetails.currency || "XOF",
          content_name: orderDetails.productName || funnelData?.projectName,
        });
      }

      // Déclenchement de l'événement TikTok Pixel CompletePayment si configuré
      if (typeof window !== "undefined" && (window as any).ttq) {
        (window as any).ttq.track("CompletePayment", {
          value: orderDetails.amount,
          currency: orderDetails.currency || "XOF",
          content_name: orderDetails.productName || funnelData?.projectName,
        });
      }

      // Redirection automatique vers l'étape suivante si configurée
      if (activeStep?.nextStepSlug) {
        setTimeout(() => {
          router.push(`/p/${slug}/${activeStep.nextStepSlug}`);
        }, 1200);
      } else {
        setShowSuccessBanner(true);
      }
    } catch (e) {
      console.error("Erreur enregistrement commande API:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-400">
          Chargement de votre page officielle...
        </p>
      </div>
    );
  }

  if (notFound || !funnelData) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-black">Page ou Offre Introuvable</h1>
        <p className="text-sm text-slate-400 max-w-md">
          Cette page de vente n'existe pas encore ou a été déplacée par son créateur.
        </p>
        <a
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg"
        >
          Créer mon propre tunnel sur Tuneliva →
        </a>
      </div>
    );
  }

  // Extraction du pixel Meta et TikTok
  const fbPixelId = funnelData.marketing?.facebookPixelId;
  const tiktokPixelId = funnelData.marketing?.tiktokPixelId;

  const displayData: FunnelPageData = activeStep
    ? {
        ...funnelData,
        pageType: activeStep.pageType,
        sections: activeStep.sections,
      }
    : funnelData;

  return (
    <div className="min-h-screen bg-black relative">
      {/* 1. INJECTION PIXEL FACEBOOK META */}
      {fbPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* 2. INJECTION PIXEL TIKTOK */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* 3. BANNIÈRE DE SUCCÈS COMMANDE (EN CAS DE RETOUR PAIEMENT) */}
      {showSuccessBanner && (
        <div className="sticky top-0 z-50 bg-emerald-600 text-white px-4 py-3 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
          <span>
            Votre commande a été validée avec succès ! Notre équipe vous contactera
            par WhatsApp pour la livraison.
          </span>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="ml-2 text-white/80 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <FunnelRenderer
        data={displayData}
        isEditable={false}
        deviceMode="desktop"
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
