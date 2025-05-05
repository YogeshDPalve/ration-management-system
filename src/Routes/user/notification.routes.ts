import { Router } from "express";
import {
  deleteAllNotifications,
  deleteSingleNotification,
  getAllNotifications,
  updateAllNotification,
  updateSingleNotification,
} from "../../Controllers/user/notifications.controller";
import {
  authOtpMiddleare,
  authUserMiddleware,
} from "../../Middlewares/authMiddleware";

const route = Router();

route.get(
  "/get-notification",
  authOtpMiddleare,
  authUserMiddleware,
  getAllNotifications
);

route.post(
  "/mark-one-read",
  authOtpMiddleare,
  authUserMiddleware,
  updateSingleNotification
);
route.post(
  "/mark-all-read",
  authOtpMiddleare,
  authUserMiddleware,
  updateAllNotification
);
route.delete(
  "/delete-one",
  authOtpMiddleare,
  authUserMiddleware,
  deleteSingleNotification
);

route.delete(
  "/delete-all",
  authOtpMiddleare,
  authUserMiddleware,
  deleteAllNotifications
);
export default route;
