import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Habit = sequelize.define("habits", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_detail_id: { type: DataTypes.INTEGER, allowNull: true },
  activity_name: { type: DataTypes.STRING, allowNull: false },
  target: { type: DataTypes.STRING, allowNull: true }
}, {
  underscored: true,
  timestamps: true
});

export default Habit;
