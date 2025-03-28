import { Router } from "express";
import {
  generateOtp,
  loginUser,
  registerUser,
  verifyOtp,
} from "../Controllers/user.controller";
import { registerValidation } from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";
import checkUnique from "../Middlewares/checkUniqueFields";
import authUserMiddleware from "../Middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  registerValidation as ValidationChain[],
  checkUnique,
  registerUser
);
router.post("/login", loginUser);
router.post("/generate-otp", authUserMiddleware, generateOtp);
router.post("/verify-otp", authUserMiddleware, verifyOtp);

export default router;
