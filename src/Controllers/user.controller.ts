import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { CheckRegReqBody } from "../Constants/interfaces";

// prisma initiation
const prisma = new PrismaClient();

// register user controller
const registerUser = async (req: Request, res: Response): Promise<any> => {
	try {
	  console.log('from controller : req.body->',req.body)
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
const loginUser = () => {};
export { registerUser, loginUser };
