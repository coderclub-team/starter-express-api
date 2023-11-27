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
exports.getWalletBalance = exports.creditOrDebit = exports.getWalletTransactions = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const user_wallet_model_1 = __importDefault(require("../models/user-wallet.model"));
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const sale_model_1 = __importDefault(require("../models/sale.model"));
const sale_detail_model_1 = __importDefault(require("../models/sale-detail.model"));
const product_master_model_1 = __importDefault(require("../models/product-master.model"));
const functions_1 = require("../functions");
const getWalletTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    try {
        const transactions = yield user_wallet_model_1.default.findAll({
            where: {
                UserGUID: req.body.CreatedGUID,
                Status: "FULLFILLED",
            },
            order: [["CreatedDate", "DESC"]],
            include: [{
                    model: sale_model_1.default,
                    include: [{
                            model: sale_detail_model_1.default,
                            include: [product_master_model_1.default],
                            nested: true
                        }]
                }, {
                    model: product_subscription_model_1.default,
                    include: [product_master_model_1.default],
                    nested: true
                }]
        });
        res.json(transactions);
    }
    catch (error) {
        next(error);
    }
});
exports.getWalletTransactions = getWalletTransactions;
const creditOrDebit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    const { type, amount, CreatedGUID } = req.body;
    if (!amount || amount <= 0 && isNaN(amount)) {
        throw new Error("Invalid amount");
    }
    try {
        let transaction;
        if (new String(type).toUpperCase() === "CREDIT") {
            console.log("come here", CreatedGUID);
            transaction = yield user_wallet_model_1.default.create({
                UserGUID: CreatedGUID,
                Credit: amount,
                Debit: 0,
                CreatedGUID: CreatedGUID,
                Status: "FULLFILLED",
                TransactionId: (0, functions_1.generateUniqueNumber)(),
            });
        }
        else if (new String(type).toUpperCase() === "DEBIT") {
            return res.status(400).json({ message: "Debit through this API is restricted" });
            // const walletBalance = await UserWalletBalance.findOne({
            //   where: { UserGUID: CreatedGUID },
            // });
            // if (walletBalance && walletBalance.Balance < amount) {
            //   throw new Error("Insufficient balance");
            // } 
            //   transaction = await UserWallet.create({
            //     UserGUID: CreatedGUID,
            //     Credit: 0,
            //     Debit: amount,
            //     CreatedGUID: CreatedGUID,
            //     Status: "FULLFILLED",
            //   });
        }
        else {
            return res.status(400).json({ message: "Invalid request" });
        }
        res.json({
            message: "Transaction successful",
            transaction,
            balance: yield user_wallet_model_1.default.findOne({
                where: { UserGUID: req.body.CreatedGUID },
                order: [["WalletGUID", "DESC"]],
            }).then((t) => t === null || t === void 0 ? void 0 : t.Balance),
        });
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.creditOrDebit = creditOrDebit;
const getWalletBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    try {
        const balance = yield user_wallet_model_1.default.findOne({
            where: { UserGUID: req.body.CreatedGUID },
            order: [["WalletGUID", "DESC"]],
            include: [{
                    model: user_model_1.default,
                    attributes: ['LoginName', 'UserGUID', 'FirstName', 'LastName', 'EmailAddress', 'MobileNo']
                }],
        });
        res.json([{ balance: balance !== null && balance !== void 0 ? balance : { "Balance": 0, } }]);
    }
    catch (error) {
        next(error);
    }
});
exports.getWalletBalance = getWalletBalance;
