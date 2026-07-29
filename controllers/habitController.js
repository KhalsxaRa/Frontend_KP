import { Habit, HabitTask } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";

export const createHabit = async (req, res) => {
  try {
    const { activity_name, target, plan_detail_id } = req.body;

    if (!activity_name) {
      return res.status(400).json({ message: "activity_name is required" });
    }

    const habit = await Habit.create({
      user_id: req.user.id,
      activity_name,
      target,
      plan_detail_id,
    });

    await logActivity(req.user.id, "CREATE_HABIT");
    return res.status(201).json({ status: "success", data: habit });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.findAll({
      where: { user_id: req.user.id },
      include: [HabitTask],
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: habits });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [HabitTask],
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });
    return res.json({ status: "success", data: habit });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    await habit.update(req.body);
    await logActivity(req.user.id, "UPDATE_HABIT");

    return res.json({
      status: "success",
      message: "Habit updated",
      data: habit,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    await habit.destroy();
    await logActivity(req.user.id, "DELETE_HABIT");

    return res.json({ status: "success", message: "Habit deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const date = req.body.date || new Date().toISOString().slice(0, 10);
    const is_completed = req.body.is_completed ?? true;

    const [task, created] = await HabitTask.findOrCreate({
      where: { habit_id: habit.id, date },
      defaults: { habit_id: habit.id, date, is_completed },
    });

    if (!created) await task.update({ is_completed });

    await logActivity(req.user.id, "CHECK_HABIT_TASK");
    return res.json({ status: "success", data: task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
