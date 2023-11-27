"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const user_address_conroller_1 = require("../controllers/user-address.conroller");
const router = express_1.default.Router();
router.get("/:me", user_address_conroller_1.getMyAddresses, handle_sequelize_error_middleware_1.default);
router.post("", user_address_conroller_1.createAddress, handle_sequelize_error_middleware_1.default);
router.put("/:AddressGUID", user_address_conroller_1.updateAddress, handle_sequelize_error_middleware_1.default);
router.delete("/:AddressGUID", user_address_conroller_1.deleteAddress, handle_sequelize_error_middleware_1.default);
exports.default = router;
