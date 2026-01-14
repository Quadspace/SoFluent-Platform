/**
 * Rate Limiting Middleware
 * Prevents API abuse and DDoS attacks
 */

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitStore = new Map();

/**
 * Create a rate limiter middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum requests per window
 * @param {string} options.message - Error message
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // 100 requests per window default
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => {
      // Default: use IP address or user ID
      return req.auth?.userId || req.ip || 'anonymous';
    }
  } = options;

  return async (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || now - entry.resetTime > windowMs) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, entry);
    }

    // Increment request count
    entry.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    // Check if limit exceeded
    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000) // seconds
      });
    }

    // Clean up old entries periodically (every 5 minutes)
    if (Math.random() < 0.01) { // 1% chance on each request
      const cutoff = now - windowMs;
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < cutoff) {
          rateLimitStore.delete(k);
        }
      }
    }

    next();
  };
};

// Pre-configured rate limiters
export const rateLimiters = {
  // Strict rate limiter for authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    message: 'Too many authentication attempts. Please try again later.'
  }),

  // Standard API rate limiter
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: 'Too many requests. Please slow down.'
  }),

  // Strict rate limiter for payment endpoints
  payment: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    message: 'Too many payment requests. Please contact support if you need assistance.'
  }),

  // Rate limiter for file uploads
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Too many file uploads. Please try again later.'
  }),
};
