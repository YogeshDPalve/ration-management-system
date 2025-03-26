import { Router } from "express";
import { loginUser, registerUser } from "../Controllers/user.controller";
import { registerValidation } from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";

const router = Router();

router.post("/register", registerValidation as ValidationChain[], registerUser);
router.post("/login", loginUser);

export default router;
