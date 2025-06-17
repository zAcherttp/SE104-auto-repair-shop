import { User } from "@supabase/supabase-js";

// Simple in-memory cache for auth state to reduce API calls
interface AuthCache {
  user: User | null;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

let authCache: AuthCache | null = null;
const CACHE_TTL = 30000; // 30 seconds

export function getCachedAuth(): AuthCache | null {
  if (!authCache) return null;

  const now = Date.now();
  if (now - authCache.timestamp > authCache.ttl) {
    authCache = null; // Cache expired
    return null;
  }

  return authCache;
}

export function setCachedAuth(user: User | null): void {
  authCache = {
    user,
    timestamp: Date.now(),
    ttl: CACHE_TTL,
  };
}

export function clearAuthCache(): void {
  authCache = null;
}
