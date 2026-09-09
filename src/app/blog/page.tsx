"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BLOG_CATEGORIES,
  BLOG_TOPICS,
  BlogCategoryKey,
  BlogTopic,
  getPublishedTopics,
} from "@/lib/blog/topics";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function BlogListingPage() {
  const publishedTopics = useMemo(() => getPublishedTopics(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoriesList = Object.entries(BLOG_CATEGORIES) as [
    BlogCategoryKey,
    (typeof BLOG_CATEGORIES)[BlogCategoryKey]
  ][];

  // Filtrage des articles
  const filteredTopics = useMemo(() => {
    return publishedTopics.filter((t) => {
      const matchCat =
        selectedCategory === "all" || t.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchSearch;
    });
  }, [publishedTopics, selectedCategory, searchQuery]);

  // Article mis en avant (le premier de la liste)
  const featuredTopic = publishedTopics[0];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Halo lumineux d'ambiance */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full blur-[140px] opacity-40 bg-gradient-to-b from-indigo-500/20 via-purple-500/15 to-transparent" />
        <div className="absolute top-[45%] -right-36 w-[600px] h-[450px] rounded-full blur-[150px] opacity-20 bg-emerald-500/20" />
      </div>

      {/* HEADER DE NAVIGATION DU BLOG */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080D]/90 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                T
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                Tuneliva<span className="text-amber-400">.</span>
              </span>
            </Link>
            <span className="hidden sm:inline text-xs font-bold text-slate-500">
              /
            </span>
            <span className="hidden sm:inline text-xs font-extrabold text-indigo-400 tracking-wider uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Blog Stratégique
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
            >
              ← Retour au Créateur
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Créer un Tunnel</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO BANNER DU BLOG */}
      <section className="relative z-10 pt-12 pb-8 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Guides & Stratégies • E-Commerce & Tunnels Panafricains</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          L'Encyclopédie Pratique du{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400">
            Commerce Digital Africain
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Découvrez 150 stratégies opérationnelles décortiquant l'encaissement Mobile Money, le Cash on Delivery, le copywriting persuasif et les tunnels de vente qui convertissent en Afrique.
        </p>

        {/* Barre de Recherche Dynamique */}
        <div className="pt-4 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un guide (ex: Wave, COD, relance WhatsApp, Facebook Ads)..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-slate-500 shadow-xl"
          />
        </div>
      </section>

      {/* SÉLECTEUR DE CATÉGORIES / PILIERS */}
      <section className="relative z-10 px-4 sm:px-8 max-w-6xl mx-auto pb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-white text-slate-950 shadow-lg font-black"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <span>Tous les Articles</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300">
              {publishedTopics.length}
            </span>
          </button>

          {categoriesList.map(([catKey, cat]) => {
            const isSelected = selectedCategory === catKey;
            const countInCat = publishedTopics.filter(
              (t) => t.category === catKey
            ).length;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? "text-white shadow-lg font-black scale-105"
                    : "bg-slate-900/80 text-slate-400 hover:text-white border-white/10"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: cat.color,
                        borderColor: cat.color,
                        boxShadow: `0 0 20px ${cat.color}40`,
                      }
                    : undefined
                }
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/40 text-slate-300">
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ARTICLE À LA UNE (SI DISPONIBLE ET PAS DE FILTRE RECHERCHE EN COURS) */}
      {featuredTopic && selectedCategory === "all" && !searchQuery && (
        <section className="relative z-10 px-4 sm:px-8 max-w-6xl mx-auto pb-10">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-slate-950 via-[#0B1020] to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: featuredTopic.categoryColor }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm flex items-center gap-1.5"
                    style={{
                      backgroundColor: featuredTopic.categoryBg,
                      color: featuredTopic.categoryColor,
                      borderColor: featuredTopic.categoryBorder,
                    }}
                  >
                    <span>{featuredTopic.categoryIcon}</span>
                    <span>{featuredTopic.categoryLabel}</span>
                  </span>
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Article Vedette</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight group-hover:text-amber-300 transition-colors">
                  <Link href={`/blog/${featuredTopic.slug}`}>
                    {featuredTopic.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {featuredTopic.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={featuredTopic.author.avatar}
                      alt={featuredTopic.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                    <span>{featuredTopic.author.name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredTopic.readTime} de lecture</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/blog/${featuredTopic.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xl transition-transform hover:scale-105"
                    style={{
                      backgroundColor: featuredTopic.categoryColor,
                      color: featuredTopic.categoryColor === "#00F5A0" ? "#064E3B" : "#FFFFFF",
                    }}
                  >
                    <span>Lire le guide complet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Link href={`/blog/${featuredTopic.slug}`}>
                  <div className="rounded-2xl overflow-hidden aspect-video sm:aspect-[4/3] border border-white/10 relative shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={featuredTopic.images[0]}
                      alt={featuredTopic.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GRILLE DES ARTICLES PUBLIÉS (AVEC BORDURES ET COULEURS THÉMATIQUES) */}
      <section className="relative z-10 px-4 sm:px-8 max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Publications Récentes</span>
            <span className="text-xs font-semibold text-slate-400">
              ({filteredTopics.length} article{filteredTopics.length > 1 ? "s" : ""})
            </span>
          </h2>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Aucun article trouvé</h3>
            <p className="text-xs text-slate-400">
              Essayez d'ajuster votre recherche ou sélectionnez une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold mt-2"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className="rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between overflow-hidden group bg-[#0B1020]/90 backdrop-blur-md"
                style={{
                  borderColor: topic.categoryBorder,
                  boxShadow: `0 10px 30px ${topic.categoryColor}10`,
                }}
              >
                {/* Image de présentation */}
                <Link href={`/blog/${topic.slug}`} className="relative block overflow-hidden aspect-video">
                  <img
                    src={topic.images[0]}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-md flex items-center gap-1"
                      style={{
                        backgroundColor: topic.categoryBg,
                        color: topic.categoryColor,
                        borderColor: topic.categoryBorder,
                      }}
                    >
                      <span>{topic.categoryIcon}</span>
                      <span>{topic.categoryLabel}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-3 text-[11px] text-slate-300 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{topic.readTime}</span>
                  </div>
                </Link>

                {/* Corps de la carte */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                      <Link href={`/blog/${topic.slug}`}>{topic.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Bas de carte avec auteur et bouton thématique */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={topic.author.avatar}
                        alt={topic.author.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-slate-400 truncate">
                        {topic.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${topic.slug}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer hover:scale-105"
                      style={{
                        backgroundColor: topic.categoryBg,
                        color: topic.categoryColor,
                        borderColor: topic.categoryBorder,
                        borderWidth: "1px",
                      }}
                    >
                      <span>Lire plus</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* BANNIÈRE DE CONVERSION EN BAS DE BLOG */}
      <section className="relative z-10 px-4 sm:px-8 max-w-5xl mx-auto pb-16">
        <div className="rounded-3xl p-8 sm:p-10 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 text-2xl mx-auto shadow-lg">
            🚀
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Passez de la Théorie aux Résultats dès Aujourd'hui
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Créez votre première page de vente mono-produit ou votre tunnel de billetterie en moins de 3 minutes avec Tuneliva. 100% gratuit et sans abonnement.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Générer mon tunnel de vente maintenant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER BLOG */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Tuneliva Blog. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Créateur de Tunnels
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Tous les Guides
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Espace Client
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
