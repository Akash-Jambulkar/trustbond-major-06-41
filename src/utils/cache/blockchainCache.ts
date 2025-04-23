
import { Transaction } from "@/utils/transactions/types";

// Cache expiration time in milliseconds
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

type CachedData<T> = {
  data: T;
  timestamp: number;
};

type BlockchainCacheStore = {
  transactions: Map<string, CachedData<Transaction[]>>;
  kycStatus: Map<string, CachedData<boolean>>;
  trustScore: Map<string, CachedData<number>>;
  loans: Map<string, CachedData<any[]>>;
};

// Initialize the cache store
const cacheStore: BlockchainCacheStore = {
  transactions: new Map(),
  kycStatus: new Map(),
  trustScore: new Map(),
  loans: new Map(),
};

/**
 * Gets data from cache if it exists and is not expired
 */
export function getFromCache<T>(cacheKey: string, cacheType: keyof BlockchainCacheStore): T | null {
  const cache = cacheStore[cacheType];
  const cachedItem = cache.get(cacheKey);
  
  if (!cachedItem) return null;
  
  // Check if cache is expired
  if (Date.now() - cachedItem.timestamp > CACHE_EXPIRY) {
    cache.delete(cacheKey);
    return null;
  }
  
  return cachedItem.data as T;
}

/**
 * Stores data in the cache with current timestamp
 */
export function storeInCache<T>(
  cacheKey: string, 
  cacheType: keyof BlockchainCacheStore, 
  data: T
): void {
  const cache = cacheStore[cacheType];
  
  // Type-safe approach with conditional typing
  switch(cacheType) {
    case 'transactions':
      (cache as Map<string, CachedData<Transaction[]>>).set(cacheKey, { 
        data: data as Transaction[], 
        timestamp: Date.now() 
      });
      break;
    case 'kycStatus':
      (cache as Map<string, CachedData<boolean>>).set(cacheKey, { 
        data: data as boolean, 
        timestamp: Date.now() 
      });
      break;
    case 'trustScore':
      (cache as Map<string, CachedData<number>>).set(cacheKey, { 
        data: data as number, 
        timestamp: Date.now() 
      });
      break;
    case 'loans':
      (cache as Map<string, CachedData<any[]>>).set(cacheKey, { 
        data: data as any[], 
        timestamp: Date.now() 
      });
      break;
  }
}

/**
 * Clears all cached data or specific cache type
 */
export function clearCache(cacheType?: keyof BlockchainCacheStore): void {
  if (cacheType) {
    cacheStore[cacheType].clear();
  } else {
    Object.values(cacheStore).forEach(cache => cache.clear());
  }
}

/**
 * Gets a cache key for the given parameters
 */
export function getCacheKey(base: string, ...params: (string | number | null | undefined)[]): string {
  return [base, ...params.filter(Boolean)].join(':');
}
