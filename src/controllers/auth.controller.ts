import { NextFunction, Request, Response } from "express";
import Sale from "../models/sale.model";
import GlobalType from "../models/global-type.model";
import SaleDetail from "../models/sale-detail.model";
import { sequelize } from "../database";
import ProductMaster from "../models/product-master.model";
import { Promotion } from "../models/promotion.model";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const salemasters = await Sale.findAll({
    where: {
      CustomerGUID: req.body.user.UserGUID,
    },

    attributes: {
      exclude: ["CustomerGUID", "SaleTypeRef"],
    },

    include: [
      // {
      //   model: User,
      //   as: "Customer",
      // },
      {
        model: GlobalType,
        as: "SaleTypeRef",

        //  Sale type shoudl be astring value of arributes.GlobaleTypeName
        attributes: {
          include: ["GlobalTypeName"],
          exclude: ["GlobalTypeGUID"],
        },
      },
      {
        model: SaleDetail,
        all: true,
        include: [
          {
            model: ProductMaster,
          },
        ],
      },
      {
        model: Promotion,
      },
    ],
  });

  salemasters?.forEach((sale) => {
    sale?.SaleDetails?.forEach((saleDetail) => {
      saleDetail?.Product?.setFullURL(req, "PhotoPath");
    });

    if (sale.SaleTypeRef) {
      sale.setDataValue("SaleType", sale.SaleTypeRef.GlobalTypeName);
      sale.setDataValue("SaleTypeRef", undefined);
    }
  });

  res.json(salemasters);
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { SalesMasterGUID } = req.params;
  if (!SalesMasterGUID) {
    throw new Error("SalesMasterGUID is required");
  } else if (!req.body.Status) {
    throw new Error("Status is required");
  }
  const transaction = await sequelize.transaction();
  try {
    const sale = await Sale.findByPk(SalesMasterGUID, { transaction });
    if (!sale) {
      throw new Error("Sale not found!");
    }
    sale.Status = req.body.Status;
    const user = await sale.save({ transaction });
    transaction.commit();
    res.json({
      message: "Sale updated successfully!",
      user,
    });
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
