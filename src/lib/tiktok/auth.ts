import fs from "fs";
import path from "path";

export interface TikTokAuthData {
  clientKey?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  openId?: string;
  creatorUsername?: string;
  creatorAvatar?: string;
  connectedAt?: string;
  expiresAt?: number;
  scope?: string;
  isConnected: boolean;
}

const DEFAULT_CLIENT_KEY = "sbawbo999rklwxzw3v";
const DEFAULT_CLIENT_SECRET = "mkUNcS7l7NzTsm2Yp769dUlSB34UMfLQ";

import os from "os";

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "tuneliva_tiktok")
  : path.join(process.cwd(), ".data");
const AUTH_FILE = path.join(DATA_DIR, "tiktok_auth.json");

let inMemoryAuth: TikTokAuthData | null = null;

function ensureDataDirSafe() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignoré en environnement lecture seule (Vercel Serverless)
  }
}

import { createAdminClient } from "@/lib/supabase/admin";

export function loadTikTokAuth(): TikTokAuthData {
  if (inMemoryAuth) {
    return inMemoryAuth;
  }

  try {
    ensureDataDirSafe();
    if (fs.existsSync(AUTH_FILE)) {
      const raw = fs.readFileSync(AUTH_FILE, "utf8");
      const parsed = JSON.parse(raw);
      let clientKey = process.env.TIKTOK_CLIENT_KEY || parsed.clientKey || DEFAULT_CLIENT_KEY;
      let clientSecret = process.env.TIKTOK_CLIENT_SECRET || parsed.clientSecret || DEFAULT_CLIENT_SECRET;
      if (clientKey === "awjjic52borhauze") clientKey = DEFAULT_CLIENT_KEY;
      if (clientSecret === "jVcqi9QKN7JUWiW9n8MCavpMfXEvrH2a") clientSecret = DEFAULT_CLIENT_SECRET;

      const auth: TikTokAuthData = {
        clientKey,
        clientSecret,
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        openId: parsed.openId,
        creatorUsername: parsed.creatorUsername,
        creatorAvatar: parsed.creatorAvatar,
        connectedAt: parsed.connectedAt,
        expiresAt: parsed.expiresAt,
        scope: parsed.scope,
        isConnected: !!(parsed.accessToken || parsed.openId),
      };
      inMemoryAuth = auth;
      return auth;
    }
  } catch {
    // fallback
  }

  const fallback: TikTokAuthData = {
    clientKey: process.env.TIKTOK_CLIENT_KEY || DEFAULT_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
    isConnected: false,
  };
  inMemoryAuth = fallback;
  return fallback;
}

export function saveTikTokAuth(data: Partial<TikTokAuthData>): void {
  const current = loadTikTokAuth();
  const updated = {
    ...current,
    ...data,
    isConnected: !!(data.accessToken || current.accessToken),
  };
  inMemoryAuth = updated;

  try {
    ensureDataDirSafe();
    fs.writeFileSync(AUTH_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    // Ignoré si lecture seule
  }
}

export async function syncTikTokAuthWithSupabase(): Promise<TikTokAuthData> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("product-images")
      .download("data/tiktok_auth.json");
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed && (parsed.accessToken || parsed.clientKey)) {
        saveTikTokAuth(parsed);
        return loadTikTokAuth();
      }
    }
  } catch (e) {
    // ignore
  }
  return loadTikTokAuth();
}

export async function persistTikTokAuthToSupabase(data: Partial<TikTokAuthData>): Promise<void> {
  saveTikTokAuth(data);
  try {
    const supabase = createAdminClient();
    const current = loadTikTokAuth();
    await supabase.storage
      .from("product-images")
      .upload("data/tiktok_auth.json", JSON.stringify(current, null, 2), {
        upsert: true,
        contentType: "application/json",
      });
  } catch (e) {
    console.error("Erreur persistence Supabase TikTok Auth:", e);
  }
}

export function getTikTokRedirectUri(): string {
  if (process.env.TIKTOK_REDIRECT_URI) {
    return process.env.TIKTOK_REDIRECT_URI;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;
  }
  return "https://tuneliva.vercel.app/api/auth/tiktok/callback";
}

