import mongoose from "mongoose";

/*

this post schema will have following fields in it:-

  - title
  -content
  -status - draft, pending, published, rejected
  -author
  -Category - which category it belongs too, the post that is

*/

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // this tells mongoose that this feild holds a mongoDb id in it
      ref: "User", // this tells mongoose that user is the collection that the id above is belongs to
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
export default Post;
