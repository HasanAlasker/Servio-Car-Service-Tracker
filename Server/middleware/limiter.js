import { rateLimit } from "express-rate-limit";

// Time constants for readability
const SECOND = 1000;
const MINUTE = 60 * SECOND;

//protects entire server
export const globalLimit = rateLimit({
  windowMs: 15 * MINUTE,
  max: 600,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

//prevents brute force attacks
export const limiterLogin = rateLimit({
  windowMs: 5 * MINUTE,
  max: 5,
  message: "Too many login attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed attempts
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again in 5 minutes.",
      retryAfter: 300,
    });
  },
});

//prevent spam accounts
export const limiterRegister = rateLimit({
  windowMs: 5 * MINUTE,
  max: 3,
  message: "Too many accounts created from this IP.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many accounts created. Please try again later.",
      retryAfter: 3600,
    });
  },
});


// TEST LIMITER - Use this to test (5 requests per minute)
export const testLimit = rateLimit({
  windowMs: 1 * MINUTE,
  max: 5,
  message: "Test rate limit hit!",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log("🚫 Rate limit hit!");
    res.status(429).json({
      success: false,
      message: "Rate limit working! You hit the limit.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});
