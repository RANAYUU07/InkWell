import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken"

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }); // findOne expects an object to be passed into it

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    // checkign if the user with the email exists or not

    const hashedPassword = await bcrypt.hash(password, 10); // the hash method expects the plain password and the number of computational rounds of hash that should happen

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    }); // in the schema we have a password field

    return res.status(201).json({
      message: "User creater successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "User with this email doesnt exists" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "The password provided is incorrect" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // the jwt format is (payload, secret, options) the payload and options both expect an object

    return res.status(200).json({
      message: "Login soccessful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
