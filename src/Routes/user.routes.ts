import { Router } from "express";
import {
  generateOtp,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  verifyOtp,
} from "../Controllers/user.controller";
import {
  loginValidation,
  registerValidation,
} from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";
import checkUnique from "../Middlewares/checkUniqueFields";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";

const router = Router();

router.post(
  "/register",
  registerValidation as ValidationChain[],
  checkUnique,
  registerUser
);
router.post("/login", loginValidation as ValidationChain[], loginUser);
router.post("/generate-otp", authUserMiddleware, generateOtp);
router.post("/verify-otp", authUserMiddleware, verifyOtp);
router.post("/logout", authUserMiddleware, authOtpMiddleare, logoutUser);
router.get("/get-user-info", authUserMiddleware, authOtpMiddleare, getUserInfo);

export default router;
