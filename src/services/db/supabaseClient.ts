"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined;
const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Export a nullable client so callers can check readiness.
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

/**
 * Returns true if Supabase env vars are set and the client is available.
 */
export const isSupabaseReady = !!supabase;

/**
 * Convenience: safe call wrapper to avoid exception propagation in fire-and-forget sync.
 */
export async function safe<T>(p: PromiseLike<T> | { then: (...args: any[]) => any } | T): Promise<T | null> {
  try {
    // Resolve both real Promises and Supabase Postgrest builders (thenables)
    return await Promise.resolve(p as any);
  } catch {
    return null;
  }
}