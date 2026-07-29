import { Favorite, Recipe, Blog } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";

export const addFavorite = async (req, res) => {
  try {
    const { recipe_id } = req.body;

    if (!recipe_id)
      return res.status(400).json({ message: "recipe_id is required" });

    const recipe = await Recipe.findByPk(recipe_id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const [favorite] = await Favorite.findOrCreate({
      where: { user_id: req.user.id, recipe_id },
      defaults: { user_id: req.user.id, recipe_id },
    });

    await logActivity(req.user.id, "ADD_FAVORITE_RECIPE");
    return res.status(201).json({ status: "success", data: favorite });
  } catch (error) {
    console.error("ADD FAVORITE ERROR:", error);

    return res.status(500).json({
      message: error.message,
      name: error.name,
      parent: error.parent?.detail,
    });
  }
};

export const addFavoriteBlog = async (req, res) => {
  try {
    const { blog_id } = req.body;

    if (!blog_id) {
      return res.status(400).json({ message: "blog_id is required" });
    }

    const blog = await Blog.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const [favorite] = await Favorite.findOrCreate({
      where: { user_id: req.user.id, blog_id },
      defaults: { user_id: req.user.id, blog_id },
    });

    await logActivity(req.user.id, "ADD_FAVORITE_BLOG");

    return res.status(201).json({ status: "success", data: favorite });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: [Recipe, Blog],
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: favorites });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFavoriteBlog = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });

    await favorite.destroy();
    await logActivity(req.user.id, "DELETE_FAVORITE_BLOG");

    return res.json({ status: "success", message: "Favorite deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!favorite)
      return res.status(404).json({ message: "Favorite not found" });

    await favorite.destroy();
    await logActivity(req.user.id, "DELETE_FAVORITE_RECIPE");

    return res.json({ status: "success", message: "Favorite deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
