import { Request, Response } from "express";
import { AuthRequest } from "../Constants/interfaces";
import { PrismaClient } from "@prisma/client";
// prisma call
const prisma = new PrismaClient();
// controller for send complaint
const postComplaint = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      userName,
      rationId,
      shopNumber,
      shopOwnerName,
      shopAddress,
      issueType,
      description,
    } = req.body;
    //array of uploaded images as proof
    const fairShopNumber = Number(shopNumber);
    const proof = req.files as Express.Multer.File[];

    if (!proof) {
      return res.status(400).send("No file uploaded.");
    }
    // extracting the file names
    const fileNames = proof.map((file) => file.filename);
    //Users rationId
    const userId: string = req.info?.rationId || "";
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User not fount to send the complaint",
      });
    }

    const user = await prisma.user.findUnique({ where: { rationId: userId } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not fount to send the complaint",
      });
    }
    const complaint = await prisma.complaint.create({
      data: {
        userName,
        rationId,
        shopNumber: fairShopNumber,
        shopOwnerName,
        shopAddress,
        issueType,
        description,
        proof: fileNames,
      },
    });
    if (!complaint) {
      return res.status(400).send({
        success: false,
        message: "Complaint not send",
      });
    }
    res.status(200).send({
      success: true,
      message:
        "Your complaint send successfully. We will take action on it soon",
      complaint,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error to post complaint",
    });
  }
};

export { postComplaint };
