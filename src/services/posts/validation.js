import { body } from "express-validator"

export const postValidationMiddlewares = [
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("cover").exists().withMessage("Cover is a mandatory field!"),
  body("content").exists().withMessage("Content is a mandatory field!"),
  body("readTime").exists().withMessage("Category is a mandatory field!"),
  body("readTime.value").exists().withMessage("Value is a mandatory field!"),
  body("readTime.unit").exists().withMessage("Unit is a mandatory field!"),
  body("author").exists().withMessage("author is a mandatory field!"),
  body("author.name").exists().withMessage("Author's name is a mandatory field!"),
]
