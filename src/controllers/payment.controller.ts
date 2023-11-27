import Razorpay from "razorpay";
import { Request, Response, NextFunction } from "express";
import { Orders } from "razorpay/dist/types/orders";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const generateRazorpayIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("generateRazorpayIntent", process.env);
  try {
    const { amount, currency, receipt } = req.body;
    if (!amount || !currency || !receipt) {
      throw Error("Amount, currency and receipt are required!");
    }

    const options: Orders.RazorpayOrderCreateRequestBody = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    };

    const response = await razorpay.orders.create(options);

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
