import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { sequelize } from "./models/index.js";
import { seedDefaultAdmin } from "./utils/seedAdmin.js";
import puppeteer from "puppeteer";

const PORT = process.env.PORT || 8080;

// --- KONFIGURASI PUPPETEER UNTUK RAILWAY ---
export const launchBrowser = async () => {
  return await puppeteer.launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process", // Tambahan untuk stabilitas di container kecil
    ],
    headless: "new",
  });
};

// --- START SERVER DENGAN ERROR LOGGING ---
const startServer = async () => {
  try {
    // 1. Cek Koneksi Database
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // 2. Sync Database
    await sequelize.sync({ alter: true }); // Menggunakan alter agar lebih aman di prod
    console.log("Database synced successfully.");

    // 3. Seed Admin
    await seedDefaultAdmin();
    console.log("Admin seeded.");

    // 4. Listen ke Port (Binding ke 0.0.0.0 untuk Railway)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // Pesan error ini akan muncul di Deploy Logs Railway saat terjadi crash
    console.error("!!! CRITICAL SERVER START ERROR !!!");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    // Jangan langsung exit jika ingin melihat log,
    // tapi untuk Railway, exit(1) diperlukan agar dia tahu container gagal
    process.exit(1);
  }
};

startServer();
