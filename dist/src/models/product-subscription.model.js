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
const product_master_model_1 = __importDefault(require("./product-master.model"));
const user_model_1 = __importDefault(require("./user.model"));
const billing_cycle_model_1 = __importDefault(require("./billing-cycle.model"));
const promotion_model_1 = require("./promotion.model");
let ProductSubscription = class ProductSubscription extends sequelize_typescript_1.Model {
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
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "SubscriptionGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "UserGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default),
    __metadata("design:type", user_model_1.default)
], ProductSubscription.prototype, "User", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_master_model_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "ProductGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_master_model_1.default),
    __metadata("design:type", product_master_model_1.default)
], ProductSubscription.prototype, "Product", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ProductSubscription.prototype, "SubscriptionStartDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ProductSubscription.prototype, "SubscriptionEndDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductSubscription.prototype, "SubscriptionOccurrences", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => promotion_model_1.Promotion),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.NUMBER,
    }),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "PromotionGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => promotion_model_1.Promotion),
    __metadata("design:type", promotion_model_1.Promotion)
], ProductSubscription.prototype, "Promotion", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => billing_cycle_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductSubscription.prototype, "BillingCycleGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ProductSubscription.prototype, "CreatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ProductSubscription.prototype, "UpdatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ProductSubscription.prototype, "DeletedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "CreatedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "UpdatedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProductSubscription.prototype, "DeletedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ProductSubscription.prototype, "SalesMasterGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ProductSubscription.prototype, "Status", void 0);
__decorate([
    sequelize_typescript_1.BeforeBulkCreate,
    sequelize_typescript_1.BeforeBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ProductSubscription, "beforeBulkCreateHook", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductSubscription]),
    __metadata("design:returntype", void 0)
], ProductSubscription, "beforeCreateHook", null);
ProductSubscription = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_ProductSubscriptions",
        createdAt: "CreatedDate",
        updatedAt: "UpdatedDate",
        deletedAt: "DeletedDate",
    })
], ProductSubscription);
exports.default = ProductSubscription;
