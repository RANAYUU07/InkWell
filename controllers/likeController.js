import Like from "../models/Likes.js";
import Post from "../models/Posts.js";

export const toggleLike = async (req, res) => {
  try {
    
    const {id} = req.params

    const post = await Post.findById(id)

    if(!post){
      return res.status(404).json({message: "Post doesnt exist"})
    }
 
    const existingLike = await Like.findOne({user: req.user.id, post: id}) // do cheeze check karenge 
    // ek to user jisne post like karna h kya usne pahle se hi uss post ko ek baar like kardiya hai and the post itself 

    if(existingLike){
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({message: "Post unliked"})
    }
    else{
      const like = await Like.create({
        user: req.user.id,
        post: id
      })
      return res.status(201).json({ message: "Post liked", like });
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}