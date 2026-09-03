# 🎨 Tuneliva - Directives de Design & UX (Design System Guidelines)

> Ce document établit la charte graphique, les règles ergonomiques et les choix d'interface utilisateur pour faire de **Tuneliva** un produit digne des plus grandes licornes tech de 2026 (style Linear, Supabase, Vercel, Framer).

---

## 1. Philosophie Visuelle : "Vibrant, Moderne & Rassurant"

L'interface de Tuneliva doit procurer une double émotion :
1. **L'excitation et la vitalité** (*Viva*) : Donner envie de créer, suggérer la croissance des ventes, l'énergie et la rapidité.
2. **La clarté et la confiance absolue** : L'outil gère de l'argent et des commandes. L'utilisateur doit ressentir un sentiment de propreté, de stabilité et de haute précision.

* **Style global** : Minimalisme tech haut de gamme, bordures fines subtiles (`border-border/40`), micro-flous (glassmorphism léger `backdrop-blur-md`), cartes aérées avec radius doux (`rounded-2xl`).

---

## 2. Palette de Couleurs

La palette combine un **Violet Indigo profond** (prestige, tech, sérénité) avec une touche d'**Émeraude / Vert Énergie** (symbole de la vitalité, de l'argent et du Mobile Money africain), complété par des tons neutres impeccables en mode sombre et clair.

### Couleurs Principales (Brand Tokens)

| Rôle | Nom / Code HEX | Utilisation & Émotion |
| :--- | :--- | :--- |
| **Primaire (Vitalité)** | **Indigo Electrique (`#6366F1`)** | Boutons d'action principaux (CTA), focus, états actifs. Évoque l'intelligence, la tech 2026 et l'élégance. |
| **Secondaire (Conversion/Cash)** | **Émeraude Viva (`#10B981`)** | Badges de succès, boutons d'encaissement, métriques de chiffre d'affaires, icône WhatsApp. |
| **Accent / Énergie** | **Corail Lumineux (`#F43F5E`)** | Badges promo, urgence, notifications chaudes, alertes importantes. |
| **Arrière-plan Sombre (Dark)** | **Obsidienne Pure (`#090A0F`)** | Fond du dashboard en mode nuit, donne de la profondeur et du contraste sans être noir pur agressif. |
| **Cartes & Conteneurs (Dark)** | **Zinc Profond (`#12141C`)** | Conteneurs de sections, barres latérales, modales d'édition. |
| **Texte Principal (Dark)** | **Blanc Glacé (`#F8FAFC`)** | Typographie claire, lisibilité maximale sur écrans OLED mobiles. |
| **Texte Secondaire** | **Ardoise Neutre (`#94A3B8`)** | Légendes, descriptions, placeholders, horodatages. |

---

## 3. Typographie

* **Police Principale (Headings & UI)** : **Plus Jakarta Sans** ou **Geist Sans** (Google Fonts / Next Font).
  * *Pourquoi :* Géométrique, moderne, chaleureuse et extrêmement lisible même en petite taille sur écran de smartphone.
* **Police des Chiffres / Monétaire** : **JetBrains Mono** ou **Plus Jakarta Sans Semi-Bold** avec tabular numbers (`font-mono tabular-nums`).
  * *Pourquoi :* Garantit que les montants en FCFA, EUR ou USD s'alignent parfaitement dans les tableaux de commandes.

### Hiérarchie des Titres
* **Hero Title (Page de vente)** : `text-3xl sm:text-5xl font-extrabold tracking-tight`
* **Section Title** : `text-2xl sm:text-3xl font-bold tracking-tight`
* **Card Heading** : `text-lg font-semibold`
* **Body / Paragraphes** : `text-sm sm:text-base font-normal leading-relaxed text-slate-400`
* **Micro-texte / Badges** : `text-xs font-medium uppercase tracking-wider`

---

## 4. Règles d'Or pour l'Expérience Utilisateur (UX)

### A. Règle "Zéro Clavier Inutile" (Mobile-First Thumb-Zone)
* 90% des actions dans l'application mobile doivent être faisables avec le **pouce**.
* Les boutons d'action critiques (ex: "Enregistrer", "Publier", "Nouvelle page") sont fixés en bas de l'écran (Bottom Navigation / Sticky Bar) sur smartphone.
* Pas de formulaires interminables : l'IA pré-remplit 80% des données. L'utilisateur n'a qu'à valider ou modifier un chiffre.

### B. Règle de la "Baguette Magique Immédiate"
* À côté de chaque section de texte, un bouton discret avec une icône de baguette (`Sparkles`) permet de :
  1. *Rendre plus vendeur (urgent/promo)*
  2. *Raccourcir*
  3. *Corriger l'orthographe*
* Un aperçu instantané s'affiche sans bloquer l'écran.

### C. Le Feedback Sensoriel et Visuel
* Chaque commande reçue ou chaque page publiée déclenche un micro-feedback gratifiant (légère vibration haptique sur mobile + confettis discrets + notification sonores désactivables).
* Skeleton loaders élégants avec effet Shimmer (aucun spinner moche qui fait attendre l'utilisateur sans repère visuel).

---

## 5. Composants UI Clés (Shadcn/UI Customisé)

1. **Cartes de projet** : Aperçu miniature du tunnel, badge de statut (En ligne / Brouillon), nombre de vues et total encaissé en FCFA/devises.
2. **Bottom Sheet (Tiroir mobile)** : Pour modifier les propriétés d'un bloc sans quitter la vue d'ensemble de la page.
3. **Modal de Checkout Mobile Money** :
   * Affichage des logos familiers : MTN MoMo (Jaune), Moov (Bleu), Wave (Pingouin bleu ciel), Orange Money (Orange), Cartes (Visa/Mastercard).
   * Champ unique pour le numéro de téléphone avec détection automatique de l'opérateur.
4. **Bouton WhatsApp Flottant** : Bouton vert vif avec pulsation douce invitant le prospect à engager la conversation s'il a une question.
