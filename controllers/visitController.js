import { Blog, Recipe } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";

export const logBlogVisit = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await logActivity(req.user.id, `VIEW_BLOG:${blog.title}`);
    return res.json({ status: "success", message: "Blog visit logged" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logRecipeVisit = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    await logActivity(req.user.id, `VIEW_RECIPE:${recipe.title}`);
    return res.json({ status: "success", message: "Recipe visit logged" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
