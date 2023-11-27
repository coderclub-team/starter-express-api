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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const product_master_model_1 = __importDefault(require("./product-master.model"));
// Path: src/models/ProductCategory.ts
let ProductCategory = class ProductCategory extends sequelize_typescript_1.Model {
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
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductCategory.prototype, "ProductCategoryGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductCategory.prototype, "ProductCategoryName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductCategory.prototype, "IsActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductCategory.prototype, "SortOrder", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductCategory.prototype, "PhotoPath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductCategory.prototype, "ProductCategoryDescription", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductCategory.prototype, "ProductCategorySlug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.VIRTUAL,
    }),
    __metadata("design:type", Array)
], ProductCategory.prototype, "products", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_master_model_1.default),
    __metadata("design:type", Array)
], ProductCategory.prototype, "Products", void 0);
ProductCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_ProductCategory",
        paranoid: false,
        timestamps: false,
    })
], ProductCategory);
exports.default = ProductCategory;
