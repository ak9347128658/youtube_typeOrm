import Redis from 'ioredis';

export class CacheService {
    private redis: Redis;
    private defaultTTL: number = 3600; // 1 hour in seconds

    constructor() {
        this.redis = new Redis({
            host: 'localhost',
            port: 6379
        });
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await this.redis.setex(key, ttl, stringValue);
        } else {
            await this.redis.setex(key, this.defaultTTL, stringValue);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);
        if (!value) return null;
        return JSON.parse(value) as T;
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async clear(): Promise<void> {
        await this.redis.flushall();
    }

    // Helper method to generate cache keys
    generateKey(prefix: string, identifier: string | number): string {
        return `${prefix}:${identifier}`;
    }
}
