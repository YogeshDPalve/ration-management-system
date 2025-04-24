import { Request, Response } from "express";
const postComplaint = (req: Request, res: Response) => {
  try {
    const {
      userName,
      rationId,
      shopNumber,
      shopOwnerName,
      shopAddress,
      proof,
      issueType,
      description,
    } = req.body;
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error to post complaint",
    });
  }
};
export { postComplaint };
