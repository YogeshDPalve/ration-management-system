import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

// prisma initiation
const prisma = new PrismaClient();

// register user controller
const registerUser = async (req: Request, res: Response): Response<unknown> => {
  try {
    const {
      rationId, // primary
      adharcardNumber, //unique
      firstName,
      middleName,
      lastName,
      mobileNo, //unique
      email,
      Address,
      password,
    } = req.body;

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        rationId,
        adharcardNumber,
        firstName,
        middleName,
        lastName,
        mobileNo,
        email,
        Address,
        password,
      },
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
