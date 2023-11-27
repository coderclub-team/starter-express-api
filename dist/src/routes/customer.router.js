"use strict";
// // a /login route that will return a JWT token
Object.defineProperty(exports, "__esModule", { value: true });
// import { Router } from "express";
// import multer from "multer";
// import { userImageUploadOptions } from "../../config";
// import {
//   login,
//   register,
//   sendOTP,
//   resetPassword,
//   verifyAccount,
//   forgotPassword,
//   getCurrentUser,
// } from "../controllers/user.controller.";
// import {  cancelOrder, getOrders } from "../controllers/auth.controller"
// import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
// import authGaurd from "../middlewares/auth-gaurd.middleware";
// import { updateUserById } from "../controllers/user.controller.";
// import { generateRazorpayIntent } from "../controllers/payment.controller";
// import couponGuard from "../middlewares/coupon-gaurd.moddleware";
// import WalletBalanceMiddleWare from "../middlewares/wallet-balance.middleware";
// import { createSale } from "../controllers/sale.controller";
// const authRouter = Router();
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
// authRouter.post("/login", login, handleSequelizeError);
// authRouter.post(
//   "/register",
//   upload.single("file"),
//   register,
//   handleSequelizeError
// );
// authRouter.put(
//   "/current-user",
//   upload.single("file"),
//   authGaurd,
//   updateUserById,
//   handleSequelizeError
// );
// authRouter.post("/verify-account", verifyAccount, handleSequelizeError);
// authRouter.post("/send-otp", sendOTP, handleSequelizeError);
// authRouter.post("/reset-password", resetPassword, handleSequelizeError);
// authRouter.post("/update-email", resetPassword, handleSequelizeError);
// authRouter.post("/forget-password", forgotPassword, handleSequelizeError);
// authRouter.get("/current-user",  authGaurd, getCurrentUser, handleSequelizeError);
// authRouter.get("/orders", authGaurd, getOrders,handleSequelizeError);
// authRouter.post("/orders", authGaurd,couponGuard,WalletBalanceMiddleWare, createSale,handleSequelizeError);
// authRouter.patch("/orders/:SalesMasterGUID", authGaurd, cancelOrder,handleSequelizeError);
// authRouter.get("/orders/payments/createOrder", authGaurd,generateRazorpayIntent,handleSequelizeError);
// export default authRouter;
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    const params = req.params;
    res.send(req.params);
    console.log("Customer Router Called", params);
    next();
});
router.get("/all", customer_controller_1.findAll);
router.get("/:id", customer_controller_1.findOneById);
router.post("/create/request", customer_controller_1.createCustomerRequest);
exports.default = router;
