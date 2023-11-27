"use strict";
// -- PromotionGUID
// -- Name
// -- Description
// -- MinOrderQty
// -- MaxOrderQty
// -- MinOrderTotal
// -- PromoCode
// -- StartDate
// -- EndDate
// -- IsActive
// -- Type
// -- Value
// -- CreatedDate
// -- UpdatedDate
// -- Stock
// -- CurrentStock
// -- UsageLimit
// -- MaxOrderTotal
// -- DeletedDate
// --MinHistoryRows
// --MaxHistoryRows
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promotion = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Promotion = class Promotion extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "PromotionGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Promotion.prototype, "Name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Promotion.prototype, "Description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "MinOrderQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "MaxOrderQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "MinOrderTotal", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Promotion.prototype, "PromoCode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Promotion.prototype, "StartDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Promotion.prototype, "EndDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Promotion.prototype, "Status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Promotion.prototype, "Type", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "Value", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Promotion.prototype, "CreatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Promotion.prototype, "UpdatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "Stock", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "CurrentStock", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "UsageLimit", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "MaxOrderTotal", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Promotion.prototype, "DeletedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "MinHistoryRows", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Promotion.prototype, "MaxHistoryRows", void 0);
Promotion = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Promotions",
        timestamps: true,
        paranoid: true,
        createdAt: "CreatedDate",
        updatedAt: "UpdatedDate",
        deletedAt: "DeletedDate",
    })
], Promotion);
exports.Promotion = Promotion;
