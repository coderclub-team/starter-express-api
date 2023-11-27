"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const sequelize_typescript_1 = require("sequelize-typescript");
const product_category_model_1 = __importDefault(require("./product-category.model"));
const product_sub_category_model_1 = __importDefault(require("./product-sub-category.model"));
const product_review_model_1 = __importDefault(require("./product-review.model"));
const product_stock_master_model_1 = __importDefault(require("./product-stock-master.model"));
let ProductMaster = class ProductMaster extends sequelize_typescript_1.Model {
    static generateProductGUID(instance) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const nextGUID = ((yield this.max("ProductGUID")) || 0) + 1;
            const productCategory = yield product_category_model_1.default.findByPk(instance.ProductCategoryGUID);
            const productSubCategory = yield product_sub_category_model_1.default.findByPk(instance.ProductSubCategoryGUID);
            if (!productCategory || !productSubCategory)
                return (instance.ProductID =
                    "ABC-XYZ-" + nextGUID.toString().padStart(4, "0"));
            const PRO = (_a = productCategory === null || productCategory === void 0 ? void 0 : productCategory.ProductCategoryName.substring(0, 3)) === null || _a === void 0 ? void 0 : _a.toUpperCase();
            const SUB = (_b = productSubCategory === null || productSubCategory === void 0 ? void 0 : productSubCategory.ProductSubCategoryName.substring(0, 3)) === null || _b === void 0 ? void 0 : _b.toUpperCase();
            instance.ProductID =
                PRO + "-" + SUB + "-" + nextGUID.toString().padStart(4, "0");
            instance.ProductID =
                "CAT" + "-" + "SUB" + "-" + nextGUID.toString().padStart(4, "0");
            instance.ProductCode = instance.ProductID;
        });
    }
    // Getter method to return an array of image URLs
    get images() {
        const images = [
            this.getDataValue("GalleryPhotoPath1"),
            this.getDataValue("GalleryPhotoPath2"),
            this.getDataValue("GalleryPhotoPath3"),
            this.getDataValue("GalleryPhotoPath4"),
        ];
        // Remove any null or undefined values
        return images.filter((image) => image);
    }
    setFullURL(request, key) {
        const hostname = request.protocol + "://" + request.get("host");
        const originalPath = this.getDataValue(key) || "identities/product-identity.png";
        if (!originalPath)
            return;
        const fullPath = `${hostname}/${originalPath}`;
        this.setDataValue(key, fullPath);
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "ProductGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_review_model_1.default),
    __metadata("design:type", product_review_model_1.default)
], ProductMaster.prototype, "Reviews", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProductMaster.prototype, "ProductID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProductMaster.prototype, "ProductName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProductMaster.prototype, "ProductCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        field: "Unit_Price",
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "UnitPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        field: "Sale_Rate",
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "SaleRate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "MRP", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "GST", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "Qty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "UnitsInStock", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TINYINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProductMaster.prototype, "IsActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ProductMaster.prototype, "CreatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ProductMaster.prototype, "SKU", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "UOM", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "UOMTypeGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "PhotoPath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "ProductType", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "GalleryPhotoPath1", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "GalleryPhotoPath2", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "GalleryPhotoPath3", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "GalleryPhotoPath4", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "ProductDescription", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "IsFeatured", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "OnSale", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "Width", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "Height", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "Length", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "Weight", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductMaster.prototype, "ProductSlug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_category_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductMaster.prototype, "ProductCategoryGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_category_model_1.default),
    __metadata("design:type", product_category_model_1.default)
], ProductMaster.prototype, "ProductCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_sub_category_model_1.default),
    __metadata("design:type", Number)
], ProductMaster.prototype, "ProductSubCategoryGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
    }),
    __metadata("design:type", Array)
], ProductMaster.prototype, "attributes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
    }),
    __metadata("design:type", Object)
], ProductMaster.prototype, "Dimensions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => product_stock_master_model_1.default),
    __metadata("design:type", product_stock_master_model_1.default)
], ProductMaster.prototype, "Stock", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
    }),
    __metadata("design:type", Array)
], ProductMaster.prototype, "Categories", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductMaster]),
    __metadata("design:returntype", Promise)
], ProductMaster, "generateProductGUID", null);
ProductMaster = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_ProductMaster",
        timestamps: true,
        paranoid: false,
        createdAt: "CreatedDate",
        updatedAt: "UpdatedAt",
        // deletedAt: "DeletedDate",
    })
], ProductMaster);
exports.default = ProductMaster;
