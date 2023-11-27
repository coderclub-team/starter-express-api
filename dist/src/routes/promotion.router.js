"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promotion_controller_1 = require("../controllers/promotion.controller");
const coupon_gaurd_moddleware_1 = __importDefault(require("../middlewares/coupon-gaurd.moddleware"));
const auth_gaurd_middleware_1 = __importDefault(require("../middlewares/auth-gaurd.middleware"));
const router = express_1.default.Router();
router.get('/', promotion_controller_1.getAllPromotions);
router.post('/check', auth_gaurd_middleware_1.default, coupon_gaurd_moddleware_1.default, promotion_controller_1.checkPromoCode);
exports.default = router;
