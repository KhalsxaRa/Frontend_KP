import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GeneratedPlan = sequelize.define("generated_plans", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  profile_id: { type: DataTypes.INTEGER, allowNull: false },
  plan_period: { type: DataTypes.STRING, allowNull: false, defaultValue: "weekly" },
  summary: { type: DataTypes.TEXT, allowNull: true },
  daily_calories_target: { type: DataTypes.INTEGER, allowNull: true }
}, {
  underscored: true,
  timestamps: true
});

export default GeneratedPlan;
