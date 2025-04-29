import { Router } from "express";
import { adminLogin, adminRegister } from "../Controllers/admin.controller";

const route = Router();

route.post("/register", adminRegister);
route.post("/login", adminLogin);

export default route;
