import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://lqmjupbtxjtbepmpdgsq.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbWp1cGJ0eGp0YmVwbXBkZ3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mzk0MDcsImV4cCI6MjEwNDIxNTQwN30.XAeyS_nr68fQsc8iJZm1hthwMg5D0eDutj1ZeiXxyl8";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY
  );
}
