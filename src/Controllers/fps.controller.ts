import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { FpsRegister } from "../Constants/types";

const prisma = new PrismaClient();
// fair price shop login controller
export const fpsLogin = async (req: Request, res: Response) => {
  try {
    const { shopNumber, contact }: { shopNumber: number; contact: string } =
      req.body;

    const loginFps = await prisma.fairPriceShop.findUnique({
      where: { shopNumber },
    });
    if (!loginFps) {
      return res.status(404).send({
        success: false,
        message: "Fair price shop not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Shop Login successfull",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to login",
    });
  }
};
// fair price shop register controller
export const fpsRegister = async (req: Request, res: Response) => {
  try {
    const { shopNumber, location, ownerName, contact }: FpsRegister = req.body;

    const exsitingFps = await prisma.fairPriceShop.findUnique({
      where: { shopNumber },
    });
    if (exsitingFps) {
      return res.status(404).send({
        success: false,
        message: "Fair price shop already exists",
      });
    }

    const registerFps = await prisma.fairPriceShop.create({
      data: { shopNumber, location, ownerName, contact },
    });
    return res.status(200).send({
      success: true,
      message: "Shop Login successfull",
      registerFps,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to login",
    });
  }
};
