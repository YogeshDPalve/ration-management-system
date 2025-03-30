import { Response } from "express";
import { AuthRequest, CheckFamilyInfo } from "../Constants/interfaces";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const addFamilyMember = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    console.log("from controller");
    const rationId: string = req.info?.rationId as string;
    const { fullName, age, relation, adharCard, gender }: CheckFamilyInfo =
      req.body;
    const userExists = await prisma.familyMembers.findUnique({
      where: { adharCard },
    });
    if (userExists) {
      return res.status(400).send({
        success: true,
        message:
          "The given person with this  adhar number is already exists in this family.",
      });
    }
    const member = await prisma.familyMembers.create({
      data: {
        fullName,
        age,
        adharCard,
        gender,
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
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error in adding a family member",
      error,
    });
  }
};

export { addFamilyMember };
