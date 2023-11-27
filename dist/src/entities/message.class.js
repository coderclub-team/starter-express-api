"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const functions_1 = require("../functions");
require("dotenv").config();
const defaultBody = {
    apikey: process.env.SMS_API_KEY,
    sender: process.env.SMS_HEADER,
};
const send = ({ Numbers, Message, }) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, axios_1.default)({
        method: "GET",
        baseURL: process.env.SMS_API_URL,
        timeout: 3000,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        },
        params: Object.assign(Object.assign({}, defaultBody), { numbers: Numbers.join(","), message: Message }),
    });
    return res.data;
});
class Message {
    // cron jon to send message
    static sendCardExpiryAlertMessage(p) {
        if (this.isServiceEnabled) {
            const indianDate = (0, functions_1.formatDateIndianStyle)(p.ExpiresDate);
            const message = `Dear ${p.CustomerName},\nYour Tamil Milk digital card no: **${p.DigitalCard} plan expires on ${indianDate}. Recharge now to avail of uninterrupted service ${p.PlanLink}.`;
            // send message
            return send({
                Numbers: [p.MobileNo],
                Message: encodeURIComponent(message),
            });
        }
    }
    // cron jon to send message
    static sendLowBalanceAlertMessage(p) {
        if (this.isServiceEnabled) {
            const message = `Dear Customer,\nYour Tamil Milk digital card no: cardno, has reached the low balance balance. Recharge now to avail of uninterrupted service planlink.`;
            // send message
            return send({
                Numbers: [p.MobileNo],
                Message: encodeURIComponent(message),
            });
        }
    }
    static sendRechargeSuccessMessage(p) {
        var _a, _b;
        if (this.isServiceEnabled) {
            const cardno = (_b = (_a = p.DigitalCard) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.slice(-8);
            const recharge_date = (0, functions_1.formatDateIndianStyle)(p.RechargeDate);
            const message = `Hi,\nRecharge of INR ${p.RechargeAmount} was successful for your Tamil Milk card no: ${cardno} on ${recharge_date}, and your current account balance is ${p.Balance}.`;
            console.log("message====>", message);
            // send message
            return send({
                Numbers: [p.MobileNo],
                Message: encodeURIComponent(message),
            });
        }
    }
    static sendWelcomeMessage(p) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isServiceEnabled) {
                const message = `Dear Customer,\nThank you for registering with Tamil MIlk. Your Verification Code is ${p.OTP}.\nThank You`;
                // send message
                return send({
                    Numbers: [p.MobileNo],
                    Message: encodeURIComponent(message),
                });
            }
        });
    }
    static sendOTPMessage(p) {
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
exports.default = Message;
Message.isServiceEnabled = false;
