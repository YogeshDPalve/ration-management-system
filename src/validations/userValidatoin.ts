import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Rating } from "../Constants/interfaces";

export const registerValidation = [
  body("rationId")
    .isString()
    .notEmpty()
    .withMessage("Ration ID is required")
    .isLength({ min: 6 })
    .withMessage("Ration ID must be at least 6 characters long"),

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
    .notEmpty()
    .withMessage("Fair Price Shop Number is required")
    .toInt()
    .isInt({ gt: 0 })
    .withMessage("Fair Price Shop Number must be positive"),

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

export const loginValidation = [
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        errors: errors.array(),
      });
    }

    next();
  },
];

export const addFamilyMemberValidation = [
  body("fullName").notEmpty().isString().withMessage("Full name is required"),
  body("relation")
    .notEmpty()
    .isString()
    .withMessage("Relation with user is required"),
  body("adharCard")
    .notEmpty()
    .isString()
    .withMessage("Adharcard Number is required"),
  body("gender").notEmpty().isString().withMessage("gender is required"),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .toInt()
    .withMessage("Please enter valid age"),

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

export const addOtpValidation = [
  body("mobileNo")
    .isString()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile number must be 10 digits"),

  body("otp")
    .isString()
    .notEmpty()
    .withMessage("OTP is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("OTP must be 6 digit"),

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

export const rationIdValidation = [
  body("rationId")
    .isString()
    .notEmpty()
    .withMessage("Ration Id is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("Ration Id must be 6 digit"),

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
export const addResetOtpValidation = [
  body("rationId")
    .isString()
    .notEmpty()
    .withMessage("Ration Id is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("Ration Id must be 6 digits"),

  body("otp")
    .isString()
    .notEmpty()
    .withMessage("OTP is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("OTP must be 6 digit"),

  body("password")
    .isString()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .isString()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
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
export const complaintValidation = [
  body("userName").notEmpty().withMessage("User's name is required"),

  body("rationId")
    .notEmpty()
    .withMessage("Ration Id is required")
    .isString()
    .matches(/^[0-9]{6}$/)
    .withMessage("Ration Id must be 6 digits"),

  body("shopNumber")
    .isNumeric()
    .notEmpty()
    .withMessage("Shop Number is required"),

  body("shopOwnerName")
    .isString()
    .notEmpty()
    .withMessage("Shop Owner Name is required"),
  body("shopAddress")
    .isString()
    .notEmpty()
    .withMessage("Shop address is required"),

  body("issueType").isString().notEmpty().withMessage("Issue type is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Please provide detailed description"),
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
export const FeedbackValidation = [
  body("rationId")
    .notEmpty()
    .withMessage("Ration Id is required")
    .isString()
    .matches(/^[0-9]{6}$/)
    .withMessage("Ration Id must be 6 digits"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isString()
    .isIn(Object.values(Rating))
    .withMessage(`Rating must be one of: ${Object.values(Rating).join(",  ")}`),
  body("shopNumber")
    .notEmpty()
    .withMessage("Shop Number is required")
    .isNumeric()
    .withMessage("Shop Number is must be number"),

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
