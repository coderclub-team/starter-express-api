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
const sequelize_typescript_2 = require("sequelize-typescript");
const product_master_model_1 = __importDefault(require("./product-master.model"));
const billing_cycle_model_1 = __importDefault(require("./billing-cycle.model"));
const user_model_1 = __importDefault(require("./user.model"));
let Cart = class Cart extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_2.Column,
    __metadata("design:type", Number)
], Cart.prototype, "CartGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => product_master_model_1.default),
    __metadata("design:type", Number)
], Cart.prototype, "ProductGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => product_master_model_1.default),
    __metadata("design:type", product_master_model_1.default)
], Cart.prototype, "Product", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_typescript_2.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Cart.prototype, "Quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    sequelize_typescript_2.Column,
    __metadata("design:type", Number)
], Cart.prototype, "CreatedGUID", void 0);
__decorate([
    sequelize_typescript_2.Column,
    __metadata("design:type", Date)
], Cart.prototype, "CreatedDate", void 0);
__decorate([
    sequelize_typescript_2.Column,
    __metadata("design:type", Number)
], Cart.prototype, "IsSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => billing_cycle_model_1.default),
    sequelize_typescript_2.Column,
    __metadata("design:type", Number)
], Cart.prototype, "SubsCycleGUID", void 0);
__decorate([
    (0, sequelize_typescript_2.Column)({
        type: sequelize_typescript_2.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Cart.prototype, "SubsOccurences", void 0);
Cart = __decorate([
    (0, sequelize_typescript_2.Table)({
        tableName: "tbl_Cart",
        timestamps: true,
        paranoid: false,
        createdAt: "CreatedDate",
        updatedAt: false,
    })
], Cart);
exports.default = Cart;
