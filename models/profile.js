import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserHealthProfile = sequelize.define("user_health_profiles", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 13, max: 100 }},
  gender: { type: DataTypes.STRING, allowNull: true },
  weight: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 20, max: 300 }},
  height: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 80, max: 250 }},
  activity_level: { type: DataTypes.STRING, allowNull: false, defaultValue: "medium" },
  goal_type: { type: DataTypes.STRING, allowNull: false, defaultValue: "maintain" },
  budget_limit: { type: DataTypes.FLOAT, allowNull: true, validate: { min: 0, max: 100000000 } }
}, {
  underscored: true,
  timestamps: true
});


export default UserHealthProfile;
