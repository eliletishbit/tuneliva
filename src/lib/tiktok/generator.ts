import fs from "fs";
import path from "path";
import { getPublishedTopics, BlogTopic } from "@/lib/blog/topics";

export interface TikTokScene {
  id: string;
  second: number;
  durationSec: number;
  subtitle: string;
  highlightWord: string;
  visualPrompt: string;
  bgImageUrl: string;
}

export interface TikTokVideoPost {
  id: string;
  title: string;
  articleSlug: string;
  articleTitle: string;
  category: string;
  categoryColor: string;
  hookText: string;
  durationSec: number;
  scenes: TikTokScene[];
  ctaText: string;
  hashtags: string[];
  musicTrack: string;
  viralityScore: number;
  scheduledTime: string;
  scheduledDate: string;
  status: "draft" | "scheduled" | "published";
  publishedAt?: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
}

import os from "os";

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "tuneliva_tiktok")
  : path.join(process.cwd(), ".data");
const POSTS_FILE = path.join(DATA_DIR, "tiktok_posts.json");

let inMemoryPosts: TikTokVideoPost[] = [];

function ensureDataDirSafe() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignoré en environnement lecture seule (Vercel Serverless)
  }
}

export function loadTikTokPosts(): TikTokVideoPost[] {
  try {
    ensureDataDirSafe();
    if (fs.existsSync(POSTS_FILE)) {
      const raw = fs.readFileSync(POSTS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryPosts = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignoré silencieusement
  }
  return inMemoryPosts;
}

export function saveTikTokPosts(posts: TikTokVideoPost[]): void {
  inMemoryPosts = posts;
  try {
    ensureDataDirSafe();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
  } catch {
    // Ignoré si lecture seule
  }
}

const VIRAL_MUSIC_TRACKS = [
  "Afrobeats Lofi • Chill Sunset Drive",
  "Amapiano Deep Bassline • Hustle Mode",
  "Naija Trap Synth • High Conversion",
  "Afro-Fusion Energy • Modern Tech",
  "Kizomba Smooth Vibe • Smart Business",
];

const VERTICAL_BG_IMAGES = [
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80",
];

export function buildTikTokPostFromTopic(topic: BlogTopic, slotIndex: number, dateStr: string): TikTokVideoPost {
  const HOOK_PATTERNS = [
    {
      hook: "Arrête de perdre tes clients au moment de payer !",
      key: "perdre",
      sub1: "1. Simplifie ton offre au maximum : 1 produit phare, 1 offre limpide en FCFA.",
      sub2: "2. Active le double encaissement : Wave, MTN MoMo + Paiement à la livraison.",
      sub3: "3. Automatise tes relances WhatsApp en 30 secondes sans coder.",
    },
    {
      hook: "Le secret des vendeurs à 1M FCFA par mois en Afrique :",
      key: "secret",
      sub1: "1. Ils ne vendent pas sur un site vitrine lent, ils utilisent des tunnels épurés.",
      sub2: "2. Ils rassurent avec des preuves locales : avis WhatsApp et badge MoMo officiel.",
      sub3: "3. Ils proposent un pack avantageux qui augmente le panier moyen instantanément.",
    },
    {
      hook: "Si tu vends sur WhatsApp, regarde cette vidéo jusqu'au bout !",
      key: "WhatsApp",
      sub1: "1. Arrête de répondre manuellement aux 'Prix svp' pendant 2 heures.",
      sub2: "2. Envoie un lien Tuneliva où le client choisit sa ville et son moyen de paiement.",
      sub3: "3. Reçois la confirmation directe et livre en moins de 24h avec zéro friction.",
    },
    {
      hook: "Pourquoi 80% des boutiques en ligne africaines échouent ?",
      key: "échouent",
      sub1: "1. Trop de produits différents qui dispersent l'attention du visiteur.",
      sub2: "2. Formulaires de commande trop longs qui découragent sur smartphone.",
      sub3: "3. Absence d'un système de suivi et confirmation d'adresse rigoureux.",
    },
    {
      hook: "Comment encaisser Wave et MoMo sans payer d'abonnement ?",
      key: "encaisser",
      sub1: "1. Utilise Tuneliva avec intégration native FedaPay et opérateurs télécoms.",
      sub2: "2. L'argent arrive directement sur ton numéro sans intermédiaire bloquant.",
      sub3: "3. Zéro frais mensuels pour démarrer, idéal pour tester ton marché à fond.",
    },
  ];

  const currentPattern = HOOK_PATTERNS[slotIndex % HOOK_PATTERNS.length];
  const scheduleTimes = ["08:30", "11:45", "14:15", "17:30", "20:00"];
  const scheduledTime = scheduleTimes[slotIndex % scheduleTimes.length];

  const bgImg = topic.images[slotIndex % topic.images.length] || VERTICAL_BG_IMAGES[slotIndex % VERTICAL_BG_IMAGES.length];

  const scenes: TikTokScene[] = [
    {
      id: "sc-1",
      second: 0,
      durationSec: 4,
      subtitle: currentPattern.hook,
      highlightWord: currentPattern.key,
      visualPrompt: "Smartphone en main avec notification Mobile Money verte",
      bgImageUrl: bgImg,
    },
    {
      id: "sc-2",
      second: 4,
      durationSec: 5,
      subtitle: currentPattern.sub1,
      highlightWord: currentPattern.sub1.split(" ")[1] || "offre",
      visualPrompt: "Tunnel mono-produit fluide sur écran tactile",
      bgImageUrl: topic.images[1] || VERTICAL_BG_IMAGES[1],
    },
    {
      id: "sc-3",
      second: 9,
      durationSec: 5,
      subtitle: currentPattern.sub2,
      highlightWord: currentPattern.sub2.split(" ")[2] || "Wave",
      visualPrompt: "Graphique de conversion e-commerce en forte hausse",
      bgImageUrl: topic.images[2] || VERTICAL_BG_IMAGES[2],
    },
    {
      id: "sc-4",
      second: 14,
      durationSec: 5,
      subtitle: currentPattern.sub3,
      highlightWord: currentPattern.sub3.split(" ")[1] || "WhatsApp",
      visualPrompt: "Message WhatsApp de confirmation envoyé instantanément",
      bgImageUrl: VERTICAL_BG_IMAGES[3],
    },
    {
      id: "sc-5",
      second: 19,
      durationSec: 6,
      subtitle: "👉 Lien en bio pour lire l'analyse complète et lancer ton tunnel sur Tuneliva !",
      highlightWord: "Tuneliva",
      visualPrompt: "Page Tuneliva sur smartphone avec bouton Commencer Gratuitement",
      bgImageUrl: VERTICAL_BG_IMAGES[4],
    },
  ];

  return {
    id: `tt-${topic.id}-${slotIndex + 1}-${dateStr}`,
    title: `TikTok #${slotIndex + 1} (${scheduledTime}) • ${topic.title.slice(0, 44)}...`,
    articleSlug: topic.slug,
    articleTitle: topic.title,
    category: topic.categoryLabel,
    categoryColor: topic.categoryColor,
    hookText: currentPattern.hook,
    durationSec: 25,
    scenes,
    ctaText: "Lien dans la bio • Découvrir l'article complet sur Tuneliva",
    hashtags: [
      "#EcommerceAfrique",
      "#MobileMoney",
      "#BusinessEnAfrique",
      "#Tuneliva",
      "#WaveSenegal",
      "#MTNMoMo",
      "#VenteEnLigne",
    ],
    musicTrack: VIRAL_MUSIC_TRACKS[slotIndex % VIRAL_MUSIC_TRACKS.length],
    viralityScore: 94 + slotIndex,
    scheduledTime,
    scheduledDate: dateStr,
    status: slotIndex === 0 ? "published" : "scheduled",
    publishedAt: slotIndex === 0 ? new Date().toISOString() : undefined,
    likesCount: 1450 + (slotIndex * 380),
    sharesCount: 210 + (slotIndex * 45),
    commentsCount: 98 + (slotIndex * 22),
  };
}

export function generateDailyTikTokPosts(count: number = 5): TikTokVideoPost[] {
  const existing = loadTikTokPosts();
  const published = getPublishedTopics();
  const todayStr = new Date().toISOString().split("T")[0];

  // Articles du jour (les 2 derniers publiés)
  const todayTopics = published.slice(-2);
  const newPosts: TikTokVideoPost[] = [];

  const targetCount = Math.min(5, Math.max(1, count));
  for (let i = 0; i < targetCount; i++) {
    // Alternance entre les deux articles du jour pour les 5 vidéos
    const topic = todayTopics[i % todayTopics.length] || published[0];
    const post = buildTikTokPostFromTopic(topic, i, todayStr);
    newPosts.push(post);
  }

  // Fusionner sans doublons par id
  const existingMap = new Map<string, TikTokVideoPost>();
  existing.forEach((p) => existingMap.set(p.id, p));
  newPosts.forEach((p) => existingMap.set(p.id, p));

  const merged = Array.from(existingMap.values());
  saveTikTokPosts(merged);
  return merged;
}
