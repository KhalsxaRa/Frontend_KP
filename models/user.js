import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Token untuk reset password
    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Waktu kedaluwarsa token reset password
    reset_password_expires: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    underscored: true,
    timestamps: true,
  },
);

export default User;
