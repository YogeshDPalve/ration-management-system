import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/user.controller";
import { registerValidation } from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";
import checkUnique from "../Middlewares/checkUniqueFields";

const router = Router();

router.post(
  "/register",
  registerValidation as ValidationChain[],
  checkUnique,
  registerUser
);
router.post("/login", loginUser);

export default router;
