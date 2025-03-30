import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../Constants/interfaces";

const authUserMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log("from auth user");
    const jwtSecret = process.env.JWT_SECRET as string;
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "token not found",
      });
    }

    const verify = jwt.verify(token, jwtSecret) as JwtPayload;
    if (!verify) {
      return res.status(400).send({
        success: false,
        message: "Invalid token",
      });
    }

    req.info = {
      rationId: verify.userInfo.rationId,
      firstName: verify.userInfo.firstName,
      lastName: verify.userInfo.lastName,
      adharCardNumber: verify.userInfo.adharcardNumber,
      mobileNumber: verify.userInfo.mobileNumber,
    };
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in auth user middleware",
      error,
    });
  }
};
const authOtpMiddleare = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    console.log("from auth otp");
    const jwtSecret = process.env.JWT_SECRET as string;
    const { verifiedOtp } = req.cookies;
    if (!verifiedOtp) {
      return res.status(400).send({
        success: false,
        message: "token not found",
      });
    }

    const verify = jwt.verify(verifiedOtp, jwtSecret) as JwtPayload;
    if (!verify) {
      return res.status(400).send({
        success: false,
        message: "Invalid token",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in auth user otp middleware",
      error,
    });
  }
};

export { authUserMiddleware, authOtpMiddleare };
