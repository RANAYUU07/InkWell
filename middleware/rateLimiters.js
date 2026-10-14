import rateLimit from "express-rate-limit";

// general limit for the whole API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per IP per window
  standardHeaders: true, // sends RateLimit-* headers so clients can see their quota
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

// much stricter limit for login and signup
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in 15 minutes" },
});
