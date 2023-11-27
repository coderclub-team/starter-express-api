export type MyWhereType = Filterable<any>["where"] & WhereOptions<any>;

export interface ISend {
  Numbers: string[];
  Message: string;
  OTP: string;
  MobileNo: string;
  DigitalCard: number;
  Balance: number;
  PlanLink: string;
  RechargeAmount: number;
  RechargeDate: Date;
  CustomerName: string;
  ExpiresDate: Date;
}
