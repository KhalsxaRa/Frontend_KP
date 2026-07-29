import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

export const seedDefaultAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || "Admin PROBIT";
  const email = process.env.ADMIN_EMAIL || "admin@probit.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const admin = await User.findOne({ where: { email } });
  if (admin) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
    role: "admin"
  });

  console.log(`Default admin created: ${email}`);
};
