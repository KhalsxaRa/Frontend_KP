import { ActivityLog } from "../models/index.js";
import { User } from "../models/index.js";

/**
 * Mengambil semua log aktivitas untuk keperluan laporan.
 * Fungsi ini akan dipanggil oleh route /admin/reports/download.
 */
export const downloadActivityReport = async (req, res) => {
  try {
    // Mengambil data log dari database dengan relasi ke model User
    const logs = await ActivityLog.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]], // Mengurutkan dari yang terbaru
    });

    // Mengembalikan data dalam format JSON agar bisa diproses frontend (jspdf)
    return res.status(200).json({
      status: "success",
      message: "Data laporan berhasil diambil",
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching activity report:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data laporan",
      error: error.message,
    });
  }
};
