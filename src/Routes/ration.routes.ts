import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";
import { getRationDetails } from "../Controllers/ration.controller";
const router = Router();

router.get(
  "/get-ration-details",
  authUserMiddleware,
  authOtpMiddleare,
  getRationDetails
);
router.post(
  "/purchase-ration",
  authUserMiddleware,
  authOtpMiddleare,
  getRationDetails
);

export default router;
