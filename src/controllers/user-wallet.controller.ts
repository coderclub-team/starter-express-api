import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import UserWallet from "../models/user-wallet.model";
import ProductSubscription from "../models/product-subscription.model";
import Sale from "../models/sale.model";
import SaleDetail from "../models/sale-detail.model";
import ProductMaster from "../models/product-master.model";
import { generateUniqueNumber } from "../functions";
export const getWalletTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.CreatedGUID = req.body.user.UserGUID;
  try {
    const transactions = await UserWallet.findAll({
      where: {
        UserGUID: req.body.CreatedGUID,
        Status: "FULLFILLED",
      },
      order: [["CreatedDate", "DESC"]],
      include: [{
        model:Sale,
        include: [{
          model:SaleDetail,
          include:[ProductMaster],
          nested: true

        }]
      },{
        model: ProductSubscription,
        include:[ProductMaster],
        nested: true
      }]
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
export const creditOrDebit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.CreatedGUID = req.body.user.UserGUID;

  const { type, amount, CreatedGUID } = req.body;
  if(!amount || amount <= 0 && isNaN(amount)){
    throw new Error("Invalid amount");
  }
  try {
    let transaction;
    if (new String(type).toUpperCase() === "CREDIT") {
      console.log("come here", CreatedGUID);
      transaction = await UserWallet.create({
        UserGUID: CreatedGUID,
        Credit: amount,
        Debit: 0,
        CreatedGUID: CreatedGUID,
        Status: "FULLFILLED",
        TransactionId:generateUniqueNumber(),
      });
    } else if (new String(type).toUpperCase() === "DEBIT") {
      return res.status(400).json({ message: "Debit through this API is restricted" });
      // const walletBalance = await UserWalletBalance.findOne({
      //   where: { UserGUID: CreatedGUID },
      // });
      // if (walletBalance && walletBalance.Balance < amount) {
      //   throw new Error("Insufficient balance");
      // } 

      //   transaction = await UserWallet.create({
      //     UserGUID: CreatedGUID,
      //     Credit: 0,
      //     Debit: amount,
      //     CreatedGUID: CreatedGUID,
      //     Status: "FULLFILLED",
      //   });

    } else {
      return res.status(400).json({ message: "Invalid request" });
    }

  

    res.json({
      message: "Transaction successful",
      transaction,
      balance: await UserWallet.findOne({
        where: { UserGUID: req.body.CreatedGUID },
        order: [["WalletGUID", "DESC"]],
      }).then((t) => t?.Balance),
    });
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const getWalletBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
      req.body.CreatedGUID = req.body.user.UserGUID;
        try {
            const balance = await UserWallet.findOne({
                where: { UserGUID: req.body.CreatedGUID },
                order: [["WalletGUID", "DESC"]],
                include: [{
                  model: User,
                  attributes: ['LoginName','UserGUID', 'FirstName', 'LastName', 'EmailAddress', 'MobileNo']
                }],
            });
      
           
            res.json([{balance: balance??{"Balance": 0,}}]);
        } catch (error) {
            next(error);
        }
    }
