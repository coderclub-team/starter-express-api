"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/**
 * FILEPATH: /Users/arul/shalom/coderclub-app100/src/server.ts
 *
 * This file contains the server configuration and routing logic for the application.
 * It imports the necessary modules and sets up the server to listen on port 3000.
 */
const database_1 = __importDefault(require("./database"));
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config().parsed;
const node_cron_1 = __importDefault(require("node-cron"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const auth_gaurd_middleware_1 = __importDefault(require("./middlewares/auth-gaurd.middleware"));
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const product_category_router_1 = __importDefault(require("./routes/product-category.router"));
const product_sub_category_router_1 = __importDefault(require("./routes/product-sub-category.router"));
const product_master_router_1 = __importDefault(require("./routes/product-master.router"));
const sale_router_1 = __importDefault(require("./routes/sale.router"));
const cart_item_router_1 = __importDefault(require("./routes/cart-item.router"));
const user_address_route_1 = __importDefault(require("./routes/user-address.route"));
const product_subscription_router_1 = __importDefault(require("./routes/product-subscription.router"));
const handle_sequelize_error_middleware_1 = __importDefault(require("./middlewares/handle-sequelize-error.middleware"));
const general_router_1 = require("./routes/general.router");
const wallet_router_1 = __importDefault(require("./routes/wallet.router"));
const app_config_router_1 = __importDefault(require("./routes/app-config.router"));
const static_info_router_1 = __importDefault(require("./routes/static-info.router"));
const lineman_router_1 = __importDefault(require("./routes/lineman.router"));
const store_router_1 = __importDefault(require("./routes/store.router"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const promotion_router_1 = __importDefault(require("./routes/promotion.router"));
const product_subscription_controller_1 = require("./controllers/product-subscription.controller");
const me_router_1 = __importDefault(require("./routes/me-router"));
const mock_router_1 = __importDefault(require("./routes/mock.router"));
// Set the base URL and store it in app.locals
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
// parse application/json
app.use(express_useragent_1.default.express());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
console.log("Connecting to DB", node_path_1.default.join("public"));
// Database connection
(0, database_1.default)()
    .then((r) => console.log("Connected to DB"))
    .catch((e) => console.log("Error connecting to DB", e));
app.use("/api/users", auth_gaurd_middleware_1.default, user_router_1.default);
app.use("/api/cartitems", auth_gaurd_middleware_1.default, cart_item_router_1.default);
app.use("/api/addresses", auth_gaurd_middleware_1.default, user_address_route_1.default);
app.use("/api/wallets", auth_gaurd_middleware_1.default, wallet_router_1.default, handle_sequelize_error_middleware_1.default);
app.use("/api/sales", auth_gaurd_middleware_1.default, sale_router_1.default);
app.use("/api/subscriptions", auth_gaurd_middleware_1.default, product_subscription_router_1.default, handle_sequelize_error_middleware_1.default);
app.use("/api/productMasters", product_master_router_1.default);
app.use("/api/productcategories", product_category_router_1.default);
app.use("/api/productsubcategories", product_sub_category_router_1.default);
app.use("/api", auth_router_1.default);
app.use("/api/me", me_router_1.default);
app.use("/api/billingcycles", general_router_1.billingcyclesRouter, handle_sequelize_error_middleware_1.default);
app.use("/api/promotions", promotion_router_1.default, handle_sequelize_error_middleware_1.default);
app.use("/api/app/config", app_config_router_1.default, handle_sequelize_error_middleware_1.default);
app.use("/api/static-info", static_info_router_1.default, handle_sequelize_error_middleware_1.default);
app.use("/api/stores", auth_gaurd_middleware_1.default, store_router_1.default, handle_sequelize_error_middleware_1.default);
///////
app.use("/api/lineman", lineman_router_1.default, handle_sequelize_error_middleware_1.default);
app.use("/api/mock", mock_router_1.default);
// app listening on port 3000 
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
// cron job updating subscription status
node_cron_1.default.schedule("0 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, product_subscription_controller_1.expireSubscription)();
    console.log("running a task every day at 12:00 am");
}), {
    scheduled: true,
    timezone: "Asia/Kolkata",
});
