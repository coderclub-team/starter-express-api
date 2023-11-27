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
exports.loginRequest = exports.resetPassword = exports.resetPasswordRequest = exports.verifyRegistration = exports.registerRequest = void 0;
const lineman_model_1 = __importDefault(require("../models/lineman.model"));
const zod_1 = __importStar(require("zod"));
const path_1 = __importDefault(require("path"));
const node_fs_1 = __importDefault(require("node:fs"));
const lineman_model_2 = __importDefault(require("../models/lineman.model"));
const custom_error_1 = require("../../custom.error");
const sequelize_1 = require("sequelize");
const registerRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files) {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No files were uploaded.");
        }
        else {
            Object.entries(req.files).forEach(([key, value]) => {
                req.body[`${key}_tmp`] = value[0].path;
                req.body[key] = path_1.default.join(path_1.default.join("lineman/docs"), value[0].filename);
            });
        }
    }
    try {
        const schema = zod_1.default
            .object({
            store_id: zod_1.default.string().min(1).max(50),
            name: zod_1.default.string().min(3).max(50),
            phone: zod_1.default.string().min(3).max(50),
            email: zod_1.default.string().email(),
            address: zod_1.default.string().min(3).max(50).optional(),
            city: zod_1.default.string().min(3).max(50).optional(),
            state: zod_1.default.string().min(3).max(50).optional(),
            pincode: zod_1.default.string().min(3).max(50).optional(),
            password: zod_1.default
                .string()
                .min(3)
                .max(50)
                .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Password must contain atleast one number and one special character"),
            AadhaarFrontFilePath: zod_1.default.string().optional(),
            AadhaarBackFilePath: zod_1.default.string().optional(),
            DrivingLicenceFrontFilePath: zod_1.default.string().optional(),
            DrivingLicenceBackFilePath: zod_1.default.string().optional(),
        })
            .parse(Object.assign(Object.assign({}, req.body), { store_id: req.params.store_id, AadhaarFrontFilePath: req.body.aadhaar_front, AadhaarBackFilePath: req.body.aadhaar_back, DrivingLicenceFrontFilePath: req.body.driving_licence_front, DrivingLicenceBackFilePath: req.body.driving_licence_back }));
        const lineman_exists = yield lineman_model_2.default.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { MobileNo: schema.phone },
                    { EmailAddress: schema.email }
                ]
            },
        });
        if (lineman_exists) {
            console.log("lineman_exists", lineman_exists);
            (lineman_exists === null || lineman_exists === void 0 ? void 0 : lineman_exists.MobileNo) === schema.phone ? res.status(400).json({
                message: "Mobile Number already exists!",
            }) : res.status(400).json({
                message: "Email Address already exists!",
            });
            return;
        }
        const lineman = yield lineman_model_1.default.create({
            LineManName: schema.name,
            Address: schema.address,
            City: schema.city,
            State: schema.state,
            PinCode: schema.pincode,
            MobileNo: schema.phone,
            EmailAddress: schema.email,
            StoreGUID: schema.store_id,
            linemanID: "LINAM123",
            createdDate: new Date().toISOString(),
            Password: schema.password,
            AadhaarFrontFilePath: schema.AadhaarFrontFilePath,
            AadhaarBackFilePath: schema.AadhaarBackFilePath,
            DrivingLicenceFrontFilePath: schema.DrivingLicenceFrontFilePath,
            DrivingLicenceBackFilePath: schema.DrivingLicenceBackFilePath,
            Status: 0,
        });
        if (lineman) {
            if (req.body.aadhaar_front_tmp) {
                node_fs_1.default.rename(req.body.aadhaar_front_tmp, path_1.default.join("public", req.body.aadhaar_front), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (req.body.aadhaar_back_tmp) {
                node_fs_1.default.rename(req.body.aadhaar_back_tmp, path_1.default.join("public", req.body.aadhaar_back), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (req.body.driving_licence_front_tmp) {
                node_fs_1.default.rename(req.body.driving_licence_front_tmp, path_1.default.join("public", req.body.driving_licence_front), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (req.body.driving_licence_back_tmp) {
                node_fs_1.default.rename(req.body.driving_licence_back_tmp, path_1.default.join("public", req.body.driving_licence_back), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            lineman.setFullURL(req, "AadhaarBackFilePath");
            lineman.setFullURL(req, "AadhaarFrontFilePath");
            lineman.setFullURL(req, "DrivingLicenceBackFilePath");
            lineman.setFullURL(req, "DrivingLicenceFrontFilePath");
            return res.status(201).json({
                message: "Registration successful!",
                lineman,
            });
        }
        res.send("ok");
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                error: error.errors[0].path[0] + " " + error.errors[0].message,
            });
        }
        if (req.body.aadhaar_front) {
            node_fs_1.default.unlink(req.body.aadhaar_front, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        if (req.body.aadhaar_back) {
            node_fs_1.default.unlink(req.body.aadhaar_back, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        if (req.body.driving_licence_front) {
            node_fs_1.default.unlink(req.body.driving_licence_front, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        if (req.body.driving_licence_back) {
            node_fs_1.default.unlink(req.body.driving_licence_back, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        next(error);
    }
});
exports.registerRequest = registerRequest;
const verifyRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile_no, otp } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const lineman = yield lineman_model_2.default.findOne({
            where: {
                MobileNo: mobile_no,
            },
            paranoid,
        });
        if (!lineman) {
            return res.status(400).json({
                message: "Account not found!",
            });
        }
        yield lineman.verifyOTP(otp);
        res.status(200).json({
            message: "Account verified successfully!",
            lineman,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyRegistration = verifyRegistration;
const resetPasswordRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile_no } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const lineman = yield lineman_model_2.default.findOne({
            where: {
                MobileNo: mobile_no,
            },
            paranoid,
        });
        if (!lineman) {
            throw new custom_error_1.UserNotFoundExceptionError("Account not found!");
        }
        yield (lineman === null || lineman === void 0 ? void 0 : lineman.sendOTP());
        res.status(200).json({
            message: "OTP sent successfully!",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPasswordRequest = resetPasswordRequest;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile_no, otp, password, email } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const lineman = yield lineman_model_2.default.findOne({
            where: {
                MobileNo: mobile_no,
            },
            paranoid,
        });
        if (!lineman) {
            return res.status(400).json({
                message: "Account not found!",
            });
        }
        yield lineman.resetPassword(password, otp, email, mobile_no);
        res.status(200).json({
            message: "Password reset successfully!",
            lineman,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const loginRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobile_no, password } = req.body;
    try {
        if (!mobile_no || !password) {
            throw new Error("MobileNo or Password is missing");
        }
        const lineman = yield lineman_model_2.default.findOne({
            where: {
                MobileNo: mobile_no,
            },
        });
        lineman === null || lineman === void 0 ? void 0 : lineman.setFullURL(req, "AadhaarBackFilePath");
        lineman === null || lineman === void 0 ? void 0 : lineman.setFullURL(req, "AadhaarFrontFilePath");
        lineman === null || lineman === void 0 ? void 0 : lineman.setFullURL(req, "DrivingLicenceBackFilePath");
        lineman === null || lineman === void 0 ? void 0 : lineman.setFullURL(req, "DrivingLicenceFrontFilePath");
        if (!lineman) {
            throw new custom_error_1.UserNotFoundExceptionError("User not found!");
        }
        // user.setFullURL(req, "PhotoPath");
        const token = yield (lineman === null || lineman === void 0 ? void 0 : lineman.authenticate(password));
        res.status(200).json({
            message: "Login successful!",
            lineman,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginRequest = loginRequest;
