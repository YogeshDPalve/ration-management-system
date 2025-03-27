import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const registerValidation = [
  body("rationId")
    .isString()
    .notEmpty()
    .withMessage("Ration ID is required")
    .isLength({ min: 5 })
    .withMessage("Ration ID must be at least 5 characters long"),

  body("adharcardNumber")
    .isString()
    .notEmpty()
    .withMessage("Aadhar Card Number is required")
    .isLength({ min: 12, max: 12 })
    .withMessage("Aadhar Card Number must be exactly 12 digits"),

  body("firstName").isString().notEmpty().withMessage("First name is required"),

  body("middleName")
    .optional()
    .isString()
    .withMessage("Middle name must be a string"),

  body("lastName").isString().notEmpty().withMessage("Last name is required"),

  body("mobileNo")
    .isString()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile number must be 10 digits"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("address").isString().notEmpty().withMessage("Address is required"),

  body("password")
    .optional()
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("fairPriceShopNumber")
    .isInt()
    .notEmpty()
    .withMessage("Fair Price Shop Number is required"),

  // Middleware to check validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array(),
      });
    }
 
    next();
  },
];

const loginValidation = [
  body("rationId")
    .isString()
    .notEmpty()
    .withMessage("Ration ID is required")
    .isLength({ min: 5 })
    .withMessage("Ration ID must be at least 5 characters long"),
  body("password")
    .optional()
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  
  (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({

      })
    }
  }
];
