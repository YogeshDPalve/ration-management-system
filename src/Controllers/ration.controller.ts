import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { purchaseHistoryBody } from "../Constants/interfaces";
import { AllotRation } from "../Constants/types";

// create instance of prisma
const prisma = new PrismaClient();

// get ration details controller
const getRationDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rationId } = req.body;
    if (!rationId) {
      return res.status(400).send({
        success: false,
        message: "could not find user",
      });
    }

    const rationData = await prisma.rationAllotment.findUnique({
      where: { rationId },
    });
    if (!rationData) {
      return res.status(500).send({
        success: false,
        message: "Ration data not found for this ration id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Ration Details fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error to get ration details",
      error,
    });
  }
};

// allot ration details controller
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
      return res.status(400).send({
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
        
      }
    })
    return res.status(201).send({
      success: true,
      message: "Ration allotted successfully",
      data: rationAllot,
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

const rationPurchased = async (req: Request, res: Response) => {
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

export { getRationDetails, allotRation, rationPurchased };
8;
