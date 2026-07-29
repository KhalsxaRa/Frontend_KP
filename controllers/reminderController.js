import { Reminder, Habit } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";

export const createReminder = async (req, res) => {
  try {
    const { habit_id, title, reminder_time, frequency } = req.body;

    if (!title) return res.status(400).json({ message: "title is required" });

    if (habit_id) {
      const habit = await Habit.findOne({
        where: { id: habit_id, user_id: req.user.id },
      });
      if (!habit)
        return res
          .status(404)
          .json({ message: "Habit not found or not yours" });
    }

    const reminder = await Reminder.create({
      user_id: req.user.id,
      habit_id,
      title,
      reminder_time,
      frequency: frequency || "daily",
    });

    await logActivity(req.user.id, "CREATE_REMINDER");
    return res.status(201).json({ status: "success", data: reminder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { user_id: req.user.id },
      include: [Habit],
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: reminders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });

    await reminder.update(req.body);
    await logActivity(req.user.id, "UPDATE_REMINDER");

    return res.json({
      status: "success",
      message: "Reminder updated",
      data: reminder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });

    await reminder.destroy();
    await logActivity(req.user.id, "DELETE_REMINDER");

    return res.json({ status: "success", message: "Reminder deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
