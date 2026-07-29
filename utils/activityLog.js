import { ActivityLog } from "../models/index.js";

export const logActivity = async (userId, activityText) => {
  if (!userId || !activityText) return;

  try {
    await ActivityLog.create({
      user_id: userId,
      action_description: activityText,
    });
  } catch (error) {
    console.error("Gagal simpan activity log:", error.message);
  }
};
