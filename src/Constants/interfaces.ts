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
  rationId: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
interface VerifyOtp {
  mobileNo: string;
  otp: string;
}
interface ComplaintBody {
  userName: string;
  rationId: string;
  shopNumber: number;
  shopOwnerName: string;
  shopAddress: string;
  issueType: string;
  description: string;
}
export enum Rating {
  WORSE = "WORSE",
  BAD = "BAD",
  OK = "OK",
  GOOD = "GOOD",
  EXCELLENT = "EXCELLENT",
}
type Feedback = Pick<ComplaintBody, "rationId" | "shopNumber"> & {
  rating: Rating;
  message: string;
};
type ShopNumber = Pick<ComplaintBody, "shopNumber">;
export interface purchaseHistoryBody {
  rationId: string;
  wheatPurchased: number;
  ricePurchased: number;
  sugarPurchased: number;
  daalPurchased: number;
  oilPurchased: number;
  fpsShopNumber: number;
}
export {
  CheckRegReqBody,
  CheckLoginReqBody,
  AuthRequest,
  CheckFamilyInfo,
  OtpToken,
  VerifyOtp,
  VerifyResetOtp,
  ComplaintBody,
  Feedback,
  ShopNumber,
};
