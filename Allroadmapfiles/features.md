# 📋 Tuneliva - Spécification des Fonctionnalités MVP (Features Spec)

> Ce document liste de manière exhaustive toutes les fonctionnalités incluses dans le **Produit Minimum Viable (MVP)** de Tuneliva à livrer lors du sprint de lancement.

---

## 1. Matrice des Fonctionnalités du MVP

| Module | Fonctionnalité | Priorité MVP | Statut |
| :--- | :--- | :--- | :--- |
| **Auth** | Connexion Google 1-clic | P0 (Indispensable) | À intégrer |
| **Auth** | Connexion Email / Mot de passe classique | P0 | À intégrer |
| **Auth** | Connexion Téléphone / OTP (SMS/WhatsApp) | P1 (Second temps) | Prévu schéma |
| **AI Builder** | Générateur de Page par Prompt textuel (Gemini Flash) | P0 | À intégrer |
| **AI Builder** | Micro-assistance IA de retouche par section (Baguette magique) | P0 | À intégrer |
| **Éditeur** | Visualisation temps réel Mobile & Desktop | P0 | À intégrer |
| **Éditeur** | Édition de texte en direct (Inline/Bottom sheet) | P0 | À intégrer |
| **Éditeur** | Gestion des images (Upload + Stock gratuit Unsplash/Pexels) | P0 | À intégrer |
| **Éditeur** | Réordonnancement des sections (Monter / Descendre) | P0 | À intégrer |
| **Checkout** | Formulaire Cash on Delivery (COD) / Paiement à la livraison | P0 | À intégrer |
| **Checkout** | Bouton de commande directe WhatsApp (Message pré-rempli) | P0 | À intégrer |
| **Checkout** | Paiement en ligne Mobile Money / Cartes (FedaPay) | P0 | À intégrer |
| **Devises** | Détection géographique IP et affichage devise locale (XOF, XAF, EUR, USD) | P0 | À intégrer |
| **Dashboard** | Gestion des commandes reçues (Statut : En attente, Confirmée, Livrée) | P0 | À intégrer |
| **Dashboard** | Statistiques rapides (Vues, Commandes, Taux de conversion, Total FCFA) | P0 | À intégrer |
| **PWA** | Installation 1-clic sur écran d'accueil mobile | P0 | À intégrer |
| **Monétisation** | Système de crédits de commandes (100 FCFA/lead) ou abonnement 5 000 FCFA | P1 | Prévu schéma |

---

## 2. Description Détaillée des Fonctionnalités Clés

### A. Générateur IA de Tunnels de Vente (Prompt-to-Funnel)
* **Comportement :**
  1. L'utilisateur clique sur "Créer un nouveau tunnel".
  2. Un champ moderne l'invite : *"Décrivez ce que vous vendez (ex: Sérum anti-taches bio à 12 000 FCFA à Abidjan avec livraison offerte)"*.
  3. L'API Gemini Flash traite la requête et retourne un schéma de page complet avec 6 sections prédéfinies :
     * **Hero Banner** : Grand titre percutant, sous-titre, image principale, bouton d'achat direct et badge de réassurance.
     * **Problème / Douleur** : Ce qui frustre le prospect avant de connaître ce produit.
     * **Bénéfices & Caractéristiques** : 3 à 4 points forts avec icônes modernes.
     * **Preuves Sociales / Témoignages** : 3 avis clients réalistes avec étoiles et photos de profil générées.
     * **Offre Irrésistible & Tarifs** : Prix normal barré, prix promo, bonus inclus.
     * **Formulaire de Commande Express** : Nom, téléphone, ville, mode de livraison.
     * **FAQ interactive** : Questions fréquentes sur la livraison et le paiement.

---

### B. L'Éditeur Modulaire Mobile-First
* **Pas de grille complexe ni de drag-and-drop encombrant.**
* Chaque composant est une section autonome.
* Sur mobile, l'utilisateur a 3 contrôles rapides sur chaque section :
  * 🔼 **Monter** / 🔽 **Descendre** pour changer l'ordre.
  * ✏️ **Modifier** : Ouvre un tiroir inférieur (Bottom Sheet) pour changer les textes et les prix en 2 clics.
  * ✨ **Améliorer avec l'IA** : Propose des variantes de texte optimisées pour la vente.
  * 🗑️ **Supprimer** / ➕ **Ajouter une section** (Galerie photo, Compte à rebours, Vidéo YouTube).

---

### C. Le Double Checkout Hybride (Le Cœur des Ventes)
Pour chaque page créée, le vendeur peut cocher les modes de commande autorisés :

1. **Option 1 : Paiement en ligne direct (Mobile Money / Carte)**
   * Le client clique sur "Payer en ligne".
   * Un modal s'ouvre avec FedaPay (MTN, Moov, Orange, Wave).
   * Une fois le paiement validé, la commande passe automatiquement au statut "Payée" et le vendeur reçoit un email/notification.

2. **Option 2 : Commande Cash on Delivery (Paiement à la livraison)**
   * Le client remplit simplement son prénom, son numéro WhatsApp et sa ville.
   * La commande est enregistrée dans le tableau de bord de Tuneliva avec le statut "À confirmer".
   * Le vendeur peut appeler le client ou lui envoyer un coursier directement.

3. **Option 3 : Finaliser sur WhatsApp**
   * En 1 clic, l'acheteur est redirigé vers l'application WhatsApp du vendeur avec un message pré-écrit :
     > *"Bonjour, je souhaite commander : [Nom du produit] au prix de [Prix en FCFA]. Voici mes coordonnées : [Nom, Ville]. Pouvez-vous me livrer ?"*

---

### D. Multi-Devise Contextuelle & Sélecteur Manuel
* Un visiteur au Bénin voit les prix en **FCFA (XOF)**.
* Un visiteur au Cameroun voit les prix en **FCFA (XAF)**.
* Un visiteur en France voit les prix convertis en **€ (EUR)**.
* Un sélecteur discret reste accessible en haut à droite pour changer de devise à tout moment.

---

### E. Tableau de Bord Gestionnaire (Back-Office Vendeur)
* **Métriques temps réel** : Chiffre d'affaires encaissé, Nombre de commandes reçues, Taux de conversion de la page.
* **Liste des commandes** : Exportable en 1 clic au format CSV ou Excel pour les agences de livraison partenaires.
* **Gestion du statut** : Marquer une commande comme "Confirmée", "En cours de livraison", "Livrée" ou "Annulée".
