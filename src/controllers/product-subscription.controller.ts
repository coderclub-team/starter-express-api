import { NextFunction, Request, Response } from "express";
import { generateUniqueNumber, omitUndefined } from "../functions";
import { MyWhereType } from "../..";
import ProductSubscription from "../models/product-subscription.model";
import BillingCycles from "../models/billing-cycle.model";
import { Op } from "sequelize";
import ProductMaster from "../models/product-master.model";
import { sequelize } from "../database";
import UserWallet from "../models/user-wallet.model";
import couponGuard from "../middlewares/coupon-gaurd.moddleware";
import Sale from "../models/sale.model";
import { Promotion } from "../models/promotion.model";

export const getUserSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.CreatedGUID = req.body.user.UserGUID;
  const where: MyWhereType = omitUndefined({
    userGUID: req.body.CreatedGUID,
    SubscriptionGUID: req.body.SubscriptionGUID,
  });

  try {
    const subscriptions = await ProductSubscription.findAll({
      where: where,
      include: [
        {
          model: ProductMaster,
        },
      ],
    });
    subscriptions.forEach((subscription) => {
      subscription?.Product?.setFullURL(req, "PhotoPath");
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

export const subscribeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.CreatedGUID = req.body.user.UserGUID;
  req.body.UserGUID = req.body.CreatedGUID;

  try {
    if (!req.body.ProductGUID) {
      throw Error("ProductGUID is required for subscription");
    } else if (!req.body.SubscriptionPrice) {
      throw Error("SubscriptionPrice is required for subscription");
    } else if (!req.body.SubscriptionStartDate) {
      throw Error("SubscriptionStartDate is required for subscription");
    } else if (!req.body.SubscriptionEndDate) {
      throw Error("SubscriptionEndDate is required for subscription");
    } else if (!req.body.SubscriptionOccurrences) {
      throw Error("SubscriptionOccurrences is required for subscription");
    } else if (!req.body.BillingCycleGUID) {
      throw Error("BillingCycleGUID is required for subscription");
    }

    function checkSufficientBalance(
      TotalAmount: number,
      WalletBalance: number
    ) {
      // return true or false
      return TotalAmount <= WalletBalance;
    }
    let sufficientBalance = checkSufficientBalance(
      req.body.SubscriptionPrice,
      req.body.WalletBalance
    );
   

    await sequelize.transaction(async (t) => {

      if (!sufficientBalance) {
        throw new Error(
          `Insufficient balance ${req.body.WalletBalance} in wallet`
        );
      }
      try {
        const billingcycle = await BillingCycles.findByPk(
          req.body.BillingCycleGUID,
          {
            transaction: t,
          }
        );
        if (!billingcycle) throw Error("Invalid billing cycle!");
        const cycle_name = billingcycle.getDataValue("BillingCycleName");
        switch (cycle_name) {
          case "Daily":
            {
            }
            break;
          case "Monthly":
            {
            }
            break;
        }
        const updatedWallet = await UserWallet.create({
          UserGUID: req.body.CreatedGUID,
          Debit: req.body.SubscriptionPrice,
          CreatedGUID: req.body.CreatedGUID,
          TransactionId:generateUniqueNumber()
        });
        const subscription = await ProductSubscription.create(
          {
            ...req.body,
            PaymentTransactionId: updatedWallet.getDataValue("WalletGUID"),
            PaymentMethod: "WALLET",
            WalletGUID: updatedWallet.getDataValue("WalletGUID"),
          },
          {
            transaction: t,
          }
        );
        await t.commit().then(() => {
          console.log("subscription", subscription.toJSON());
        return  res.status(200).send({
            message: "Subscription created successfully!",
            subscription: subscription.toJSON(),
            updatedWalletBalance:
              req.body.WalletBalance - updatedWallet.getDataValue("Debit"),
          });
        });
      } catch (error) {
      
        await t?.rollback();
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const calcelSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { SubscriptionGUID } = req.params;
  const { Status } = req.body;

  if (req.body.user) {
    req.body.CreatedGUID = req.body.user.UserGUID;
  } else {
    req.body.CreatedGUID = req.body.user.UserGUID;
  }
  req.body.UserGUID = req.body.CreatedGUID;

  if (!Status) {
    throw new Error("Status is required");
  }
  try {
    const productSubscription = await ProductSubscription.findByPk(
      SubscriptionGUID
    );
    if (!productSubscription) throw Error("Invalid subscription!");
    productSubscription.Status = Status;
    const subscription = await productSubscription.save();
    res.status(200).send({
      message: "Subscription updated successfully!",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const expireSubscription = async () => {
  try {
    const expiredSubscriptions = await ProductSubscription.findAll({
      where: {
        SubscriptionEndDate: {
          [Op.lt]: new Date(),
        },
        Status: {
          [Op.notIn]: ["EXPIRED", "CANCELLED"],
        },
      },
    });

    expiredSubscriptions.forEach(async (subscription) => {
      subscription.Status = "EXPIRED";
      const updatedSubscription = await subscription.save();
      console.log("expiry updated by a cron", updatedSubscription.toJSON());
    });
  } catch (error: any) {
    console.log("expireSubscription_Fn", error.message);
  }

  // Do something with the expired subscriptions
};
