import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateAdminRegistration = [
  body("name").notEmpty().withMessage("Admin Name Required").isString(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be string"),
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .isString()
    .matches(/^[0-9]{10}$/)
    .withMessage("Enter valid contact number"),

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
export const validateAdminLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be string"),

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
export const validateFPSRegistration = [
  body("ownerName").notEmpty().withMessage("Owner Name Required").isString(),
  body("location")
    .notEmpty()
    .withMessage("Location of shop is Required")
    .isString(),
  body("shopNumber")
    .notEmpty()
    .withMessage("Owner Name Required")
    .isInt({ gt: 0 })
    .withMessage("Fair Price Shop number must be positive number"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be string"),
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .isString()
    .matches(/^[0-9]{10}$/)
    .withMessage("Enter valid contact number"),

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
export const validateFPSLogin = [
  body("shopNumber")
    .notEmpty()
    .withMessage("Owner Name Required")
    .isInt({ gt: 0 })
    .withMessage("Fair Price Shop number must be positive number"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("Password must be string"),

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
