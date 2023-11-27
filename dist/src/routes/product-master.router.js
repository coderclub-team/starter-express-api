"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// router for product Product master
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../../config");
const product_master_controller_1 = require("../controllers/product-master.controller");
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const auth_gaurd_middleware_1 = __importDefault(require("../middlewares/auth-gaurd.middleware"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: config_1.productImageUploadOptions.storage,
    limits: config_1.productImageUploadOptions.limits,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});
router.get("/", product_master_controller_1.getAllProductMasters);
router.get("/:ProductGUID", product_master_controller_1.getProductMasterById);
// router.get("/searchproduct", getProductByQuery);
router.post("/", upload.fields([
    { name: "PhotoPath", maxCount: 1 },
    {
        name: "GalleryPhotoPath1",
        maxCount: 1,
    },
    { name: "GalleryPhotoPath2", maxCount: 1 },
    { name: "GalleryPhotoPath3", maxCount: 1 },
    { name: "GalleryPhotoPath4", maxCount: 1 },
]), product_master_controller_1.createProductMaster, handle_sequelize_error_middleware_1.default);
router.put("/:ProductMasterGUID", product_master_controller_1.updateProductMaster, handle_sequelize_error_middleware_1.default);
router.delete("/:ProductMasterGUID", product_master_controller_1.deleteProductMaster, handle_sequelize_error_middleware_1.default);
// attributes
router.post("/:productGUID/attributes", product_master_controller_1.createAttribute);
// router.get("/:productGUID/reviews", getProductReviews);
router.post("/:productGUID/reviews", auth_gaurd_middleware_1.default, product_master_controller_1.createProductReview, handle_sequelize_error_middleware_1.default);
exports.default = router;
