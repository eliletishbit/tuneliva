-- ==============================================================================
-- 🚀 TUNELIVA - SCHÉMA DE BASE DE DONNÉES SUPABASE (PostgreSQL)
-- ==============================================================================
-- Ce script SQL crée l'ensemble des tables, contraintes, déclencheurs (triggers),
-- fonctions et politiques de sécurité Row Level Security (RLS) pour Tuneliva.
-- À exécuter directement dans l'éditeur SQL de votre tableau de bord Supabase.
-- ==============================================================================

-- Activation des extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLE : PROFILES (Profils Utilisateurs Vendeurs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    business_name TEXT,
    country_code VARCHAR(5) DEFAULT 'BJ', -- BJ, CI, SN, CM, NG, GH, FR, etc.
    preferred_currency VARCHAR(5) DEFAULT 'XOF', -- XOF, XAF, GHS, NGN, EUR, USD
    wallet_credits INTEGER DEFAULT 50, -- Crédits de commandes offerts à l'inscription (50 leads COD gratuits)
    avatar_url TEXT,
    plan_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'pro', 'agency'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. TABLE : PROJECTS (Projets / Tunnels de vente)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- Utilisé pour le sous-domaine : [slug].tuneliva.app
    custom_domain TEXT UNIQUE, -- Ex: www.maboutique.com
    is_published BOOLEAN DEFAULT FALSE,
    whatsapp_number TEXT, -- Numéro WhatsApp pour recevoir les commandes directes
    fedapay_public_key TEXT, -- Clé publique optionnelle pour encaisser en direct
    paystack_public_key TEXT,
    settings JSONB DEFAULT '{}'::jsonb, -- Options globales (pixel FB, TikTok, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABLE : PAGES (Pages associées à un tunnel de vente)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL, -- Ex: '/' pour la page d'accueil, 'merci' pour la page de remerciement
    is_home BOOLEAN DEFAULT TRUE,
    content JSONB NOT NULL DEFAULT '{"sections": []}'::jsonb, -- Structure complète des blocs générés par l'IA
    meta_title TEXT,
    meta_description TEXT,
    og_image_url TEXT,
    theme JSONB DEFAULT '{"primaryColor": "#6366F1", "font": "Plus Jakarta Sans"}'::jsonb,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

-- ==============================================================================
-- 4. TABLE : ORDERS (Commandes Reçues)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_city TEXT,
    delivery_address TEXT,
    quantity INTEGER DEFAULT 1,
    product_name TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'XOF',
    payment_method VARCHAR(20) NOT NULL, -- 'cod' (Cash on Delivery), 'whatsapp', 'fedapay', 'paystack', 'stripe'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    order_status VARCHAR(20) DEFAULT 'new', -- 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'
    payment_reference TEXT, -- ID de transaction retourné par la passerelle de paiement
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABLE : TRANSACTIONS (Recharges de crédits & Abonnements Tuneliva)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- 'subscription_pro', 'credit_topup', 'commission_fee'
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'XOF',
    gateway VARCHAR(20) NOT NULL, -- 'fedapay', 'paystack', 'stripe'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'successful', 'failed'
    reference TEXT UNIQUE,
    credits_added INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. INDEX POUR LA PERFORMANCE ULTRA-RAPIDE (< 1s)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_custom_domain ON public.projects(custom_domain);
CREATE INDEX IF NOT EXISTS idx_pages_project_id ON public.pages(project_id);
CREATE INDEX IF NOT EXISTS idx_orders_project_id ON public.orders(project_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- 7. FONCTION & TRIGGER : MISE À JOUR AUTOMATIQUE DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 8. TRIGGER AUTOMATIQUE : CRÉATION DE PROFIL À L'INSCRIPTION AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Politiques Profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques Projects
CREATE POLICY "Les utilisateurs peuvent voir leurs projets"
ON public.projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Lecture publique des projets publiés"
ON public.projects FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Les utilisateurs peuvent insérer leurs projets"
ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs projets"
ON public.projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs projets"
ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Politiques Pages
CREATE POLICY "Accès aux pages par le propriétaire du projet"
ON public.pages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = pages.project_id AND projects.user_id = auth.uid()
    )
);

CREATE POLICY "Lecture publique des pages de projets publiés"
ON public.pages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = pages.project_id AND projects.is_published = TRUE
    )
);

-- Politiques Orders
CREATE POLICY "Les vendeurs voient les commandes de leurs projets"
ON public.orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = orders.project_id AND projects.user_id = auth.uid()
    )
);

CREATE POLICY "Insertion publique de commandes par les acheteurs"
ON public.orders FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Les vendeurs peuvent mettre à jour le statut des commandes"
ON public.orders FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = orders.project_id AND projects.user_id = auth.uid()
    )
);

-- Politiques Transactions
CREATE POLICY "Les utilisateurs voient leurs propres transactions"
ON public.transactions FOR SELECT USING (auth.uid() = user_id);
