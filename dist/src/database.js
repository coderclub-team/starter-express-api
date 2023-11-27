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
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config");
const product_master_model_1 = __importDefault(require("./models/product-master.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const product_category_model_1 = __importDefault(require("./models/product-category.model"));
const product_sub_category_model_1 = __importDefault(require("./models/product-sub-category.model"));
const sale_model_1 = __importDefault(require("./models/sale.model"));
const sale_detail_model_1 = __importDefault(require("./models/sale-detail.model"));
const global_type_model_1 = __importDefault(require("./models/global-type.model"));
const global_type_category_nodel_1 = __importDefault(require("./models/global-type-category.nodel"));
const product_review_model_1 = __importDefault(require("./models/product-review.model"));
const user_address_model_1 = __importDefault(require("./models/user-address.model"));
const cart_item_1 = __importDefault(require("./models/cart-item"));
const product_subscription_model_1 = __importDefault(require("./models/product-subscription.model"));
const billing_cycle_model_1 = __importDefault(require("./models/billing-cycle.model"));
const product_stock_master_model_1 = __importDefault(require("./models/product-stock-master.model"));
const user_wallet_model_1 = __importDefault(require("./models/user-wallet.model"));
const user_wallet_balance_model_1 = __importDefault(require("./models/user-wallet-balance.model"));
const promotion_model_1 = require("./models/promotion.model");
const cms_model_1 = require("./models/cms.model");
const cart_model_1 = __importDefault(require("./models/cart.model"));
const lineman_model_1 = __importDefault(require("./models/lineman.model"));
const customer_model_1 = __importDefault(require("./models/customer.model"));
const store_master_model_1 = __importDefault(require("./models/store-master.model"));
const route_model_1 = require("./models/route.model");
exports.sequelize = new sequelize_typescript_1.Sequelize(config_1.sequelizeConnectionOptions);
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.sequelize
        .authenticate({
        logging: console.log,
        plain: true,
        raw: true,
    })
        .then(() => {
        console.log("Connection has been established successfully.");
    })
        .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });
    exports.sequelize.addModels([
        user_model_1.default,
        product_category_model_1.default,
        product_sub_category_model_1.default,
        product_master_model_1.default,
        global_type_category_nodel_1.default,
        global_type_model_1.default,
        sale_model_1.default,
        sale_detail_model_1.default,
        product_review_model_1.default,
        user_address_model_1.default,
        cart_item_1.default,
        billing_cycle_model_1.default,
        product_subscription_model_1.default,
        product_stock_master_model_1.default,
        user_wallet_model_1.default,
        user_wallet_balance_model_1.default,
        promotion_model_1.Promotion,
        cms_model_1.Walkthrough,
        cms_model_1.Banner,
        cms_model_1.FAQ,
        cms_model_1.ContactForm,
        cart_model_1.default,
        lineman_model_1.default,
        customer_model_1.default,
        store_master_model_1.default,
        route_model_1.Route
    ]);
    // return sequelize;
});
