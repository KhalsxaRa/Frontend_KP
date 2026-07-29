import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Blog = sequelize.define(
  "blogs",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    admin_id: { type: DataTypes.INTEGER, allowNull: false },

    title: { type: DataTypes.STRING, allowNull: false },

    category: {
      type: DataTypes.STRING,
      allowNull: true, // Bisa dikosongkan atau beri defaultValue: "General"
    },

    content: { type: DataTypes.TEXT, allowNull: false },

    // Mengganti 'image' jadi 'image_url' untuk konsistensi
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    underscored: true,
    timestamps: true,
  },
);

export default Blog;
