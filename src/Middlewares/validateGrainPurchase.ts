import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { purchaseHistoryBody } from "../Constants/interfaces";
// create instance of prisma
const prisma = new PrismaClient();

//* Middleware of purchase ration controller for validate grains limit
export const validateGrainPurchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      rationId,
      wheatPurchased,
      ricePurchased,
      sugarPurchased,
      daalPurchased,
      oilPurchased,
    }: purchaseHistoryBody = req.body;

    // check user exists
    const checkUser = await prisma.user.findUnique({ where: { rationId } });
    if (!checkUser) {
      return res.status(404).send({
        success: false,
        message: "User Not found",
      });
    }

    // fetching data of alloted ration of given user
    const checkGrainsLimit = await prisma.rationAllotment.findUnique({
      where: { rationId },
    });
    if (!checkGrainsLimit) {
      return res.status(404).send({
        success: false,
        message: "Ration allotment not found",
      });
    }

    //   array grains name
    const grainNames = ["wheat", "rice", "sugar", "oil", "daal"] as const;

    //	input data from body
    const purchasedMap = {
      wheat: wheatPurchased,
      rice: ricePurchased,
      sugar: sugarPurchased,
      oil: oilPurchased,
      daal: daalPurchased,
    };

    // mapping data to each grain
    const grains = grainNames.map((name) => ({
      name,
      quota: checkGrainsLimit[`${name}Quota`],
      used: checkGrainsLimit[`${name}Used`],
      purchased: purchasedMap[name],
    }));

    // checking if limit exceeds
    const limitExceeded = grains.find(
      (grain) => grain.quota < grain.used + grain.purchased
    );
    if (limitExceeded) {
      return res.status(404).send({
        success: false,
        message: `You cannot purchase more than the provided ${limitExceeded.name} limit`,
      });
    }

    // go to next function
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to validate grains limit",
    });
  }
};
