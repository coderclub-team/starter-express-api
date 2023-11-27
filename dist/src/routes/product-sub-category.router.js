"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// router for product sub category
const express_1 = __importDefault(require("express"));
const product_sub_category_controller_1 = require("../controllers/product-sub-category.controller");
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const router = express_1.default.Router();
router.get("/", product_sub_category_controller_1.getAllProductSubCategories, handle_sequelize_error_middleware_1.default);
router.get("/:ProductSubCategoryGUID", product_sub_category_controller_1.getProductSubCategoryById, handle_sequelize_error_middleware_1.default);
router.post("/", product_sub_category_controller_1.createProductSubCategory, handle_sequelize_error_middleware_1.default);
router.put("/:ProductSubCategoryGUID", product_sub_category_controller_1.updateProductSubCategory, handle_sequelize_error_middleware_1.default);
router.delete("/:ProductSubCategoryGUID", product_sub_category_controller_1.deleteProductSubCategory, handle_sequelize_error_middleware_1.default);
exports.default = router;
