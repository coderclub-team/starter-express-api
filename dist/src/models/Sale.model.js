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
const global_type_model_1 = __importDefault(require("./global-type.model"));
const database_1 = require("../database");
const user_model_1 = __importDefault(require("./user.model"));
const sale_detail_model_1 = __importDefault(require("./sale-detail.model"));
const promotion_model_1 = require("./promotion.model");
let Sale = class Sale extends sequelize_typescript_1.Model {
    static addSaleOrderID(sale) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield database_1.sequelize.query("SELECT IDENT_CURRENT('tbl_SalesMaster')+1 as NEXTID"));
            const id = result[0][0].NEXTID;
            sale.SaleOrderID = `S${id.toString().padStart(7, "0")}`;
        });
    }
    static beforeBulkCreateHook(instances) {
        instances.forEach((instance) => {
            Object.entries(instance.toJSON()).forEach(([key, value]) => {
                if (typeof value === "string") {
                    instance.setDataValue(key, value.trim());
                }
            });
        });
    }
    static beforeCreateHook(instance) {
        Object.entries(instance.toJSON()).forEach(([key, value]) => {
            if (typeof value === "string") {
                instance.setDataValue(key, value.trim());
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "SalesMasterGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sale.prototype, "SaleOrderID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], Sale.prototype, "SaleOrderDate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => global_type_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        field: "SaleType",
    }),
    __metadata("design:type", String)
], Sale.prototype, "SaleType", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => global_type_model_1.default),
    __metadata("design:type", global_type_model_1.default)
], Sale.prototype, "SaleTypeRef", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "PaymentMode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "SalemanGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "LinemanGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "StoreGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "CreatedGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Sale.prototype, "CreatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "CustomerGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Sale.prototype, "UpdatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Sale.prototype, "DeletedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sale.prototype, "Status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sale.prototype, "PaymentTransactionID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => promotion_model_1.Promotion),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.NUMBER,
    }),
    __metadata("design:type", Number)
], Sale.prototype, "PromotionGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => promotion_model_1.Promotion),
    __metadata("design:type", promotion_model_1.Promotion)
], Sale.prototype, "Promotion", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sale_detail_model_1.default, {
        foreignKey: "SalesMasterGUID",
        as: "SaleDetails",
    }),
    __metadata("design:type", Array)
], Sale.prototype, "SaleDetails", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "WalletGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "GrossTotal", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sale.prototype, "TotalAmount", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Sale.prototype, "SalePlatform", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Sale]),
    __metadata("design:returntype", Promise)
], Sale, "addSaleOrderID", null);
__decorate([
    sequelize_typescript_1.BeforeBulkCreate,
    sequelize_typescript_1.BeforeBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], Sale, "beforeBulkCreateHook", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Sale]),
    __metadata("design:returntype", void 0)
], Sale, "beforeCreateHook", null);
Sale = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_SalesMaster",
        timestamps: false,
        createdAt: "CreatedDate",
        updatedAt: "UpdatedDate",
        deletedAt: "DeletedDate",
        paranoid: false,
    })
], Sale);
exports.default = Sale;
