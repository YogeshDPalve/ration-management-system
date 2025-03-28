import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../Constants/interfaces";
const authUserMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "token not found",
      });
    }
    const authToken: string = token.split(" ")[1];
    const verify = jwt.verify(authToken, jwtSecret) as JwtPayload;
    if (!verify) {
      return res.status(400).send({
        success: false,
        message: "Invalid token",
      });
    }
    req.id = verify.rationId;
    next();
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in auth user middleware",
      error,
    });
  }
};
export default authUserMiddleware;
