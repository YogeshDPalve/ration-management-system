import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  AuthRequest,
  CheckLoginReqBody,
  CheckRegReqBody,
  OtpToken,
  VerifyOtp,
  VerifyResetOtp,
} from "../Constants/interfaces";
import { generateOtpToken, generateToken } from "../Utils/generateToken";
import redis from "../Utils/redis";
import sendOtp from "../Utils/twilio";
import { stringify } from "querystring";

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
    console.log(user);
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
interface Ration {
  rationId: string;
}
const generateOtp = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const tokenExpiryTime = process.env.TOKEN_EXPIRY_TIME as string;
    const { rationId }: Ration = req.body;
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
    // await redis.set(`otp:${mobileNo}`, otp);
    const result = await redis.get(`otp:${mobileNo}`);
    console.log(`Stored OTP: ${result}`);

    res.status(200).send({
      success: true,
      message: "otp send successfully to your mobile number",
      otp,
    });

    // send otp to user via sms
    // sendOtp(otp, mobileNo, tokenExpiryTime, res);
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
// verify otp controller
const verifyOtp = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { rationId, firstName, lastName } = req.info ?? {};
    const { mobileNo, otp }: VerifyOtp = req.body;

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

    // OTP is correct, delete  it from Redis
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

// verify otp to reset password
const verifyResetOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rationId, otp, password, confirmPassword }: VerifyResetOtp =
      req.body;

    const user = await prisma.user.findUnique({ where: { rationId } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User Not Found for provided ration id",
      });
    }
    const mobileNo = user.mobileNo;
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and confirm password are different",
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

    // Reset password
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatePassword = await prisma.user.update({
      where: { rationId },
      data: { password: hashedPassword },
    });
    if (!updatePassword) {
      return res.status(400).send({
        success: false,
        message: "Error occured to reset the password",
      });
    }
    // OTP is correct, delete it from Redis
    await redis.del(`otp:${mobileNo}`);

    //generate the opt token for further verification
    return res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Internal server error to reset passowrd",
    });
  }
};

const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rationId } = req.query;
    console.log(rationId);
    const del = await redis.del(`user:${rationId}`);
    if (!del) {
      return res.status(500).send({
        success: false,
        message: "Unable to logout",
      });
    }
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

const getUserInfo = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const rationId: string = req.params?.rationId as string;
    const userData = await redis.get(`user:${rationId}`);
    if (userData) {
      return res.status(200).send({
        success: true,
        message: "User info get successfully",
        userInfo: JSON.parse(userData),
      });
    }
    const userInfo = await prisma.user.findUnique({
      where: { rationId },
      select: {
        rationId: true,
        adharcardNumber: true,
        firstName: true,
        middleName: true,
        lastName: true,
        mobileNo: true,
        email: true,
        address: true,
        fairPriceShopNumber: true,
        RationAllotment: true,
        AllotmentHistory: true,
        Complaint: true,
        Feedback: true,
        FamilyMembers: true,
        FPSTransaction: true,
        PurchaseHistory: true,
        RationNotifications: true,
        createdAt: true,
        updatedAt: true,
        // password is intentionally excluded
      },
    });
    if (!userInfo) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    // cache data to redis with ration id key
    const prefix = `${rationId}`;

    // Define each section and store individually
    const sectionsToStore = {
      RationAllotment: userInfo.RationAllotment,
      AllotmentHistory: userInfo.AllotmentHistory,
      Complaint: userInfo.Complaint,
      Feedback: userInfo.Feedback,
      FamilyMembers: userInfo.FamilyMembers,
      FPSTransaction: userInfo.FPSTransaction,
      PurchaseHistory: userInfo.PurchaseHistory,
      RationNotifications: userInfo.RationNotifications,
      BasicInfo: {
        rationId: userInfo.rationId,
        adharcardNumber: userInfo.adharcardNumber,
        firstName: userInfo.firstName,
        middleName: userInfo.middleName,
        lastName: userInfo.lastName,
        mobileNo: userInfo.mobileNo,
        email: userInfo.email,
        address: userInfo.address,
        fairPriceShopNumber: userInfo.fairPriceShopNumber,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      },
    };

    try {
      for (const [key, value] of Object.entries(sectionsToStore)) {
        const redisKey = `${prefix}:${key}`;
        await redis.set(redisKey, JSON.stringify(value));
      }
      console.log(`User data stored in Redis under prefix ${prefix}:`);
    } catch (error) {
      console.error("Error storing namespaced user data in Redis:", error);
    }
    // await redis.set(`user:${userInfo.rationId}`, `${JSON.stringify(userInfo)}`);

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
  verifyResetOtp,
};
