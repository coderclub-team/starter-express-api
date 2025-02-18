"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../../config");
const user_controller_1 = require("../controllers/user.controller.");
const auth_controller_1 = require("../controllers/auth.controller");
const payment_controller_1 = require("../controllers/payment.controller");
const sale_controller_1 = require("../controllers/sale.controller");
const user_controller_2 = require("../controllers/user.controller.");
const coupon_gaurd_moddleware_1 = __importDefault(require("../middlewares/coupon-gaurd.moddleware"));
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const auth_gaurd_middleware_1 = __importDefault(require("../middlewares/auth-gaurd.middleware"));
const wallet_balance_middleware_1 = __importDefault(require("../middlewares/wallet-balance.middleware"));
const cart_controller_1 = require("../controllers/cart.controller");
const meRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: config_1.userImageUploadOptions.storage,
    limits: config_1.userImageUploadOptions.limits,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});
meRouter.post("/login", user_controller_1.login, handle_sequelize_error_middleware_1.default);
meRouter.post("/register", upload.single("file"), user_controller_1.register, handle_sequelize_error_middleware_1.default);
// const upload = multer({
//   storage: userImageUploadOptions.storage,
//   limits: userImageUploadOptions.limits,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//     }
//   },
// });
meRouter.put("/", upload.single("file"), auth_gaurd_middleware_1.default, user_controller_2.updateUserById, handle_sequelize_error_middleware_1.default);
meRouter.post("/verify-account", user_controller_1.verifyAccount, handle_sequelize_error_middleware_1.default);
meRouter.post("/send-otp", user_controller_1.sendOTP, handle_sequelize_error_middleware_1.default);
meRouter.post("/reset-password", user_controller_1.resetPassword, handle_sequelize_error_middleware_1.default);
meRouter.post("/update-email", user_controller_1.resetPassword, handle_sequelize_error_middleware_1.default);
meRouter.post("/forget-password", user_controller_1.forgotPassword, handle_sequelize_error_middleware_1.default);
meRouter.get("/", auth_gaurd_middleware_1.default, user_controller_1.getCurrentUser, handle_sequelize_error_middleware_1.default);
meRouter.get("/orders", auth_gaurd_middleware_1.default, auth_controller_1.getOrders, handle_sequelize_error_middleware_1.default);
meRouter.post("/orders", auth_gaurd_middleware_1.default, coupon_gaurd_moddleware_1.default, wallet_balance_middleware_1.default, sale_controller_1.createSale, handle_sequelize_error_middleware_1.default);
meRouter.patch("/orders/:SalesMasterGUID", auth_gaurd_middleware_1.default, auth_controller_1.cancelOrder, handle_sequelize_error_middleware_1.default);
meRouter.get("/orders/payments/createOrder", auth_gaurd_middleware_1.default, payment_controller_1.generateRazorpayIntent, handle_sequelize_error_middleware_1.default);
meRouter.get("/cart", auth_gaurd_middleware_1.default, cart_controller_1.getCart, handle_sequelize_error_middleware_1.default);
meRouter.post("/cart", auth_gaurd_middleware_1.default, cart_controller_1.addToCart, handle_sequelize_error_middleware_1.default);
meRouter.patch("/cart", auth_gaurd_middleware_1.default, cart_controller_1.removeFromCart, handle_sequelize_error_middleware_1.default);
meRouter.post("/cart/checkout", auth_gaurd_middleware_1.default, wallet_balance_middleware_1.default, cart_controller_1.moveFromCartToOrder, handle_sequelize_error_middleware_1.default);
exports.default = meRouter;
