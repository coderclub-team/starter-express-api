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
exports.generateRazorpayIntent = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const generateRazorpayIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("generateRazorpayIntent", process.env);
    try {
        const { amount, currency, receipt } = req.body;
        if (!amount || !currency || !receipt) {
            throw Error("Amount, currency and receipt are required!");
        }
        const options = {
            amount: amount * 100,
            currency,
            receipt,
        };
        const response = yield razorpay.orders.create(options);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.generateRazorpayIntent = generateRazorpayIntent;
