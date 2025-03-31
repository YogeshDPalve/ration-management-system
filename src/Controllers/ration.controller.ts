import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../Constants/interfaces";

// create instance of prisma
const prisma = new PrismaClient();

// get ration details controller
const getRationDetails = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const rationId: string = req.info?.rationId as string;
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
    return res.status(500).send({
      success: false,
      message: "Internal server error to get ration details",
    });
  }
};
// allot ration details controller
export { getRationDetails };
