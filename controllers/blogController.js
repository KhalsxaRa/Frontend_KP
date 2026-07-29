import { Blog, User } from "../models/index.js";
import { logActivity } from "../utils/activityLog.js";
import { uploadToSupabase, deleteFromSupabase } from "../utils/uploadToSupabase.js";

export const createBlog = async (req, res) => {
  try {
    const { title, category, content, published_at } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "title and content are required",
      });
    }

    const imageUrl = await uploadToSupabase(req.file, "blogs");

    const blog = await Blog.create({
      admin_id: req.user.id,
      title,
      category,
      content,
      image_url: imageUrl,
      published_at: published_at || new Date(),
    });

    await logActivity(req.user.id, "ADMIN_CREATE_BLOG");
    return res.status(201).json({ status: "success", data: blog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: User, attributes: ["id", "username", "email", "role"] },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({ status: "success", data: blogs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "username", "email", "role"] },
      ],
    });

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.json({ status: "success", data: blog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const updateData = { ...req.body };

    if (req.file) {
      await deleteFromSupabase(blog.image_url);
      updateData.image_url = await uploadToSupabase(req.file, "blogs");
    }

    await blog.update(updateData);
    await logActivity(req.user.id, "ADMIN_UPDATE_BLOG");

    return res.json({
      status: "success",
      message: "Blog updated",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const title = blog.title;
    await deleteFromSupabase(blog.image_url);
    await blog.destroy();

    await logActivity(req.user.id, `Admin menghapus blog: ${title}`);

    return res.json({
      status: "success",
      message: "Blog berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};