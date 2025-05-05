import { Request, Response } from "express";
import redis from "../../Utils/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllNotifications = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { rationId } = req.query;

    if (!rationId) {
      return res.status(404).send({
        success: false,
        message: "Ration id not found",
      });
    }
    const id: string = rationId as string;
    const RationNotifications = await redis.get(`${id}:RationNotifications`);

    if (RationNotifications) {
      return res.status(200).send({
        success: true,
        message: "Notifications get successfully",
        notification: JSON.parse(RationNotifications),
      });
    }

    const notification = await prisma.rationNotification.findMany({
      where: { rationId: id },
    });
    if (!notification) {
      return res.status(404).send({
        success: false,
        message: "notifications not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Notifications fetched successfully",
      notification,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to get notifications",
      error,
    });
  }
};
// mark as read (One)
export const updateSingleNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { notificationId, rationId } = req.body;

    const checkNotification = await prisma.rationNotification.findUnique({
      where: { id: notificationId },
    });

    if (!checkNotification) {
      return res.status(404).send({
        success: false,
        message: "notification not found",
      });
    }
    if (rationId !== checkNotification.rationId) {
      return res.status(404).send({
        success: false,
        message: "User not matched to update notification status",
      });
    }

    const markRead = await prisma.rationNotification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    // updating redis
    const redisKey = `${rationId}:RationNotifications`;
    try {
      const data: string = (await redis.get(redisKey)) as string;
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "No data found in redis",
        });
      }
      const notifications = JSON.parse(data);
      const updatedNotifications = notifications.map((notification: any) => {
        if (notification.id === notificationId) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
      await redis.set(redisKey, JSON.stringify(updatedNotifications));
      console.log("redis data updated");
    } catch (error) {
      console.log("unable to update redis", error);
    }
    return res.status(200).send({
      success: true,
      message: "notification marked as read",
      markRead,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to mark as read",
      error,
    });
  }
};
// mark as read (all)
export const updateAllNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { rationId } = req.body;

    const checkNotification =
      await prisma.rationNotification.updateManyAndReturn({
        where: { rationId },
        data: { isRead: true },
      });

    if (!checkNotification) {
      return res.status(404).send({
        success: false,
        message: "notification not found",
      });
    }

    // updating redis
    const redisKey = `${rationId}:RationNotifications`;
    try {
      const data: string = (await redis.get(redisKey)) as string;
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "No data found in redis",
        });
      }
      const notifications = JSON.parse(data);
      const updatedNotifications = notifications.map((notification: any) => ({
        ...notification,
        isRead: true,
      }));
      console.log("updatedNotifications", updatedNotifications);
      await redis.set(redisKey, JSON.stringify(updatedNotifications));
      console.log("redis data updated");
    } catch (error) {
      console.log("unable to update redis", error);
    }
    return res.status(200).send({
      success: true,
      message: "All notifications are marked as read",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to mark as read",
      error,
    });
  }
};
// delete single notification
export const deleteSingleNotification = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { notificationId, rationId } = req.body;

    // Check if notification exists in DB
    const checkNotification = await prisma.rationNotification.findUnique({
      where: { id: notificationId },
    });

    if (!checkNotification) {
      return res.status(404).send({
        success: false,
        message: "Notification not found",
      });
    }

    // Ensure the notification belongs to the correct user
    if (rationId !== checkNotification.rationId) {
      return res.status(403).send({
        success: false,
        message: "User not authorized to delete this notification",
      });
    }

    await prisma.rationNotification.delete({
      where: { id: notificationId },
    });

    //  Update Redis
    const redisKey: string = `${rationId}:RationNotifications`;
    const redisData: string = (await redis.get(redisKey)) as string;

    if (redisData) {
      const parsed = JSON.parse(redisData);
      const updated = parsed.filter((item: any) => item.id !== notificationId);
      await redis.set(redisKey, JSON.stringify(updated));
      console.log("redis updated");
    }

    return res.status(200).send({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete notification",
      error,
    });
  }
};
// mark as read (all)
export const deleteAllNotifications = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { rationId } = req.body;

    // Check if notification exists in DB
    const checkNotifications = await prisma.rationNotification.findMany({
      where: { rationId },
    });

    if (checkNotifications.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Notifications not found to delete",
      });
    }
    const checkNotification = await prisma.rationNotification.deleteMany({
      where: { rationId },
    });

    if (!checkNotification) {
      return res.status(404).send({
        success: false,
        message: "notification not found to delete",
      });
    }

    // updating redis
    const redisKey = await redis.set(`${rationId}:RationNotifications`, "");
    console.log("redis updated");

    return res.status(200).send({
      success: true,
      message: "All notifications are deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to mark as read",
      error,
    });
  }
};
