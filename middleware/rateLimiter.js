import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 percobaan login
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
  },
});
