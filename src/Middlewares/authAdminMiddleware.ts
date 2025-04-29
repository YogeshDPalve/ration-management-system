import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET as string;

const prisma = new PrismaClient();
// Admin verification middleware
export const authAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).send({
        success: false,
        message: "Token not found",
      });
    }
    const verify = jwt.verify(token, jwtSecret) as JwtPayload;
    if (!verify) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }
    const email: string = verify.data as string;

    const checkAdmin = await prisma.admin.findUnique({ where: { email } });
    if (!checkAdmin) {
      return res.status(404).send({
        success: false,
        message: "ADmin not found with provided token",
      });
    }

    next();
    // return res.status(200).send({
    //   success: true,
    //   message: "Admin verified successfully",
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to auth Admin",
    });
  }
};
// FPS verification middleware
export const authFPSMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).send({
        success: false,
        message: "Token not found",
      });
    }
    const verify = jwt.verify(token, jwtSecret) as JwtPayload;
    if (!verify) {
      return res.status(404).send({
        success: false,
        message: "Invalid token",
      });
    }
    const shopNumber: number = verify.data as number;

    const checkFPS = await prisma.fairPriceShop.findUnique({
      where: { shopNumber },
    });
    if (!checkFPS) {
      return res.status(404).send({
        success: false,
        message: "Fair Price shop not found with provided token",
      });
    }

    // next();
    return res.status(200).send({
      success: true,
      message: "Fair Price Shop verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to auth Fair Price Shop",
    });
  }
};
