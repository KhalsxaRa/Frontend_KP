import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/index.js";
import { sendResetPasswordEmail } from "../utils/sendEmail.js";

const toPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, dan password wajib diisi",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      status: "success",
      message: "Register berhasil",
      data: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    return res.json({
      status: "success",
      message: "Login berhasil",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const me = async (req, res) => {
  return res.json({
    status: "success",
    data: toPublicUser(req.user),
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Email tidak ditemukan",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 60 * 60 * 1000;

    console.log("====================================");
    console.log("TOKEN :", token);
    console.log("EXPIRES :", expires);
    console.log("====================================");

    user.reset_password_token = token;
    user.reset_password_expires = expires;

    await user.save();

    const checkUser = await User.findByPk(user.id);

    console.log("DB EXPIRES :", checkUser.reset_password_expires);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return res.status(200).json({
      status: "success",
      message: "Link reset password berhasil dikirim ke email.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token dan password wajib diisi",
      });
    }

    const user = await User.findOne({
      where: {
        reset_password_token: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token reset password tidak valid",
      });
    }

    console.log("====================================");
    console.log("NOW :", new Date());
    console.log("EXPIRES :", user.reset_password_expires);
    console.log(
      "COMPARE :",
      new Date() > new Date(user.reset_password_expires),
    );
    console.log("====================================");

    if (
      !user.reset_password_expires ||
      Date.now() > Number(user.reset_password_expires)
    ) {
      return res.status(400).json({
        message: "Token reset password sudah kedaluwarsa",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
