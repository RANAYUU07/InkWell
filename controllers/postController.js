// this controller defines how a post will be created

import Post from "../models/Posts.js";
import User from "../models/User.js";

// creating a post

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

// editing a post

/*

Find the post by that id
Check: does this post even exist?
Check: is the logged-in user (req.user.id) actually the author of this post?
Check: is the post still in draft status?
If all checks pass → update the post with new data from req.body
Send back the response

*/

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Coudnt find the post" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "User is not authorized" });
    }
    // post.author is a mongoDb object even tho it seems like a string and req.user.id is a string. U cant compare an object to a string without turning it into a string itself

    if (post.status !== "draft") {
      return res
        .status(400)
        .json({ message: "Post that are not a draft cant be edited" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    await post.save();

    return res.status(200).json({
      message: "post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// submitting a post

/*

Find the post by id
Check it exists
Check the logged-in user is the author (same ownership check as before)
Check the post is currently in draft (can't submit something that's already pending/published/rejected)
Change status to pending
Save and respond

*/

export const submitPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post does not exists" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    if (post.status !== "draft") {
      return res.status(400).json({ message: "Post is already in review" });
    }

    post.status = "pending";

    await post.save();

    return res.status(200).json({
      message: "Post has been submitted for review",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// approving a post

/* 

Find the post by id
Check it exists
Find the logged-in user's full details (via User.findById, since the token only has their ID)
Check the user's role is "editor"
Check the post is currently in pending (can't approve a draft, or something already published/rejected)
Change status to published
Save and respond

*/

export const approvePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post does not exist" });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== "editor") {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (post.status !== "pending") {
      return res.status(400).json({ message: "no such post found for review" });
    }

    post.status = "published";

    await post.save();

    return res.status(200).json({
      message: "post is publishes successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// rejecting a post

/* 

Find the post by id
Check it exists
Find the logged-in user's full details (via User.findById, since the token only has their ID)
Check the user's role is "editor"
Check the post is currently in pending (can't approve a draft, or something already published/rejected)
Change status to published
Save and respond

*/

export const rejectPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post does not exist" });
    }

    const user = await User.findbyId(req.user.id);
    if (user.role !== "editor") {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (post.status !== "pending") {
      return res.status(400).json({ message: "no such post found for review" });
    }

    post.status = "rejected";

    await post.save();

    return res.status(200).json({
      message: "post is publishes successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getting all the published posts

/*
Fetch all posts where status is "published"
Send back the response
*/

export const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find({ status: "published" }).populate(
      "author",
      "name email",
    );

    return res.status(200).json({
      message: "posts fetched successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getting a single post

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.status !== "published") {
      return res.status(403).json({ message: "This post is not published" });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a post

/*

Find the post by id, check it exists
Find the logged-in user's full details (need their role)
Check permission — this is the new part. The user is allowed to delete if:
They're the post's author AND the post is draft, OR
They're an editor AND the post is published
Otherwise → reject
If allowed, delete the post
Send response

*/

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.user.id);

    const isAuthorDeletingDraft =
      post.author.toString() === req.user.id && post.status === "draft";

    const isEditorDeletingPublished =
      user.role === "editor" && post.status === "published";

    if (!isAuthorDeletingDraft && !isEditorDeletingPublished) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Quick recap of the four status codes we've now used, to lock this in:

// 404 — resource doesn't exist
// 401 — we don't know who you are (no/invalid token)
// 403 — we know who you are, but you're not allowed to do this
// 400 — the request/action is invalid given the current state of the data
