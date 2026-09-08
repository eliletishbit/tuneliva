-- ==============================================================================
-- 🚀 TUNELIVA - SCRIPT DE DÉBLOCAGE DES PERMISSIONS SUPABASE (CODE ERREUR 42501)
-- ==============================================================================
-- Copiez-collez ce script directement dans le SQL Editor de Supabase :
-- 👉 https://supabase.com/dashboard/project/lqmjupbtxjtbepmpdgsq/sql
-- Puis cliquez sur Run (Exécuter).
--
-- Explication : Comme l'option Désactiver l'exposition automatique des nouvelles tables
-- a été cochée lors de la création du projet, PostgreSQL n'a pas octroyé les droits
-- aux rôles Supabase (service_role, anon, authenticated).
-- Ce script accorde ces permissions tout en conservant la sécurité Row Level Security (RLS).
-- ==============================================================================

-- 1. Autoriser l'usage du schéma public
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Accorder les droits de lecture / écriture sur les tables existantes
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Accorder les droits sur les séquences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 4. Accorder les droits d'exécution sur les fonctions (triggers, rpc)
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 5. Configurer les droits par défaut pour toutes les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
