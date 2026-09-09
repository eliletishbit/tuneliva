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

const DEFAULT_CLIENT_KEY = "awjjic52borhauze";
const DEFAULT_CLIENT_SECRET = "jVcqi9QKN7JUWiW9n8MCavpMfXEvrH2a";

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

export function loadTikTokAuth(): TikTokAuthData {
  if (inMemoryAuth) {
    return inMemoryAuth;
  }

  try {
    ensureDataDirSafe();
    if (fs.existsSync(AUTH_FILE)) {
      const raw = fs.readFileSync(AUTH_FILE, "utf8");
      const parsed = JSON.parse(raw);
      const auth = {
        clientKey: process.env.TIKTOK_CLIENT_KEY || parsed.clientKey || DEFAULT_CLIENT_KEY,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET || parsed.clientSecret || DEFAULT_CLIENT_SECRET,
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

export function getTikTokRedirectUri(): string {
  if (process.env.TIKTOK_REDIRECT_URI) {
    return process.env.TIKTOK_REDIRECT_URI;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;
  }
  return "https://tuneliva.vercel.app/api/auth/tiktok/callback";
}
