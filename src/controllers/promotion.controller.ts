import { NextFunction, Request, Response } from "express";
import { Promotion } from "../models/promotion.model";
import { Op } from "sequelize";

export const getAllPromotions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const promotions = await Promotion.findAll({
      where: {
        StartDate: {
          [Op.lte]: new Date(),
        },
        EndDate: {
          [Op.gte]: new Date(),
        },

        Stock: {
            [Op.gte]: 1,
        },
        CurrentStock: {
            [Op.gte]: 1,
        },
      },
    });

    res.json(promotions);
  } catch (error) {
    next(error);
  }
};

export const checkPromoCode = async ( req: Request, res: Response, next: NextFunction) =>{
    if(req.body.PromoCode===req.body.promotion.PromoCode) {
        res.status(200).json({
            message:"PromoCode is valid",
            PromotionGUID:req.body.PromotionGUID
        });
    }
    else{
        res.status(400).json({
            message:"PromoCode is invalid"
        });
    }
   
}
