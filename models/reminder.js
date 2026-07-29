import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Reminder = sequelize.define("reminders", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  habit_id: { type: DataTypes.INTEGER, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: false },
  reminder_time: { type: DataTypes.TIME, allowNull: true },
  frequency: { type: DataTypes.STRING, allowNull: true, defaultValue: "daily" }
}, {
  underscored: true,
  timestamps: true
});

export default Reminder;
