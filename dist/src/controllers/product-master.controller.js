"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductReview = exports.createAttribute = exports.deleteProductMaster = exports.updateProductMaster = exports.createProductMaster = exports.getProductMasterById = exports.getAllProductMasters = void 0;
const config_1 = require("../../config");
const product_master_model_1 = __importDefault(require("../models/product-master.model"));
const node_path_1 = __importDefault(require("node:path"));
const database_1 = require("../database");
const product_variant_model_1 = require("../models/product-variant.model");
const sequelize_1 = require("sequelize");
const product_category_model_1 = __importDefault(require("../models/product-category.model"));
const functions_1 = require("../functions");
const product_review_model_1 = __importDefault(require("../models/product-review.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const product_stock_master_model_1 = __importDefault(require("../models/product-stock-master.model"));
const getAllProductMasters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let authuser;
    try {
        authuser = req.body.user;
    }
    catch (error) { }
    const { ProductGUID, ProductID, ProductName, ProductCode, ProductType, SKU, IsFeatured, NewArrival, ProductCategoryGUID } = req.query;
    const where = (0, functions_1.omitUndefined)(Object.assign(Object.assign({ ProductGUID: ProductGUID, ProductID: ProductID, ProductName: ProductName, ProductCode: ProductCode !== undefined ? { [sequelize_1.Op.like]: `%${ProductCode}%` } : undefined }, (ProductType !== undefined && {
        ProductType: { [sequelize_1.Op.like]: `%${ProductType}%` },
    })), { SKU: SKU, IsFeatured: IsFeatured, ProductCategoryGUID: ProductCategoryGUID }));
    try {
        var products = yield product_master_model_1.default.findAll({
            where,
            include: [
                {
                    model: product_category_model_1.default,
                    attributes: {
                        include: ["ProductCategoryName", "PhotoPath"],
                    },
                },
                {
                    model: product_stock_master_model_1.default,
                    attributes: ["ProductGUID", "StoreGUID", "UnitsInStock"],
                    nested: true,
                    where: authuser
                        ? {
                            StoreGUID: authuser.StoreGUID,
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
        const mappedProducts = yield mapAllProducts(products, req);
        res.status(200).json(mappedProducts);
    }
    catch (error) {
        console.log("---error", error.message);
        res.status(500).json(error);
    }
});
exports.getAllProductMasters = getAllProductMasters;
const getProductMasterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductGUID } = req.params;
    let authuser;
    try {
        authuser = req.body.user;
    }
    catch (error) { }
    try {
        var products = yield product_master_model_1.default.findAll({
            where: {
                ProductGUID: {
                    [sequelize_1.Op.eq]: ProductGUID,
                },
            },
            include: [
                {
                    model: product_category_model_1.default,
                    attributes: {
                        include: ["ProductCategoryName", "PhotoPath"],
                    },
                },
                {
                    model: product_stock_master_model_1.default,
                    attributes: ["ProductGUID", "StoreGUID", "UnitsInStock"],
                    nested: true,
                    where: authuser
                        ? {
                            StoreGUID: authuser.StoreGUID,
                        }
                        : undefined,
                }, {
                    model: product_review_model_1.default,
                    include: [user_model_1.default]
                }
            ],
            attributes: {
                exclude: ["UnitsInStock"],
            },
            nest: true,
        });
        const mappedProducts = yield mapAllProducts(products, req);
        res.status(200).json(mappedProducts);
    }
    catch (error) {
        console.log("---error", error.message);
        res.status(500).json(error);
    }
});
exports.getProductMasterById = getProductMasterById;
const createProductMaster = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.ProductType) {
        res.status(400).json({
            message: "Product type is required!",
        });
    }
    else if (req.body.ProductType.toString().toLocaleUpperCase() === "SIMPLE" &&
        req.body.variants.length > 1) {
        res.status(400).json({
            message: "Product type is simple, More than one variant not allowed!",
        });
    }
    req.body.CreatedGUID = req.body.user.UserGUID;
    console.log("req.body", req.body);
    const { ProductName, ProductCode, ProductType, PhotoPath, GalleryPhotoPath1, GalleryPhotoPath2, GalleryPhotoPath3, GalleryPhotoPath4, variants, } = req.body;
    let t = undefined;
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No files were uploaded.");
        }
        else {
            Object.entries(req.files).forEach(([key, value]) => {
                console.log(key, value);
                req.body[key] = node_path_1.default.join(config_1.productImageUploadOptions.directory, value[0].filename);
            });
        }
        t = yield database_1.sequelize.transaction();
        if (req.body.ProductType.toString().toLocaleUpperCase() === "SIMPLE") {
            const product = yield product_master_model_1.default.create({
                ProductName,
                ProductCode,
                ProductType,
                PhotoPath,
                GalleryPhotoPath1,
                GalleryPhotoPath2,
                GalleryPhotoPath3,
                GalleryPhotoPath4,
                CreatedGUID: req.body.CreatedGUID,
            }, {
                transaction: t,
            });
            let createdVariants = yield product_variant_model_1.ProductVariant.bulkCreate(variants.map((variant) => (Object.assign(Object.assign({}, variant), { ProductMasterRefGUID: product.ProductGUID, CreatedGUID: req.body.CreatedGUID }))), {
                transaction: t,
            });
            yield t.commit();
            res.status(201).json({
                message: "Product master created successfully!",
                product: Object.assign(Object.assign({}, product.toJSON()), { variants: createdVariants }),
            });
        }
        else if (req.body.ProductType.toString().toLocaleUpperCase() === "VARIABLE") {
            variants.forEach((variant) => {
                // check if the variant has a Size or Color or Flavour otherwise throw error
                if (!variant.Size && !variant.Color && !variant.Flavour) {
                    throw new Error("Size or Color or Flavour is required for each variant!");
                }
            });
            const product = yield product_master_model_1.default.create(req.body);
            const objects = [];
            if (Array.isArray(req.body.ProductCategoryRefGUID)) {
                let objs = req.body.ProductCategoryRefGUID.map((category) => ({
                    ProductCategoryRefGUID: +category,
                    ProductRefGUID: product.ProductGUID,
                }));
                console.log("objects", objs);
                objects.push(...objs);
            }
            else if (req.body.ProductCategoryRefGUID &&
                !isNaN(req.body.ProductCategoryRefGUID)) {
                objects.push({
                    ProductCategoryRefGUID: req.body.ProductCategoryRefGUID,
                    ProductRefGUID: product.ProductGUID,
                });
            }
            else {
                objects.push({
                    ProductCategoryRefGUID: 1,
                    ProductRefGUID: product.ProductGUID,
                });
            }
            yield t.commit().catch((error) => {
                console.error("Error occurred while committing transaction:", error);
                t === null || t === void 0 ? void 0 : t.rollback();
            });
            res.status(201).json({
                message: "Product master created successfully!",
                product: Object.assign({}, product.toJSON()),
            });
        }
    }
    catch (error) {
        next(error);
    }
    finally {
    }
});
exports.createProductMaster = createProductMaster;
const updateProductMaster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductMasterGUID } = req.params;
    req.body.ModifiedGUID = req.body.user.UserGUID;
    try {
        const productMaster = yield product_master_model_1.default.findByPk(ProductMasterGUID);
        if (!productMaster) {
            return res.status(400).json({
                message: "Product master not found!",
            });
        }
        yield productMaster.update(req.body);
        res.send({
            message: "Product master updated successfully!",
            productMaster,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updateProductMaster = updateProductMaster;
const deleteProductMaster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.DeletedGUID = req.body.user.UserGUID;
    const { ProductMasterGUID } = req.params;
    try {
        const productMaster = yield product_master_model_1.default.findByPk(ProductMasterGUID);
        if (!productMaster) {
            return res.status(400).json({
                message: "Product master not found!!",
            });
        }
        yield product_master_model_1.default.destroy({
            where: {
                ProductMasterGUID,
            },
        });
        res.send({
            message: "Product master deleted successfully!",
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.deleteProductMaster = deleteProductMaster;
const createAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get productGUID from params
    const { productGUID } = req.params;
    try {
        res.status(201).json({
            message: "Attribute created successfully!",
            // attribute
            // ProductMasterGUID: productGUID,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.createAttribute = createAttribute;
function mapAllProducts(products, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = yield getProductOptions();
        const host = req.protocol + "://" + req.get("host");
        products.forEach((product) => {
            var _a;
            product.setFullURL(req, "PhotoPath");
            (_a = product === null || product === void 0 ? void 0 : product.ProductCategory) === null || _a === void 0 ? void 0 : _a.setFullURL(req, "PhotoPath");
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
                const imagePath = product[imageKey];
                if (imagePath) {
                    const imageFullPath = new URL(node_path_1.default.join(host, imagePath)).toString();
                    if (imagePath) {
                        images.push({
                            id: i,
                            src: imageFullPath,
                            name: node_path_1.default.basename(imagePath),
                            alt: node_path_1.default.basename(imagePath),
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
            p.attributes = p.attributes.reduce((acc, curr) => {
                const matchingAttribute = acc.find((a) => a.name === curr.name);
                if (matchingAttribute) {
                    matchingAttribute.options.push(curr.options[0]);
                }
                else {
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
    });
}
function getProductOptions() {
    const query = `
SELECT  ProductName, 
STUFF((SELECT ', ' + CONCAT(SKU,UOM)
FROM tbl_ProductMaster as p2
WHERE p1.ProductName = p2.ProductName
FOR XML PATH('')), 1, 2, '') AS options
from tbl_ProductMaster as p1 GROUP by ProductName
`;
    return database_1.sequelize.query(query, {
        type: sequelize_1.QueryTypes.SELECT,
    });
}
const createProductReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productGUID } = req.params;
    req.body.ProductGUID = productGUID;
    req.body.CreatedUserGUID = req.body.user.UserGUID;
    delete req.body.user;
    try {
        if (req.body.ReviewGUID) {
            let review = yield product_review_model_1.default.findByPk(req.body.ReviewGUID);
            if (!review) {
                throw Error("Inavlid ProductGUID!");
            }
            let updatedReview = yield (review === null || review === void 0 ? void 0 : review.update(req.body));
            return res.send({
                message: "Product review updated successfully!",
                review: updatedReview,
            });
        }
        else {
            delete req.body.ReviewGUID;
            const review = yield product_review_model_1.default.create(req.body);
            res.send({
                message: `Product Review created successfully!`,
                review,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createProductReview = createProductReview;
