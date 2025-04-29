import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AdminLogin, AdminRegister } from "../Constants/types";
import bcrypt from "bcryptjs";
import { generateAdminToken } from "../Utils/generateToken";
const prisma = new PrismaClient();

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password, contact }: AdminRegister = req.body;
    if (!name || !email || !password || !contact) {
      return res.status(404).send({
        success: false,
        message: "All fields are required",
      });
    }
    const checkAdmin = await prisma.admin.findUnique({ where: { email } });
    if (checkAdmin) {
      return res.status(404).send({
        success: false,
        message: "Admin already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contact,
      },
    });
    res.status(200).send({
      success: true,
      message: "Admin registered successfully",
      createAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to register admin",
    });
  }
};
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password }: AdminLogin = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "All fields are required",
      });
    }
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Admin not exists with this email id",
      });
    }
    const passwordCheck: boolean = await bcrypt.compare(
      password,
      admin.password
    );
    if (!passwordCheck) {
      return res.status(404).send({
        success: false,
        message: "Incorrect email or password",
      });
    }
    // generate jwt token for admin
    generateAdminToken(email, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Failed to login admin",
    });
  }
};
