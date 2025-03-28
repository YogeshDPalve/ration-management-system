import { Request } from "express";
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
interface AuthRequest extends Request {
  id?: string;
}
export { CheckRegReqBody, CheckLoginReqBody, AuthRequest };
