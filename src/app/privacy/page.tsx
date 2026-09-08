import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Politique de Confidentialité (Privacy Policy) | Tuneliva",
  description: "Politique de confidentialité et protection des données personnelles sur Tuneliva et ses intégrations (TikTok, Google, MoMo).",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 py-12 px-4 sm:px-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil Tuneliva</span>
        </Link>

        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Protection des Données & Vie Privée</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Politique de Confidentialité (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Dernière mise à jour : 8 Septembre 2026 • Plateforme Tuneliva
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">1.</span> Collecte des Données Personnelles
            </h2>
            <p>
              Dans le cadre de la fourniture de ses services, <strong>Tuneliva</strong> collecte uniquement les données strictement nécessaires au bon fonctionnement de l'application :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-400">
              <li>Informations de compte : nom complet, adresse email, numéro de téléphone professionnel.</li>
              <li>Données relatives aux tunnels : informations produits, textes descriptifs, images et paramétrages marchands.</li>
              <li>Données analytiques anonymisées : nombre de visites, conversions et préférences d'interface.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">2.</span> Utilisation des Données TikTok API
            </h2>
            <p>
              Tuneliva intègre l'API officielle TikTok (Content Posting API). Lorsque vous autorisez Tuneliva à se connecter à votre compte TikTok :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-400">
              <li>Nous demandons uniquement les permissions nécessaires à la publication ou à la sauvegarde de vidéos dans vos brouillons (scope <code>video.upload</code> / <code>video.publish</code>).</li>
              <li>Nous ne vendons, ne louons et ne partageons jamais vos données TikTok avec des tiers publicitaires.</li>
              <li>Les tokens d'accès sont chiffrés et stockés dans un environnement sécurisé. Vous pouvez révoquer l'accès à tout instant depuis vos paramètres TikTok.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">3.</span> Sécurité et Hébergement des Données
            </h2>
            <p>
              Toutes les communications transitent par des protocoles chiffrés SSL/TLS (HTTPS). Nos bases de données bénéficient de politiques de sécurité rigoureuses (Row Level Security Supabase PostgreSQL, hachage sécurisé des clés).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">4.</span> Vos Droits (Accès, Rectification, Suppression)
            </h2>
            <p>
              Conformément aux réglementations sur la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression totale de vos données. Vous pouvez exercer ce droit à tout moment en nous contactant à <strong>privacy@tuneliva.com</strong>.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 Tuneliva. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-emerald-400 font-bold">
              Politique de Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Conditions d'Utilisation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
