import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";

import { addFamilyMember } from "../Controllers/family.controller";
import { addFamilyMemberValidation } from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";
const route = Router();

// add single family member
route.post(
  "/add-member",
  authUserMiddleware,
  authOtpMiddleare,
  addFamilyMemberValidation as ValidationChain[],
  addFamilyMember
);

export default route;
