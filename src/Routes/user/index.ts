import { Router } from "express";
import notificationRoute from "./notification.routes";
const router = Router();

router.use("/notification", notificationRoute);
export default router;
