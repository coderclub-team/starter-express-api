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
const promotion_model_1 = require("../models/promotion.model");
const sale_model_1 = __importDefault(require("../models/sale.model"));
const database_1 = require("../database");
const sequelize_1 = require("sequelize");
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const couponGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { PromoCode, GrossTotal, SubscriptionPrice } = req.method === "GET" ? req.query : req.body;
    if (!PromoCode)
        return next();
    yield database_1.sequelize.transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const UserGUID = req.body.user.UserGUID;
        if (!UserGUID)
            return res
                .status(400)
                .json({ message: "UserGUID is required for apply a coupon" });
        if (!(GrossTotal))
            return res
                .status(400)
                .json({ message: "GrossTotal is required for apply a coupon" });
        try {
            const promotion = yield promotion_model_1.Promotion.findOne({
                where: {
                    PromoCode,
                    Status: "ACTIVE",
                    Stock: {
                        [sequelize_1.Op.gt]: 0,
                    },
                    CurrentStock: {
                        [sequelize_1.Op.gt]: 0,
                    },
                    StartDate: {
                        [sequelize_1.Op.lte]: new Date(),
                    },
                    EndDate: {
                        [sequelize_1.Op.gte]: new Date(),
                    },
                    MinOrderTotal: {
                        [sequelize_1.Op.lte]: GrossTotal || SubscriptionPrice,
                    },
                },
            });
            if (!promotion) {
                return res.status(404).json({ message: "Invalid Coupon" });
            }
            const { count: salecount } = yield sale_model_1.default.findAndCountAll({
                where: {
                    CreatedGUID: UserGUID,
                    PromotionGUID: promotion.PromotionGUID,
                },
                transaction,
            });
            const { count: subscount } = yield product_subscription_model_1.default.findAndCountAll({
                where: {
                    CreatedGUID: UserGUID,
                    PromotionGUID: promotion.PromotionGUID,
                },
                transaction,
            });
            const getTotal = (num1 = 0, num2 = 0) => num1 + num2;
            if (getTotal(salecount, subscount) >= promotion.UsageLimit) {
                return res.status(400).json({ message: "Coupon already used" });
            }
            req.body.promotion = promotion.toJSON();
            next();
        }
        catch (error) {
            yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }));
});
exports.default = couponGuard;
