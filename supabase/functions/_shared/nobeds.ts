// Shared helpers for the NoBeds integration.
import { createClient } from "npm:@supabase/supabase-js@2";

export const NOBEDS_BASE_URL = "https://api.nobeds.com/api";

/**
 * Mapping between referral_order_id prefixes and the originating sales channel.
 * Adjust here only — every function imports this constant.
 */
export const CHANNEL_PREFIXES: Array<{ prefix: string; source: string }> = [
  { prefix: "BDC-", source: "booking.com" },
  { prefix: "AIR-", source: "airbnb" },
  { prefix: "HM", source: "airbnb" },
  { prefix: "EXP-", source: "expedia" },
  { prefix: "AGO-", source: "agoda" },
  { prefix: "TRIP-", source: "trip.com" },
];

export const DEFAULT_CHANNEL_SOURCE = "direct";

export function resolveChannelSource(referralOrderId: unknown): string {
  if (typeof referralOrderId !== "string" || !referralOrderId.trim()) {
    return DEFAULT_CHANNEL_SOURCE;
  }
  const value = referralOrderId.trim().toUpperCase();
  for (const { prefix, source } of CHANNEL_PREFIXES) {
    if (value.startsWith(prefix.toUpperCase())) return source;
  }
  return DEFAULT_CHANNEL_SOURCE;
}

export function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export type ChannelRow = {
  id: string;
  provider: string;
  api_token: string;
};

export async function getChannel(
  supabase: ReturnType<typeof serviceClient>,
  channelId: string,
): Promise<ChannelRow> {
  const { data, error } = await supabase
    .from("connected_channels")
    .select("id, provider, api_token")
    .eq("id", channelId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Channel not found");
  return data as ChannelRow;
}

export async function recordSync(
  supabase: ReturnType<typeof serviceClient>,
  channelId: string,
  syncError: string | null,
) {
  await supabase
    .from("connected_channels")
    .update({ last_synced_at: new Date().toISOString(), sync_error: syncError })
    .eq("id", channelId);
}

/** GET a NoBeds endpoint — the token lives in the URL path, not a header. */
export async function nobedsGet(
  token: string,
  path: string,
  query: Record<string, string> = {},
): Promise<unknown> {
  const url = new URL(`${NOBEDS_BASE_URL}/${path}/${token}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`NoBeds ${path} responded ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`NoBeds ${path} returned an unreadable response`);
  }
}

/** NoBeds sometimes wraps arrays in { data: [...] } or an object map. */
export function toArray(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["data", "result", "results", "items", "hotels", "rentals", "bookings", "messages"]) {
      if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
    }
    const values = Object.values(obj);
    if (values.length && values.every((v) => v && typeof v === "object" && !Array.isArray(v))) {
      return values as Record<string, unknown>[];
    }
  }
  return [];
}

export function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function int(value: unknown): number | null {
  const n = num(value);
  return n === null ? null : Math.trunc(n);
}

export function str(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

export function pick(row: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  return null;
}

export function toIso(value: unknown): string | null {
  const raw = str(value);
  if (!raw) return null;
  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function jsonResponse(body: unknown, headers: HeadersInit, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
