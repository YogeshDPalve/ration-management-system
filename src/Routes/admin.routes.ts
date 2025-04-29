import { Router } from "express";
import { adminLogin, adminRegister } from "../Controllers/admin.controller";
import { authAdminMiddleware } from "../Middlewares/authAdminMiddleware";

const route = Router();

route.post("/register", adminRegister);
route.post("/login", adminLogin);
route.post("/add", authAdminMiddleware);

export default route;
