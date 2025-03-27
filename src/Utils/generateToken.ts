import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = async (
  rationId: string,
  res: Response,
  msg: string
): Promise<any> => {
  try {
    console.log("hello from jwt");
    const jwtSecret = process.env.JWT_SECRET as string;

    // generate token
    let authToken = jwt.sign({ rationId }, jwtSecret, {
      expiresIn: "1d",
    });
    // token with Bearer Naming convention
    const token = `Bearer ${authToken}`;
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
        message: msg,
        token,
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in generate jwt token.",
    });
  }
};
