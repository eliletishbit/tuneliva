"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FunnelPageData } from "@/types/page";
import { FunnelRenderer } from "@/components/preview/FunnelRenderer";
import { Loader2 } from "lucide-react";

export default function PublicFunnelPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [funnelData, setFunnelData] = useState<FunnelPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadFunnel() {
      try {
        const res = await fetch(`/api/funnels?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setFunnelData(data);
        } else {
          // Si introuvable dans la base, on essaie depuis le localStorage
          const local = localStorage.getItem(`tuneliva_funnel_${slug}`);
          if (local) {
            setFunnelData(JSON.parse(local));
          } else {
            setNotFound(true);
          }
        }
      } catch (e) {
        console.error("Erreur chargement tunnel public:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadFunnel();
    }
  }, [slug]);

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
    } catch (e) {
      console.error("Erreur enregistrement commande API:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-400">Chargement de votre page officielle...</p>
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

  return (
    <div className="min-h-screen bg-black">
      <FunnelRenderer
        data={funnelData}
        isEditable={false}
        deviceMode="desktop"
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
