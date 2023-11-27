"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var Lineman_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const message_class_1 = __importDefault(require("../entities/message.class"));
const user_model_1 = __importDefault(require("./user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let Lineman = Lineman_1 = class Lineman extends sequelize_typescript_1.Model {
    static hashPassword(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance.Password) {
                const salt = yield bcrypt_1.default.genSalt(10);
                const hash = yield bcrypt_1.default.hash(instance.Password, salt);
                instance.Password = hash;
                const { OTP, OtpExpiryDate } = instance.generateOTP();
                instance.OTP = OTP;
                instance.OtpExpiryDate = OtpExpiryDate;
                return instance;
            }
        });
    }
    generateOTP() {
        const digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        if (process.env.NODE_ENV !== "production") {
            OTP = "998877";
        }
        // one hour from now
        const OtpExpiryDate = new Date(Date.now() + 60 * 60 * 1000);
        return {
            OTP,
            OtpExpiryDate,
        };
    }
    sendOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("sendOTP-this", this);
            try {
                // if (this.Status == 0) {
                //   console.log("sendOTP-this.Status", this.Status);
                //   return Promise.reject("Account is not activated");
                // } else
                if (this.Account_Deactivated) {
                    return Promise.reject("Account is deactivated by admin");
                }
                // else if (this.Password_Attempt && this.Password_Attempt >= 3) {
                //   return Promise.reject("Account is locked due to multiple attempts");
                // }
                const { OTP, OtpExpiryDate } = this.generateOTP();
                this.OTP = OTP;
                this.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;
                yield message_class_1.default.sendOTPMessage({
                    MobileNo: this.getDataValue("MobileNo"),
                    OTP: OTP,
                });
                return yield this.save();
            }
            catch (error) {
                return Promise.reject(error.message);
            }
        });
    }
    static sendOTPMessage(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance.MobileNo) {
                const { OTP, OtpExpiryDate } = instance;
                instance.OTP = OTP;
                instance.OtpExpiryDate = OtpExpiryDate;
                yield message_class_1.default.sendWelcomeMessage({
                    MobileNo: instance.getDataValue("MobileNo"),
                    OTP: OTP,
                });
            }
        });
    }
    verifyOTP(otp) {
        try {
            if (!otp) {
                return Promise.reject("OTP is required");
            }
            else if (!this.OTP) {
                return Promise.reject("OTP is not generated");
            }
            else if (this.OTP != otp) {
                return Promise.reject("OTP is incorrect");
            }
            else if (this.OtpExpiryDate &&
                (0, moment_1.default)(this.OtpExpiryDate).isBefore((0, moment_1.default)())) {
                return Promise.reject("OTP is expired");
            }
            this.OTP = null;
            this.OtpExpiryDate = null;
            this.Password_Attempt = 0;
            this.IsPhoneVerified = 1;
            this.Status = 1;
            return this.save();
        }
        catch (error) {
            return Promise.reject(error.message);
        }
    }
    resetPassword(password, otp, email, mobileno) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!password) {
                    return Promise.reject("Password is required");
                }
                else if (!this.OTP) {
                    return Promise.reject("OTP is not generated");
                }
                else if (this.OTP != otp) {
                    return Promise.reject("OTP is incorrect");
                }
                else if (!this.OtpExpiryDate) {
                    return Promise.reject("OTP is not generated");
                }
                else if ((0, moment_1.default)(this.OtpExpiryDate).isBefore((0, moment_1.default)())) {
                    return Promise.reject("OTP is expired");
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const hash = yield bcrypt_1.default.hash(password, salt);
                this.Password = hash;
                this.OTP = null;
                this.OtpExpiryDate = null;
                this.Password_Attempt = 0;
                this.Status = 1;
                if (email) {
                    this.EmailAddress = email;
                }
                if (mobileno) {
                    this.MobileNo = mobileno;
                }
                return yield this.save({
                    fields: ["Password", "OTP", "OtpExpiryDate", "Password_Attempt"],
                });
            }
            catch (error) {
                return Promise.reject(error.message);
            }
        });
    }
    forgetPassword(PhoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lineman = yield Lineman_1.findOne({
                    where: {
                        PhoneNumber: PhoneNumber,
                    },
                });
                if (!lineman) {
                    return Promise.reject("lineman not found");
                }
                const { OTP, OtpExpiryDate } = lineman.generateOTP();
                lineman.OTP = OTP;
                lineman.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;
                return yield lineman.save();
            }
            catch (error) {
                return Promise.reject(error.message);
            }
        });
    }
    static beforeBulkCreateHook(instances) {
        instances.forEach((instance) => {
            Object.entries(instance.toJSON()).forEach(([key, value]) => {
                if (typeof value === "string") {
                    instance.setDataValue(key, value.trim());
                }
            });
        });
    }
    static beforeCreateHook(instance) {
        Object.entries(instance.toJSON()).forEach(([key, value]) => {
            if (typeof value === "string") {
                instance.setDataValue(key, value.trim());
            }
        });
    }
    static afterCreateHook(instance) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            instance.LineManID =
                "LM" + ((_a = instance.LineManGUID) === null || _a === void 0 ? void 0 : _a.toString().padStart(6, "0"));
            try {
                yield instance.save();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    setFullURL(request, key) {
        const hostname = request.protocol + "://" + request.get("host");
        const originalPath = this.getDataValue(key) || "identities/lineman-identity.png";
        if (!originalPath)
            return;
        const fullPath = `${hostname}/${originalPath}`;
        this.setDataValue(key, fullPath);
    }
    authenticate(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!password) {
                return Promise.reject("Password is required");
            }
            // else if (this.Password_Attempt && this.Password_Attempt >= 3) {
            //   return Promise.reject(
            //     "Account is locked due to multiple incorrect password attempts"
            //   );
            // }
            else if (this.Account_Deactivated) {
                return Promise.reject("Account is deactivated");
            }
            else if (this.Status == 0) {
                return Promise.reject("Account is not activated");
            }
            else if (!(yield bcrypt_1.default.compare(password, this.Password))) {
                if (this.Password_Attempt) {
                    this.Password_Attempt = this.Password_Attempt + 1;
                }
                else {
                    this.Password_Attempt = 1;
                }
                yield this.save({
                    fields: ["Password_Attempt"],
                });
                return Promise.reject("Incorrect password");
            }
            else if (this.Status == 0) {
                return Promise.reject("Account is not activated");
            }
            try {
                if (process.env.JWT_SECRET) {
                    const token = jsonwebtoken_1.default.sign(this.get({ plain: true }), process.env.JWT_SECRET, {
                        expiresIn: "1d",
                    });
                    return Promise.resolve(token);
                }
                else {
                    throw new Error("JWT_SECRET not found");
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Lineman.prototype, "LineManGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "LineManID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "LineManName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "Address", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "City", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "State", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "PinCode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "MobileNo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "EmailAddress", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "ShopID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "StoreGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    __metadata("design:type", Object)
], Lineman.prototype, "CreatedGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Lineman.prototype, "CreatedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Lineman.prototype, "ModifiedGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Lineman.prototype, "DeletedGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Lineman.prototype, "ModifiedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Lineman.prototype, "DeletedDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "CommissionStatusGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "IncentiveStatusGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "IsActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "Password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TINYINT,
        defaultValue: 0,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Lineman.prototype, "Password_Attempt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Lineman.prototype, "Account_Deactivated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Lineman.prototype, "OTP", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Lineman.prototype, "IsPhoneVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Lineman.prototype, "OtpExpiryDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "DeviceToken", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "DeviceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Lineman.prototype, "Logouttime", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Lineman.prototype, "Status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "AadhaarFrontFilePath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "AadhaarBackFilePath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "DrivingLicenceFrontFilePath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Lineman.prototype, "DrivingLicenceBackFilePath", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Lineman]),
    __metadata("design:returntype", Promise)
], Lineman, "hashPassword", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.default]),
    __metadata("design:returntype", Promise)
], Lineman, "sendOTPMessage", null);
__decorate([
    sequelize_typescript_1.BeforeBulkCreate,
    sequelize_typescript_1.BeforeBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], Lineman, "beforeBulkCreateHook", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Lineman]),
    __metadata("design:returntype", void 0)
], Lineman, "beforeCreateHook", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Lineman]),
    __metadata("design:returntype", Promise)
], Lineman, "afterCreateHook", null);
Lineman = Lineman_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Lineman",
        createdAt: "CreatedDate",
        updatedAt: false,
        deletedAt: false,
    })
], Lineman);
exports.default = Lineman;
