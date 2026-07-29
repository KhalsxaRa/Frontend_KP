import sequelize from "../config/database.js";

import User from "./user.js";
import UserHealthProfile from "./profile.js";
import GeneratedPlan from "./plan.js";
import PlanDetail from "./plandetail.js";
import Habit from "./habit.js";
import HabitTask from "./habittask.js";
import Recipe from "./recipe.js";
import Blog from "./blog.js";
import Favorite from "./favorite.js";
import Reminder from "./reminder.js";
import ActivityLog from "./activitylog.js";

User.hasMany(UserHealthProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
UserHealthProfile.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(GeneratedPlan, { foreignKey: "user_id", onDelete: "CASCADE" });
GeneratedPlan.belongsTo(User, { foreignKey: "user_id" });

UserHealthProfile.hasMany(GeneratedPlan, { foreignKey: "profile_id", onDelete: "CASCADE" });
GeneratedPlan.belongsTo(UserHealthProfile, { foreignKey: "profile_id" });

GeneratedPlan.hasMany(PlanDetail, { foreignKey: "plan_id", onDelete: "CASCADE" });
PlanDetail.belongsTo(GeneratedPlan, { foreignKey: "plan_id" });

User.hasMany(Habit, { foreignKey: "user_id", onDelete: "CASCADE" });
Habit.belongsTo(User, { foreignKey: "user_id" });

PlanDetail.hasMany(Habit, { foreignKey: "plan_detail_id", onDelete: "SET NULL" });
Habit.belongsTo(PlanDetail, { foreignKey: "plan_detail_id" });

Habit.hasMany(HabitTask, { foreignKey: "habit_id", onDelete: "CASCADE" });
HabitTask.belongsTo(Habit, { foreignKey: "habit_id" });

User.hasMany(Recipe, { foreignKey: "admin_id", onDelete: "CASCADE" });
Recipe.belongsTo(User, { foreignKey: "admin_id" });

User.hasMany(Blog, { foreignKey: "admin_id", onDelete: "CASCADE" });
Blog.belongsTo(User, { foreignKey: "admin_id" });

User.belongsToMany(Recipe, { through: Favorite, foreignKey: "user_id" });
Recipe.belongsToMany(User, { through: Favorite, foreignKey: "recipe_id" });
Favorite.belongsTo(Recipe, { foreignKey: "recipe_id" });
User.belongsToMany(Blog, { through: Favorite, foreignKey: "user_id" });
Blog.belongsToMany(User, { through: Favorite, foreignKey: "blog_id" });
Favorite.belongsTo(Blog, { foreignKey: "blog_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });


User.hasMany(Reminder, { foreignKey: "user_id", onDelete: "CASCADE" });
Reminder.belongsTo(User, { foreignKey: "user_id" });

Habit.hasMany(Reminder, { foreignKey: "habit_id", onDelete: "SET NULL" });
Reminder.belongsTo(Habit, { foreignKey: "habit_id" });

User.hasMany(ActivityLog, { foreignKey: "user_id", onDelete: "CASCADE" });
ActivityLog.belongsTo(User, { foreignKey: "user_id" });

export {
  sequelize,
  User,
  UserHealthProfile,
  GeneratedPlan,
  PlanDetail,
  Habit,
  HabitTask,
  Recipe,
  Blog,
  Favorite,
  Reminder,
  ActivityLog
};
