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
let CartItem = class CartItem extends sequelize_typescript_1.Model {
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
], CartItem.prototype, "CartItemGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_master_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CartItem.prototype, "ProductGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CartItem.prototype, "Quantity", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    __metadata("design:type", Number)
], CartItem.prototype, "CreatedGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], CartItem.prototype, "CreatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_master_model_1.default),
    __metadata("design:type", product_master_model_1.default)
], CartItem.prototype, "Product", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], CartItem.prototype, "isSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => billing_cycle_model_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CartItem.prototype, "SubsCycleGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CartItem.prototype, "SubsOccurences", void 0);
__decorate([
    sequelize_typescript_1.BeforeBulkCreate,
    sequelize_typescript_1.BeforeBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], CartItem, "beforeBulkCreateHook", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CartItem]),
    __metadata("design:returntype", void 0)
], CartItem, "beforeCreateHook", null);
CartItem = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_CartItems",
        timestamps: false,
        paranoid: false,
    })
], CartItem);
exports.default = CartItem;
