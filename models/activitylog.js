import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ActivityLog = sequelize.define("activity_logs", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  action_description: { type: DataTypes.TEXT, allowNull: false }
}, {
  underscored: true,
  timestamps: true,
  updatedAt: false
});

export default ActivityLog;
