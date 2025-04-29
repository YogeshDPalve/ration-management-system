import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { FpsLogin, FpsRegister } from "../Constants/types";
import { generateAdminToken } from "../Utils/generateToken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

//* fair price shop register controller
export const fpsRegister = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { shopNumber, location, ownerName, contact, password }: FpsRegister =
      req.body;

    const exsitingFps = await prisma.fairPriceShop.findUnique({
      where: { shopNumber },
    });
    if (exsitingFps) {
      return res.status(404).send({
        success: false,
        message: "Fair price shop already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashed password
    const registerFps = await prisma.fairPriceShop.create({
      data: {
        shopNumber,
        location,
        ownerName,
        contact,
        password: hashedPassword,
      },
    });
    return res.status(200).send({
      success: true,
      message: "Shop Login successfull",
      registerFps,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to login",
      error,
    });
  }
};

//* fair price shop login controller
export const fpsLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { shopNumber, password }: FpsLogin = req.body;

    const checkFPS = await prisma.fairPriceShop.findUnique({
      where: { shopNumber },
    });
    if (!checkFPS) {
      return res.status(404).send({
        success: false,
        message: "Fair price shop not exist with this number",
      });
    }

    const checkPassword: boolean = await bcrypt.compare(
      password,
      checkFPS.password
    );
    if (!checkPassword) {
      return res.status(404).send({
        success: false,
        message: "Invalid shop number or password",
      });
    }
    // generate jwt token
    generateAdminToken(shopNumber, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to login",
      error,
    });
  }
};
