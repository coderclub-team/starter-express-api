import { Request, Response } from "express";
import StoreMaster from "../models/store-master.model";
import User from "../models/user.model";
import ProductCategory from "../models/product-category.model";

export const getAllStoreMasters = async (req: Request, res: Response) => {
  try {
    const storeMasters = await StoreMaster.findAll({
      attributes: {
        exclude: ["CreatedByGUID", "ModifiedByGUID", "DeletedByGUID"],
      },
      include: [
        {
          model: ProductCategory,
          as: "ProductCategory",
        },
      ],
      raw: true,
      nest: true,
    });
    res.status(200).json({
      message: "Store Masters fetched successfully!",
      storeMasters,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getStoreMasterById = async (req: Request, res: Response) => {
  const { StoreGUID } = req.params;
  try {
    const storeMaster = await StoreMaster.findByPk(StoreGUID, {
      //   include: [
      //     {
      //       model: User,
      //       as: "CreatedBy",
      //       attributes: ["UserID", "UserName"],
      //     },
      //     {
      //       model: User,
      //       as: "ModifiedBy",
      //       attributes: ["UserID", "UserName"],
      //     },
      //     {
      //       model: User,
      //       as: "DeletedBy",
      //       attributes: ["UserID", "UserName"],
      //     },
      //   ],
      attributes: {
        exclude: ["CreatedByGUID", "ModifiedByGUID", "DeletedByGUID"],
      },
    });
    res.status(200).json({
      message: "Store Master fetched successfully!",
      storeMaster,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createStoreMaster = async (req: Request, res: Response) => {
  req.body.CreatedGUID = req.body.user.UserGUID;

  try {
    const storeMaster = await StoreMaster.create(req.body);
    res.status(201).json({
      message: "Store Master created successfully!",
      storeMaster,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateStoreMaster = async (req: Request, res: Response) => {
  req.body.ModifiedGUID = req.body.user.UserGUID;
  const { StoreGUID } = req.params;
  try {
    const store = await StoreMaster.findByPk(StoreGUID);
    if (store) {
      const storeMaster = await store.update(req.body);
      res.status(200).json({
        message: "Store Master updated successfully!",
        storeMaster,
      });
    } else {
      res.status(404).json({ message: "Store not found!" });
    }
  } catch (error: any) {
    console.log("storeMasterController.ts: error: ", error.message);
    res.status(500).json({ error });
  }
};

export const deleteStoreMaster = async (req: Request, res: Response) => {
  const { StoreGUID } = req.params;
  try {
    const store = await StoreMaster.findByPk(StoreGUID);
    if (store) {
      const storeMaster = await store.destroy();
      res.status(200).json({
        message: "Store Master deleted successfully!",
        storeMaster,
      });
    } else {
      res.status(404).json({ message: "Store not found!" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
