import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";
import { allotRation } from "../Controllers/ration.controller";
import { rationAllotmentValidation } from "../Middlewares/rationValidatoins";
import { ValidationChain } from "express-validator";
// import { purchaseRation } from "../Controllers/ration.controller";
const router = Router();

router.get("/get-ration-details", authUserMiddleware, authOtpMiddleare);
router.post("/purchase-ration", authUserMiddleware, authOtpMiddleare);
router.post(
  "/ration-allocation",
  rationAllotmentValidation as ValidationChain[],
  allotRation
);

export default router;
