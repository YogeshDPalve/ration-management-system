import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { purchaseHistoryBody, ShopNumber } from "../Constants/interfaces";
import { AllotRation, NotificationsData } from "../Constants/types";
import { currentMonth, currentMonthName } from "../Constants/others";

// create instance of prisma
const prisma = new PrismaClient();

// ration allocation to user and send notification of it
const allotRation = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      rationId,
      wheatQuota,
      riceQuota,
      sugarQuota,
      daalQuota,
      oilQuota,
    }: AllotRation = req.body;

    // check user exists or not
    const checkUser = await prisma.user.findUnique({
      where: { rationId },
    });
    if (!checkUser) {
      return res.status(404).send({
        success: false,
        message: "Provided ration id is invalid",
      });
    }

    // check if user exists in ration allocation
    const ration = await prisma.rationAllotment.findUnique({
      where: { rationId },
    });

    // if user not exists create new allocation of ration
    if (!ration) {
      createRationAllotment(
        rationId,
        wheatQuota,
        riceQuota,
        sugarQuota,
        daalQuota,
        oilQuota,
        res
      );
    }

    const date = new Date(ration?.updatedAt || "");
    const month = date.getMonth() + 1;

    // cannot update ration allocation if it allocated for current month
    if (currentMonth === month) {
      return res.status(400).send({
        success: false,
        message: "You cannot update data untill next month.",
      });
    }
    // update ration allocation if user exists
    updateRationAllotment(
      rationId,
      wheatQuota,
      riceQuota,
      sugarQuota,
      daalQuota,
      oilQuota,
      res
    );
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

    // calculate total purchased ammount of ration (KG)
    const totalAmount = [
      wheatPurchased,
      ricePurchased,
      daalPurchased,
      sugarPurchased,
      oilPurchased,
    ].reduce((sum, value) => sum + value, 0);

    // add queries in transaction that both run successfully or none of them
    const [purchaseData, fpsTransaction, sendPurchaseNotification] =
      await prisma.$transaction([
        prisma.purchaseHistory.create({
          data: {
            rationId,
            wheatPurchased,
            ricePurchased,
            sugarPurchased,
            daalPurchased,
            oilPurchased,
            fpsShopNumber,
          },
        }),
        prisma.fPSTransaction.create({
          data: {
            rationId,
            shopNumber: fpsShopNumber,
            wheatBought: wheatPurchased,
            riceBought: ricePurchased,
            sugarBought: sugarPurchased,
            daalBought: daalPurchased,
            oilBought: oilPurchased,
            totalAmount,
          },
        }),
        prisma.rationNotification.create({
          data: {
            rationId,
            type: "Pickup Confirmation",
            message: `Ration for ${currentMonthName} has been purchased and picked up successfully`,
          },
        }),
      ]);
    res.status(201).send({
      success: true,
      message: "Purchase and notification created successfully",
      purchaseData,
      fpsTransaction,
      sendPurchaseNotification,
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
      sendNotification,
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

  
//* ---------------------------------------------------------
  
// create new ration if user not exists
const createRationAllotment = async (
  rationId: string,
  wheatQuota: number,
  riceQuota: number,
  sugarQuota: number,
  daalQuota: number,
  oilQuota: number,
  res: Response
) => {
  try {
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
// update existing ration if user exists
const updateRationAllotment = async (
  rationId: string,
  wheatQuota: number,
  riceQuota: number,
  sugarQuota: number,
  daalQuota: number,
  oilQuota: number,
  res: Response
) => {
  try {
    const rationAllot = await prisma.rationAllotment.update({
      where: { rationId },
      data: { wheatQuota, riceQuota, sugarQuota, daalQuota, oilQuota },
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
