import { Router } from "express";
import { fpsLogin, fpsRegister } from "../Controllers/fps.controller";
import { authFPSMiddleware } from "../Middlewares/authAdminMiddleware";
import {
  validateFPSLogin,
  validateFPSRegistration,
} from "../validations/adminValidationsMiddlware";
import { ValidationChain } from "express-validator";

const route = Router();

// fair price shop register route
route.post(
  "/register",
  validateFPSRegistration as ValidationChain[],
  fpsRegister
);
// fair price shop login route
route.post("/login", validateFPSLogin as ValidationChain[], fpsLogin);
route.post("/add", authFPSMiddleware); // fair price shop register route

export default route;
