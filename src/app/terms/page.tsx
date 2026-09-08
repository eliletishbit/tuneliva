import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Conditions Générales d'Utilisation (CGU) | Tuneliva",
  description: "Conditions d'utilisation officielles de la plateforme Tuneliva, constructeur de tunnels de vente en Afrique.",
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Légal Officiel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Conditions Générales d'Utilisation (Terms of Service)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Dernière mise à jour : 8 Septembre 2026 • Plateforme Tuneliva
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">1.</span> Présentation du Service
            </h2>
            <p>
              <strong>Tuneliva</strong> est une plateforme technologique SaaS permettant aux entrepreneurs, créateurs de contenu et commerçants de concevoir, personnaliser et publier des tunnels de vente optimisés pour le commerce digital et physique en Afrique et à l'international.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">2.</span> Accès et Utilisation de la Plateforme
            </h2>
            <p>
              L'accès à Tuneliva s'effectue par création d'un compte sécurisé (via Google OAuth, email ou numéro de téléphone Mobile Money). L'utilisateur s'engage à fournir des informations exactes et à préserver la confidentialité de ses identifiants.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-400">
              <li>L'utilisation du service à des fins illégales, frauduleuses ou trompeuses est strictement interdite.</li>
              <li>Tuneliva offre un accès libre dans le cadre de sa phase de lancement pour encourager l'adoption sans carte bancaire obligatoire.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">3.</span> Intégrations Tierces & Réseaux Sociaux (TikTok, WhatsApp, FedaPay)
            </h2>
            <p>
              Tuneliva propose des fonctionnalités avancées d'intégration avec des services tiers, notamment l'<strong>API TikTok (TikTok for Developers)</strong>, les services de messagerie instantanée (WhatsApp) et les passerelles de paiement Mobile Money.
            </p>
            <p>
              En connectant votre compte TikTok à Tuneliva, vous autorisez notre moteur d'automatisation à planifier et publier des contenus vidéos (formats courts 9:16) ou à les enregistrer dans vos brouillons TikTok conformément à vos directives expresses. Tuneliva ne collecte ni ne conserve votre mot de passe TikTok et respecte scrupuleusement les <em>TikTok Developer Terms of Service</em>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">4.</span> Propriété Intellectuelle & Contenu
            </h2>
            <p>
              L'utilisateur conserve l'entière propriété de ses produits, textes, visuels et contenus créés via Tuneliva. Tuneliva concède à l'utilisateur une licence d'utilisation non exclusive de ses modèles et architectures de conversion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">5.</span> Paiements et Transactions Marchandes
            </h2>
            <p>
              Les transactions financières conclues entre les marchands et leurs acheteurs finaux (que ce soit via Mobile Money, Carte Bancaire ou Paiement à la Livraison) relèvent de la responsabilité contractuelle directe du commerçant et de la passerelle de paiement agréée.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">6.</span> Contact & Support
            </h2>
            <p>
              Pour toute question relative aux présentes conditions, contactez l'équipe support à : <strong>contact@tuneliva.com</strong> ou via nos canaux officiels.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 Tuneliva. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300">
              Politique de Confidentialité
            </Link>
            <Link href="/terms" className="text-indigo-400 font-bold">
              Conditions d'Utilisation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
