import multer from "multer";
import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";
import {
  complaintValidation,
  FeedbackValidation,
} from "../validations/userValidatoin";
import { ValidationChain } from "express-validator";
import { feedback, postComplaint } from "../Controllers/complaint.controller";
import path from "path";

const route = Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Limit file size to 5MB
});

route.post(
  "/complaint",
  upload.array("proof", 5),
  complaintValidation as ValidationChain[],
  authUserMiddleware,
  authOtpMiddleare,
  postComplaint
);

route.post(
  "/feedback",
  FeedbackValidation as ValidationChain[],
  authUserMiddleware,
  authOtpMiddleare,
  feedback
);
export default route;
