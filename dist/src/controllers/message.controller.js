"use strict";
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
exports.lowBalanceAlertMessage = exports.expiryAlertMessage = void 0;
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const message_class_1 = __importDefault(require("../entities/message.class"));
const expiryAlertMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expiredSubscriptions = yield product_subscription_model_1.default.findAll({
            where: {
                SubscriptionEndDate: {
                    [sequelize_1.Op.lte]: new Date(),
                },
                Status: {
                    [sequelize_1.Op.notIn]: ["INACTIVE", "CANCELLED", "EXPIRED", "PENDING", "SUSPENDED",],
                },
            },
            include: [
                {
                    model: user_model_1.default,
                },
            ],
        });
        const bulkMessage = expiredSubscriptions.map((subscription) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            if (subscription.User.Status == 1 && subscription.User.MobileNo === "9944781003") {
                return message_class_1.default.sendCardExpiryAlertMessage({
                    CustomerName: (_a = subscription.User) === null || _a === void 0 ? void 0 : _a.FirstName,
                    DigitalCard: (_b = subscription.User) === null || _b === void 0 ? void 0 : _b.DigitalCard,
                    ExpiresDate: subscription.SubscriptionEndDate,
                    PlanLink: "https://tamil-milk.com",
                    MobileNo: (_c = subscription.User) === null || _c === void 0 ? void 0 : _c.MobileNo
                });
            }
        }));
        return Promise.all(bulkMessage);
    }
    catch (error) {
        console.log(error);
    }
});
exports.expiryAlertMessage = expiryAlertMessage;
const lowBalanceAlertMessage = (req, res, next) => { };
exports.lowBalanceAlertMessage = lowBalanceAlertMessage;
