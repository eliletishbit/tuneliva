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

const DATA_DIR = path.join(process.cwd(), ".data");
const POSTS_FILE = path.join(DATA_DIR, "tiktok_posts.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadTikTokPosts(): TikTokVideoPost[] {
  ensureDataDir();
  if (fs.existsSync(POSTS_FILE)) {
    try {
      const raw = fs.readFileSync(POSTS_FILE, "utf8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveTikTokPosts(posts: TikTokVideoPost[]): void {
  ensureDataDir();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
}

const VIRAL_MUSIC_TRACKS = [
  "Afrobeats Lofi • Chill Sunset Drive",
  "Amapiano Deep Bassline • Hustle Mode",
  "Naija Trap Synth • High Conversion",
  "Afro-Fusion Energy • Modern Tech",
];

const VERTICAL_BG_IMAGES = [
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
];

export function buildTikTokPostFromTopic(topic: BlogTopic, indexInDay: number, dateStr: string): TikTokVideoPost {
  const hooks = [
    `Arrête de perdre tes clients au moment de payer !`,
    `Le secret des vendeurs à 1M FCFA par mois en Afrique :`,
    `Si tu vends sur WhatsApp, regarde cette vidéo jusqu'au bout !`,
    `Pourquoi 80% des boutiques en ligne africaines échouent ?`,
    `Comment encaisser Wave et MoMo sans payer d'abonnement ?`,
  ];

  const hook = hooks[indexInDay % hooks.length];
  const scheduleTimes = ["10:30", "13:00", "16:15", "18:45", "20:30"];
  const scheduledTime = scheduleTimes[indexInDay % scheduleTimes.length];

  const bgImg = topic.images[indexInDay % topic.images.length] || VERTICAL_BG_IMAGES[indexInDay % VERTICAL_BG_IMAGES.length];

  const scenes: TikTokScene[] = [
    {
      id: "sc-1",
      second: 0,
      durationSec: 4,
      subtitle: hook,
      highlightWord: hook.split(" ")[1] || "perdre",
      visualPrompt: "Plan serré smartphone avec notification Mobile Money verte",
      bgImageUrl: bgImg,
    },
    {
      id: "sc-2",
      second: 4,
      durationSec: 5,
      subtitle: "1. Simplifie ton offre au maximum : 1 produit phare, 1 offre claire en FCFA.",
      highlightWord: "Simplifie",
      visualPrompt: "Tunnel épuré mono-produit sur écran tactile",
      bgImageUrl: topic.images[1] || VERTICAL_BG_IMAGES[1],
    },
    {
      id: "sc-3",
      second: 9,
      durationSec: 5,
      subtitle: "2. Active le double encaissement : Wave, MTN MoMo + Cash on Delivery.",
      highlightWord: "Wave",
      visualPrompt: "Graphique de conversion en hausse instantanée",
      bgImageUrl: topic.images[2] || VERTICAL_BG_IMAGES[2],
    },
    {
      id: "sc-4",
      second: 14,
      durationSec: 5,
      subtitle: "3. Automatise tes relances WhatsApp en 30 secondes chrono sans coder.",
      highlightWord: "Automatise",
      visualPrompt: "Message WhatsApp de confirmation envoyé automatiquement",
      bgImageUrl: VERTICAL_BG_IMAGES[3],
    },
    {
      id: "sc-5",
      second: 19,
      durationSec: 6,
      subtitle: "👉 Lien en bio pour lire l'analyse complète et lancer ton tunnel sur Tuneliva !",
      highlightWord: "Tuneliva",
      visualPrompt: "Page d'accueil Tuneliva sur smartphone avec bouton Commencer Gratuitement",
      bgImageUrl: VERTICAL_BG_IMAGES[4],
    },
  ];

  return {
    id: `tt-${topic.id}-${indexInDay + 1}-${dateStr}`,
    title: `TikTok #${indexInDay + 1} • ${topic.title.slice(0, 48)}...`,
    articleSlug: topic.slug,
    articleTitle: topic.title,
    category: topic.categoryLabel,
    categoryColor: topic.categoryColor,
    hookText: hook,
    durationSec: 25,
    scenes,
    ctaText: "Lien dans la bio • Découvrir l'article sur Tuneliva",
    hashtags: [
      "#EcommerceAfrique",
      "#MobileMoney",
      "#BusinessEnAfrique",
      "#Tuneliva",
      "#WaveSenegal",
      "#MTNMoMo",
      "#Infopreneur",
    ],
    musicTrack: VIRAL_MUSIC_TRACKS[indexInDay % VIRAL_MUSIC_TRACKS.length],
    viralityScore: 92 + (indexInDay * 2),
    scheduledTime,
    scheduledDate: dateStr,
    status: indexInDay === 0 ? "published" : "scheduled",
    publishedAt: indexInDay === 0 ? new Date().toISOString() : undefined,
    likesCount: 1240 + (indexInDay * 340),
    sharesCount: 184 + (indexInDay * 42),
    commentsCount: 92 + (indexInDay * 19),
  };
}

export function generateDailyTikTokPosts(count: number = 3): TikTokVideoPost[] {
  const existing = loadTikTokPosts();
  const published = getPublishedTopics();
  const todayStr = new Date().toISOString().split("T")[0];

  // Articles du jour (les 2 derniers publiés)
  const todayTopics = published.slice(-2);
  const newPosts: TikTokVideoPost[] = [];

  const targetCount = Math.min(5, Math.max(1, count));
  for (let i = 0; i < targetCount; i++) {
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
