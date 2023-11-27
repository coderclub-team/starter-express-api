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
exports.createSale = exports.getSaleById = exports.getAllSales = void 0;
const sale_detail_model_1 = __importDefault(require("../models/sale-detail.model"));
const sale_model_1 = __importDefault(require("../models/sale.model"));
const global_type_model_1 = __importDefault(require("../models/global-type.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const database_1 = require("../database");
const user_wallet_model_1 = __importDefault(require("../models/user-wallet.model"));
const functions_1 = require("../functions");
function getAllSales(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const salemasters = yield sale_model_1.default.findAll({
            attributes: {
                exclude: ["CustomerGUID", "SaleTypeRef"],
            },
            include: [
                {
                    model: user_model_1.default,
                    as: "Customer",
                },
                {
                    model: global_type_model_1.default,
                    as: "SaleTypeRef",
                    //  Sale type shoudl be astring value of arributes.GlobaleTypeName
                    attributes: {
                        include: ["GlobalTypeName"],
                        exclude: ["GlobalTypeGUID"],
                    },
                },
                {
                    model: sale_detail_model_1.default,
                    all: true,
                },
            ],
        });
        salemasters.forEach((sale) => {
            if (sale.SaleTypeRef) {
                sale.setDataValue("SaleType", sale.SaleTypeRef.GlobalTypeName);
                sale.setDataValue("SaleTypeRef", undefined);
            }
        });
        res.status(200).json(salemasters);
    });
}
exports.getAllSales = getAllSales;
function getSaleById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { SalemanGUID } = req.params;
        const sale = yield sale_model_1.default.findOne({
            where: {
                SalemanGUID: SalemanGUID,
            },
            include: [
                {
                    model: user_model_1.default,
                    as: "Customer",
                },
                {
                    model: global_type_model_1.default,
                    as: "SaleTypeRef",
                    //  Sale type shoudl be astring value of arributes.GlobaleTypeName
                    attributes: {
                        include: ["GlobalTypeName"],
                        exclude: ["GlobalTypeGUID"],
                    },
                },
                {
                    model: sale_detail_model_1.default,
                    all: true,
                },
            ],
        });
        if (!sale) {
            return res.status(404).json({
                message: "Sale not found",
            });
        }
        if (sale.SaleTypeRef) {
            sale.setDataValue("SaleType", sale.SaleTypeRef.GlobalTypeName);
            sale.setDataValue("SaleTypeRef", undefined);
        }
        res.status(200).json(sale);
    });
}
exports.getSaleById = getSaleById;
const createSale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    const transaction = yield database_1.sequelize.transaction();
    try {
        const { SaleOrderID, SaleOrderDate, ModeOfPayment, SaleChannel, SalePlatform, CustomerGUID = req.body.user.UserGUID, SalesDetails, CreatedGUID, PaymentTransactionID, PromotionGUID, TotalAmount, } = req.body;
        const saleData = {
            SaleOrderID,
            SaleOrderDate,
            SaleChannel,
            CustomerGUID,
            CreatedGUID,
            SalePlatform,
            ModeOfPayment,
            PaymentTransactionID,
            PromotionGUID,
            TotalAmount,
        };
        function checkSufficientBalance(TotalAmount, WalletBalance) {
            // return true or false
            return TotalAmount <= WalletBalance;
        }
        let sufficientBalance = checkSufficientBalance(TotalAmount, req.body.WalletBalance);
        if (!sufficientBalance) {
            throw new Error(`Insufficient balance ${req.body.WalletBalance} in wallet`);
        }
        if (!SaleOrderDate) {
            throw new Error("SaleOrderDate is required");
        }
        else if (!ModeOfPayment) {
            throw new Error("ModeOfPayment is required");
        }
        else if (!SaleChannel) {
            throw new Error("SaleChannel is required");
        }
        else if (!SalePlatform) {
            throw new Error("SalePlatform is required");
        }
        else if (!PaymentTransactionID) {
            throw new Error("PaymentTransactionID is required");
        }
        else if (!TotalAmount) {
            throw new Error("TotalAmount is required");
        }
        SalesDetails.forEach((saleDetail) => {
            if (!saleDetail.ProductGUID) {
                throw new Error("ProductGUID is required");
            }
            else if (!saleDetail.Qty) {
                throw new Error("Quantity is required");
            }
            else if (!saleDetail.Amount) {
                throw new Error("Amount is required");
            }
        });
        if (!Array.isArray(SalesDetails)) {
            throw new Error("SaleDetails should be an array");
        }
        const updatedWallet = yield user_wallet_model_1.default.create({
            UserGUID: req.body.CreatedGUID,
            Debit: TotalAmount,
            CreatedGUID: req.body.CreatedGUID,
            TransactionId: (0, functions_1.generateUniqueNumber)()
        });
        const sale = yield sale_model_1.default.create(Object.assign(Object.assign({}, saleData), { WalletGUID: updatedWallet.WalletGUID }), { transaction });
        const saleDetails = yield sale_detail_model_1.default.bulkCreate(SalesDetails.map((saleDetail) => (Object.assign({ SalesMasterGUID: sale.SalesMasterGUID }, saleDetail))), { transaction });
        transaction.commit();
        res.json({
            sale,
            SaleDetails: saleDetails,
        });
    }
    catch (error) {
        transaction.rollback();
        next(error);
    }
});
exports.createSale = createSale;
