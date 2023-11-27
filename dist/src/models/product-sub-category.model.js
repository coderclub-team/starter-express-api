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
const sequelize_typescript_1 = require("sequelize-typescript");
const product_category_model_1 = __importDefault(require("./product-category.model"));
let ProductSubCategory = class ProductSubCategory extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "ProductSubCategoryGUID",
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], ProductSubCategory.prototype, "ProductSubCategoryGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_category_model_1.default, {
        foreignKey: "ProductCategoryGUID",
        targetKey: "ProductCategoryGUID",
        as: "Parent",
    }),
    (0, sequelize_typescript_1.Column)({
        field: "ProductCategoryGUID",
        allowNull: false,
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "Product Category GUID",
    }),
    __metadata("design:type", Number)
], ProductSubCategory.prototype, "ProductCategoryGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "ProductSubCategoryName",
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "Product Sub Category Name",
        unique: true,
    }),
    __metadata("design:type", String)
], ProductSubCategory.prototype, "ProductSubCategoryName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "IsActive",
        allowNull: false,
        type: sequelize_typescript_1.DataType.BOOLEAN,
        comment: "Is Active",
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], ProductSubCategory.prototype, "IsActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "CreatedDate",
        allowNull: false,
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ProductSubCategory.prototype, "CreatedDate", void 0);
ProductSubCategory = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_ProductSubCategory",
        timestamps: false,
        paranoid: false,
    })
], ProductSubCategory);
exports.default = ProductSubCategory;
