import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

// create instance of prisma
const prisma = new PrismaClient();
const checkAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminEmail } = req.body();
    const checkAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });
    if (!checkAdmin) {
      return res.status(400).send({
        success: false,
        message: "You are not admin",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error at Admin middleware",
    });
  }
};
export default checkAdminMiddleware;
