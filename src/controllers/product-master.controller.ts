import { NextFunction, Request, Response } from "express";
import { productImageUploadOptions } from "../../config";
import ProductMaster from "../models/product-master.model";
import path from "node:path";
import { sequelize } from "../database";
import { ProductVariant } from "../models/product-variant.model";
import {
  Op,
  QueryTypes,
  Transaction,
} from "sequelize";
import ProductCategory from "../models/product-category.model";
import { omitUndefined } from "../functions";
import ProductReview from "../models/product-review.model";
import User from "../models/user.model";
import { MyWhereType } from "../..";
import ProductStockMaster from "../models/product-stock-master.model";

export const getAllProductMasters = async (req: Request, res: Response) => {
  let authuser;
  try {
    authuser = req.body.user;
  } catch (error) {}

  const {
    ProductGUID,
    ProductID,
    ProductName,
    ProductCode,
    ProductType,
    SKU,
    IsFeatured,
    NewArrival,
    ProductCategoryGUID

  } = req.query;

  const where: MyWhereType = omitUndefined({
    ProductGUID: ProductGUID,
    ProductID: ProductID,
    ProductName: ProductName,
    ProductCode:
      ProductCode !== undefined ? { [Op.like]: `%${ProductCode}%` } : undefined,
    ...(ProductType !== undefined && {
      ProductType: { [Op.like]: `%${ProductType}%` },
    }),
    SKU: SKU,
    IsFeatured: IsFeatured,
    ProductCategoryGUID: ProductCategoryGUID
  });

  try {
    var products = await ProductMaster.findAll({
      where,
      include: [
        {
          model: ProductCategory,
          attributes: {
            include: ["ProductCategoryName", "PhotoPath"],
          },
        },
        {
          model: ProductStockMaster,
          attributes: ["ProductGUID", "StoreGUID", "UnitsInStock"],
          nested: true,
          where: authuser
            ? {
                StoreGUID: authuser!.StoreGUID,
              }
            : undefined,
        },
      ],
      attributes: {
        exclude: ["UnitsInStock"],
      },
      nest: true,
      order: NewArrival ? [["CreatedDate", "DESC"]] : undefined,
    });

    const mappedProducts = await mapAllProducts(products, req);
    res.status(200).json(mappedProducts);
  } catch (error: any) {
    console.log("---error", error.message);
    res.status(500).json(error);
  }
};

export const getProductMasterById = async (req: Request, res: Response) => {
  const { ProductGUID } = req.params;
  let authuser;
  try {
    authuser = req.body.user;
  } catch (error) {}

  try {
    var products = await ProductMaster.findAll({
      where: {
        ProductGUID: {
          [Op.eq]: ProductGUID,
        },
      },
      include: [
        {
          model: ProductCategory,
          attributes: {
            include: ["ProductCategoryName", "PhotoPath"],
          },
        },
        {
          model: ProductStockMaster,
          attributes: ["ProductGUID", "StoreGUID", "UnitsInStock"],
          nested: true,
          where: authuser
            ? {
                StoreGUID: authuser!.StoreGUID,
              }
            : undefined,
        },{
          model:ProductReview,
          include:[User]
        }
      ],
      attributes: {
        exclude: ["UnitsInStock"],
      },
      nest: true,
    });

    const mappedProducts = await mapAllProducts(products, req);
    res.status(200).json(mappedProducts);
  } catch (error: any) {
    console.log("---error", error.message);
    res.status(500).json(error);
  }
};

