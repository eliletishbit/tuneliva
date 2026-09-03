# 🛠️ Tuneliva - Stack Technique Complète (Architecture & Outils)

> Ce document détaille l'ensemble des briques technologiques, bibliothèques, services tiers et protocoles d'intégration utilisés pour propulser **Tuneliva**.

---

## 1. Vue d'Ensemble de la Stack

```
Frontend (Web & PWA)    : Next.js 14+ / 15 (App Router) + React + TypeScript
Styling & UI Kit        : Tailwind CSS + Shadcn/UI + Lucide Icons
State & Cache           : Zustand / React Server Components / React Query
Database & Auth         : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Moteur d'Intelligence   : Google Gemini 1.5/2.0 Flash (Free Tier via Google AI Studio)
Paiements Afrique       : FedaPay (UEMOA/CEMAC) + Paystack (Anglophone)
Paiements Monde         : Paystack International + Stripe
Hébergement & CDN       : Vercel Edge Network + Cloudflare DNS
```

---

## 2. Détail par Couche

### A. Frontend & Expérience Utilisateur (UI / UX)
* **Next.js (App Router, Server Actions)** :
  * *Pourquoi :* Permet de créer un tableau de bord réactif tout en compilant les pages de vente publiques en HTML ultra-optimisé côté serveur (SSR / ISR) pour un chargement instantané (< 800ms).
* **Tailwind CSS v4** :
  * *Pourquoi :* Pas de surcharge CSS inutile, styles compilés et purgés à la perfection, support natif du responsive mobile et des thèmes Dark/Light.
* **Shadcn/UI + Radix UI Primitives** :
  * *Composants utilisés :* Dialog, Drawer (Bottom Sheet pour mobile), DropdownMenu, Tabs, Toast (Sonner), Tooltip, Badge, Skeleton, Switch.
* **Lucide React** : Pack d'icônes vectorielles légères et cohérentes pour toute l'interface.
* **Canvas-Confetti** : Micro-animations festives lors de la publication d'une page ou de la réception d'une vente.

---

### B. Moteur PWA (Progressive Web App)
* **`manifest.json` + Service Workers** :
  * Permet aux utilisateurs d'installer Tuneliva directement sur l'écran d'accueil de leur smartphone (iOS / Android) comme une vraie application native.
  * Icônes adaptatives, splash screen et mise en cache des assets statiques pour une utilisation fluide même hors-ligne ou sur réseau 2G/3G capricieux.

---

### C. Base de Données, Sécurité & Authentification : Supabase
* **Base de données : PostgreSQL 15+** :
  * Schéma relationnel propre avec support du type `JSONB` pour stocker la structure flexible des blocs de chaque page de vente.
* **Row Level Security (RLS)** :
  * Cloisonnement strict des données : chaque utilisateur ne peut lire et modifier que ses propres tunnels, pages et commandes.
* **Authentification multi-canaux (Supabase Auth)** :
  * Connexion **Google 1-clic** (OAuth).
  * Connexion par **Email / Mot de passe**.
  * Connexion par **Numéro de téléphone / OTP WhatsApp & SMS** pour le public mobile africain.
* **Supabase Storage** :
  * Bucket sécurisé pour héberger les images des produits téléchargées par les vendeurs avec redimensionnement automatique (WebP/AVIF).

---

### D. Moteur d'IA Générative : Google Gemini Flash (100% Gratuit)
* **SDK officiel** : `@google/genai` (ou requêtes REST sécurisées via Server Actions).
* **Modèle** : `gemini-1.5-flash` ou `gemini-2.0-flash`.
* **Rôle** :
  1. Prendre le prompt brut du vendeur (*"Je vends des montres de luxe étanches à Cotonou à 25 000 FCFA avec livraison gratuite"*).
  2. Générer en 2 secondes une structure **JSON strictement typée** comprenant :
     * Le titre d'accroche (Hook).
     * Les 3 problèmes majeurs du prospect résolus par le produit.
     * Les 4 caractéristiques / bénéfices clés.
     * 3 avis clients crédibles adaptés au contexte local.
     * Une FAQ rassurante (délais de livraison, garantie).
     * Le badge d'offre limitée / compte à rebours.
  3. Fournir une micro-assistance de reformulation de texte sur demande.

---

### E. Passerelles de Paiement & Flux Financier

| Passerelle | Couverture Géographique | Moyens de Paiement | Rôle dans Tuneliva |
| :--- | :--- | :--- | :--- |
| **FedaPay** | Bénin, Togo, Côte d'Ivoire, Sénégal, Niger | MTN MoMo, Moov Money, Orange Money, Wave, Cartes locales | Encaissement principal zone UEMOA/CEMAC des ventes et des abonnements Tuneliva. |
| **Paystack** | Nigéria, Ghana, Kenya, Afrique du Sud, International | M-Pesa, Bank Transfer, Mobile Money, Cartes Visa / Mastercard | Encaissement zone anglophone et cartes bancaires internationales sans blocage. |
| **Stripe** | Europe (France, Belgique, etc.), USA, Canada | Cartes bancaires mondiales, Apple Pay, Google Pay, SEPA | Encaissement de la diaspora et clients occidentaux. |

---

### F. Routage Multi-Tenant & Domaines
* **Sous-domaines automatiques** : Wildcard DNS (`*.tuneliva.app`).
* **Middleware Next.js (`middleware.ts`)** :
  * Détecte le sous-domaine de la requête (ex: `montres.tuneliva.app`).
  * Récupère la page correspondante en base de données et renvoie le HTML compilé sans aucune redirection visible.
* **Domaines personnalisés (Option Pro)** : L'utilisateur pointe son CNAME vers `cname.tuneliva.app`, le middleware fait la résolution transparente.
