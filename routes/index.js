import express from "express";

import {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import {
  generatePlan,
  getPlans,
  getPlanById,
  deletePlan,
} from "../controllers/planController.js";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  checkHabit,
} from "../controllers/habitController.js";
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} from "../controllers/reminderController.js";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import {
  addFavorite,
  addFavoriteBlog,
  getFavorites,
  deleteFavorite,
  deleteFavoriteBlog,
} from "../controllers/favoriteController.js";
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getActivityLogs,
  getMyActivityLogs,
  updateAdminProfile,
} from "../controllers/adminUserController.js";

import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";
import {
  logBlogVisit,
  logRecipeVisit,
} from "../controllers/visitController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { downloadActivityReport } from "../controllers/reportController.js";

const router = express.Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", loginLimiter, login);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.get("/auth/me", verifyToken, me);

// Public content
router.get("/recipes", getRecipes);
router.get("/recipes/:id", getRecipeById);
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlogById);

// User health profile
router.post(
  "/user/health-profiles",
  verifyToken,
  allowRoles("user", "admin"),
  createProfile,
);
router.get(
  "/user/health-profiles",
  verifyToken,
  allowRoles("user", "admin"),
  getProfiles,
);
router.get(
  "/user/health-profiles/:id",
  verifyToken,
  allowRoles("user", "admin"),
  getProfileById,
);
router.put(
  "/user/health-profiles/:id",
  verifyToken,
  allowRoles("user", "admin"),
  updateProfile,
);
router.delete(
  "/user/health-profiles/:id",
  verifyToken,
  allowRoles("user", "admin"),
  deleteProfile,
);

// Generated plan from health profile
router.post(
  "/user/generated-plans",
  verifyToken,
  allowRoles("user", "admin"),
  generatePlan,
);
router.get(
  "/user/generated-plans",
  verifyToken,
  allowRoles("user", "admin"),
  getPlans,
);
router.get(
  "/user/generated-plans/:id",
  verifyToken,
  allowRoles("user", "admin"),
  getPlanById,
);
router.delete(
  "/user/generated-plans/:id",
  verifyToken,
  allowRoles("user", "admin"),
  deletePlan,
);

// Habits
router.post(
  "/user/habits",
  verifyToken,
  allowRoles("user", "admin"),
  createHabit,
);
router.get("/user/habits", verifyToken, allowRoles("user", "admin"), getHabits);
router.get(
  "/user/habits/:id",
  verifyToken,
  allowRoles("user", "admin"),
  getHabitById,
);
router.put(
  "/user/habits/:id",
  verifyToken,
  allowRoles("user", "admin"),
  updateHabit,
);
router.delete(
  "/user/habits/:id",
  verifyToken,
  allowRoles("user", "admin"),
  deleteHabit,
);
router.post(
  "/user/habits/:id/check",
  verifyToken,
  allowRoles("user", "admin"),
  checkHabit,
);

// Reminders
router.post(
  "/user/reminders",
  verifyToken,
  allowRoles("user", "admin"),
  createReminder,
);
router.get(
  "/user/reminders",
  verifyToken,
  allowRoles("user", "admin"),
  getReminders,
);
router.put(
  "/user/reminders/:id",
  verifyToken,
  allowRoles("user", "admin"),
  updateReminder,
);
router.delete(
  "/user/reminders/:id",
  verifyToken,
  allowRoles("user", "admin"),
  deleteReminder,
);

// Favorites
router.post(
  "/user/favorites",
  verifyToken,
  allowRoles("user", "admin"),
  addFavorite,
);
router.get(
  "/user/favorites",
  verifyToken,
  allowRoles("user", "admin"),
  getFavorites,
);
router.delete(
  "/user/favorites/:id",
  verifyToken,
  allowRoles("user", "admin"),
  deleteFavorite,
);

router.post(
  "/user/favorites/blogs",
  verifyToken,
  allowRoles("user", "admin"),
  addFavoriteBlog,
);

router.delete(
  "/user/favorites/blogs/:id",
  verifyToken,
  allowRoles("user", "admin"),
  deleteFavoriteBlog,
);

// Admin content management

router.post(
  "/user/articles/:id/visit",
  verifyToken,
  allowRoles("user", "admin"),
  logBlogVisit,
);

router.post(
  "/user/recipes/:id/visit",
  verifyToken,
  allowRoles("user", "admin"),
  logRecipeVisit,
);

router.get(
  "/user/activity-logs",
  verifyToken,
  allowRoles("user", "admin"),
  getMyActivityLogs,
);

// Admin only\
router.get("/admin/users", verifyToken, allowRoles("admin"), getUsers);
router.put(
  "/admin/users/:id/role",
  verifyToken,
  allowRoles("admin"),
  updateUserRole,
);
router.delete("/admin/users/:id", verifyToken, allowRoles("admin"), deleteUser);
router.get(
  "/admin/activity-logs",
  verifyToken,
  allowRoles("admin"),
  getActivityLogs,
);

router.put(
  "/admin/profile",
  verifyToken,
  allowRoles("admin"),
  upload.single("image"),
  updateAdminProfile,
);

router.post(
  "/admin/recipes",
  verifyToken,
  allowRoles("admin"),
  upload.single("image"),
  createRecipe,
);
router.put(
  "/admin/recipes/:id",
  verifyToken,
  allowRoles("admin"),
  upload.single("image"),
  updateRecipe,
);
router.delete(
  "/admin/recipes/:id",
  verifyToken,
  allowRoles("admin"),
  deleteRecipe,
);

router.post(
  "/admin/blogs",
  verifyToken,
  allowRoles("admin"),
  upload.single("image"),
  createBlog,
);
router.get("/admin/blogs", verifyToken, allowRoles("admin"), getBlogs);
router.put(
  "/admin/blogs/:id",
  verifyToken,
  allowRoles("admin"),
  upload.single("image"),
  updateBlog,
);
router.delete("/admin/blogs/:id", verifyToken, allowRoles("admin"), deleteBlog);
router.get(
  "/admin/reports/download",
  verifyToken,
  allowRoles("admin"),
  downloadActivityReport,
);
export default router;
