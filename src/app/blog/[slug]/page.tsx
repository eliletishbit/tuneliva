import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrGenerateArticle, getPublishedTopics } from "@/lib/blog/engine";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import {
  Clock,
  ArrowLeft,
  Share2,
  MessageCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getOrGenerateArticle(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tuneliva.com";

  if (!article) {
    return {
      title: "Article Introuvable | Blog Tuneliva",
      description: "Ce guide n'est pas encore disponible.",
    };
  }

  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  const ogImage = article.images[0];

  return {
    title: `${article.title} | Blog Tuneliva`,
    description: article.summary,
    keywords: [
      article.categoryLabel,
      ...article.tags,
      "e-commerce Afrique",
      "Mobile Money",
      "tunnel de vente",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: canonicalUrl,
      siteName: "Tuneliva Blog",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [ogImage],
    },
  };
}

export default async function SingleBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getOrGenerateArticle(slug);

  if (!article) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tuneliva.com";
  const articleUrl = `${baseUrl}/blog/${slug}`;

  // Articles recommandés (même catégorie)
  const relatedTopics = BLOG_TOPICS.filter(
    (t) => t.category === article.category && t.slug !== article.slug
  ).slice(0, 3);

  // Lien de partage WhatsApp direct
  const whatsappShareText = encodeURIComponent(
    `🔥 Je viens de lire cet excellent guide : "${article.title}"\n\nÀ lire absolument ici : ${articleUrl}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${whatsappShareText}`;

  // Construction des schémas JSON-LD
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    image: article.images,
    datePublished: "2026-09-08T08:00:00+01:00",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Tuneliva",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.categoryLabel,
        item: `${baseUrl}/blog?cat=${article.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Injection Schema.org JSON-LD Ultra-SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Halo lumineux d'ambiance */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[150px] opacity-30 pointer-events-none"
          style={{ backgroundColor: article.categoryColor }}
        />
      </div>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080D]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux articles du blog</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              title="Partager cet article sur WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Partager</span>
            </a>

            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Créer un Tunnel</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ARTICLE WRAPPER */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CORPS PRINCIPAL DE L'ARTICLE (8 COLONNES) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Header de l'article */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-sm flex items-center gap-1.5"
                  style={{
                    backgroundColor: article.categoryBg,
                    color: article.categoryColor,
                    borderColor: article.categoryBorder,
                  }}
                >
                  <span>{article.categoryIcon}</span>
                  <span>{article.categoryLabel}</span>
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime} de lecture</span>
                </span>

                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400">{article.publishedAt}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Encadré d'introduction / Résumé exécutif */}
              <div
                className="p-4 sm:p-5 rounded-2xl border bg-slate-900/60 backdrop-blur-md text-xs sm:text-sm text-slate-300 leading-relaxed"
                style={{ borderColor: article.categoryBorder }}
              >
                <div className="font-bold text-white text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>En Bref : Ce que vous allez apprendre</span>
                </div>
                {article.summary}
              </div>

              {/* Info auteur */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  style={{ borderColor: article.categoryColor }}
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{article.author.name}</h4>
                  <p className="text-[11px] text-slate-400">{article.author.role}</p>
                </div>
              </div>
            </div>

            {/* Image vedette principale */}
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black relative">
              <img
                src={article.images[0]}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu textuel riche */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6">
              {article.content.split("\n\n").map((para, pIdx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                // Titres H2
                if (trimmed.startsWith("## ")) {
                  const headingText = trimmed.replace("## ", "").split("{#")[0].trim();
                  const anchorId = trimmed.includes("{#")
                    ? trimmed.split("{#")[1].replace("}", "").trim()
                    : undefined;
                  return (
                    <h2
                      key={pIdx}
                      id={anchorId}
                      className="text-xl sm:text-2xl font-black text-white pt-6 pb-2 border-b border-white/10 tracking-tight"
                    >
                      {headingText}
                    </h2>
                  );
                }

                // Titres H3
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3
                      key={pIdx}
                      className="text-base sm:text-lg font-extrabold text-amber-300 pt-4"
                    >
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }

                // Citations / Callouts
                if (trimmed.startsWith("> ")) {
                  return (
                    <div
                      key={pIdx}
                      className="p-4 rounded-2xl bg-indigo-950/40 border-l-4 border-indigo-400 text-xs sm:text-sm text-indigo-200 italic my-4"
                    >
                      {trimmed.replace("> ", "")}
                    </div>
                  );
                }

                // Images Markdown
                if (trimmed.startsWith("![")) {
                  const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    const caption = match[1];
                    const src = match[2];
                    return (
                      <div key={pIdx} className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                        <img src={src} alt={caption} className="w-full max-h-96 object-cover" />
                        {caption && (
                          <div className="p-2.5 bg-slate-950/80 text-[11px] text-slate-400 text-center italic">
                            {caption}
                          </div>
                        )}
                      </div>
                    );
                  }
                }

                // Puces Markdown
                if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
                  const lines = trimmed.split("\n");
                  return (
                    <ul key={pIdx} className="space-y-2 my-3 pl-2">
                      {lines.map((l, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{l.replace(/^- \[ \] |- |^\d+\. /, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={pIdx} className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* SECTION FAQ SPÉCIFIQUE */}
            {article.faq && article.faq.length > 0 && (
              <div className="pt-8 border-t border-white/10 space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>Foire Aux Questions</span>
                </h3>

                <div className="space-y-3">
                  {article.faq.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-white">
                        {q.question}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOUTON DE PARTAGE WHATSAPP EN BAS D'ARTICLE */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/40 border border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white">Vous avez apprécié cet article ?</h4>
                <p className="text-[11px] text-slate-400">Partagez-le avec vos associés ou votre communauté d'entrepreneurs.</p>
              </div>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Partager sur WhatsApp</span>
              </a>
            </div>
          </article>

          {/* BARRE LATÉRALE STICKY (4 COLONNES) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sommaire Cliquable Sticky */}
            <div className="sticky top-20 space-y-6">
              <div className="p-5 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Table des Matières</span>
                </h3>

                <nav className="space-y-1 text-xs">
                  {article.headings.map((h, hIdx) => (
                    <a
                      key={hIdx}
                      href={`#${h.id}`}
                      className="block py-1.5 px-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all truncate"
                    >
                      {h.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bannière CTA Tuneliva */}
              <div className="p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 space-y-4 shadow-xl text-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-400/30 flex items-center justify-center text-lg mx-auto shadow-md">
                  🚀
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">
                    Appliquez ces Stratégies dès Maintenant
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Créez votre premier tunnel de vente mono-produit ou votre billetterie VIP avec Tuneliva en 3 minutes.
                  </p>
                </div>

                <Link
                  href="/"
                  className="block w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white font-black text-xs shadow-lg transition-transform hover:scale-105"
                >
                  Créer mon tunnel gratuit
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ARTICLES SIMILAIRES */}
        {relatedTopics.length > 0 && (
          <section className="pt-16 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>Articles Recommandés sur la Même Thématique</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTopics.map((rel) => (
                <div
                  key={rel.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 space-y-3 flex flex-col justify-between hover:border-indigo-400/50 transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="rounded-xl overflow-hidden aspect-video bg-black relative">
                      <img
                        src={rel.images[0]}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                      <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {rel.summary}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${rel.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Lire le guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
