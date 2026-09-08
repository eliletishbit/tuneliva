-- ==============================================================================
-- 🚀 TUNELIVA - SCHÉMA SQL COMPLET POUR SUPABASE POSTGRESQL
-- ==============================================================================
-- Exécutez ce script dans le SQL Editor de votre tableau de bord Supabase
-- (https://supabase.com/dashboard/project/lqmjupbtxjtbepmpdgsq/sql)
-- ==============================================================================

-- 1. EXTENSIONS NÉCESSAIRES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES PROFILS COMMERÇANTS (Liée à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    phone TEXT,
    business_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activation RLS Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Création de profil autorisée à l'inscription"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. TABLE DES TUNNELS DE VENTE (FUNNELS)
CREATE TABLE IF NOT EXISTS public.funnels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    page_type TEXT DEFAULT 'sales',
    data JSONB NOT NULL,
    is_published BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour recherches ultra-rapides
CREATE INDEX IF NOT EXISTS idx_funnels_slug ON public.funnels(slug);
CREATE INDEX IF NOT EXISTS idx_funnels_user_id ON public.funnels(user_id);

-- Activation RLS Funnels
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Les acheteurs peuvent lire les tunnels publiés
CREATE POLICY "Lecture publique des tunnels publiés"
    ON public.funnels FOR SELECT
    USING (is_published = true);

-- Le commerçant gère ses propres tunnels
CREATE POLICY "Le commerçant a accès complet à ses tunnels"
    ON public.funnels FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. TABLE DES COMMANDES CLIENTS (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    funnel_slug TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT,
    customer_address TEXT,
    product_name TEXT,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'XOF',
    payment_method TEXT DEFAULT 'cod', -- 'cod' | 'momo' | 'card' | 'fedapay'
    payment_status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
    order_status TEXT DEFAULT 'new', -- 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    fedapay_transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_orders_funnel_slug ON public.orders(funnel_slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- Activation RLS Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- N'importe quel acheteur peut soumettre une commande sur une page publique
CREATE POLICY "Insertion publique de commandes par les acheteurs"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Le commerçant gère les commandes de ses tunnels
CREATE POLICY "Le commerçant peut lire et modifier ses commandes"
    ON public.orders FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 5. BUCKET DE STOCKAGE PHOTOS PRODUITS (Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques de stockage
CREATE POLICY "Lecture publique des images produits"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Téléversement d'images pour les utilisateurs connectés"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

-- 6. TRIGGER AUTOMATIQUE DE CRÉATION DE PROFIL LORS DE L'INSCRIPTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, created_at, updated_at)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        COALESCE(new.phone, new.raw_user_meta_data->>'phone', ''),
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. PERMISSIONS & PRIVILÈGES D'ACCÈS (CRITIQUE : REQUIS PAR SUPABASE / POSTGREST)
-- ==============================================================================
-- Permet à l'API Supabase (service_role, authenticated, anon) d'accéder aux tables
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

