import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PlanDetail = sequelize.define("plan_details", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  plan_id: { type: DataTypes.INTEGER, allowNull: false },
  day: { type: DataTypes.STRING, allowNull: false },
  activity_type: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  estimated_cost: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 }
}, {
  underscored: true,
  timestamps: true
});

export default PlanDetail;
