import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CustomDomainRecord {
  domain: string;
  funnelSlug: string;
  userId?: string;
  status: "verified" | "pending";
  createdAt: string;
}

const STORAGE_BUCKET = "product-images";
const DOMAINS_FILE = "data/custom-domains.json";
const LOCAL_DOMAINS_FILE = path.join(process.cwd(), ".data", "domains.json");

export async function getDomainMapping(): Promise<Record<string, string>> {
  try {
    const supabase = createAdminClient();
    const res = await supabase.storage.from(STORAGE_BUCKET).download(DOMAINS_FILE);
    if (!res.error && res.data) {
      const text = await res.data.text();
      const records: CustomDomainRecord[] = JSON.parse(text);
      const mapping: Record<string, string> = {};
      for (const r of records) {
        mapping[r.domain.toLowerCase().trim()] = r.funnelSlug;
      }
      return mapping;
    }
  } catch {}

  try {
    if (fs.existsSync(LOCAL_DOMAINS_FILE)) {
      const raw = fs.readFileSync(LOCAL_DOMAINS_FILE, "utf-8");
      const records: CustomDomainRecord[] = JSON.parse(raw);
      const mapping: Record<string, string> = {};
      for (const r of records) {
        mapping[r.domain.toLowerCase().trim()] = r.funnelSlug;
      }
      return mapping;
    }
  } catch {}

  return {};
}

export async function getAllDomains(userId?: string): Promise<CustomDomainRecord[]> {
  try {
    const supabase = createAdminClient();
    const res = await supabase.storage.from(STORAGE_BUCKET).download(DOMAINS_FILE);
    if (!res.error && res.data) {
      const text = await res.data.text();
      const records: CustomDomainRecord[] = JSON.parse(text);
      return userId ? records.filter((r) => r.userId === userId) : records;
    }
  } catch {}

  try {
    if (fs.existsSync(LOCAL_DOMAINS_FILE)) {
      const raw = fs.readFileSync(LOCAL_DOMAINS_FILE, "utf-8");
      const records: CustomDomainRecord[] = JSON.parse(raw);
      return userId ? records.filter((r) => r.userId === userId) : records;
    }
  } catch {}

  return [];
}

export async function saveDomain(
  domain: string,
  funnelSlug: string,
  userId?: string,
  status: "verified" | "pending" = "pending"
): Promise<CustomDomainRecord> {
  const cleanDomain = domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
  const all = await getAllDomains();
  const existingIndex = all.findIndex((d) => d.domain === cleanDomain);
  const record: CustomDomainRecord = {
    domain: cleanDomain,
    funnelSlug,
    userId,
    status,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    all[existingIndex] = record;
  } else {
    all.push(record);
  }

  // Persistance Cloud Storage Supabase
  try {
    const supabase = createAdminClient();
    await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(DOMAINS_FILE, JSON.stringify(all, null, 2), {
        contentType: "application/json",
        upsert: true,
      });
  } catch {}

  // Fallback Local
  try {
    const dir = path.dirname(LOCAL_DOMAINS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DOMAINS_FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch {}

  return record;
}

export async function deleteDomain(domain: string): Promise<boolean> {
  const cleanDomain = domain.toLowerCase().trim();
  const all = await getAllDomains();
  const filtered = all.filter((d) => d.domain !== cleanDomain);

  try {
    const supabase = createAdminClient();
    await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(DOMAINS_FILE, JSON.stringify(filtered, null, 2), {
        contentType: "application/json",
        upsert: true,
      });
  } catch {}

  try {
    fs.writeFileSync(LOCAL_DOMAINS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch {}

  return true;
}
