import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";
import { allotRation, purchaseRation } from "../Controllers/ration.controller";
import { rationAllotmentValidation } from "../Middlewares/rationValidatoins";
import { ValidationChain } from "express-validator";
import { validateGrainPurchase } from "../Middlewares/validateGrainPurchase";
// import { purchaseRation } from "../Controllers/ration.controller";
const router = Router();

router.get("/get-ration-details", authUserMiddleware, authOtpMiddleare);
router.post("/purchase-ration", authUserMiddleware, authOtpMiddleare, validateGrainPurchase, purchaseRation);
router.post(
  "/ration-allocation",
  rationAllotmentValidation as ValidationChain[],
  allotRation
);

export default router;
