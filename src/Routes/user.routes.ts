import { Router } from "express";
import {
  generateOtp,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  verifyOtp,
  verifyResetOtp,
} from "../Controllers/user.controller";
import {
  addOtpValidation,
  addResetOtpValidation,
  loginValidation,
  rationIdValidation,
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
router.post(
  "/generate-login-otp",
  rationIdValidation as ValidationChain[],
  authUserMiddleware,
  generateOtp
);
router.post(
  "/generate-reset-otp",
  rationIdValidation as ValidationChain[],
  generateOtp
);
router.post(
  "/verify-otp",
  addOtpValidation as ValidationChain[],
  authUserMiddleware,
  verifyOtp
);
router.post("/logout", authUserMiddleware, authOtpMiddleare, logoutUser);
router.put(
  "/reset-password",
  addResetOtpValidation as ValidationChain[],
  verifyResetOtp
);
router.get("/get-user-info", authUserMiddleware, authOtpMiddleare, getUserInfo);

export default router;
