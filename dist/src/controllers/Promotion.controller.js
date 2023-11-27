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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPromoCode = exports.getAllPromotions = void 0;
const promotion_model_1 = require("../models/promotion.model");
const sequelize_1 = require("sequelize");
const getAllPromotions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield promotion_model_1.Promotion.findAll({
            where: {
                StartDate: {
                    [sequelize_1.Op.lte]: new Date(),
                },
                EndDate: {
                    [sequelize_1.Op.gte]: new Date(),
                },
                Stock: {
                    [sequelize_1.Op.gte]: 1,
                },
                CurrentStock: {
                    [sequelize_1.Op.gte]: 1,
                },
            },
        });
        res.json(promotions);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPromotions = getAllPromotions;
const checkPromoCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.PromoCode === req.body.promotion.PromoCode) {
        res.status(200).json({
            message: "PromoCode is valid",
            PromotionGUID: req.body.PromotionGUID
        });
    }
    else {
        res.status(400).json({
            message: "PromoCode is invalid"
        });
    }
});
exports.checkPromoCode = checkPromoCode;
