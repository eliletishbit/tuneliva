"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TikTokVideoPost, TikTokScene } from "@/lib/tiktok/generator";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Music,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  ExternalLink,
  Flame,
  TrendingUp,
  Video,
  Smartphone,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  KeyRound,
  Unlink,
  Check,
  AlertCircle,
  UploadCloud,
} from "lucide-react";

interface TikTokAuthStatus {
  isConnected: boolean;
  clientKey?: string;
  hasSecret?: boolean;
  creatorUsername?: string;
  connectedAt?: string;
}

export function TikTokManager() {
  const [posts, setPosts] = useState<TikTokVideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [generateCount, setGenerateCount] = useState<number>(3);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [copiedUrlType, setCopiedUrlType] = useState<string | null>(null);

  // État de l'authentification TikTok
  const [authStatus, setAuthStatus] = useState<TikTokAuthStatus>({ isConnected: false });
  const [clientKeyInput, setClientKeyInput] = useState("");
  const [clientSecretInput, setClientSecretInput] = useState("");
  const [savingKeys, setSavingKeys] = useState(false);
  const [authNotification, setAuthNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null);

  // État du lecteur 9:16
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSecond, setCurrentSecond] = useState(0);

  const selectedPost = posts.find((p) => p.id === selectedPostId) || posts[0] || null;

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch("/api/auth/tiktok/status");
      const json = await res.json();
      if (json.success) {
        setAuthStatus({
          isConnected: json.isConnected,
          clientKey: json.clientKey,
          hasSecret: json.hasSecret,
          creatorUsername: json.creatorUsername,
          connectedAt: json.connectedAt,
        });
      }
    } catch (err) {
      console.error("Erreur statut TikTok Auth", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tiktok");
      const json = await res.json();
      if (json.success && json.posts) {
        setPosts(json.posts);
        if (!selectedPostId && json.posts.length > 0) {
          setSelectedPostId(json.posts[0].id);
        }
      }
    } catch (err) {
      console.error("Erreur chargement TikTok posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAuthStatus();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("connected") === "true") {
        setAuthNotification({
          type: "success",
          message: "Félicitations ! Votre compte TikTok est officiellement connecté et prêt pour la publication automatique.",
        });
      } else if (params.get("error")) {
        setAuthNotification({
          type: "error",
          message: decodeURIComponent(params.get("error") || "Erreur lors de la connexion TikTok"),
        });
      }
    }
  }, []);

  // Timer de lecture vidéo
  useEffect(() => {
    if (!isPlaying || !selectedPost) return;

    const interval = setInterval(() => {
      setCurrentSecond((prev) => {
        if (prev >= selectedPost.durationSec) {
          return 0; // boucle
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedPost]);

  // Scène courante
  const currentScene: TikTokScene | undefined = selectedPost?.scenes.find((sc) => {
    return currentSecond >= sc.second && currentSecond < sc.second + sc.durationSec;
  }) || selectedPost?.scenes[0];

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: generateCount }),
      });
      const json = await res.json();
      if (json.success && json.posts) {
        setPosts(json.posts);
        if (json.posts.length > 0) {
          setSelectedPostId(json.posts[0].id);
          setCurrentSecond(0);
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error("Erreur génération IA", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStatus = async (post: TikTokVideoPost) => {
    const nextStatus = post.status === "published" ? "scheduled" : "published";
    try {
      const res = await fetch("/api/tiktok", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, status: nextStatus }),
      });
      const json = await res.json();
      if (json.success && json.post) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? json.post : p)));
      }
    } catch (err) {
      console.error("Erreur mise à jour statut", err);
    }
  };

  const handlePublishDirectToTikTok = async (post: TikTokVideoPost) => {
    if (!authStatus.isConnected) {
      setAuthNotification({
        type: "error",
        message: "Veuillez d'abord connecter votre compte TikTok ci-dessus via OAuth officiel pour publier directement.",
      });
      return;
    }

    try {
      setPublishingPostId(post.id);
      const res = await fetch("/api/tiktok/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      const json = await res.json();
      if (json.success && json.post) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? json.post : p)));
        setAuthNotification({
          type: "success",
          message: `Vidéo "${post.title}" transmise à votre compte TikTok (@${authStatus.creatorUsername || "compte"}) !`,
        });
      } else {
        setAuthNotification({
          type: "error",
          message: json.error || "Erreur de transmission TikTok",
        });
      }
    } catch (err: any) {
      setAuthNotification({
        type: "error",
        message: err.message || "Erreur réseau lors de la publication TikTok",
      });
    } finally {
      setPublishingPostId(null);
    }
  };

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientKeyInput.trim() || !clientSecretInput.trim()) {
      setAuthNotification({
        type: "error",
        message: "Veuillez renseigner à la fois la Client Key et le Client Secret.",
      });
      return;
    }

    try {
      setSavingKeys(true);
      const res = await fetch("/api/auth/tiktok/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientKey: clientKeyInput.trim(),
          clientSecret: clientSecretInput.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAuthNotification({
          type: "success",
          message: "Clés TikTok API enregistrées avec succès ! Cliquez maintenant sur 'Connecter mon Compte TikTok'.",
        });
        fetchAuthStatus();
      } else {
        setAuthNotification({ type: "error", message: json.error || "Erreur d'enregistrement des clés" });
      }
    } catch (err: any) {
      setAuthNotification({ type: "error", message: err.message });
    } finally {
      setSavingKeys(false);
    }
  };

  const handleDisconnectTikTok = async () => {
    if (!confirm("Voulez-vous vraiment déconnecter votre compte TikTok de Tuneliva ?")) return;
    try {
      const res = await fetch("/api/auth/tiktok/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disconnect: true }),
      });
      const json = await res.json();
      if (json.success) {
        setAuthNotification({ type: "success", message: "Compte TikTok déconnecté." });
        fetchAuthStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrlType(type);
    setTimeout(() => setCopiedUrlType(null), 2500);
  };

  const copyScript = (post: TikTokVideoPost) => {
    const fullText = `TITRE: ${post.title}
ACCROCHE: ${post.hookText}
SCÈNES:
${post.scenes.map((s, idx) => `[${s.second}s - ${s.second + s.durationSec}s] ${s.subtitle}`).join("\n")}
CTA: ${post.ctaText}
HASHTAGS: ${post.hashtags.join(" ")}
SON: ${post.musicTrack}`;

    navigator.clipboard.writeText(fullText);
    setCopiedScriptId(post.id);
    setTimeout(() => setCopiedScriptId(null), 3000);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-400" />
        <p className="text-xs font-mono">Chargement du Moteur Vidéo TikTok IA...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification d'alerte / succès */}
      {authNotification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium ${
            authNotification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {authNotification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{authNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthNotification(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer font-bold px-2 py-0.5 rounded-lg bg-slate-800/50"
          >
            Fermer
          </button>
        </div>
      )}

      {/* 0. Carte de Connexion Officielle TikTok API */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <span>Connexion Officielle TikTok API (OAuth 2.0 Direct Post)</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pour des raisons absolues de sécurité et de conformité aux politiques de TikTok, vous ne partagez jamais votre mot de passe TikTok. La connexion s'effectue via l'API officielle TikTok avec redirection sécurisée.
            </p>
          </div>

          {/* Statut de connexion */}
          <div className="shrink-0 w-full lg:w-auto">
            {authStatus.isConnected ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between lg:justify-start gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black text-emerald-300">Compte TikTok Connecté</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {authStatus.creatorUsername || "@compte_tiktok"}
                  </div>
                  {authStatus.connectedAt && (
                    <div className="text-[10px] text-slate-400">
                      Lié le : {new Date(authStatus.connectedAt).toLocaleDateString("fr-FR")}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDisconnectTikTok}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Déconnecter le compte TikTok"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Déconnecter</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <a
                  href="/api/auth/tiktok/login"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-rose-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  title="Utilise l'URL de rappel officielle : /api/auth/tiktok/callback"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>🔗 Connecter TikTok (Callback Officiel)</span>
                </a>
                <a
                  href="/api/auth/tiktok/login?redirect_uri=https%3A%2F%2Ftuneliva.vercel.app%2Fhq-master-9821"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] border border-slate-700 transition-all"
                  title="Si vous aviez configuré /hq-master-9821 sur le portail TikTok"
                >
                  <span>Si configuré avec /hq-master-9821</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Détails de configuration & Copie des URLs TikTok Portal */}
        {!authStatus.isConnected && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Paramètres requis sur votre portail TikTok Developer :</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Terms of service URL */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Terms of Service URL</span>
                  <button
                    type="button"
                    onClick={() => copyUrl("https://tuneliva.vercel.app/terms", "terms")}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedUrlType === "terms" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrlType === "terms" ? "Copié" : "Copier"}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-200 truncate select-all">
                  https://tuneliva.vercel.app/terms
                </div>
              </div>

              {/* Privacy Policy URL */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Privacy Policy URL</span>
                  <button
                    type="button"
                    onClick={() => copyUrl("https://tuneliva.vercel.app/privacy", "privacy")}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedUrlType === "privacy" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrlType === "privacy" ? "Copié" : "Copier"}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-200 truncate select-all">
                  https://tuneliva.vercel.app/privacy
                </div>
              </div>

              {/* Redirect URI / Callback URL */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Redirect URI (Callback)</span>
                  <button
                    type="button"
                    onClick={() => copyUrl("https://tuneliva.vercel.app/api/auth/tiktok/callback", "callback")}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {copiedUrlType === "callback" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrlType === "callback" ? "Copié" : "Copier"}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-200 truncate select-all">
                  https://tuneliva.vercel.app/api/auth/tiktok/callback
                </div>
              </div>
            </div>

            {/* Saisie Client Key & Secret */}
            <form onSubmit={handleSaveKeys} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Client Key TikTok</label>
                <input
                  type="text"
                  placeholder="Ex: aw8192jx..."
                  value={clientKeyInput}
                  onChange={(e) => setClientKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Client Secret TikTok</label>
                <input
                  type="password"
                  placeholder="Ex: sec_..."
                  value={clientSecretInput}
                  onChange={(e) => setClientSecretInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="w-full sm:w-auto self-end pt-2 sm:pt-0">
                <button
                  type="submit"
                  disabled={savingKeys}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingKeys ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Enregistrer les Clés</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 1. Entête & Statistiques Globales */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-rose-400" />
              <span>Générateur & Publication Vidéo TikTok IA (9:16)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            L'IA transforme chaque jour les 2 articles publiés sur le blog en scripts verticaux viraux, sous-titres cinétiques rythmés et appels à l'action pour maximiser la visibilité de Tuneliva.
          </p>
        </div>

        {/* Contrôle de génération */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Nb / jour :</span>
            {[1, 2, 3, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setGenerateCount(cnt)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  generateCount === cnt
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-black shadow-xl shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Génération IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Générer les Vidéos du Jour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Métriques Résumées */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Vidéos Actives</div>
          <div className="text-2xl font-black text-white">{posts.length}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Basées sur les articles blog</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Vues Estimées</div>
          <div className="text-2xl font-black text-rose-400">
            {posts.reduce((acc, p) => acc + p.likesCount * 12, 0).toLocaleString("fr-FR")}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold">Portée mensuelle ciblée</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Score de Viralité</div>
          <div className="text-2xl font-black text-amber-400">95.4%</div>
          <div className="text-[10px] text-amber-300 font-semibold">Hooks à forte rétention</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Format Standard</div>
          <div className="text-2xl font-black text-indigo-400">9:16 Vertical</div>
          <div className="text-[10px] text-slate-400 font-semibold">Optimisé TikTok & Reels</div>
        </div>
      </div>

      {/* 3. Zone Centrale : Simulateur Smartphone 9:16 & Liste des Vidéos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Simulateur Smartphone 9:16 (5 colonnes) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulateur Plein Écran TikTok 9:16</span>
          </div>

          {selectedPost && (
            <div className="w-[320px] sm:w-[340px] h-[640px] rounded-[44px] bg-black p-3.5 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              {/* Fond Vidéo avec Zoom Lent Ken Burns */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={currentScene?.bgImageUrl || selectedPost.scenes[0]?.bgImageUrl}
                  alt="Fond vidéo"
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    isPlaying ? "scale-110" : "scale-100"
                  }`}
                />
                {/* Dégradés sombres d'ambiance TikTok */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />
              </div>

              {/* Barre supérieure iPhone (Dynamic Island & Heure) */}
              <div className="relative z-20 flex items-center justify-between text-[11px] font-semibold text-white px-2 pt-1">
                <span>{selectedPost.scheduledTime}</span>
                <div className="w-20 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
                  <div className="w-2 h-2 rounded-full bg-blue-900" />
                </div>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-white rounded-sm p-0.5">
                    <div className="h-full bg-white rounded-xs w-3/4" />
                  </div>
                </div>
              </div>

              {/* Onglets TikTok Live / Pour Toi */}
              <div className="relative z-20 flex items-center justify-center gap-4 text-xs font-black text-white/70 pt-2">
                <span className="hover:text-white cursor-pointer">Abonnements</span>
                <span className="text-white border-b-2 border-white pb-0.5 cursor-pointer">Pour toi</span>
              </div>

              {/* Centre : Sous-Titres Cinétiques Mot par Mot (Alex Hormozi style) */}
              <div className="relative z-20 my-auto px-4 text-center">
                <div className="inline-block px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl">
                  <p className="text-base sm:text-lg font-black text-white leading-tight tracking-tight uppercase">
                    {currentScene?.subtitle.split(" ").map((word, wIdx) => {
                      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
                      const isHighlighted =
                        cleanWord.toLowerCase() === (currentScene?.highlightWord || "").toLowerCase();
                      return (
                        <span
                          key={wIdx}
                          className={`inline-block mx-0.5 transition-all ${
                            isHighlighted
                              ? "text-yellow-300 scale-110 drop-shadow-[0_0_12px_rgba(234,179,8,0.8)] font-black"
                              : "text-white"
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </div>

              {/* Bas : Profil Créateur & Barre Latérale d'Interactions TikTok */}
              <div className="relative z-20 flex items-end justify-between gap-3">
                {/* Infos bas gauche */}
                <div className="space-y-1.5 text-white max-w-[210px]">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span>@{authStatus.creatorUsername || "tuneliva.officiel"}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                  </div>

                  <p className="text-[11px] line-clamp-2 text-white/90 leading-tight">
                    {selectedPost.hookText}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-white/70">
                    <Music className="w-3 h-3 animate-spin" />
                    <span className="truncate">{selectedPost.musicTrack}</span>
                  </div>
                </div>

                {/* Barre latérale droite d'engagement */}
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white fill-rose-500/80" />
                    </div>
                    <span className="text-[10px] font-bold">
                      {selectedPost.likesCount.toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">
                      {selectedPost.commentsCount.toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">
                      {selectedPost.sharesCount.toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full border-2 border-white/80 overflow-hidden bg-slate-900 mt-1">
                    <img
                      src={selectedPost.scenes[0]?.bgImageUrl}
                      alt="Vinyl"
                      className="w-full h-full object-cover animate-spin"
                      style={{ animationDuration: "5s" }}
                    />
                  </div>
                </div>
              </div>

              {/* Barre de progression vidéo en bas */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-rose-500 transition-all duration-200"
                  style={{
                    width: `${(currentSecond / (selectedPost.durationSec || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Commandes du Lecteur */}
          <div className="flex items-center gap-3 mt-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 shadow-md">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white transition-transform active:scale-95 cursor-pointer shadow-lg shadow-rose-500/30"
              title={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              type="button"
              onClick={() => setCurrentSecond(0)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-transform active:scale-95 cursor-pointer shadow-md"
              title="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentSecond}s / {selectedPost?.durationSec || 25}s
            </span>
          </div>
        </div>

        {/* Détail & Liste des Vidéos du Jour (7 colonnes) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Programmation Journalière des Vidéos</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Aujourd'hui : {posts.length} clips générés
            </span>
          </div>

          <div className="space-y-3">
            {posts.map((post) => {
              const isSelected = selectedPost?.id === post.id;
              const isPublishing = publishingPostId === post.id;

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setCurrentSecond(0);
                    setIsPlaying(true);
                  }}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-slate-900/90 border-rose-500/60 shadow-xl ring-2 ring-rose-500/20"
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                          style={{
                            backgroundColor: `${post.categoryColor}20`,
                            color: post.categoryColor,
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Diffusion : {post.scheduledTime}</span>
                        </span>
                        <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>Score : {post.viralityScore}%</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-white truncate pt-0.5">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-1 italic">
                        "{post.hookText}"
                      </p>
                    </div>

                    {/* Actions sur le post */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0" onClick={(e) => e.stopPropagation()}>
                      {/* Bouton Publier Directement sur TikTok */}
                      <button
                        type="button"
                        onClick={() => handlePublishDirectToTikTok(post)}
                        disabled={isPublishing}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-rose-500/20 disabled:opacity-50"
                        title="Publier sur votre compte TikTok connecté"
                      >
                        {isPublishing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5" />
                        )}
                        <span>{isPublishing ? "Envoi..." : "Publier TikTok"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyScript(post)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        title="Copier le script complet"
                      >
                        {copiedScriptId === post.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                            <span>Script</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(post)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          post.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                        }`}
                      >
                        {post.status === "published" ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Publié</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Programmé</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/blog/${post.articleSlug}`}
                        target="_blank"
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Voir l'article source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Scénario détaillé si sélectionné */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-200">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">
                        Découpage des Scènes (Timing & Sous-titres) :
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {post.scenes.map((scene, scIdx) => (
                          <div
                            key={scene.id || scIdx}
                            onClick={() => {
                              setCurrentSecond(scene.second);
                              setIsPlaying(true);
                            }}
                            className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                              currentScene?.id === scene.id
                                ? "bg-rose-500/15 border border-rose-500/40 text-rose-200"
                                : "bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 font-mono text-[10px] mb-1">
                              <span className="text-amber-400 font-bold">Scène {scIdx + 1} ({scene.second}s - {scene.second + scene.durationSec}s)</span>
                              <span className="text-slate-500 truncate max-w-[120px]">Mot clé: {scene.highlightWord}</span>
                            </div>
                            <p className="line-clamp-2 leading-relaxed">{scene.subtitle}</p>
                          </div>
                        ))}
                      </div>

                      {/* Hashtags et Appel à l'action */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {post.hashtags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
