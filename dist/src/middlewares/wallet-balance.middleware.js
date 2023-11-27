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
const user_wallet_model_1 = __importDefault(require("../models/user-wallet.model"));
function WalletBalance(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const balance = yield user_wallet_model_1.default.findOne({
                where: {
                    UserGUID: req.body.user.UserGUID,
                },
                order: [["WalletGUID", "DESC"]],
            });
            if (balance == null) {
                req.body.WalletBalance = 0;
            }
            else {
                req.body.WalletBalance = balance === null || balance === void 0 ? void 0 : balance.getDataValue("Balance");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = WalletBalance;
