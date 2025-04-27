import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { purchaseHistoryBody, ShopNumber } from "../Constants/interfaces";
import { AllotRation, NotificationsData } from "../Constants/types";

// create instance of prisma
const prisma = new PrismaClient();

// ration allocation to user and send notification of it
const allotRation = async (req: Request, res: Response) => {
  try {
    const {
      rationId,
      wheatQuota,
      riceQuota,
      sugarQuota,
      daalQuota,
      oilQuota,
    }: AllotRation = req.body;

    const checkUser = await prisma.user.findUnique({
      where: { rationId },
    });
    if (!checkUser) {
      return res.status(404).send({
        success: false,
        message: "Provided ration id is invalid",
      });
    }

    const rationAllot = await prisma.rationAllotment.create({
      data: {
        rationId,
        wheatQuota,
        riceQuota,
        sugarQuota,
        daalQuota,
        oilQuota,
      },
    });

    const sendNotification = await prisma.rationNotification.create({
      data: {
        rationId,
        type: "Allocation",
        message: "Monthly allotment for next month has been assigned.",
      },
    });
    return res.status(201).send({
      success: true,
      message: "Ration allotted successfully",
      data: { rationAllot, sendNotification },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to allot ration details",
      error,
    });
  }
};

// ration purchase
const purchaseRation = async (req: Request, res: Response) => {
  try {
    const {
      rationId,
      wheatPurchased,
      ricePurchased,
      sugarPurchased,
      daalPurchased,
      oilPurchased,
      fpsShopNumber,
    }: purchaseHistoryBody = req.body;

    const checkUser = await prisma.user.findUnique({ where: { rationId } });
    if (!checkUser) {
      return res.status(400).send({
        success: false,
        message: "User Not found",
      });
    }

    const purchaseData = await prisma.purchaseHistory.create({
      data: {
        rationId,
        wheatPurchased,
        ricePurchased,
        sugarPurchased,
        daalPurchased,
        oilPurchased,
        fpsShopNumber,
      },
    });

    res.status(200).send({
      success: true,
      message: "Ration purchased successfully",
      purchaseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to purchase ration",
    });
  }
};

// send notification of ration pickup to every user of fair price shop
const sendNotificationOfPickup = async (req: Request, res: Response) => {
  try {
    const { shopNumber }: ShopNumber = req.body;
    const users = await prisma.user.findMany({
      where: { fairPriceShopNumber: shopNumber },
    });

    if (users.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No users found for the given shop number",
      });
    }
    const notificationsData: NotificationsData[] = users.map((user) => ({
      rationId: user.rationId,
      type: "Pickup",
      message: "Your ration for this month is ready for pickup!",
    }));
    const sendNotification = await prisma.rationNotification.createMany({
      data: notificationsData,
    });

    return res.status(201).send({
      success: true,
      message: "Pickup notifications send successfully to all users",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to send the pickup notification",
      error,
    });
  }
};

export { allotRation, purchaseRation, sendNotificationOfPickup };
