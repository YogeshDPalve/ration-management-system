import { Router } from "express";
import { getAllNotifications } from "../../Controllers/user/user.controller";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../../Middlewares/authMiddleware";

const route = Router();

route.get(
  "/notification",
  authOtpMiddleare,
  authUserMiddleware,
  getAllNotifications
);

export default route;
