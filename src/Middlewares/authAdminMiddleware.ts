import { Request, Response, NextFunction, json } from "express";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET as string;
export const authAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(404).send({
      success: false,
      message: "Token not found",
    });
  }
  const verify = jwt.verify(token, jwtSecret);
  if (!verify) {
    return res.status(404).send({
      success: false,
      message: "Invalid token",
    });
  }
  console.log(verify);
};
