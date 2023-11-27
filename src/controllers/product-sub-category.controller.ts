import { NextFunction, Request, Response } from "express";
import ProductSubCategory from "../models/product-sub-category.model";
import ProductCategory from "../models/product-category.model";

export const getAllProductSubCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const productSubCategories = await ProductSubCategory.findAll({
      // ProductCategory refe
      include: {
        model: ProductCategory,
        attributes: ["ProductCategoryName"],
      },
    });

    res.status(200).json(productSubCategories);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getProductSubCategoryById = async (
  req: Request,
  res: Response
) => {
  const { ProductSubCategoryGUID } = req.params;

  try {
    const productSubCategory = await ProductSubCategory.findByPk(
      ProductSubCategoryGUID,
      {
        include: {
          model: ProductCategory,
          attributes: ["ProductCategoryName"],
        },
      }
    );

    if (!productSubCategory) {
      return res.status(400).json({
        message: "Product sub category not found!",
      });
    }

    res.send({
      message: "Product sub category fetched successfully!",
      productSubCategory,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createProductSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  req.body.CreatedGUID = req.body.user.UserGUID;

  try {
    // Check if the ProductCategoryGUID value exists in the ProductCategory table
    const category = await ProductCategory.findByPk(
      req.body.ProductCategoryGUID
    );
    // if (!category) {
    //   throw new ProductCategoryNotFoundException("Product category not found!");
    // }

    const productSubCategory = await ProductSubCategory.create(req.body);

    res.status(201).json({
      message: "Product sub category created successfully!",
      productSubCategory,
    });
  } catch (error: any) {
    console.log("error", error.message);
    next(error);
  }
};

export const updateProductSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.ModifiedGUID = req.body.user.UserGUID;
  const { ProductSubCategoryGUID } = req.params;

  try {
    const productSubCategory = await ProductSubCategory.findByPk(
      ProductSubCategoryGUID
    );

    if (!productSubCategory) {
      return res.status(400).json({
        message: "Product sub category not found!",
      });
    }

    productSubCategory!.set({
      ProductSubCategoryName: req.body.ProductSubCategoryName,
      ProductCategoryGUID: req.body.ProductCategoryGUID,
    });
    await productSubCategory.save({
      fields: ["ProductSubCategoryName", "ProductCategoryGUID"],
    });

    res.status(200).json({
      message: "Product sub category updated successfully!",
      productSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductSubCategory = async (req: Request, res: Response) => {
  const { ProductSubCategoryGUID } = req.params;

  try {
    const productSubCategory = await ProductSubCategory.findByPk(
      ProductSubCategoryGUID
    );

    if (!productSubCategory) {
      return res.status(400).json({
        message: "Product sub category not found!",
      });
    }

    productSubCategory.destroy();

    res.status(200).json({
      message: "Product sub category deleted successfully!",
      productSubCategory,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
