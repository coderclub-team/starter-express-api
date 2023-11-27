"use strict";
// CREATE TABLE tbl_Shops (
//     GUID INT NOT NULL PRIMARY KEY  IDENTITY(1,1),
//     Name VARCHAR(255) NOT NULL,
//     Descriptions VARCHAR(255)  NULL,
//     Latitude DECIMAL(9,6) NULL,
//     Longitude DECIMAL(9,6) NULL,
//     Status INT NOT NULL DEFAULT 1,
//     CreatedDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
//     UpdatedDate DATETIME2  NULL,
//     DeletedDate DATETIME2  NULL
// )
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
let Shop = class Shop extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Shop.prototype, "GUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Shop.prototype, "Name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Shop.prototype, "Descriptions", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Shop.prototype, "Latitude", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Shop.prototype, "Longitude", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Shop.prototype, "Status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Shop.prototype, "CreatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Shop.prototype, "UpdatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Shop.prototype, "DeletedDate", void 0);
Shop = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Shops",
        timestamps: true,
        createdAt: "CreatedDate",
        updatedAt: "ModifiedDate",
        deletedAt: "DeletedDate",
        paranoid: true,
    })
], Shop);
exports.default = Shop;
