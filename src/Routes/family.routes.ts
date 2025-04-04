import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";

import { addFamilyMember } from "../Controllers/family.controller";
import { addFamilyMemberValidation } from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";
const router = Router();

// add single family member
router.post(
  "/add-member",
  authUserMiddleware,
  authOtpMiddleare,
  addFamilyMemberValidation as ValidationChain[],
  addFamilyMember
);

export default router;
