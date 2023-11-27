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
let StoreMaster = class StoreMaster extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        autoIncrement: true,
        field: "StoreGUID",
    }),
    __metadata("design:type", Number)
], StoreMaster.prototype, "StoreGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "StoreID",
        unique: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "StoreID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "StoreName",
        allowNull: false,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "StoreName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "Phone",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "Phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "Email",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "Email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "Address",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "Address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "City",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "City", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "State",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "State", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "PinCode",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "PinCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "GSTNO",
        allowNull: true,
    }),
    __metadata("design:type", String)
], StoreMaster.prototype, "GSTNO", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "CreatedDate",
        allowNull: false,
    }),
    __metadata("design:type", Date)
], StoreMaster.prototype, "CreatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "ModifiedDate",
        allowNull: true,
    }),
    __metadata("design:type", Date)
], StoreMaster.prototype, "ModifiedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: "DeletedDate",
        allowNull: true,
    }),
    __metadata("design:type", Date)
], StoreMaster.prototype, "DeletedDate", void 0);
StoreMaster = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_StoreMaster",
        timestamps: true,
        createdAt: "CreatedDate",
        updatedAt: "ModifiedDate",
        deletedAt: "DeletedDate",
        paranoid: true,
    })
], StoreMaster);
exports.default = StoreMaster;
