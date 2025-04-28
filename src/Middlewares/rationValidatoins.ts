import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const rationAllotmentValidation = [
  body("rationId")
    .notEmpty()
    .isString()
    .withMessage("Ration ID is required")
    .isLength({ min: 6 })
    .withMessage("Ration ID must be at least 6 characters long"),

  // body("adminEmail")
  //   .isEmail()
  //   .notEmpty()
  //   .isString()
  //   .withMessage("Admin email is required"),

  body("wheatQuota")
    .notEmpty()
    .withMessage("Wheat Quota is required")
    .isInt({ gt: 0 })
    .withMessage("Wheat Quota must be an integer greater than 0"),

  body("riceQuota")
    .notEmpty()
    .withMessage("Rice Quota is required")
    .isInt({ gt: 0 })
    .withMessage("Rice Quota must be an integer greater than 0"),
  body("sugarQuota")
    .notEmpty()
    .withMessage("Sugar Quota is required")
    .isInt({ gt: 0 })
    .withMessage("Sugar Quota must be an integer greater than 0"),
  body("daalQuota")
    .notEmpty()
    .withMessage("Daal Quota is required")
    .isInt({ gt: 0 })
    .withMessage("Daal Quota must be an integer greater than 0"),
  body("oilQuota")
    .notEmpty()
    .withMessage("Oil Quota is required")
    .isInt({ gt: 0 })
    .withMessage("Oil Quota must be an integer greater than 0"),

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
