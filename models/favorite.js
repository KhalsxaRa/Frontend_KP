import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Favorite = sequelize.define("favorites", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  recipe_id: { type: DataTypes.INTEGER, allowNull: true },
  blog_id: { type: DataTypes.INTEGER, allowNull: true },
}, {
  underscored: true,
  timestamps: true,
});
export default Favorite;
