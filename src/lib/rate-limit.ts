import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize if Redis env vars are present
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// Dynamic Cache for ratelimiters
const cache = new Map<string, Ratelimit>();

export async function checkRateLimit(keyId: string, limitRpm: number, limitRpd: number) {
    // If Redis is not configured, fail-open to not break development environments
    if (!redis) {
        return { success: true, limit: limitRpm, remaining: limitRpm, reset: 0 };
    }

    // Create or get RateLimiters (so we don't recreate the instance on every request if unnecessary, although it's lightweight)
    const rpmKey = `rpm_${limitRpm}`;
    if (!cache.has(rpmKey)) {
        cache.set(rpmKey, new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limitRpm, "1 m"),
            prefix: "ratelimit:rpm",
            analytics: true,
        }));
    }

    const rpdKey = `rpd_${limitRpd}`;
    if (!cache.has(rpdKey)) {
        cache.set(rpdKey, new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(limitRpd, "1 d"),
            prefix: "ratelimit:rpd",
            analytics: true,
        }));
    }

    const rlRpm = cache.get(rpmKey)!;
    const rlRpd = cache.get(rpdKey)!;

    // Check both simultaneously
    const [resRpm, resRpd] = await Promise.all([
        rlRpm.limit(keyId),
        rlRpd.limit(keyId)
    ]);

    // If either fails, return the failure
    if (!resRpm.success) return resRpm;
    if (!resRpd.success) return resRpd;

    // Otherwise return success (returning the RPM status by default)
    return resRpm;
}

// Dedicated Rate Limiter for public endpoints based on IP
const publicIpLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
    prefix: "ratelimit:public:ip",
    analytics: true,
}) : null;

export async function rateLimitIP(ipIdentifier: string) {
    if (!publicIpLimiter) {
        return { success: true };
    }
    return await publicIpLimiter.limit(ipIdentifier);
}
