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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let Customer = class Customer extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Customer.prototype, "CustomerGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "CustomerID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "CustomerName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "Description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "Address", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "City", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "State", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "MobileNo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "EmailID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "ShopID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "CreatedGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Customer.prototype, "CreatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "GSTNo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "CustomerTypeGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "LineCode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Customer.prototype, "ActiveFrom", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Customer.prototype, "ActiveTo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "AppSubscriptionStatus", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Customer.prototype, "IsActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "CustomerType", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Customer.prototype, "SaleRateGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Customer.prototype, "UpdatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Customer.prototype, "DeletedDate", void 0);
Customer = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Customer",
        timestamps: true,
        createdAt: "CreatedDate",
        updatedAt: "UpdatedDate",
        deletedAt: "DeletedDate",
        paranoid: true,
    })
], Customer);
exports.default = Customer;
