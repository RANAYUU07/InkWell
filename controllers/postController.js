// this controller defines how a post will be created

import Post from "../models/Posts.js";
import User from "../models/User.js";

// creating a post

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user.id,
      coverImage
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
    next(error);
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

export const editPost = async (req, res, next) => {
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

    if (req.file) {
      post.coverImage = `/uploads/${req.file.filename}`;
    }


    await post.save();

    return res.status(200).json({
      message: "post updated successfully",
      post,
    });
  } catch (error) {
    next(error);
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

export const submitPost = async (req, res, next) => {
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
    next(error);
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

export const approvePost = async (req, res, next) => {
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
    next(error);
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

export const rejectPost = async (req, res, next) => {
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

    post.status = "rejected";

    await post.save();

    return res.status(200).json({
      message: "post rejected successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// getting all the published posts

/*
Fetch all posts where status is "published"
Send back the response
*/

export const getAllPosts = async (req, res, next) => {
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
    next(error);
  }
};

// getting a single post

export const getSinglePost = async (req, res, next) => {
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
    next(error);
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

export const deletePost = async (req, res, next) => {
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
    next(error);
  }
};

export const getPostsByCategory = async (req, res, next) => {
  try {
   
    const stats = await Post.aggregate([
      {$match: {status: "published"}}, // we are only categorising posts that are published
      {$group: {_id: "$category", totalPosts: {$sum: 1}} }, // we are grouping them on categories so a new id is created solely for categories by the mongdb, the totalPost number increases when it finds teh post with a category id accordingly
      {
        $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo"
      },
    }, // this is how you populate in aggregators since poplation work with find().
    {$unwind: "$categoryInfo"},
    {
      $project: {
        _id: 0,
        category: "$categoryInfo.name",
        totalPosts: 1
      } // this is what we are gonna show in the frontend
    }
    ])

    return res.status(200).json({
      message: "categories numbered",
      stats
    })

  } catch (error) {
    next(error);
  }
}

// Quick recap of the four status codes we've now used, to lock this in:

// 404 — resource doesn't exist
// 401 — we don't know who you are (no/invalid token)
// 403 — we know who you are, but you're not allowed to do this
// 400 — the request/action is invalid given the current state of the data
