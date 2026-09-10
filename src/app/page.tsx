"use client";

import React, { useState, useEffect } from "react";
import { FunnelPageData, CurrencyCode, FunnelPageType } from "@/types/page";
import { FunnelEditor } from "@/components/editor/FunnelEditor";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Flame,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  ShoppingBag,
  Wrench,
  Crown,
  CreditCard,
  Globe2,
  MessageCircle,
  Star,
  Check,
  ChevronRight,
  ChevronLeft,
  PackageCheck,
  CheckCircle,
} from "lucide-react";
import { generateSmartFunnel } from "@/lib/ai/smart-engine";
import { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageCode } from "@/lib/i18n/translations";

export default function HomePage() {
  const [lang, setLang] = useState<LanguageCode>("fr");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tuneliva_lang") as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setLang(saved);
      }
    } catch {}
  }, []);

  const handleSelectLang = (code: LanguageCode) => {
    setLang(code);
    setShowLangDropdown(false);
    try {
      localStorage.setItem("tuneliva_lang", code);
    } catch {}
  };

  const [prompt, setPrompt] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("XOF");
  const [pageType, setPageType] = useState<FunnelPageType>("sales");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFunnel, setGeneratedFunnel] = useState<FunnelPageData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Index du slider de créatives
  const [activeCreativeIndex, setActiveCreativeIndex] = useState(0);

  // Détection synchrone de ?edit= pour éviter le flash de l'accueil
  const [isEditLoading, setIsEditLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).has("edit");
    }
    return false;
  });

  // CHARGEMENT DIRECT D'UN PROJET EXISTANT DEPUIS LE DASHBOARD (?edit=mon-slug)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const editSlug = urlParams.get("edit");
      if (editSlug) {
        setIsLoading(true);
        setIsEditLoading(true);
        fetch(`/api/funnels?slug=${encodeURIComponent(editSlug)}`)
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Introuvable");
          })
          .then((data) => {
            if (data && data.projectName) {
              setGeneratedFunnel(data);
            }
          })
          .catch((err) => {
            console.warn("Erreur chargement projet à éditer:", err);
            setIsEditLoading(false);
          })
          .finally(() => {
            setIsLoading(false);
            setIsEditLoading(false);
          });
      }
    }
  }, []);

  const handleGenerate = async (targetPrompt?: string) => {
    const textToUse = targetPrompt || prompt;
    if (!textToUse.trim()) {
      setErrorMessage(
        lang === "en"
          ? "Please describe your product or choose a template below."
          : "Veuillez décrire votre produit ou choisir un modèle ci-dessous."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToUse,
          currency,
          pageType,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedFunnel(json.data);
      } else {
        const localPage = await generateSmartFunnel(textToUse, currency, pageType);
        setGeneratedFunnel(localPage);
      }
    } catch (err) {
      console.warn("Erreur réseau, utilisation du générateur local:", err);
      const localPage = await generateSmartFunnel(textToUse, currency, pageType);
      setGeneratedFunnel(localPage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchTemplate = async (templatePrompt: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const page = await generateSmartFunnel(templatePrompt, currency, pageType);
      setGeneratedFunnel(page);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditLoading && !generatedFunnel) {
    return (
      <div className="min-h-screen bg-[#06080E] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-600/30 animate-pulse">
          T
        </div>
        <div className="space-y-1 text-center">
          <h2 className="font-extrabold text-base tracking-tight text-white">
            {lang === "en" ? "Opening Tuneliva Studio..." : "Ouverture du Studio Tuneliva..."}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === "en" ? "Loading your sales funnel." : "Chargement de votre tunnel de vente en cours."}
          </p>
        </div>
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (generatedFunnel) {
    return (
      <FunnelEditor
        initialData={generatedFunnel}
        onBackToPrompt={() => setGeneratedFunnel(null)}
        onSave={(updatedData) => {
          setGeneratedFunnel(updatedData);
          alert(
            lang === "en"
              ? "Your funnel was saved successfully!"
              : "Votre tunnel a été enregistré avec succès !"
          );
        }}
      />
    );
  }

  const creatives = t.creativesShowcase.items;
  const currentCreative = creatives[activeCreativeIndex] || creatives[0];

  const templateIcons = [Zap, Sparkles, Crown, Layers, Wrench, ShoppingBag];

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Halo lumineux décoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-indigo-600/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* 1. NAVBAR */}
      <header className="relative z-50 border-b border-white/10 bg-[#06080E]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 text-base">
            T
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent block">
              Tuneliva
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
              {t.header.tagline}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{t.header.regions}</span>
          </div>

          {/* SÉLECTEUR DE LANGUE MULTILINGUE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Changer la langue / Change language"
            >
              <span className="text-sm">{SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.flag || "🌐"}</span>
              <span className="uppercase text-[11px]">{lang}</span>
              <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${showLangDropdown ? "rotate-90" : ""}`} />
            </button>

            {showLangDropdown && (
              <>
                {/* Backdrop click-away */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowLangDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl p-1.5 z-50 space-y-1">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLang(l.code);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        lang === l.code
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-200 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-lg">{l.flag}</span>
                        <span className="text-xs font-semibold">{l.name}</span>
                      </span>
                      {lang === l.code && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <a
            href="/blog"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/50 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>{t.header.blog}</span>
          </a>

          <a
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.header.myOrders}</span>
          </a>
        </div>
      </header>

      {/* 2. ZONE HÉRO PRINCIPALE & BARRE DE GÉNÉRATION */}
      <section className="relative z-10 px-4 pt-10 pb-16 max-w-4xl mx-auto text-center space-y-8 w-full">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-emerald-500/10 text-indigo-300 border border-white/10 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            {t.hero.titlePart1}
            <span className="bg-gradient-to-r from-indigo-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>

        {/* BARRE DE PROMPT */}
        <div className="w-full max-w-2xl mx-auto space-y-3">
          <div className="p-2.5 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500 transition-all space-y-2 text-left">
            {/* TYPE DE PAGE À CRÉER */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
                {t.hero.typeLabel}
              </span>
              {(Object.keys(t.pageTypes) as FunnelPageType[]).map((typeKey) => (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setPageType(typeKey)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    pageType === typeKey
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                      : "bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {t.pageTypes[typeKey]?.label || typeKey}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder={t.hero.promptPlaceholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none resize-none"
            />

            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 px-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 font-semibold w-full sm:w-auto"
              >
                {(Object.keys(t.currencies) as CurrencyCode[]).map((cKey) => (
                  <option key={cKey} value={cKey}>
                    {t.currencies[cKey]}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleGenerate()}
                disabled={isLoading}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>{t.hero.generatingBtn}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>{t.hero.generateBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {errorMessage}
            </p>
          )}
        </div>

        {/* BANDEAU DES PAIEMENTS ACCEPTÉS (MOMO + CARTES) */}
        <div className="pt-2 pb-4 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="font-bold text-slate-300">{t.paymentsStrip.label}</span>
          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20">MTN MoMo</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">Moov Money</span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">Orange Money</span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">Wave</span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">{t.paymentsStrip.cards}</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">{t.paymentsStrip.cod}</span>
        </div>
      </section>

      {/* 3. DÉMARRAGE DIRECT AVEC LES MODÈLES PRÊTS À L'EMPLOI (SANS IA REQUISE) */}
      <section className="py-10 px-4 max-w-5xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            {t.starterTemplates.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {t.starterTemplates.items.map((tmpl, idx) => {
            const Icon = templateIcons[idx % templateIcons.length];
            return (
              <button
                key={tmpl.id}
                onClick={() => handleLaunchTemplate(tmpl.prompt)}
                className="p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-indigo-500/60 transition-all text-left space-y-2 group cursor-pointer shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {tmpl.name}
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-white/10 text-slate-300">
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{tmpl.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION : CRÉATIVES ÉPOUSTOUFLANTS (SLIDER DYNAMIQUE) */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
            {t.creativesShowcase.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.creativesShowcase.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.creativesShowcase.subtitle}
          </p>
        </div>

        {/* CARROUSEL / SHOWCASE INTERACTIF */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold text-white"
                style={{ backgroundColor: currentCreative.color }}
              >
                {currentCreative.theme}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {currentCreative.stats}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentCreative.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentCreative.subtitle}
            </p>

            <button
              onClick={() => handleLaunchTemplate(currentCreative.prompt)}
              className="py-3 px-5 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: currentCreative.color }}
            >
              <span>{t.creativesShowcase.ctaBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* CONTRÔLES DU SLIDER */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              {creatives.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCreativeIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeCreativeIndex === idx
                      ? "w-8 bg-indigo-500"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-video relative shadow-2xl border border-white/10 group">
            <img
              src={currentCreative.imageUrl}
              alt={currentCreative.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-white">{t.creativesShowcase.livePreviewBadge}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION : CAS D'USAGE (POUR QUI EST FAIT TUNELIVA ?) */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
            {t.useCases.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.useCases.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              🛍️
            </div>
            <h3 className="font-extrabold text-base text-white">{t.useCases.ecommerceTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.useCases.ecommerceDesc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              🛠️
            </div>
            <h3 className="font-extrabold text-base text-white">{t.useCases.artisanTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.useCases.artisanDesc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              👑
            </div>
            <h3 className="font-extrabold text-base text-white">{t.useCases.infopreneurTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.useCases.infopreneurDesc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-extrabold text-base text-white">{t.useCases.startupsTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.useCases.startupsDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 6. NOUVELLE SECTION : TARIFS CLAIRS & TRANSPARENCE DES QUOTAS */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            {t.pricing.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.pricing.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* CARTE PLAN GRATUIT */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {t.pricing.freePlan.badge}
                </span>
                <span className="text-xs text-slate-400">{t.pricing.freePlan.period}</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{t.pricing.freePlan.title}</h3>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                  {t.pricing.freePlan.price}
                </div>
                <p className="text-xs text-slate-400 mt-2">{t.pricing.freePlan.desc}</p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
                {t.pricing.freePlan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all border border-white/10 cursor-pointer text-center"
            >
              {t.pricing.freePlan.cta}
            </button>
          </div>

          {/* CARTE PLAN PRO ILLIMITÉ */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500/50 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-500 text-white shadow-md shadow-indigo-500/30">
                  {t.pricing.proPlan.badge}
                </span>
                <span className="text-xs text-indigo-300 font-semibold">{t.pricing.proPlan.period}</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{t.pricing.proPlan.title}</h3>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {t.pricing.proPlan.price}
                </div>
                <p className="text-xs text-slate-300 mt-2">{t.pricing.proPlan.desc}</p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200">
                {t.pricing.proPlan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/dashboard"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-center block cursor-pointer"
            >
              {t.pricing.proPlan.cta}
            </a>
          </div>
        </div>

        {/* ENCADRÉ EXPLICATIF TRANSPARENCE QUOTA */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/10 text-left space-y-1.5 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
            <span>{t.pricing.faqNoteTitle}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.pricing.faqNoteBody}
          </p>
        </div>
      </section>

      {/* 7. SECTION : TÉMOIGNAGES CLIENTS */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            {t.testimonials.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {t.testimonials.items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="font-bold text-sm text-white">{item.name}</div>
                <div className="text-[11px] text-slate-400">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-200">
          <span>{t.footer.regions}</span>
        </div>
        <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
      </footer>
    </div>
  );
}
