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
let SubscriptionCycle = class SubscriptionCycle extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "BillingCycleGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SubscriptionCycle.prototype, "BillingCycleName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SubscriptionCycle.prototype, "NumberOfCycles", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "MondayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "TuesdayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "WednesdayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "ThursdayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "FridayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "SaturdayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "SundayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "EveryNthDayInterval", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "EveryNthDayQty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "UserGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SubscriptionCycle.prototype, "ProductGUID", void 0);
SubscriptionCycle = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_BillingCycles",
        timestamps: false,
        paranoid: false,
    })
], SubscriptionCycle);
exports.default = SubscriptionCycle;
