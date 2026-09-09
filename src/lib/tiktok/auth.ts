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

const DATA_DIR = path.join(process.cwd(), ".data");
const AUTH_FILE = path.join(DATA_DIR, "tiktok_auth.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadTikTokAuth(): TikTokAuthData {
  ensureDataDir();
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const raw = fs.readFileSync(AUTH_FILE, "utf8");
      const parsed = JSON.parse(raw);
      return {
        clientKey: process.env.TIKTOK_CLIENT_KEY || parsed.clientKey,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET || parsed.clientSecret,
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
    } catch {
      // fallback
    }
  }

  return {
    clientKey: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    isConnected: false,
  };
}

export function saveTikTokAuth(data: Partial<TikTokAuthData>): void {
  ensureDataDir();
  const current = loadTikTokAuth();
  const updated = {
    ...current,
    ...data,
    isConnected: !!(data.accessToken || current.accessToken),
  };
  fs.writeFileSync(AUTH_FILE, JSON.stringify(updated, null, 2), "utf8");
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
