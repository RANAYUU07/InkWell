// this controller defines how a post will be created 

import Post from "../models/Posts.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post: {
        id: post._id,
        status: post.status,
        author: post.author,
        title: post.title,
        content: post.content,
        category: post.category,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
