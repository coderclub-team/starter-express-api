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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_address_model_1 = __importDefault(require("./user-address.model"));
const message_class_1 = __importDefault(require("../entities/message.class"));
const product_subscription_model_1 = __importDefault(require("./product-subscription.model"));
const route_model_1 = require("./route.model");
const sale_model_1 = __importDefault(require("./sale.model"));
// 
let User = User_1 = class User extends sequelize_typescript_1.Model {
    get token() {
        return this.token;
    }
    set token(token) {
        this._token = token;
    }
    static hashPassword(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance.Password) {
                const salt = yield bcrypt_1.default.genSalt(10);
                const hash = yield bcrypt_1.default.hash(instance.Password, salt);
                instance.Password = hash;
                const { OTP, OtpExpiryDate } = instance.generateOTP();
                instance.OTP = OTP;
                instance.OtpExpiryDate = OtpExpiryDate;
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
                const user = yield User_1.findOne({
                    where: {
                        PhoneNumber: PhoneNumber,
                    },
                });
                if (!user) {
                    return Promise.reject("User not found");
                }
                const { OTP, OtpExpiryDate } = user.generateOTP();
                user.OTP = OTP;
                user.OtpExpiryDate = OtpExpiryDate ? OtpExpiryDate : null;
                return yield user.save();
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
        // get next identity value
    }
    setFullURL(request, key) {
        const hostname = request.protocol + "://" + request.get("host");
        const originalPath = this.getDataValue(key) || "identities/user-identity.png";
        if (!originalPath)
            return;
        const fullPath = `${hostname}/${originalPath}`;
        this.setDataValue(key, fullPath);
    }
};
User.fields = {
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false, exclude: true },
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "UserGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            // regex for First Name
            is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "FirstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            notEmpty: true,
            // regex for Last Name
            is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "LastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        validate: {
            notEmpty: true,
            // regex for Full Name
            is: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "FullName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        validate: {
            isIn: [["Male", "Female", "Transgender", null]],
        },
    }),
    __metadata("design:type", String)
], User.prototype, "Gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "DoorNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "Street", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "Area", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "Landmark", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        defaultValue: "./identities/user-identity.png",
    }),
    __metadata("design:type", String)
], User.prototype, "PhotoPath", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "LoginName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "Password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
        validate: {
            isEmail: true,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "EmailAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        unique: true,
        allowNull: false,
        validate: {
            // regex for mobile number
            is: /^[0-9]{10,15}$/,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "MobileNo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.NUMBER,
        allowNull: true,
        validate: {
            // regex for landline
            is: /^[0-9-]{10,20}$/,
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "Landline", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => user_address_model_1.default),
    __metadata("design:type", Number)
], User.prototype, "PrimaryAddressGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
        validate: {
            isEighteenOrOlder: function (value) {
                if (!value)
                    return;
                // Calculate user's age based on date of birth
                const age = (0, moment_1.default)().diff((0, moment_1.default)(value), "years");
                // Check if user is at least 18 years old
                if (age < 18) {
                    throw new Error("User must be at least 18 years old");
                }
            },
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "DOB", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        validate: {},
    }),
    __metadata("design:type", Object)
], User.prototype, "Address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        validate: {},
    }),
    __metadata("design:type", Object)
], User.prototype, "City", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        validate: {},
    }),
    __metadata("design:type", Number)
], User.prototype, "State", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.NUMBER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "Status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TINYINT,
        defaultValue: null,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "Password_Attempt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "Account_Deactivated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "OTP", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "OtpExpiryDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "DeviceToken", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "DeviceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "Logouttime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "AuthID", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Object)
], User.prototype, "CreatedDate", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Object)
], User.prototype, "ModifiedDate", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Object)
], User.prototype, "DeletedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "CreatedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "ModifiedGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => route_model_1.Route),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "RouteRefGUID", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => route_model_1.Route),
    __metadata("design:type", route_model_1.Route)
], User.prototype, "Route", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "StoreGUID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "DigitalCard", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_address_model_1.default),
    __metadata("design:type", user_address_model_1.default)
], User.prototype, "Addresses", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => product_subscription_model_1.default),
    __metadata("design:type", Array)
], User.prototype, "Subscriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sale_model_1.default),
    __metadata("design:type", Array)
], User.prototype, "Orders", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "sendOTPMessage", null);
__decorate([
    sequelize_typescript_1.BeforeBulkCreate,
    sequelize_typescript_1.BeforeBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], User, "beforeBulkCreateHook", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "beforeCreateHook", null);
User = User_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "tbl_Users",
        timestamps: true,
        paranoid: true,
    })
], User);
exports.default = User;