export const createProductMaster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.ProductType) {
    res.status(400).json({
      message: "Product type is required!",
    });
  } else if (
    req.body.ProductType.toString().toLocaleUpperCase() === "SIMPLE" &&
    req.body.variants.length > 1
  ) {
    res.status(400).json({
      message: "Product type is simple, More than one variant not allowed!",
    });
  }
  req.body.CreatedGUID = req.body.user.UserGUID;
  console.log("req.body", req.body);
  const {
    ProductName,
    ProductCode,
    ProductType,
    PhotoPath,
    GalleryPhotoPath1,
    GalleryPhotoPath2,
    GalleryPhotoPath3,
    GalleryPhotoPath4,
    variants,
  } = req.body;
  let t: Transaction | undefined = undefined;
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
    } else {
      Object.entries(req.files).forEach(([key, value]) => {
        console.log(key, value);
        req.body[key] = path.join(
          productImageUploadOptions.directory,
          value[0].filename
        );
      });
    }

    t = await sequelize.transaction();

    if (req.body.ProductType.toString().toLocaleUpperCase() === "SIMPLE") {
      const product = await ProductMaster.create(
        {
          ProductName,
          ProductCode,
          ProductType,
          PhotoPath,
          GalleryPhotoPath1,
          GalleryPhotoPath2,
          GalleryPhotoPath3,
          GalleryPhotoPath4,
          CreatedGUID: req.body.CreatedGUID,
        },
        {
          transaction: t,
        }
      );
      let createdVariants = await ProductVariant.bulkCreate(
        variants.map((variant: any) => ({
          ...variant,
          ProductMasterRefGUID: product.ProductGUID,
          CreatedGUID: req.body.CreatedGUID,
        })),
        {
          transaction: t,
        }
      );

      await t.commit();

      res.status(201).json({
        message: "Product master created successfully!",
        product: {
          ...product.toJSON(),
          variants: createdVariants,
        },
      });
    } else if (
      req.body.ProductType.toString().toLocaleUpperCase() === "VARIABLE"
    ) {
      variants.forEach((variant: any) => {
        // check if the variant has a Size or Color or Flavour otherwise throw error
        if (!variant.Size && !variant.Color && !variant.Flavour) {
          throw new Error(
            "Size or Color or Flavour is required for each variant!"
          );
        }
      });

      const product = await ProductMaster.create(req.body);
      const objects = [];

      if (Array.isArray(req.body.ProductCategoryRefGUID)) {
        let objs = req.body.ProductCategoryRefGUID.map((category: any) => ({
          ProductCategoryRefGUID: +category,
          ProductRefGUID: product.ProductGUID,
        }));
        console.log("objects", objs);
        objects.push(...objs);
      } else if (
        req.body.ProductCategoryRefGUID &&
        !isNaN(req.body.ProductCategoryRefGUID)
      ) {
        objects.push({
          ProductCategoryRefGUID: req.body.ProductCategoryRefGUID,
          ProductRefGUID: product.ProductGUID,
        });
      } else {
        objects.push({
          ProductCategoryRefGUID: 1,
          ProductRefGUID: product.ProductGUID,
        });
      }

      await t.commit().catch((error) => {
        console.error("Error occurred while committing transaction:", error);
        t?.rollback();
      });

      res.status(201).json({
        message: "Product master created successfully!",
        product: {
          ...product.toJSON(),
        },
      });
    }
  } catch (error: any) {
    next(error);
  } finally {
  }
};
export const updateProductMaster = async (req: Request, res: Response) => {
  const { ProductMasterGUID } = req.params;
  req.body.ModifiedGUID = req.body.user.UserGUID;
  try {
    const productMaster = await ProductMaster.findByPk(ProductMasterGUID);
    if (!productMaster) {
      return res.status(400).json({
        message: "Product master not found!",
      });
    }
    await productMaster.update(req.body);
    res.send({
      message: "Product master updated successfully!",
      productMaster,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const deleteProductMaster = async (req: Request, res: Response) => {
  req.body.DeletedGUID = req.body.user.UserGUID;
  const { ProductMasterGUID } = req.params;
  try {
    const productMaster = await ProductMaster.findByPk(ProductMasterGUID);
    if (!productMaster) {
      return res.status(400).json({
        message: "Product master not found!!",
      });
    }
    await ProductMaster.destroy({
      where: {
        ProductMasterGUID,
      },
    });
    res.send({
      message: "Product master deleted successfully!",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const createAttribute = async (req: Request, res: Response) => {
  // get productGUID from params
  const { productGUID } = req.params;
  try {
    res.status(201).json({
      message: "Attribute created successfully!",
      // attribute
      // ProductMasterGUID: productGUID,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

async function mapAllProducts(products: ProductMaster[], req: Request) {
  const options = await getProductOptions();
  const host = req.protocol + "://" + req.get("host");

  products.forEach((product: ProductMaster) => {
    product.setFullURL(req,"PhotoPath");
    product?.ProductCategory?.setFullURL(req,"PhotoPath")
    // adding attributes to product
    const found = options.find((o) => o.ProductName === product.ProductName);
    if (found) {
      product.attributes = [
        {
          name: "Qty",
          options: found.options.replace(/\s/g, "").split(","),
          variation: true,
          visible: true,
        },
      ];
    }
    // adding categories to product

    if (product.ProductCategory)
      product.Categories = [
        {
          name: product.ProductCategory.ProductCategoryName,
        },
      ];
    const images = [];
    for (let i = 1; i <= 4; i++) {
      const imageKey = `GalleryPhotoPath${i}`;
      const imagePath = product[imageKey as keyof ProductMaster];

      if (imagePath) {
        const imageFullPath = new URL(path.join(host, imagePath)).toString();

        if (imagePath) {
          images.push({
            id: i,
            src: imageFullPath,
            name: path.basename(imagePath),
            alt: path.basename(imagePath),
          });
        }
      }
    }

    product.setDataValue("GalleryPhotoPath1", undefined);
    product.setDataValue("GalleryPhotoPath2", undefined);
    product.setDataValue("GalleryPhotoPath3", undefined);
    product.setDataValue("GalleryPhotoPath4", undefined);
    product.setDataValue("Images", images);
  });

  products.forEach((p) => {
    p.attributes = p.attributes.reduce((acc: any, curr: any) => {
      const matchingAttribute = acc.find((a: any) => a.name === curr.name);
      if (matchingAttribute) {
        matchingAttribute.options.push(curr.options[0]);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    p.Dimensions = {
      height: p.Height || 0,
      width: p.Width || 0,
      length: p.Length || 0,
    };
    delete p.Height;
    delete p.Width;
    delete p.Length;
  });
  return products;
}

function getProductOptions(): Promise<
  {
    ProductName: string;
    options: string;
  }[]
> {
  const query = `
SELECT  ProductName, 
STUFF((SELECT ', ' + CONCAT(SKU,UOM)
FROM tbl_ProductMaster as p2
WHERE p1.ProductName = p2.ProductName
FOR XML PATH('')), 1, 2, '') AS options
from tbl_ProductMaster as p1 GROUP by ProductName
`;
  return sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
}


export const createProductReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productGUID } = req.params;
  req.body.ProductGUID = productGUID;
  req.body.CreatedUserGUID = req.body.user.UserGUID;

  delete req.body.user;

  try {
    if (req.body.ReviewGUID) {
      let review = await ProductReview.findByPk(req.body.ReviewGUID);
      if (!review) {
        throw Error("Inavlid ProductGUID!");
      }
      let updatedReview = await review?.update(req.body);
      return res.send({
        message: "Product review updated successfully!",
        review: updatedReview,
      });
    } else {
      delete req.body.ReviewGUID;
      const review = await ProductReview.create(req.body);
      res.send({
        message: `Product Review created successfully!`,
        review,
      });
    }
  } catch (error) {
    next(error);
  }
};
