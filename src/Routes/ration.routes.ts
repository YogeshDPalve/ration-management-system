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
const route = Router();

route.get("/get-ration-details", authUserMiddleware, authOtpMiddleare);
route.post(
  "/purchase-ration",
  authUserMiddleware,
  authOtpMiddleare,
  validateGrainPurchase,
  purchaseRation
);
route.post(
  "/ration-allocation",
  rationAllotmentValidation as ValidationChain[],
  allotRation
);

export default route;
