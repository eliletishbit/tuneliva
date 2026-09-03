"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FunnelPageData, FunnelStep } from "@/types/page";
import { FunnelRenderer } from "@/components/preview/FunnelRenderer";
import { Loader2 } from "lucide-react";

export default function PublicFunnelStepPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const stepSlug = params?.step as string;

  const [funnelData, setFunnelData] = useState<FunnelPageData | null>(null);
  const [currentStep, setCurrentStep] = useState<FunnelStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadFunnel() {
      try {
        const res = await fetch(`/api/funnels?slug=${encodeURIComponent(slug)}`);
        let data: FunnelPageData | null = null;
        if (res.ok) {
          data = await res.json();
        } else {
          const local = localStorage.getItem(`tuneliva_funnel_${slug}`);
          if (local) data = JSON.parse(local);
        }

        if (data) {
          setFunnelData(data);
          // Recherche de l'étape correspondante au stepSlug
          const matchedStep = data.steps?.find(
            (st) => st.slug === stepSlug || st.id === stepSlug
          );

          if (matchedStep) {
            setCurrentStep(matchedStep);
          } else {
            // Si pas de step correspondant, on affiche les sections principales
            setCurrentStep({
              id: `step-${stepSlug}`,
              name: data.projectName,
              slug: stepSlug,
              pageType: data.pageType,
              sections: data.sections,
            });
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Erreur chargement étape tunnel:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug && stepSlug) {
      loadFunnel();
    }
  }, [slug, stepSlug]);

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

      // Redirection automatique vers l'étape suivante (Merci / Confirmation)
      if (currentStep?.nextStepSlug) {
        setTimeout(() => {
          router.push(`/p/${slug}/${currentStep.nextStepSlug}`);
        }, 1200);
      }
    } catch (e) {
      console.error("Erreur enregistrement commande API:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-400">Chargement de votre étape...</p>
      </div>
    );
  }

  if (notFound || !funnelData || !currentStep) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-black">Étape Introuvable</h1>
        <p className="text-sm text-slate-400 max-w-md">
          Cette étape du tunnel n'existe pas ou a été modifiée.
        </p>
        <a
          href={`/p/${slug}`}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg"
        >
          Retourner au début du tunnel →
        </a>
      </div>
    );
  }

  // Fusion des données de l'étape avec le thème global du tunnel
  const stepData: FunnelPageData = {
    ...funnelData,
    pageType: currentStep.pageType,
    sections: currentStep.sections,
  };

  return (
    <div className="min-h-screen bg-black">
      <FunnelRenderer
        data={stepData}
        isEditable={false}
        deviceMode="desktop"
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
