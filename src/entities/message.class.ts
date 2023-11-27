import axios from "axios";
import { ISend } from "../..";
import { formatDateIndianStyle } from "../functions";
require("dotenv").config();

const defaultBody = {
  apikey: process.env.SMS_API_KEY,
  sender: process.env.SMS_HEADER,
};
const send = async ({
  Numbers,
  Message,
}: Pick<ISend, "Numbers" | "Message">) => {
  const res = await axios({
    method: "GET",
    baseURL: process.env.SMS_API_URL,
    timeout: 3000,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    params: {
      ...defaultBody,
      numbers: Numbers.join(","),
      message: Message,
    },
  });
  return res.data;
};

export default class Message {
  protected static isServiceEnabled = false;

  // cron jon to send message
  static sendCardExpiryAlertMessage(
    p: Pick<
      ISend,
      "CustomerName" | "DigitalCard" | "ExpiresDate" | "PlanLink" | "MobileNo"
    >
  ) {
    if (this.isServiceEnabled) {
      const indianDate = formatDateIndianStyle(p.ExpiresDate);
      const message = `Dear ${p.CustomerName},\nYour Tamil Milk digital card no: **${p.DigitalCard} plan expires on ${indianDate}. Recharge now to avail of uninterrupted service ${p.PlanLink}.`;
      // send message
      return send({
        Numbers: [p.MobileNo],
        Message: encodeURIComponent(message),
      });
    }
  }
  // cron jon to send message
  static sendLowBalanceAlertMessage(
    p: Pick<ISend, "DigitalCard" | "Balance" | "PlanLink" | "MobileNo">
  ) {
    if (this.isServiceEnabled) {
      const message = `Dear Customer,\nYour Tamil Milk digital card no: cardno, has reached the low balance balance. Recharge now to avail of uninterrupted service planlink.`;
      // send message
      return send({
        Numbers: [p.MobileNo],
        Message: encodeURIComponent(message),
      });
    }
  }
  static sendRechargeSuccessMessage(
    p: Pick<
      ISend,
      "RechargeAmount" | "DigitalCard" | "RechargeDate" | "Balance" | "MobileNo"
    >
  ) {
    if (this.isServiceEnabled) {
      const cardno = p.DigitalCard?.toString()?.slice(-8);
      const recharge_date = formatDateIndianStyle(p.RechargeDate);
      const message = `Hi,\nRecharge of INR ${p.RechargeAmount} was successful for your Tamil Milk card no: ${cardno} on ${recharge_date}, and your current account balance is ${p.Balance}.`;
      console.log("message====>", message);
      // send message
      return send({
        Numbers: [p.MobileNo],
        Message: encodeURIComponent(message),
      });
    }
  }
  static async sendWelcomeMessage(p: Pick<ISend, "OTP" | "MobileNo">) {
    if (this.isServiceEnabled) {
      const message = `Dear Customer,\nThank you for registering with Tamil MIlk. Your Verification Code is ${p.OTP}.\nThank You`;
      // send message
      return send({
        Numbers: [p.MobileNo],
        Message: encodeURIComponent(message),
      });
    }
  }
  static sendOTPMessage(p: Pick<ISend, "OTP" | "MobileNo">) {
    if (this.isServiceEnabled) {
      const message = `Hi, Use this One Time Password ${p.OTP} to access your Tamil Milk account. - @Tamil Milk`;
      // send message
      return send({
        Numbers: [p.MobileNo],
        Message: encodeURIComponent(message),
      });
    }
  }
}
