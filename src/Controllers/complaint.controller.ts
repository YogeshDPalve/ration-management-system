import { Request, Response } from "express";
import { AuthRequest, ComplaintBody, Feedback } from "../Constants/interfaces";
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
    }: ComplaintBody = req.body;
    //array of uploaded images as proof
    const fairShopNumber: number = Number(shopNumber);
    const proof = req.files as Express.Multer.File[];
    console.log(proof);
    if (!proof || proof.length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "No file uploaded." });
    }
    // extracting the file names
    const fileNames: string[] = proof.map((file) => file.filename);
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
const feedback = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rationId, rating, shopNumber, message }: Feedback = req.body;
    const user = await prisma.user.findUnique({ where: { rationId } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        rationId,
        rating,
        shopNumber,
        message,
      },
    });
    if (!feedback) {
      return res.status(400).send({
        success: false,
        message: "Cannot send Feedback",
      });
    }
    return res.status(200).send({
      success: true,
      message:
        "Thanks for your feedback. We will consider your feedback for improvement",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error to send feedback",
    });
  }
};
export { postComplaint, feedback };
