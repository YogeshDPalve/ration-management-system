import { Request, Response, NextFunction } from "express";
const verifiedOtp = (req: Request, res: Response, next: NextFunction) => {
	const { verifiedOtp } = req.cookies;
	if (!verifiedOtp) {
		
	}
  verifiedOtp
    ? next()
    : res.status(400).send({
        success: false,
        message: "Please verify mobile Number using otp",
      });
};

export default verifiedOtp;
