import { Router } from "express";
import authUserMiddleware from "../Middlewares/authMiddleware";
import verifiedOtp from "../Middlewares/verifiedOtpMiddleware";
import { addFamilyMember } from "../Controllers/family.controller";
import { addFamilyMemberValidation } from "../Middlewares/userValidatoin";
const router = Router();

// add single family member
router.post(
  "/add-member",
  authUserMiddleware,
  verifiedOtp,
  addFamilyMemberValidation,
  addFamilyMember
);

export default router;
