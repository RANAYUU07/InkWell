import { body, validationResult } from "express-validator";

// the checker: runs after the rules and decides whether to continue
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginValidator = [
  body("email").trim().notEmpty().withMessage("A valid email is required"),
  body("password").notEmpty(), // we are not gonna check the length of the password in teh login side cuz what if someone is trying to guess the password. the check will give him the min length of someone's password
];

export const postValidator = [
  body("content").notEmpty().trim().withMessage("content is required"),
  body("title").trim().isLength({ min: 3, max: 150 }).withMessage("Title must be of 3 to 150 characters"),
];
