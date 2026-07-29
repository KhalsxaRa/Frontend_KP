import { UserHealthProfile } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";

export const createProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      weight,
      height,
      activity_level,
      goal_type,
      budget_limit,
    } = req.body;

    const numericAge = Number(age);
    const numericWeight = Number(weight);
    const numericHeight = Number(height);
    const numericBudget = budget_limit === undefined || budget_limit === null || budget_limit === "" ? null : Number(budget_limit);

    if (!age || !weight || !height || !goal_type) {
      return res
        .status(400)
        .json({ message: "age, weight, height, and goal_type are required" });
    }

    if (!Number.isFinite(numericAge) || numericAge < 13 || numericAge > 100) {
      return res.status(400).json({ message: "Umur harus antara 13 sampai 100 tahun" });
    }

    if (!Number.isFinite(numericWeight) || numericWeight < 20 || numericWeight > 300) {
      return res.status(400).json({ message: "Berat badan harus antara 20 sampai 300 kg" });
    }

    if (!Number.isFinite(numericHeight) || numericHeight < 80 || numericHeight > 250) {
      return res.status(400).json({ message: "Tinggi badan harus antara 80 sampai 250 cm" });
    }

    if (numericBudget !== null && (!Number.isFinite(numericBudget) || numericBudget < 0 || numericBudget > 100000000)) {
      return res.status(400).json({ message: "Budget harus antara 0 sampai 100000000" });
    }

    const profile = await UserHealthProfile.create({
      user_id: req.user.id,
      age,
      gender,
      weight,
      height,
      activity_level: activity_level || "medium",
      goal_type,
      budget_limit,
    });

    await logActivity(req.user.id, "CREATE_HEALTH_PROFILE");
    return res.status(201).json({ status: "success", data: profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await UserHealthProfile.findAll({
      where: { user_id: req.user.id },
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const profile = await UserHealthProfile.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!profile)
      return res.status(404).json({ message: "Health profile not found" });
    return res.json({ status: "success", data: profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await UserHealthProfile.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!profile)
      return res.status(404).json({ message: "Health profile not found" });

    await profile.update(req.body);
    await logActivity(req.user.id, "UPDATE_HEALTH_PROFILE");

    return res.json({
      status: "success",
      message: "Health profile updated",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profile = await UserHealthProfile.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!profile)
      return res.status(404).json({ message: "Health profile not found" });

    await profile.destroy();
    await logActivity(req.user.id, "DELETE_HEALTH_PROFILE");

    return res.json({ status: "success", message: "Health profile deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
