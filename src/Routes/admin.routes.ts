import { Router } from "express";
import { adminLogin, adminRegister } from "../Controllers/admin.controller";
import { authAdminMiddleware } from "../Middlewares/authAdminMiddleware";
import {
  validateAdminLogin,
  validateAdminRegistration,
} from "../validations/adminValidationsMiddlware";
import { ValidationChain } from "express-validator";

const route = Router();

route.post(
  "/register",
  validateAdminRegistration as ValidationChain[],
  adminRegister
);
route.post("/login", validateAdminLogin as ValidationChain[], adminLogin);
route.post("/add", authAdminMiddleware);

export default route;
