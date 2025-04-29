export type AllotRation = {
  adminEmail: string;
  rationId: string;
  wheatQuota: number;
  riceQuota: number;
  sugarQuota: number;
  daalQuota: number;
  oilQuota: number;
};
export type NotificationsData = {
  rationId: string;
  type: string;
  message: string;
};

export type GrainsLimit = {
  wheatQuota: number;
  riceQuota: number;
  sugarQuota: number;
  daalQuota: number;
  oilQuota: number;
  wheatUsed: number;
  riceUsed: number;
  sugarUsed: number;
  daalUsed: number;
  oilUsed: number;
};

export type FpsRegister = {
  shopNumber: number;
  location: string;
  ownerName: string;
  contact: string;
  password: string;
};
export type FpsLogin = Pick<FpsRegister, "shopNumber" | "password">;
export type AdminRegister = {
  name: string;
  email: string;
  password: string;
  contact: string;
};
export type AdminLogin = Pick<AdminRegister, "email" | "password">;
