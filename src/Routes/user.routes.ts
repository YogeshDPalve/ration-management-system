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
} from "../validations/userValidatoin";
import { ValidationChain } from "express-validator";
import checkUnique from "../Middlewares/checkUniqueFields";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";

const route = Router();

route.post(
  "/register",
  registerValidation as ValidationChain[],
  checkUnique,
  registerUser
);
route.post("/login", loginValidation as ValidationChain[], loginUser);
route.post(
  "/generate-login-otp",
  rationIdValidation as ValidationChain[],
  authUserMiddleware,
  generateOtp
);
route.post(
  "/generate-reset-otp",
  rationIdValidation as ValidationChain[],
  generateOtp
);
route.post(
  "/verify-otp",
  addOtpValidation as ValidationChain[],
  authUserMiddleware,
  verifyOtp
);
route.get("/logout", authUserMiddleware, authOtpMiddleare, logoutUser);
route.put(
  "/reset-password",
  addResetOtpValidation as ValidationChain[],
  verifyResetOtp
);
route.get(
  "/get-user-info/:rationId",
 
  getUserInfo
);

export default route;
