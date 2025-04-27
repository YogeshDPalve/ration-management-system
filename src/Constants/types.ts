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
