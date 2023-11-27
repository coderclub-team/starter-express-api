"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// a route for products
const express_1 = __importDefault(require("express"));
const product_category_controller_1 = require("../controllers/product-category.controller");
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const router = express_1.default.Router();
exports.default = router;
router.get("/", product_category_controller_1.getAllProductCategories);
router.get("/:ProductCategoryGUID", product_category_controller_1.getProductCategoryById);
router.post("/", product_category_controller_1.createProductCategory, handle_sequelize_error_middleware_1.default);
router.delete("/:ProductCategoryGUID", product_category_controller_1.deleteProductCategory);
