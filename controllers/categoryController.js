/*
  
  Quick Plan:
   - Create category -> editor only , requires name from the req.body
   - Lists all the categories -> public, anyone can see the categories (we can use that for dropdown)

*/


import Category from "../models/Category.js";
import User from "../models/User.js";

export const createCategory = async (req, res, next) => {
  try {

    const {name} = req.body

    const user = await User.findById(req.user.id)

    if(user.role !== "editor"){
      return res.status(403).json({message: "You dont have the permission to change the catogory"})
    }

    const category = await Category.create({
      name
    })

    return res.status(201).json({
      message: "New Category created successfully",
      category
    })
    
  } catch (error) {
    next(error);
  }
} 

export const listAllCategory = async (req, res, next) => {
  try {

    const allCategory = await Category.find({})

    return res.status(200).json({
      message: "Fetched all the categories successfully",
      allCategory
    })

  } catch (error) {
    next(error);
  }
}