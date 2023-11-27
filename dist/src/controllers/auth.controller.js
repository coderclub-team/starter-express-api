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
exports.cancelOrder = exports.getOrders = void 0;
const sale_model_1 = __importDefault(require("../models/sale.model"));
const global_type_model_1 = __importDefault(require("../models/global-type.model"));
const sale_detail_model_1 = __importDefault(require("../models/sale-detail.model"));
const database_1 = require("../database");
const product_master_model_1 = __importDefault(require("../models/product-master.model"));
const promotion_model_1 = require("../models/promotion.model");
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const salemasters = yield sale_model_1.default.findAll({
        where: {
            CustomerGUID: req.body.user.UserGUID,
        },
        attributes: {
            exclude: ["CustomerGUID", "SaleTypeRef"],
        },
        include: [
            // {
            //   model: User,
            //   as: "Customer",
            // },
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
                include: [
                    {
                        model: product_master_model_1.default,
                    },
                ],
            },
            {
                model: promotion_model_1.Promotion,
            },
        ],
    });
    salemasters === null || salemasters === void 0 ? void 0 : salemasters.forEach((sale) => {
        var _a;
        (_a = sale === null || sale === void 0 ? void 0 : sale.SaleDetails) === null || _a === void 0 ? void 0 : _a.forEach((saleDetail) => {
            var _a;
            (_a = saleDetail === null || saleDetail === void 0 ? void 0 : saleDetail.Product) === null || _a === void 0 ? void 0 : _a.setFullURL(req, "PhotoPath");
        });
        if (sale.SaleTypeRef) {
            sale.setDataValue("SaleType", sale.SaleTypeRef.GlobalTypeName);
            sale.setDataValue("SaleTypeRef", undefined);
        }
    });
    res.json(salemasters);
});
exports.getOrders = getOrders;
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { SalesMasterGUID } = req.params;
    if (!SalesMasterGUID) {
        throw new Error("SalesMasterGUID is required");
    }
    else if (!req.body.Status) {
        throw new Error("Status is required");
    }
    const transaction = yield database_1.sequelize.transaction();
    try {
        const sale = yield sale_model_1.default.findByPk(SalesMasterGUID, { transaction });
        if (!sale) {
            throw new Error("Sale not found!");
        }
        sale.Status = req.body.Status;
        const user = yield sale.save({ transaction });
        transaction.commit();
        res.json({
            message: "Sale updated successfully!",
            user,
        });
    }
    catch (error) {
        transaction.rollback();
        next(error);
    }
});
exports.cancelOrder = cancelOrder;
