import jwt from "jsonwebtoken";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const generateToken = async (user: any, res: Response): Promise<any> => {
  try {
    const userInfo = {
      rationId: user.rationId,
      firstName: user.firstName,
      lastName: user.lastName,
      adharcardNumber: user.adharcardNumber,
      mobileNo: user.mobileNo,
    };
    const jwtSecret = process.env.JWT_SECRET as string;

    // generate token
    let token = jwt.sign({ userInfo }, jwtSecret, {
      expiresIn: "1d",
    });
    // token with Bearer Naming convention
    console.log(token);
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //! for 1 day
      })
      .send({
        success: true,
        message: "Login successfull please verify otp",
        token,
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in generate jwt token.",
    });
  }
};

export const generateOtpToken = async (
  res: Response,
  rationId: string,
  firstName: string,
  lastName: string
): Promise<any> => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;

    // generate token
    let otpToken = jwt.sign({ rationId }, jwtSecret, {
      expiresIn: "1d",
    });

    // token with Bearer Naming convention
    console.log(`otp token:${otpToken}`);
    return res
      .status(200)
      .cookie("verifiedOtp", otpToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //! for 1 day
      })
      .send({
        success: true,
        message: `Welcome back ${firstName} ${lastName} 🤍`,
        otpToken,
      });
    ``;
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in generate jwt token.",
    });
  }
};
