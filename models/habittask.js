import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const HabitTask = sequelize.define("habit_tasks", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  habit_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  is_completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  underscored: true,
  timestamps: true,
  indexes: [{ unique: true, fields: ["habit_id", "date"] }]
});

export default HabitTask;
