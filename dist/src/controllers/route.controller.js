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
exports.routeById = exports.allRoutes = void 0;
const route_model_1 = require("../models/route.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const sale_detail_model_1 = __importDefault(require("../models/sale-detail.model"));
const sale_model_1 = __importDefault(require("../models/sale.model"));
const allRoutes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routes = yield route_model_1.Route.findAll({
            paranoid: true,
            include: [
                {
                    model: user_model_1.default,
                    include: [
                        product_subscription_model_1.default,
                        {
                            model: sale_model_1.default,
                            include: [sale_detail_model_1.default],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(routes);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.allRoutes = allRoutes;
const routeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { route_id } = req.params;
    try {
        const routes = yield route_model_1.Route.findByPk(route_id, {
            include: [
                {
                    model: user_model_1.default,
                    include: [
                        product_subscription_model_1.default,
                        {
                            model: sale_model_1.default,
                            include: [sale_detail_model_1.default],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(routes);
    }
    catch (error) {
        next(error);
    }
});
exports.routeById = routeById;
