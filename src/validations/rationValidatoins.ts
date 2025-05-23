import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const rationAllotmentValidation = [
  body("allottedBy").notEmpty().withMessage("Admin email id is required"),

  body("rationId")
    .notEmpty()
    .isString()
    .withMessage("Ration ID is required")
    .isLength({ min: 6 })
    .withMessage("Ration ID must be at least 6 characters long"),

  body("wheatQuota")
    .notEmpty()
    .withMessage("Wheat Quota is required")
    .isInt({ gt: 0 })
    .toInt()
    .withMessage("Wheat Quota must be an integer greater than 0"),

  body("riceQuota")
    .notEmpty()
    .withMessage("Rice Quota is required")
    .isInt({ gt: 0 })
    .toInt()
    .withMessage("Rice Quota must be an integer greater than 0"),
  body("sugarQuota")
    .notEmpty()
    .withMessage("Sugar Quota is required")
    .isInt({ gt: 0 })
    .toInt()
    .withMessage("Sugar Quota must be an integer greater than 0"),
  body("daalQuota")
    .notEmpty()
    .withMessage("Daal Quota is required")
    .isInt({ gt: 0 })
    .toInt()
    .withMessage("Daal Quota must be an integer greater than 0"),
  body("oilQuota")
    .notEmpty()
    .withMessage("Oil Quota is required")
    .isInt({ gt: 0 })
    .toInt()
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
