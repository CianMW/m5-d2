import { body } from "express-validator"

export const postValidationMiddlewares = [
  body("firstName").exists().withMessage("First name is a mandatory field!"),
  body("lastName").exists().withMessage("Last name is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
]
