"use strict";
// a /login route that will return a JWT token
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller.");
const handle_sequelize_error_middleware_1 = __importDefault(require("../middlewares/handle-sequelize-error.middleware"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", user_controller_1.getAllUsers);
userRouter.get("/:UserGUID", user_controller_1.getUserById);
userRouter.delete("/:UserGUID", user_controller_1.deleteUserById, handle_sequelize_error_middleware_1.default);
exports.default = userRouter;
