interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from URL and options
  generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  // Cache size in bytes (approximate)
  getSize(): number {
    let size = 0;
    for (const [key, value] of this.cache.entries()) {
      size += key.length * 2; // Unicode characters
      size += JSON.stringify(value).length * 2;
    }
    return size;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      size: this.getSize()
    };
  }
}

// Create singleton instance
export const apiCache = new APICache();

// Enhanced fetch with caching
export const cachedFetch = async <T>(
  url: string,
  options: RequestInit = {},
  ttl?: number
): Promise<T> => {
  const cacheKey = apiCache.generateKey(url, options);
  
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    console.log('API Cache: Hit for', url);
    return cachedData;
  }

  console.log('API Cache: Miss for', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache successful responses
    apiCache.set(cacheKey, data, ttl);
    
    return data;
  } catch (error) {
    console.error('API Cache: Fetch failed for', url, error);
    throw error;
  }
};

// Cache invalidation helpers
export const invalidateCache = (pattern?: string) => {
  if (!pattern) {
    apiCache.clear();
    return;
  }

  // Remove entries matching pattern
  for (const key of apiCache['cache'].keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
};

// Cache warming for critical data
export const warmCache = async (urls: string[]) => {
  const promises = urls.map(url => 
    cachedFetch(url).catch(error => 
      console.warn('Cache warming failed for', url, error)
    )
  );
  
  await Promise.allSettled(promises);
  console.log('Cache warming completed');
};
