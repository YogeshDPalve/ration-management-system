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
export { CheckRegReqBody, CheckLoginReqBody };
