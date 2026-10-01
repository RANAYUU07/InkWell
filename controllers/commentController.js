import Comment from "../models/Comments.js";
import Post from "../models/Posts.js";

export const createComment = async (req, res) => {
  try {
    const { id } = req.params; // post id
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.status !== "published") {
      return res
        .status(400)
        .json({ message: "Can't comment on an unpublished post" });
    }

    const comment = await Comment.create({
      content,
      post: id,
      author: req.user.id,
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ post: id }).populate(
      "author",
      "name email",
    );

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
