import multer from "multer";
import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";
import { complaintValidation } from "../Middlewares/userValidatoin";
import { ValidationChain } from "express-validator";
import { postComplaint } from "../Controllers/complaint.controller";

const router = Router();

router.post(
  "/complaint",
  complaintValidation as ValidationChain[],
  authUserMiddleware,
  authOtpMiddleare,
  postComplaint
);
