import { Router } from "express";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../Middlewares/authMiddleware";
import { allotRation, purchaseRation } from "../Controllers/ration.controller";
import { rationAllotmentValidation } from "../validations/rationValidatoins";
import { ValidationChain } from "express-validator";
import { validateGrainPurchase } from "../Middlewares/validateGrainPurchase";
import {
  authAdminMiddleware,
  authFPSMiddleware,
} from "../Middlewares/authAdminMiddleware";
// import { purchaseRation } from "../Controllers/ration.controller";
const route = Router(); 

route.get("/get-ration-details", authUserMiddleware, authOtpMiddleare);
route.post(
  "/purchase-ration",
  authFPSMiddleware,
  validateGrainPurchase,
  purchaseRation
);
route.post(
  "/ration-allocation",
  authAdminMiddleware,
  rationAllotmentValidation as ValidationChain[],
  allotRation
);

export default route;
