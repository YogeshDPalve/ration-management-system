import { Request } from "express";
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
interface CheckRegReqBody {
  rationId: string; // primary
  adharcardNumber: string; //unique
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNo: string; //unique
  email: string;
  fairPriceShopNumber: number;
  address: string;
  password: string;
}

interface CheckLoginReqBody {
  rationId: string;
  password: string;
}
interface CheckFamilyInfo {
  fullName: string;
  age: number;
  gender: Gender;
  adharCard: string;
  relation: string;
}
interface AuthRequest extends Request {
  info?: {
    rationId: string;
    firstName: string;
    lastName: string;
    adharCardNumber: string;
    mobileNumber: string;
  };
}
interface OtpToken {
  rationId: string;
  firstName: string;
  lastName: string;
}
interface VerifyResetOtp {
  mobileNo: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
interface VerifyOtp {
  mobileNo: string;
  otp: string;
}
export {
  CheckRegReqBody,
  CheckLoginReqBody,
  AuthRequest,
  CheckFamilyInfo,
  OtpToken,
  VerifyOtp,
  VerifyResetOtp,
};
