import { NextFunction, Request, Response } from "express";
import ProductSubscription from "../models/product-subscription.model";
import { Op } from "sequelize";
import User from "../models/user.model";
import Message from "../entities/message.class";

export const expiryAlertMessage = async () => {
  try {
    const expiredSubscriptions = await ProductSubscription.findAll({
      where: {
        SubscriptionEndDate: {
          [Op.lte]: new Date(),
        },
        Status: {
            [Op.notIn]: ["INACTIVE","CANCELLED","EXPIRED","PENDING","SUSPENDED",],
        },
      },
      include: [
        {
          model: User,
        },
      ],
    });

    const bulkMessage=expiredSubscriptions.map(async (subscription) => {
       if( subscription.User.Status==1 && subscription.User.MobileNo==="9944781003"){
        return  Message.sendCardExpiryAlertMessage({
            CustomerName:subscription.User?.FirstName,
            DigitalCard:subscription.User?.DigitalCard!,
            ExpiresDate:subscription.SubscriptionEndDate,
            PlanLink:"https://tamil-milk.com",
            MobileNo:subscription.User?.MobileNo
        })
       }
       
    })
   return Promise.all(bulkMessage)


  } catch (error) {
    console.log(error);
  }
};
export const lowBalanceAlertMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
