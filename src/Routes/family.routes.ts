import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";

import { addFamilyMember } from "../Controllers/family.controller";
import { addFamilyMemberValidation } from "../Middlewares/userValidatoin";
const router = Router();

// add single family member
router.post(
  "/add-member",
  authUserMiddleware,
  authOtpMiddleare,
  addFamilyMemberValidation,
  addFamilyMember
);

export default router;
