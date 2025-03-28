import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { CheckLoginReqBody, CheckRegReqBody } from "../Constants/interfaces";
import { generateToken } from "../Utils/generateToken";

// prisma initiation
const prisma = new PrismaClient();

// register user controller
const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      rationId, // primary
      adharcardNumber, //unique
      firstName,
      middleName,
      lastName,
      mobileNo, //unique
      email,
      address,
      fairPriceShopNumber,
      password,
    }: CheckRegReqBody = req.body;

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        rationId,
        adharcardNumber,
        firstName,
        middleName,
        lastName,
        mobileNo,
        email,
        address,
        password: hashedPassword,
        fairPriceShopNumber,
      },
    });

    return res.status(200).send({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in register controller",
      error,
    });
  }
};

// login user controller
const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rationId, password }: CheckLoginReqBody = req.body;

    const user = await prisma.user.findUnique({ where: { rationId } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message:
          "User not exists please register first and then come to login.",
      });
    }

    const passowordCheck: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!passowordCheck) {
      return res.status(400).send({
        success: false,
        message: "Invalid ration id or password.",
      });
    }

    generateToken(
      user.rationId,
      res,
      `Welcome back ${user.firstName} ${user.lastName}🤍.`
    );
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in login controller",
      error,
    });
  }
};
export { registerUser, loginUser };
