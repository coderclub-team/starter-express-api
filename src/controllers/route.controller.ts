import { NextFunction, Request, Response } from "express";
import { Route } from "../models/route.model";
import User from "../models/user.model";
import Subscription from "../models/product-subscription.model";
import SaleOrder from "../models/sale.model";
import SaleDetails from "../models/sale-detail.model";
import Sale from "../models/sale.model";

export const allRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const routes = await Route.findAll({
      paranoid: true,
      include: [
        {
          model: User,
          include: [
            Subscription,
            {
              model: Sale,
              include: [SaleDetails],
            },
          ],
        },
      ],
    });
    res.status(200).json(routes);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};
export const routeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { route_id } = req.params;
  try {
    const routes = await Route.findByPk(route_id, {
      include: [
        {
          model: User,
          include: [
            Subscription,
            {
              model: Sale,
              include: [SaleDetails],
            },
          ],
        },
      ],
    });
    res.status(200).json(routes);
  } catch (error) {
    next(error);
  }
};
