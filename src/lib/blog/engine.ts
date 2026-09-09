import { BLOG_TOPICS, BlogTopic, BlogCategoryKey, BLOG_CATEGORIES } from "./topics";
import fs from "fs";
import path from "path";

import os from "os";

export interface BlogPostArticle extends BlogTopic {
  content: string;
  publishedAt: string;
  headings: { id: string; title: string; level: number }[];
  faq: { question: string; answer: string }[];
}

// Cache en mémoire pour réponses instantanées sans dépendre du disque
const memoryCache: Record<string, BlogPostArticle> = {};

// Sur Vercel ou serverless, le dossier courant est en lecture seule (read-only EROFS).
// On utilise os.tmpdir() si Vercel est détecté, ou .data en local.
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "tuneliva_blog")
  : path.join(process.cwd(), ".data");
const ARTICLES_FILE = path.join(DATA_DIR, "blog_articles.json");

function ensureDataDirSafe() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignoré en environnement lecture seule (Vercel Serverless)
  }
}

function loadCachedArticlesSafe(): Record<string, BlogPostArticle> {
  try {
    ensureDataDirSafe();
    if (fs.existsSync(ARTICLES_FILE)) {
      const raw = fs.readFileSync(ARTICLES_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch {
    // Ignoré silencieusement
  }
  return {};
}

function saveCachedArticleSafe(slug: string, article: BlogPostArticle) {
  try {
    ensureDataDirSafe();
    const all = loadCachedArticlesSafe();
    all[slug] = article;
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(all, null, 2), "utf8");
  } catch {
    // Ignoré si le disque est en lecture seule
  }
}

// Re-export getPublishedTopics pour compatibilité
export { getPublishedTopics } from "./topics";

// Générateur de contenu riche et pratique adapté au commerce africain
function generateRichContent(topic: BlogTopic): {
  content: string;
  headings: { id: string; title: string; level: number }[];
  faq: { question: string; answer: string }[];
} {
  const h1 = "1. Les Réalités du Terrain et les Défis Incontournables";
  const h2 = "2. Stratégie Étape par Étape pour Dominer votre Marché";
  const h3 = "3. Outils Recommandés et Intégration Mobile Money";
  const h4 = "4. Erreurs Fréquentes qui Ruinent les Vendeurs et Comment les Éviter";
  const h5 = "5. Plan d'Action Immédiat en 48 Heures";

  const headings = [
    { id: "defis-terrain", title: h1, level: 2 },
    { id: "strategie-etape", title: h2, level: 2 },
    { id: "outils-momo", title: h3, level: 2 },
    { id: "erreurs-frequentes", title: h4, level: 2 },
    { id: "plan-action", title: h5, level: 2 },
  ];

  const content = `
Dans le paysage économique actuel de l'Afrique de l'Ouest et du Centre, l'accélération de la numérisation crée des opportunités sans précédent. Que vous soyez basé à **Abidjan, Cotonou, Dakar, Lomé ou Douala**, maîtriser **${topic.title.toLowerCase()}** est devenu le facteur différenciateur entre les commerçants qui peinent à joindre les deux bouts et ceux qui génèrent plusieurs millions de FCFA chaque mois en toute indépendance.

Ce guide opérationnel décortique les méthodes éprouvées, les chiffres réels et les protocoles prêts à l'emploi pour transformer votre activité dès aujourd'hui.

---

## ${h1} {#defis-terrain}

Le consommateur africain moderne est ultra-connecté via son smartphone mais reste naturellement méfiant face aux arnaques en ligne. Pour gagner sa confiance, vous devez impérativement répondre à trois attentes fondamentales :

1. **La clarté absolue de l'offre :** Pas de frais cachés, un prix net en FCFA et une explication limpide de ce qu'il recevra.
2. **La simplicité de commande :** Un formulaire court sans mot de passe ni création de compte obligatoire.
3. **La flexibilité de règlement :** La liberté totale de payer par **Mobile Money (Wave, MTN MoMo, Moov)** ou en espèces lors de la remise du colis (Cash on Delivery).

> **💡 Règle d'Or Tuneliva :** En Afrique, chaque friction supplémentaire dans votre tunnel de vente vous fait perdre environ 25% de vos acheteurs potentiels. La simplicité est votre premier levier de profit.

![Visuel stratégique](${topic.images[1] || topic.images[0]})
*Figure 1 : Fluidité du passage en caisse et expérience utilisateur mobile optimisée.*

---

## ${h2} {#strategie-etape}

Pour mettre en place un système performant sans gaspiller votre trésorerie, suivez cette feuille de route en 3 étapes :

### Étape A : Valider le besoin avant d'investir
Ne commettez pas l'erreur d'acheter des centaines d'unités de stock sans avoir testé l'appétence réelle de votre audience. Créez un tunnel de présentation mono-produit sur **Tuneliva**, paramétrez un formulaire de commande et lancez un test publicitaire ciblé à petit budget (5 000 à 10 000 FCFA).

### Étape B : Structurer une offre irrésistible
Plutôt que de vous battre sur les prix au centime près, offrez de la valeur perçue supérieure :
- Un produit principal certifié de haute qualité.
- Un bonus offert d'une valeur réelle (ex: guide d'entretien ou accessoire complémentaire).
- Une garantie de satisfaction de 30 jours avec remplacement gratuit.
- Une livraison express assurée sous 24 à 48 heures.

### Étape C : Automatiser la confirmation et la logistique
Dès qu'une commande est passée, un accusé de réception automatique via **WhatsApp** rassure le client et confirme son adresse exacte avant que votre livreur ne démarre sa tournée.

---

## ${h3} {#outils-momo}

L'époque des virements bancaires manuels avec envoi de captures d'écran floues par message est révolue. Aujourd'hui, les tunnels de vente modernes intègrent directement des passerelles certifiées :

- **FedaPay & Passerelles Panafricaines :** Permettent à vos clients du Bénin, de Côte d'Ivoire, du Togo et du Sénégal de payer en 2 clics via leur compte Mobile Money préféré.
- **Wave Deep Linking :** Redirige directement le client dans son application Wave pour valider la transaction par empreinte digitale en 3 secondes.
- **Tableaux de bord en temps réel :** Vous suivez votre chiffre d'affaires, vos commandes honorées et vos fonds disponibles sans aucune ressaisie manuelle.

![Paiement et Logistique](${topic.images[2] || topic.images[0]})
*Figure 2 : Écosystème de paiement Mobile Money et suivi des encaissements marchands.*

---

## ${h4} {#erreurs-frequentes}

Voici les 4 erreurs critiques observées chez les débutants :

1. **Négliger l'appel téléphonique de confirmation :** En paiement à la livraison, ne jamais expédier un colis sans avoir joint le destinataire par appel vocal ou message vocal WhatsApp.
2. **Utiliser des images génériques de mauvaise qualité :** Les photos réelles prises au smartphone avec une belle lumière naturelle vendent 3 fois plus que les images retouchées d'usines asiatiques.
3. **Multiplier les choix et les produits :** Trop d'options tue la décision. Présentez une offre claire avec 1 à 3 packs maximum.
4. **Oublier la relance des abandons :** Près de 30% des paniers non finalisés peuvent être récupérés avec un simple message cordial d'assistance.

---

## ${h5} {#plan-action}

Pour récolter vos premiers résultats dans les prochaines 48 heures :

- [ ] **Heure 0 à 4 :** Définissez votre promesse principale et rassemblez 3 à 5 photos authentiques de votre solution.
- [ ] **Heure 4 à 8 :** Configurez votre tunnel de vente sur **Tuneliva** en sélectionnant un modèle adapté (Fintech, Masterclass, Boutique Élite).
- [ ] **Heure 8 à 16 :** Connectez votre numéro WhatsApp et activez l'encaissement Mobile Money ou le formulaire COD express.
- [ ] **Heure 16 à 48 :** Partagez votre lien public sur vos statuts WhatsApp, groupes ciblés et lancez vos premières diffusions publicitaires.
`;

  const faq = [
    {
      question: "Combien de temps faut-il pour observer les premiers résultats ?",
      answer: "Avec une offre bien ciblée et une page de vente épurée, les premières commandes peuvent arriver dans les premières 24 heures suivant la diffusion de votre lien.",
    },
    {
      question: "Le paiement par Mobile Money est-il obligatoire pour réussir ?",
      answer: "Il est vivement conseillé d'allier le Mobile Money (Wave, MTN, Moov) et le paiement à la livraison (COD) pour laisser le choix total à vos clients et maximiser vos conversions.",
    },
    {
      question: "Puis-je gérer tout ce processus directement depuis mon smartphone ?",
      answer: "Oui, la plateforme Tuneliva et les outils de gestion d'aujourd'hui sont 100% conçus pour être administrés depuis un simple smartphone avec connexion 4G.",
    },
  ];

  return { content, headings, faq };
}

// Récupère ou génère l'article complet
export async function getOrGenerateArticle(slug: string): Promise<BlogPostArticle | null> {
  if (!slug) return null;
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();

  const topic = BLOG_TOPICS.find(
    (t) =>
      t.slug === slug ||
      t.slug.toLowerCase() === normalizedSlug ||
      decodeURIComponent(t.slug).toLowerCase() === normalizedSlug
  );
  if (!topic) return null;

  // 1. Vérification en cache mémoire
  if (memoryCache[topic.slug]) {
    return memoryCache[topic.slug];
  }

  // 2. Vérification sur disque (sécurisée)
  const cached = loadCachedArticlesSafe();
  if (cached[topic.slug]) {
    memoryCache[topic.slug] = cached[topic.slug];
    return cached[topic.slug];
  }

  try {
    // 3. Génération du contenu structuré
    const generated = generateRichContent(topic);

    // Calcul de la date de publication
    const BASE_DATE = new Date("2026-09-08T00:00:00Z");
    const pubDate = new Date(
      BASE_DATE.getTime() + (topic.publishDayIndex || 0) * 24 * 60 * 60 * 1000
    );
    const formattedDate = pubDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const article: BlogPostArticle = {
      ...topic,
      content: generated.content,
      headings: generated.headings,
      faq: generated.faq,
      publishedAt: formattedDate,
    };

    memoryCache[topic.slug] = article;
    saveCachedArticleSafe(topic.slug, article);
    return article;
  } catch (error) {
    console.error("Erreur génération article blog:", error);
    return null;
  }
}
