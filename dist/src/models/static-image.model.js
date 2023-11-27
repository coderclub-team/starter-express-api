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
require("dotenv").config();
let StaticImageModel = class StaticImageModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], StaticImageModel.prototype, "StaticImageGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], StaticImageModel.prototype, "EntityName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        get() {
            const baseURL = process.env.STATIC_FILE_URL;
            const PhotoPath = this.getDataValue("PhotoPath");
            return PhotoPath ? `${baseURL}/${PhotoPath}` : "";
        },
    }),
    __metadata("design:type", String)
], StaticImageModel.prototype, "PhotoPath", void 0);
StaticImageModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_StaticImages",
        timestamps: false,
    })
], StaticImageModel);
exports.default = StaticImageModel;
