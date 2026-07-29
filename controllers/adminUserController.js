import { User, ActivityLog } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";

const userAttributes = [
  "id",
  "username",
  "email",
  "role",
  "avatar",
  "created_at",
  "updated_at",
];

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: userAttributes,
      order: [["id", "DESC"]],
    });
    return res.json({ status: "success", data: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "role must be user or admin" });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ role });
    await logActivity(req.user.id, `ADMIN_UPDATE_USER_ROLE:${user.id}:${role}`);

    return res.json({
      status: "success",
      message: "User role updated",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Admin cannot delete own account" });
    }
    await user.destroy();
    await logActivity(req.user.id, `ADMIN_DELETE_USER:${req.params.id}`);
    return res.json({ status: "success", message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "role", "avatar"],
        },
      ],
      order: [["id", "DESC"]],
    });
    return res.json({ status: "success", data: logs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getMyActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "role", "avatar"],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: logs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const adminId = req.user.id;

    const admin = await User.findByPk(adminId);
    if (!admin)
      return res.status(404).json({ message: "Admin tidak ditemukan" });

    const updateData = { username, email };
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    await admin.update(updateData);
    await logActivity(adminId, `ADMIN_UPDATE_PROFILE:${adminId}`);

    // Ambil data terbaru untuk dikirim ke frontend
    const updatedAdmin = await User.findByPk(adminId);

    return res.json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: updatedAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
