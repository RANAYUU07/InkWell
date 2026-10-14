import mongoose from "mongoose";
import Like from "../models/Likes.js";
import Post from "../models/Posts.js";

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post doesnt exist" });
    }

    const existingLike = await Like.findOne({ user: req.user.id, post: id }); // do cheeze check karenge
    // ek to user jisne post like karna h kya usne pahle se hi uss post ko ek baar like kardiya hai and the post itself

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ message: "Post unliked" });
    } else {
      const like = await Like.create({
        user: req.user.id,
        post: id,
      });
      return res.status(201).json({ message: "Post liked", like });
    }
  } catch (error) {
    next(error);
  }
};

export const getNumberOfLikesForPost = async (req, res) => {
  try {
    const { id } = req.params;

    const likeCount = await Like.aggregate([
      { $match: { post: new mongoose.Types.ObjectId(id) } },
      { $count: "totalLikes" }, // always gives an array as a result
    ]);

    // aggregates always have objects in them
    // and match always takes an object in it

    const totalLikesCount = likeCount[0]?.totalLikes || 0; // this line uses an optional chaining mechanism basically if the value of the array is nothing likek its an empty array then the usual code will silenty fail and give out an error but this way we say it that if the array is empty then give me "undefined" as an answer but dont throw an error and if the whole thing (before "||") is undefined give out 0 as an answer.

    return res.status(200).json({
      message: "Likes count fetched successfully",
      totalLikesCount,
    });
  } catch (error) {
    next(error);
  }
};
