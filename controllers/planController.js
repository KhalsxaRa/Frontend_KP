import {
  sequelize,
  UserHealthProfile,
  GeneratedPlan,
  PlanDetail,
} from "../models/index.js";
import { buildPlanFromProfile } from "../services/generatePlanService.js";
import { logActivity } from "../utils/activityLog.js";

export const generatePlan = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { profile_id, plan_period } = req.body;

    if (!profile_id) {
      await transaction.rollback();
      return res.status(400).json({ message: "profile_id is required" });
    }

    const profile = await UserHealthProfile.findOne({
      where: { id: profile_id, user_id: req.user.id },
      transaction,
    });

    if (!profile) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Health profile not found or not yours" });
    }

    const generated = buildPlanFromProfile(profile);

    const plan = await GeneratedPlan.create(
      {
        user_id: req.user.id,
        profile_id: profile.id,
        plan_period: plan_period || "weekly",
        summary: generated.summary,
        daily_calories_target: generated.dailyCaloriesTarget,
      },
      { transaction },
    );

    const details = await PlanDetail.bulkCreate(
      generated.details.map((detail) => ({ ...detail, plan_id: plan.id })),
      { transaction },
    );

    await transaction.commit();
    await logActivity(req.user.id, "GENERATE_PLAN_FROM_HEALTH_PROFILE");

    return res.status(201).json({
      status: "success",
      message: "Generated plan created from user health profile",
      data: { ...plan.toJSON(), plan_details: details },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await GeneratedPlan.findAll({
      where: { user_id: req.user.id },
      include: [UserHealthProfile, PlanDetail],
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: plans });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await GeneratedPlan.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [UserHealthProfile, PlanDetail],
    });

    if (!plan)
      return res.status(404).json({ message: "Generated plan not found" });
    return res.json({ status: "success", data: plan });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await GeneratedPlan.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!plan)
      return res.status(404).json({ message: "Generated plan not found" });

    await plan.destroy();
    await logActivity(req.user.id, "DELETE_GENERATED_PLAN");

    return res.json({ status: "success", message: "Generated plan deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
