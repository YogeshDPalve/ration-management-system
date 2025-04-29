import { Router } from "express";
import { fpsLogin, fpsRegister } from "../Controllers/fps.controller";
import { authFPSMiddleware } from "../Middlewares/authAdminMiddleware";

const route = Router();

route.post("/login", fpsLogin); // fair price shop login route
route.post("/register", fpsRegister); // fair price shop register route
route.post("/add", authFPSMiddleware); // fair price shop register route

export default route;
