import { NextFunction, Request, Response, response } from "express";
import UserWallet from "../models/user-wallet.model";

export default async function WalletBalance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const balance = await UserWallet.findOne({
      where: {
        UserGUID: req.body.user.UserGUID,
      },
      order: [["WalletGUID", "DESC"]],
    });
    if (balance == null) {
      req.body.WalletBalance = 0;
    } else {
      req.body.WalletBalance = balance?.getDataValue("Balance");
    }
    next();
  } catch (error) {
    next(error);
  }
}
