"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller.");
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const router = express_1.default.Router();
router.get("", user_controller_1.getCartItems, handle_sequelize_error_middleware_1.default);
router.post("", user_controller_1.addCartItem, handle_sequelize_error_middleware_1.default);
exports.default = router;
