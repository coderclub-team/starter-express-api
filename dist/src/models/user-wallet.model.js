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
var UserWallet_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const message_class_1 = __importDefault(require("../entities/message.class"));
const user_model_1 = __importDefault(require("./user.model"));
// import UserWalletBalance from "./user-wallet-balance.model";
const product_subscription_model_1 = __importDefault(require("./product-subscription.model"));
const sale_model_1 = __importDefault(require("./sale.model"));
let UserWallet = UserWallet_1 = class UserWallet extends sequelize_typescript_1.Model {
    // @ForeignKey(() => Sale)
    // @Column
    // SalesMasterGUID!: number;
    // @BelongsTo(() => Sale)
    // Order!: Sale;
    // @ForeignKey(() => ProductSubscription)
    // @Column
    // SubscriptionGUID!: number;
    // @BelongsTo(() => ProductSubscription)
    // Subscription!: ProductSubscription;
    static updateBalance(instance, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByPk(instance.getDataValue("UserGUID"), {
                transaction: options.transaction
            });
            const balance = yield UserWallet_1.findOne({
                where: { UserGUID: instance.getDataValue("UserGUID") },
                order: [["WalletGUID", "DESC"]],
                transaction: options.transaction
            });
            if (instance.getDataValue("Credit") > 0) {
                message_class_1.default.sendRechargeSuccessMessage({
                    MobileNo: user === null || user === void 0 ? void 0 : user.getDataValue("MobileNo"),
                    RechargeAmount: instance.getDataValue("Credit"),
                    RechargeDate: instance.getDataValue("CreatedDate"),
                    Balance: balance === null || balance === void 0 ? void 0 : balance.getDataValue("Balance"),
                    DigitalCard: user === null || user === void 0 ? void 0 : user.DigitalCard,
                });
            }
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "WalletGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "UserGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default),
    __metadata("design:type", user_model_1.default)
], UserWallet.prototype, "User", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserWallet.prototype, "Description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "Credit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "Debit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    }),
    __metadata("design:type", Date)
], UserWallet.prototype, "CreatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    }),
    __metadata("design:type", Date)
], UserWallet.prototype, "UpdatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], UserWallet.prototype, "DeletedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "CreatedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "UpdatedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], UserWallet.prototype, "DeletedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        defaultValue: "FULLFILLED",
    }),
    __metadata("design:type", String)
], UserWallet.prototype, "Status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserWallet.prototype, "PaymentId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserWallet.prototype, "TransactionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        allowNull: true,
        get() {
            const prefix = this.getDataValue("Credit") > 0 ? "PT-" : "CL-";
            return `${prefix}${new Date(this.getDataValue("CreatedDate")).getTime()}`;
        },
    }),
    __metadata("design:type", String)
], UserWallet.prototype, "VoucherNo", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => sale_model_1.default, {
        foreignKey: 'WalletGUID',
    }),
    __metadata("design:type", UserWallet)
], UserWallet.prototype, "Sale", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        get() {
            return this.getDataValue("Credit") > 0 ? "RECEIPT" : "INVOICE";
        },
    }),
    __metadata("design:type", String)
], UserWallet.prototype, "VoucherType", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => product_subscription_model_1.default, {
        foreignKey: 'WalletGUID',
    }),
    __metadata("design:type", UserWallet)
], UserWallet.prototype, "Subscription", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserWallet.prototype, "Balance", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserWallet, Object]),
    __metadata("design:returntype", Promise)
], UserWallet, "updateBalance", null);
UserWallet = UserWallet_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        paranoid: true,
        tableName: "tbl_UserWallets",
        createdAt: "CreatedDate",
        updatedAt: "UpdatedDate",
        deletedAt: "DeletedDate",
        hasTrigger: true,
    })
], UserWallet);
exports.default = UserWallet;
