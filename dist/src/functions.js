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
exports.capitalizeEveryWord = exports.generateUniqueNumber = exports.numberToCurrency = exports.getCartTotal = exports.promocodeValidator = exports.formatDateIndianStyle = exports.oneMonthAgo = exports.omitUndefined = void 0;
function omitUndefined(obj) {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) &&
            obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}
exports.omitUndefined = omitUndefined;
exports.oneMonthAgo = new Date();
exports.oneMonthAgo.setMonth(exports.oneMonthAgo.getMonth() - 1);
function formatDateIndianStyle(date) {
    const options = { year: "numeric", month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
}
exports.formatDateIndianStyle = formatDateIndianStyle;
const promotion_model_1 = require("./models/promotion.model");
const sale_model_1 = __importDefault(require("./models/sale.model"));
const sequelize_1 = require("sequelize");
const promocodeValidator = ({ PromoCode, CartGrossTotal, CreatedGUID, }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const promotion = yield promotion_model_1.Promotion.findOne({
            where: {
                PromoCode: {
                    [sequelize_1.Op.eq]: PromoCode,
                },
                DeletedDate: {
                    [sequelize_1.Op.eq]: null,
                },
                MaxOrderTotal: {
                    [sequelize_1.Op.gte]: CartGrossTotal,
                },
                CurrentStock: {
                    [sequelize_1.Op.gt]: 0,
                },
                Status: {
                    [sequelize_1.Op.eq]: "ACTIVE",
                },
            },
        });
        if (!promotion) {
            return reject("Invalid Promo Code");
        }
        const count_used = yield sale_model_1.default.count({
            where: {
                PromotionGUID: {
                    [sequelize_1.Op.eq]: promotion === null || promotion === void 0 ? void 0 : promotion.PromotionGUID,
                },
                CreatedGUID: {
                    [sequelize_1.Op.eq]: CreatedGUID,
                },
            },
        });
        if (count_used >= promotion.UsageLimit) {
            return reject("Promo code usage limit reached");
        }
        return resolve(promotion);
    }));
});
exports.promocodeValidator = promocodeValidator;
const getCartTotal = (props) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const saleGrossTotal = (_a = props.sales) === null || _a === void 0 ? void 0 : _a.reduce((acc, cart) => acc + cart.Product.SaleRate * cart.Quantity, 0);
    const subsGrossTotal = (_b = props === null || props === void 0 ? void 0 : props.subscriptions) === null || _b === void 0 ? void 0 : _b.reduce((acc, cart) => {
        return acc + cart.Product.SaleRate * cart.SubsOccurences;
    }, 0);
    const CartGrossTotal = (saleGrossTotal || 0) + (subsGrossTotal || 0);
    return CartGrossTotal;
});
exports.getCartTotal = getCartTotal;
const numberToCurrency = (number) => {
    const formattedNumber = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(number);
    return formattedNumber;
};
exports.numberToCurrency = numberToCurrency;
function generateUniqueNumber(length) {
    // Generate a random 6-digit number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    // Ensure the number is exactly 6 digits long
    const uniqueNumber = String(randomNumber).slice(0, length || 6);
    return uniqueNumber;
}
exports.generateUniqueNumber = generateUniqueNumber;
function capitalizeEveryWord(sentence) {
    return sentence
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
exports.capitalizeEveryWord = capitalizeEveryWord;
