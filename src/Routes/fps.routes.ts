import { Router } from "express";
import { fpsLogin, fpsRegister } from "../Controllers/fps.controller";

const route = Router();

route.post("/login", fpsLogin); // fair price shop login route
route.post("/register", fpsRegister); // fair price shop register route

export default route;
