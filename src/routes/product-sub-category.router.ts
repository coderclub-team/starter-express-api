// router for product sub category
import express from "express";
import {
  createProductSubCategory,
  deleteProductSubCategory,
  getAllProductSubCategories,
  getProductSubCategoryById,
  updateProductSubCategory,
} from "../controllers/product-sub-category.controller";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
const router = express.Router();
router.get("/", getAllProductSubCategories, handleSequelizeError);
router.get(
  "/:ProductSubCategoryGUID",
  getProductSubCategoryById,
  handleSequelizeError
);
router.post("/", createProductSubCategory, handleSequelizeError);
router.put(
  "/:ProductSubCategoryGUID",
  updateProductSubCategory,
  handleSequelizeError
);
router.delete(
  "/:ProductSubCategoryGUID",
  deleteProductSubCategory,
  handleSequelizeError
);

export default router;
