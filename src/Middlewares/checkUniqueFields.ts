import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

// prisma initiation
const prisma = new PrismaClient();

type User = object | null;

const checkUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { rationId, adharcardNumber, email, mobileNo } = req.body;

  //   check if User exists
  const checkUser: User = await prisma.user.findUnique({ where: { rationId } });
  if (checkUser) {
    return res.status(400).send({
      success: false,
      message: "User already exists.",
    });
  }

  // check if adhar exists
  const adharCheck: User = await prisma.user.findUnique({
    where: { adharcardNumber },
  });
  if (adharCheck) {
    return res.status(400).send({
      success: false,
      message: "Adhar Number already exists.",
    });
  }

  // check if email exists
  const checkEmail: User = await prisma.user.findUnique({
    where: { email },
  });
  if (checkEmail) {
    return res.status(400).send({
      success: false,
      message: "Email already exists.",
    });
  }

  // check if Mobile exists
  const checkMobile: User = await prisma.user.findUnique({
    where: { mobileNo },
  });
  if (checkMobile) {
    return res.status(400).send({
      success: false,
      message: "Mobile Number already exists.",
    });
  }
  next();
};

export default checkUnique;
