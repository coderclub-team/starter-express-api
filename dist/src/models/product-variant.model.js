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
exports.ProductVariant = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const product_master_model_1 = __importDefault(require("./product-master.model"));
let ProductVariant = class ProductVariant extends sequelize_typescript_1.Model {
    // Define the virtual field as a getter method that returns an object with the dimensions
    get dimensions() {
        return {
            width: this.Width,
            height: this.Height,
            length: this.Length,
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "ProductVariantGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "Unit_Price", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "MRP", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "GST", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "Qty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "UnitsInStock", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "IsActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductVariant.prototype, "SKU", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductVariant.prototype, "UOM", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "Weight", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "Length", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "Width", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "Height", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "SaleRate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_master_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "ProductMasterRefGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductVariant.prototype, "Size", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductVariant.prototype, "Color", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductVariant.prototype, "Flavour", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "Featured", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductVariant.prototype, "CreatedGUID", void 0);
ProductVariant = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_ProductVariant",
        timestamps: true,
        paranoid: false,
        createdAt: "CreatedDate",
        updatedAt: "ModifiedDate",
        deletedAt: "DeletedDate",
    })
], ProductVariant);
exports.ProductVariant = ProductVariant;
