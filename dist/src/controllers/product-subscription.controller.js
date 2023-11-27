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
exports.expireSubscription = exports.calcelSubscription = exports.subscribeProduct = exports.getUserSubscriptions = void 0;
const functions_1 = require("../functions");
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const billing_cycle_model_1 = __importDefault(require("../models/billing-cycle.model"));
const sequelize_1 = require("sequelize");
const product_master_model_1 = __importDefault(require("../models/product-master.model"));
const database_1 = require("../database");
const user_wallet_model_1 = __importDefault(require("../models/user-wallet.model"));
const getUserSubscriptions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    const where = (0, functions_1.omitUndefined)({
        userGUID: req.body.CreatedGUID,
        SubscriptionGUID: req.body.SubscriptionGUID,
    });
    try {
        const subscriptions = yield product_subscription_model_1.default.findAll({
            where: where,
            include: [
                {
                    model: product_master_model_1.default,
                },
            ],
        });
        subscriptions.forEach((subscription) => {
            var _a;
            (_a = subscription === null || subscription === void 0 ? void 0 : subscription.Product) === null || _a === void 0 ? void 0 : _a.setFullURL(req, "PhotoPath");
        });
        res.status(200).json(subscriptions);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserSubscriptions = getUserSubscriptions;
const subscribeProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    req.body.UserGUID = req.body.CreatedGUID;
    try {
        if (!req.body.ProductGUID) {
            throw Error("ProductGUID is required for subscription");
        }
        else if (!req.body.SubscriptionPrice) {
            throw Error("SubscriptionPrice is required for subscription");
        }
        else if (!req.body.SubscriptionStartDate) {
            throw Error("SubscriptionStartDate is required for subscription");
        }
        else if (!req.body.SubscriptionEndDate) {
            throw Error("SubscriptionEndDate is required for subscription");
        }
        else if (!req.body.SubscriptionOccurrences) {
            throw Error("SubscriptionOccurrences is required for subscription");
        }
        else if (!req.body.BillingCycleGUID) {
            throw Error("BillingCycleGUID is required for subscription");
        }
        function checkSufficientBalance(TotalAmount, WalletBalance) {
            // return true or false
            return TotalAmount <= WalletBalance;
        }
        let sufficientBalance = checkSufficientBalance(req.body.SubscriptionPrice, req.body.WalletBalance);
        yield database_1.sequelize.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            if (!sufficientBalance) {
                throw new Error(`Insufficient balance ${req.body.WalletBalance} in wallet`);
            }
            try {
                const billingcycle = yield billing_cycle_model_1.default.findByPk(req.body.BillingCycleGUID, {
                    transaction: t,
                });
                if (!billingcycle)
                    throw Error("Invalid billing cycle!");
                const cycle_name = billingcycle.getDataValue("BillingCycleName");
                switch (cycle_name) {
                    case "Daily":
                        {
                        }
                        break;
                    case "Monthly":
                        {
                        }
                        break;
                }
                const updatedWallet = yield user_wallet_model_1.default.create({
                    UserGUID: req.body.CreatedGUID,
                    Debit: req.body.SubscriptionPrice,
                    CreatedGUID: req.body.CreatedGUID,
                    TransactionId: (0, functions_1.generateUniqueNumber)()
                });
                const subscription = yield product_subscription_model_1.default.create(Object.assign(Object.assign({}, req.body), { PaymentTransactionId: updatedWallet.getDataValue("WalletGUID"), PaymentMethod: "WALLET", WalletGUID: updatedWallet.getDataValue("WalletGUID") }), {
                    transaction: t,
                });
                yield t.commit().then(() => {
                    console.log("subscription", subscription.toJSON());
                    return res.status(200).send({
                        message: "Subscription created successfully!",
                        subscription: subscription.toJSON(),
                        updatedWalletBalance: req.body.WalletBalance - updatedWallet.getDataValue("Debit"),
                    });
                });
            }
            catch (error) {
                yield (t === null || t === void 0 ? void 0 : t.rollback());
                next(error);
            }
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.subscribeProduct = subscribeProduct;
const calcelSubscription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { SubscriptionGUID } = req.params;
    const { Status } = req.body;
    if (req.body.user) {
        req.body.CreatedGUID = req.body.user.UserGUID;
    }
    else {
        req.body.CreatedGUID = req.body.user.UserGUID;
    }
    req.body.UserGUID = req.body.CreatedGUID;
    if (!Status) {
        throw new Error("Status is required");
    }
    try {
        const productSubscription = yield product_subscription_model_1.default.findByPk(SubscriptionGUID);
        if (!productSubscription)
            throw Error("Invalid subscription!");
        productSubscription.Status = Status;
        const subscription = yield productSubscription.save();
        res.status(200).send({
            message: "Subscription updated successfully!",
            subscription,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.calcelSubscription = calcelSubscription;
const expireSubscription = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expiredSubscriptions = yield product_subscription_model_1.default.findAll({
            where: {
                SubscriptionEndDate: {
                    [sequelize_1.Op.lt]: new Date(),
                },
                Status: {
                    [sequelize_1.Op.notIn]: ["EXPIRED", "CANCELLED"],
                },
            },
        });
        expiredSubscriptions.forEach((subscription) => __awaiter(void 0, void 0, void 0, function* () {
            subscription.Status = "EXPIRED";
            const updatedSubscription = yield subscription.save();
            console.log("expiry updated by a cron", updatedSubscription.toJSON());
        }));
    }
    catch (error) {
        console.log("expireSubscription_Fn", error.message);
    }
    // Do something with the expired subscriptions
});
exports.expireSubscription = expireSubscription;
