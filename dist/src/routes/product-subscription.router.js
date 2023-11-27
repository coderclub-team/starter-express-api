"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_subscription_controller_1 = require("../controllers/product-subscription.controller");
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const wallet_balance_middleware_1 = __importDefault(require("../middlewares/wallet-balance.middleware"));
const coupon_gaurd_moddleware_1 = __importDefault(require("../middlewares/coupon-gaurd.moddleware"));
const router = (0, express_1.Router)();
router.get("", product_subscription_controller_1.getUserSubscriptions, handle_sequelize_error_middleware_1.default);
router.post("", wallet_balance_middleware_1.default, coupon_gaurd_moddleware_1.default, product_subscription_controller_1.subscribeProduct, handle_sequelize_error_middleware_1.default);
router.patch("/:SubscriptionGUID", product_subscription_controller_1.calcelSubscription, handle_sequelize_error_middleware_1.default);
exports.default = router;
