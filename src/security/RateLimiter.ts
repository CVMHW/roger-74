
/**
 * Client-Side Rate Limiter
 * 
 * Implements rate limiting for user actions to prevent abuse
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiter {
  private static instances: Map<string, RateLimiter> = new Map();
  private requests: number[] = [];
  private blockedUntil: number = 0;
  private config: RateLimitConfig;

  private constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Get or create rate limiter instance
   */
  static getInstance(key: string, config: RateLimitConfig): RateLimiter {
    if (!this.instances.has(key)) {
      this.instances.set(key, new RateLimiter(config));
    }
    return this.instances.get(key)!;
  }

  /**
   * Check if request is allowed
   */
  checkLimit(): RateLimitResult {
    const now = Date.now();

    // Check if currently blocked
    if (this.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: this.blockedUntil,
        blocked: true
      };
    }

    // Remove old requests outside the window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    // Check if limit exceeded
    if (this.requests.length >= this.config.maxRequests) {
      this.blockedUntil = now + this.config.blockDurationMs;
      return {
        allowed: false,
        remaining: 0,
        resetTime: this.blockedUntil,
        blocked: true
      };
    }

    // Record this request
    this.requests.push(now);

    return {
      allowed: true,
      remaining: this.config.maxRequests - this.requests.length,
      resetTime: now + this.config.windowMs,
      blocked: false
    };
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.requests = [];
    this.blockedUntil = 0;
  }

  /**
   * Get current status
   */
  getStatus(): { requests: number; blocked: boolean; remaining: number } {
    const now = Date.now();
    const recentRequests = this.requests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    return {
      requests: recentRequests.length,
      blocked: this.blockedUntil > now,
      remaining: Math.max(0, this.config.maxRequests - recentRequests.length)
    };
  }
}

// Pre-configured rate limiters for different actions
export const messageRateLimiter = RateLimiter.getInstance('messages', {
  maxRequests: 30, // 30 messages
  windowMs: 60 * 1000, // per minute
  blockDurationMs: 5 * 60 * 1000 // block for 5 minutes
});

export const feedbackRateLimiter = RateLimiter.getInstance('feedback', {
  maxRequests: 10, // 10 feedback actions
  windowMs: 60 * 1000, // per minute
  blockDurationMs: 2 * 60 * 1000 // block for 2 minutes
});
