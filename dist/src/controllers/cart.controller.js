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
exports.moveFromCartToOrder = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_master_model_1 = __importDefault(require("../models/product-master.model"));
const billing_cycle_model_1 = __importDefault(require("../models/billing-cycle.model"));
const sequelize_1 = require("sequelize");
const global_type_model_1 = __importDefault(require("../models/global-type.model"));
const database_1 = require("../database");
const user_wallet_model_1 = __importDefault(require("../models/user-wallet.model"));
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const sale_model_1 = __importDefault(require("../models/sale.model"));
const functions_1 = require("../functions");
const sale_detail_model_1 = __importDefault(require("../models/sale-detail.model"));
const addSubsToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductGUID, Quantity, IsSubscription = 1, SubsCycleGUID, SubsOccurences = 1, user, } = req.body;
    try {
        const product = product_master_model_1.default.findByPk(ProductGUID);
        if (!product) {
            throw new Error("Product not found");
        }
        const subscriptionCycle = yield billing_cycle_model_1.default.findByPk(SubsCycleGUID);
        if (!subscriptionCycle) {
            throw new Error("Subscription cycle not found");
        }
        const cart = yield cart_model_1.default.findOne({
            where: {
                ProductGUID,
                CreatedGUID: user.UserGUID,
                IsSubscription: {
                    [sequelize_1.Op.eq]: 1,
                },
            },
        });
        if (cart) {
            return res.status(400).json({
                message: "Subscription already added to cart",
            });
        }
        const newCart = yield cart_model_1.default.create({
            ProductGUID,
            Quantity: 1,
            CreatedGUID: user.UserGUID,
            IsSubscription: 1,
            SubsCycleGUID,
            SubsOccurences,
        });
        return res.status(200).json({
            message: "Cart updated successfully",
            cart: newCart,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});
const removeSubsFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductGUID, Quantity, IsSubscription, SubsCycleGUID, SubsOccurences, user, } = req.body;
    try {
        const cart = yield cart_model_1.default.findOne({
            where: {
                ProductGUID,
                CreatedGUID: {
                    [sequelize_1.Op.eq]: [user.UserGUID],
                },
                IsSubscription: {
                    [sequelize_1.Op.eq]: 1,
                },
                SubsCycleGUID: {
                    [sequelize_1.Op.eq]: SubsCycleGUID,
                },
                SubsOccurences: {
                    [sequelize_1.Op.eq]: SubsOccurences,
                },
            },
        });
        if (!cart) {
            throw new Error("Cart not found");
        }
        yield cart.destroy();
        return res.status(200).json({
            message: "Cart deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});
// *************
// *************
// *************
// *************
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    try {
        const sales = yield cart_model_1.default.findAll({
            where: {
                CreatedGUID: user.UserGUID,
                IsSubscription: 0,
            },
            include: [product_master_model_1.default],
        });
        const subscriptions = yield cart_model_1.default.findAll({
            where: {
                CreatedGUID: user.UserGUID,
                IsSubscription: 1,
            },
            include: [product_master_model_1.default],
        });
        const CartTotal = yield (0, functions_1.getCartTotal)({
            sales,
            subscriptions,
        });
        return res.status(200).json({
            Message: "Cart fetched successfully",
            Cart: [...sales, ...subscriptions],
            CartTotal: (0, functions_1.numberToCurrency)(CartTotal),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductGUID, Quantity, IsSubscription, user } = req.body;
    if (IsSubscription) {
        return addSubsToCart(req, res);
    }
    else {
        try {
            const product = product_master_model_1.default.findByPk(ProductGUID);
            if (!product) {
                throw new Error("Product not found");
            }
            const cart = yield cart_model_1.default.findOne({
                where: {
                    ProductGUID,
                    CreatedGUID: user.UserGUID,
                },
            });
            if (cart) {
                cart.Quantity += Quantity;
                yield cart.save();
                return res.status(200).json({
                    message: "Cart updated successfully",
                    cart,
                });
            }
            const newCart = yield cart_model_1.default.create({
                ProductGUID,
                Quantity,
                UserGUID: user.UserGUID,
                CreatedGUID: user.UserGUID,
            });
            return res.status(200).json({
                message: "Cart updated successfully",
                cart: newCart,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({
                message: error.message,
            });
        }
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ProductGUID, Quantity, IsSubscription, user } = req.body;
    if (IsSubscription) {
        return removeSubsFromCart(req, res);
    }
    else {
        try {
            const cart = yield cart_model_1.default.findOne({
                where: {
                    ProductGUID: {
                        [sequelize_1.Op.eq]: ProductGUID,
                    },
                    CreatedGUID: {
                        [sequelize_1.Op.eq]: [user.UserGUID],
                    },
                    IsSubscription: {
                        [sequelize_1.Op.ne]: 0,
                    },
                },
            });
            if (!cart) {
                throw new Error("Cart not found");
            }
            if (Quantity >= cart.Quantity) {
                yield cart.destroy();
                return res.status(200).json({
                    message: "Cart deleted successfully",
                });
            }
            else {
                cart.Quantity -= Quantity;
            }
            yield cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
                cart,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({
                message: error.message,
            });
        }
    }
});
exports.removeFromCart = removeFromCart;
const moveFromCartToOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { user, PaymentMode = "Wallet", WalletBalance, PaymentTransactionID, PromoCode, SaleType = 69, promotion, } = req.body;
    const SalePlatform = (_a = req.useragent) === null || _a === void 0 ? void 0 : _a.platform;
    const t = yield database_1.sequelize.transaction({
        autocommit: false,
    });
    try {
        const sales = yield cart_model_1.default.findAll({
            where: {
                CreatedGUID: user.UserGUID,
                IsSubscription: 0,
            },
            include: [product_master_model_1.default],
        });
        const subscriptions = yield cart_model_1.default.findAll({
            where: {
                CreatedGUID: user.UserGUID,
                IsSubscription: 1,
            },
            include: [product_master_model_1.default],
        });
        if (sales.length == 0 && subscriptions.length == 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }
        if (PaymentMode == "Wallet") {
            const GT = yield global_type_model_1.default.findOne({
                where: {
                    GlobalTypeName: {
                        [sequelize_1.Op.eq]: PaymentMode,
                    },
                },
            });
            const CartGrossTotal = yield (0, functions_1.getCartTotal)({
                sales,
                subscriptions,
            });
            if (CartGrossTotal > WalletBalance) {
                return res.status(400).json({
                    message: "Insufficient balance",
                });
            }
            const p = PromoCode
                ? yield (0, functions_1.promocodeValidator)({
                    CartGrossTotal: CartGrossTotal,
                    PromoCode,
                    CreatedGUID: user.UserGUID,
                })
                : undefined;
            const wallet = yield user_wallet_model_1.default.create({
                UserGUID: user.UserGUID,
                Debit: CartGrossTotal,
                CreatedGUID: user.UserGUID,
                Description: "Order Placed",
                PaymentId: (0, functions_1.generateUniqueNumber)(),
                TransactionId: (0, functions_1.generateUniqueNumber)(),
                CreatedDate: new Date(),
            }, {
                transaction: t
            });
            const salesData = yield sale_model_1.default.create({
                SaleType,
                StoreGUID: user.StoreGUID,
                CreatedGUID: user.StoreGUID,
                CustomerGUID: user.StoreGUID,
                SaleOrderDate: new Date(),
                SalePlatform,
                PaymentMode: GT === null || GT === void 0 ? void 0 : GT.getDataValue("GlobalTypeGUID"),
                PromotionGUID: promotion === null || promotion === void 0 ? void 0 : promotion.getDataValue("PromotionGUID"),
                PaymentTransactionID: wallet.getDataValue("WalletGUID"),
                Status: "PLACED",
                // PaymentTransactionID,
                GrossTotal: CartGrossTotal,
                TotalAmount: (p === null || p === void 0 ? void 0 : p.Type) === "PERCENTAGE"
                    ? CartGrossTotal * ((p === null || p === void 0 ? void 0 : p.Value) / 100)
                    : (p === null || p === void 0 ? void 0 : p.Type) == "FIXED"
                        ? CartGrossTotal - (p === null || p === void 0 ? void 0 : p.Value)
                        : CartGrossTotal,
            }, {
                transaction: t,
            });
            const sale_details = sales.map((cart) => ({
                ProductGUID: cart.getDataValue("ProductGUID"),
                Quantity: cart.getDataValue('Quantity'),
                SaleMasterGUID: salesData.getDataValue("SalesMasterGUID"),
            }));
            const subscriptionsData = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.map((cart) => ({
                UserGUID: user.UserGUID,
                SalesMasterGUID: salesData === null || salesData === void 0 ? void 0 : salesData.getDataValue('SalesMasterGUID'),
                ProductGUID: cart === null || cart === void 0 ? void 0 : cart.getDataValue("ProductGUID"),
                SubscriptionStartDate: new Date(),
                SubscriptionEndDate: new Date(),
                SubscriptionOccurrences: cart.getDataValue("SubsOccurences"),
                PaymentTransactionId: (0, functions_1.generateUniqueNumber)(),
                SubscriptionPrice: cart.Product.getDataValue("SaleRate"),
                BillingCycleGUID: cart.getDataValue('SubsCycleGUID'),
            }));
            const sales_details_records = yield sale_detail_model_1.default.bulkCreate(sale_details, {
                transaction: t,
            });
            const subscription_records = yield product_subscription_model_1.default.bulkCreate(subscriptionsData, {
                transaction: t,
            });
            yield cart_model_1.default.destroy({
                where: {
                    CreatedGUID: {
                        [sequelize_1.Op.eq]: user.UserGUID,
                    },
                },
                transaction: t,
            });
            yield t.commit();
            return res.status(200).json({
                message: "Order placed successfully",
                salesData,
                sales_details_records,
                subscription_records,
            });
        }
    }
    catch (error) {
        t.rollback();
        next(error);
    }
});
exports.moveFromCartToOrder = moveFromCartToOrder;
