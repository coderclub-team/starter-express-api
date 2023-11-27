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
exports.signout = exports.resetPassword = exports.forgotPassword = exports.sendOTP = exports.verifyAccount = exports.getCurrentUser = exports.login = exports.register = exports.addCartItem = exports.getCartItems = exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const config_1 = require("../../config");
const user_address_model_1 = __importDefault(require("../models/user-address.model"));
const cart_item_1 = __importDefault(require("../models/cart-item"));
const sequelize_1 = require("sequelize");
const product_master_model_1 = __importDefault(require("../models/product-master.model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const users = yield user_model_1.default.findAll({
            attributes: {
                exclude: [
                    "CreatedGUID",
                    "ModifiedGUID",
                    "CreatedDate",
                    "ModifiedDate",
                    "DeletedDate",
                ],
            },
            paranoid,
            include: [user_address_model_1.default],
        });
        users.forEach((user) => {
            user.setFullURL(req, "PhotoPath");
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserGUID } = req.params;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                UserGUID,
            },
            paranoid,
            include: [user_address_model_1.default],
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            });
        }
        user.setFullURL(req, "PhotoPath");
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getUserById = getUserById;
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body===>", JSON.stringify(req.body.user));
    res.status(200).json({ message: "User updated successfully!" });
    // const { UserGUID } = req.body.user;
    // const { deleted } = req.query;
    // const paranoid = deleted === "true" ? false : true;
    // if (req.file) {
    //   const { filename, path: tmpPath } = req.file;
    //   req.body.tmpPath = tmpPath;
    //   req.body.uploadPath = path.join(
    //     userImageUploadOptions.relativePath,
    //     filename
    //   );
    //   req.body.PhotoPath = path.join(userImageUploadOptions.directory, filename);
    // }
    // try {
    //   let user = await User.findByPk(UserGUID, {
    //     paranoid,
    //   });
    //   if (user && user.DeletedDate && !paranoid) {
    //     await user.restore();
    //     // user.DeletedDate = null;
    //   } else if (!user) {
    //     return res.status(400).json({ message: "User not found!" });
    //   }
    //   const oldPhotoPath = user.PhotoPath;
    //   delete req.body.MobileNo;
    //   delete req.body.Password;
    //   Object.keys(req.body).forEach((key: string) => {
    //     if (user) {
    //       user.setDataValue(key, req.body[key]);
    //     }
    //   });
    //   if (req.body.tmpPath && req.body.uploadPath) {
    //     fs.rename(req.body.tmpPath, req.body.uploadPath, (err) => {
    //       if (err) console.log(err);
    //       else {
    //         user?.setFullURL(req, "PhotoPath");
    //       }
    //     });
    //   }
    //   if (oldPhotoPath && oldPhotoPath !== user.PhotoPath) {
    //     fs.unlink(
    //       path.join(
    //         userImageUploadOptions.relativePath,
    //         path.basename(oldPhotoPath)
    //       ),
    //       (err) => {
    //         if (err) console.log(err);
    //         else console.log("Old photo deleted successfully!");
    //       }
    //     );
    //   }
    //   await user.save();
    //   res.status(201).json({ message: "User updated successfully!", user: user });
    // } catch (error) {
    //   next(error);
    // }
});
exports.updateUserById = updateUserById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deleted } = req.query;
    const { UserGUID } = req.params;
    const paranoid = deleted === "true" ? false : true;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                UserGUID,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            });
        }
        yield user.destroy({
            force: !paranoid,
        });
        return res.status(200).json({
            message: "User deleted successfully!",
            user,
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.deleteUserById = deleteUserById;
const getCartItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    try {
        const cartItems = yield cart_item_1.default.findAll({
            where: {
                CreatedGUID: {
                    [sequelize_1.Op.eq]: req.body.CreatedGUID,
                },
            },
            include: [product_master_model_1.default],
        });
        cartItems === null || cartItems === void 0 ? void 0 : cartItems.forEach((item) => {
            var _a;
            return (_a = item.Product) === null || _a === void 0 ? void 0 : _a.setFullURL(req, "PhotoPath");
        });
        res.status(200).send({
            CartItem: cartItems,
            CartTotal: yield cartTotal(req)
        });
    }
    catch (error) {
        console.log("message===>", error === null || error === void 0 ? void 0 : error.message);
        next(error);
    }
});
exports.getCartItems = getCartItems;
const addCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserGUID } = req.body.user;
    const { Quantity, ProductGUID } = req.body;
    if (!ProductGUID || !Quantity) {
        throw Error("ProductGUID and Quantity is required to add cart item!");
    }
    try {
        //  mutating existing item
        const item = yield cart_item_1.default.findOne({
            where: {
                ProductGUID,
                CreatedGUID: UserGUID,
            },
            include: [product_master_model_1.default],
        });
        if (item) {
            item.Quantity += req.body.Quantity;
            if (item.Quantity < 0) {
                throw Error(`Cart item quantity ${item.Quantity} not allowed!`);
            }
            else if (item.Quantity === 0) {
                item.destroy();
                return res.status(200).send({
                    message: "CartItem deleted successfully!",
                    CartItem: null,
                    cartTotal: yield cartTotal(req)
                });
            }
            yield item.save();
            return res.status(200).send({
                message: "CartItem updated successfully!",
                CartItem: item,
                cartTotal: yield cartTotal(req)
            });
        }
        //  mutating existing item
        if (req.body.Quantity < 1) {
            throw Error("Minimum Quantity is required to add cart item!");
        }
        const cartitem = yield cart_item_1.default.create(Object.assign(Object.assign({}, req.body), { CreatedGUID: UserGUID }), {
            include: [product_master_model_1.default],
        });
        res.status(200).send({
            message: "CartItem added successfully!",
            CartItem: cartitem,
            cartTotal: yield cartTotal(req),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addCartItem = addCartItem;
const cartTotal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserGUID } = req.body.user;
    const items = yield cart_item_1.default.findAll({
        where: {
            CreatedGUID: {
                [sequelize_1.Op.eq]: UserGUID,
            },
        },
        include: [product_master_model_1.default],
    });
    const total = items.reduce((acc, item) => {
        var _a, _b, _c;
        const qty = item === null || item === void 0 ? void 0 : item.getDataValue("Quantity");
        const sale_price = ((_a = item === null || item === void 0 ? void 0 : item.Product) === null || _a === void 0 ? void 0 : _a.getDataValue("SaleRate")) ||
            ((_b = item === null || item === void 0 ? void 0 : item.Product) === null || _b === void 0 ? void 0 : _b.getDataValue("UnitPrice")) ||
            ((_c = item === null || item === void 0 ? void 0 : item.Product) === null || _c === void 0 ? void 0 : _c.getDataValue("MRP"));
        return acc + qty * sale_price;
    }, 0);
    return total;
});
// auth controller
const custom_error_1 = require("../../custom.error");
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const { filename, path: tmpPath } = req.file;
        req.body.tmpPath = tmpPath;
        req.body.uploadPath = node_path_1.default.join(config_1.userImageUploadOptions.relativePath, filename);
        req.body.PhotoPath = node_path_1.default.join(config_1.userImageUploadOptions.directory, filename);
    }
    try {
        const createdUser = yield user_model_1.default.create(req.body);
        if (!createdUser) {
            throw new custom_error_1.UserNotFoundExceptionError("User not found!");
        }
        if (req.file) {
            node_fs_1.default.rename(req.body.tmpPath, req.body.uploadPath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            createdUser.setFullURL(req, "PhotoPath");
        }
        return res.status(201).json({
            message: "User created successfully!",
            user: createdUser,
        });
    }
    catch (error) {
        // remove the uploaded file
        if (req.body.tmpPath) {
            node_fs_1.default.unlink(req.body.tmpPath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { MobileNo, Password } = req.body;
    try {
        if (!MobileNo || !Password) {
            throw new Error("MobileNo or Password is missing");
        }
        const user = yield user_model_1.default.findOne({
            where: {
                MobileNo: MobileNo,
            },
            include: [user_address_model_1.default, product_subscription_model_1.default],
        });
        if (!user) {
            throw new custom_error_1.UserNotFoundExceptionError("User not found!");
        }
        user.setFullURL(req, "PhotoPath");
        const token = yield (user === null || user === void 0 ? void 0 : user.authenticate(Password));
        res.status(200).json({
            message: "Login successful!",
            user,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get user fromtoken
    try {
        console.log("auth_user==>", req.body.user);
        const user = yield user_model_1.default.findByPk(req.body.user.UserGUID, {
            attributes: {
                exclude: ["Password"],
            },
            include: [user_address_model_1.default],
        });
        user === null || user === void 0 ? void 0 : user.setFullURL(req, "PhotoPath");
        res.json([user]);
    }
    catch (error) {
        next(error);
    }
});
exports.getCurrentUser = getCurrentUser;
const verifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { MobileNo, OTP } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                MobileNo,
            },
            paranoid,
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            });
        }
        yield user.verifyOTP(OTP);
        res.status(200).json({
            message: "User verified successfully!",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyAccount = verifyAccount;
const sendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { MobileNo } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                MobileNo,
            },
            paranoid,
        });
        if (!user) {
            throw new custom_error_1.UserNotFoundExceptionError("User not found!");
        }
        yield (user === null || user === void 0 ? void 0 : user.sendOTP());
        res.status(200).json({
            message: "OTP sent successfully!",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendOTP = sendOTP;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { MobileNo } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                MobileNo,
            },
            paranoid,
        });
        if (!user) {
            throw new custom_error_1.UserNotFoundExceptionError("User not found!");
        }
        yield (user === null || user === void 0 ? void 0 : user.sendOTP());
        res.status(200).json({
            message: "OTP sent successfully!",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // reset password by verifying OTP
    const { MobileNo, OTP, Password, EmailAddress } = req.body;
    const { deleted } = req.query;
    const paranoid = deleted === "true" ? false : true;
    try {
        const user = yield user_model_1.default.findOne({
            where: {
                MobileNo,
            },
            paranoid,
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            });
        }
        yield user.resetPassword(Password, OTP, EmailAddress, MobileNo);
        res.status(200).json({
            message: "Password reset successfully!",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        message: "Signout should be implemented at the Frontend side!",
    });
});
exports.signout = signout;
