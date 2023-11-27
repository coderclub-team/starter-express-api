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
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../models/user.model"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const custom_error_1 = require("../../custom.error");
const uniqueUserGaurd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { MobileNo, EmailAddress, LoginName } = req.body;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ MobileNo }, { EmailAddress }, { LoginName }],
            },
        });
        if (user) {
            if (user.MobileNo === MobileNo) {
                throw new custom_error_1.UniqueUserException("MobileNo already exists!");
                //
            }
            else if (user.EmailAddress === EmailAddress) {
                throw new custom_error_1.UniqueUserException(`EmailAddress ${user.EmailAddress} already exists!`);
            }
            else if (user.LoginName === LoginName) {
                throw new custom_error_1.UniqueUserException(`LoginName ${user.LoginName} already exists!`);
            }
            else {
                throw new custom_error_1.UniqueUserException("User already exists!");
            }
        }
        next();
    }
    catch (error) {
        if (req.file) {
            const tmpPath = node_path_1.default.join("public/tmp", (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename);
            node_fs_1.default.existsSync(tmpPath) && node_fs_1.default.unlinkSync(tmpPath);
        }
        return res.status(400).json(error);
    }
});
exports.default = uniqueUserGaurd;
