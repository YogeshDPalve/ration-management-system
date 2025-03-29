import { Response } from "express";
import { AuthRequest, CheckFamilyInfo } from "../Constants/interfaces";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const addFamilyMember = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const rationId = req.id as string;
    const { fullName, age, relation }: CheckFamilyInfo = req.body;

    const member = await prisma.familyMembers.create({
      data: {
        fullName,
        age,
        relation,
        rationId,
      },
    });

    if (!member) {
      return res.status(400).send({
        success: false,
        message: "Family Member not added",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Family Member added successfully",
      member,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error in adding a family member",
      error,
    });
  }
};

export { addFamilyMember };
