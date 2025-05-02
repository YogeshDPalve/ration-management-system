import { json, Request, Response } from "express";
import redis from "../../Utils/redis";
import { RationId } from "../../Constants/types";
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
    const RationNotifications =
      (await redis.get(`${rationId}:RationNotifications`)) || "";

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
