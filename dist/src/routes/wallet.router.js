"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const user_wallet_controller_1 = require("../controllers/user-wallet.controller");
const router = express_1.default.Router();
router.get("/", user_wallet_controller_1.getWalletTransactions, handle_sequelize_error_middleware_1.default);
router.get("/balance", user_wallet_controller_1.getWalletBalance, handle_sequelize_error_middleware_1.default);
router.post("/", user_wallet_controller_1.creditOrDebit, handle_sequelize_error_middleware_1.default);
exports.default = router;
