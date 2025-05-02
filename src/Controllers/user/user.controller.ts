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
    const redisNotification = (await redis.get(`user:${rationId}`)) || "";
    const JsonRedis = JSON.parse(redisNotification);
    if (JsonRedis) {
      return res.status(200).send({
        success: true,
        message: "Notifications get successfully",
        notification: JsonRedis.RationNotifications,
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
export const storeuserInfoInRedis = async (userInfo: any) => {
  const rationId = userInfo?.rationId;
  if (!rationId) {
    throw new Error("rationId is required");
  }

  const prefix = `${rationId}`;

  // Define each section and store individually
  const sectionsToStore = {
    RationAllotment: userInfo.RationAllotment,
    AllotmentHistory: userInfo.AllotmentHistory,
    Complaint: userInfo.Complaint,
    Feedback: userInfo.Feedback,
    FamilyMembers: userInfo.FamilyMembers,
    FPSTransaction: userInfo.FPSTransaction,
    PurchaseHistory: userInfo.PurchaseHistory,
    RationNotifications: userInfo.RationNotifications,
    BasicInfo: {
      rationId: userInfo.rationId,
      adharcardNumber: userInfo.adharcardNumber,
      firstName: userInfo.firstName,
      middleName: userInfo.middleName,
      lastName: userInfo.lastName,
      mobileNo: userInfo.mobileNo,
      email: userInfo.email,
      address: userInfo.address,
      fairPriceShopNumber: userInfo.fairPriceShopNumber,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
    },
  };

  try {
    for (const [key, value] of Object.entries(sectionsToStore)) {
      const redisKey = `${prefix}:${key}`;
      await redis.set(redisKey, JSON.stringify(value));
    }
    console.log(`User data stored in Redis under prefix ${prefix}:`);
  } catch (error) {
    console.error("Error storing namespaced user data in Redis:", error);
  }
};
