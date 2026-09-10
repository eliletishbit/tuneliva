import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://lqmjupbtxjtbepmpdgsq.supabase.co";
const DEFAULT_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbWp1cGJ0eGp0YmVwbXBkZ3NxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODYzOTQwNywiZXhwIjoyMTA0MjE1NDA3fQ._DoOjFxGAOGmCbHIdvNRTqZ4OAimvqXn654Cl-K1l0I";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY;

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: (class DummyWS {} as any),
    },
  });
}
