import mongoose from 'mongoose';

/*

So my userSchema will have 4 fields in it---
  - name
  - password
  - email
  - role - reader, author, editor
*/



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["reader", "author", "editor"], // the role field can only ever be one of these, nothing else
      default: "reader",
    },
  },
  {timestamps: true} // ok this is a neat mongoose feature which automaticallly adds createdAt and updatedAt fields to the schema automatically, adn its free of cost. nice!
)

const User = mongoose.model( "User" ,userSchema)
export default User;