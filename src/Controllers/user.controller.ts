import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  AuthRequest,
  CheckLoginReqBody,
  CheckRegReqBody,
  OtpToken,
} from "../Constants/interfaces";
import { generateOtpToken, generateToken } from "../Utils/generateToken";
import redis from "../Utils/redis";
import sendOtp from "../Utils/twilio";

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

    generateToken(user, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error in login controller",
      error,
    });
  }
};
// generate otp controller
const generateOtp = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const tokenExpiryTime = process.env.TOKEN_EXPIRY_TIME as string;
    const rationId = req.info?.rationId as string;
    console.log(rationId);
    const user = await prisma.user.findUnique({ where: { rationId } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found please login first.",
      });
    }
    const mobileNo = user.mobileNo;
    // Genetating otp
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();

    // Store or update the OTP in Redis with a fresh 10-minute expiry
    await redis.set(`otp:${mobileNo}`, otp, "EX", tokenExpiryTime);
    const result = await redis.get(`otp:${mobileNo}`);
    console.log(`Stored OTP: ${result}`);

    // send otp to user via sms
    sendOtp(otp, mobileNo, tokenExpiryTime, res);
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
// verify otp controller
const verifyOtp = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { rationId, firstName, lastName } = req.info ?? {};
    const { mobileNo, otp } = req.body;

    if (!mobileNo || !otp) {
      return res.status(400).send({
        success: false,
        message: "Mobile No and OTP are required",
      });
    }

    // Check if the entered mobileNo has an OTP
    const storedOtp = await redis.get(`otp:${mobileNo}`);
    console.log(`Stored OTP: ${storedOtp}`);

    if (!storedOtp) {
      return res.status(400).send({
        success: false,
        message: "OTP expired or does not exist",
      });
    }

    // Verify the OTP for the current mobile number
    if (storedOtp !== otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is correct, delete it from Redis
    await redis.del(`otp:${mobileNo}`);

    //generate the opt token for further verification
    generateOtpToken(
      res,
      rationId as string,
      firstName as string,
      lastName as string
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutUser = (_: Request, res: Response): any => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .cookie("verifiedOtp", "", { maxAge: 0 })
      .send({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to logout",
    });
  }
};

const getUserInfo = async (req: AuthRequest, res: Response): Promise<any>  => {
  try {
    const rationId: string = req.info?.rationId as string;

    const userInfo = await prisma.user.findUnique({ where: { rationId } });
    if (!userInfo) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User info get successfully",
      userInfo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error to get user info",
    });
  }
};
export {
  registerUser,
  loginUser,
  generateOtp,
  verifyOtp,
  logoutUser,
  getUserInfo,
};
