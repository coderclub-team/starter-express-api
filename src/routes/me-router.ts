import { Router } from "express";
import multer from "multer";

import { userImageUploadOptions } from "../../config";
import { login, verifyAccount, sendOTP, resetPassword, forgotPassword, getCurrentUser, register,} from "../controllers/user.controller.";

import { getOrders, cancelOrder } from "../controllers/auth.controller";
import { generateRazorpayIntent } from "../controllers/payment.controller";
import { createSale } from "../controllers/sale.controller";
import { updateUserById } from "../controllers/user.controller.";
import couponGuard from "../middlewares/coupon-gaurd.moddleware";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
import authGaurd from "../middlewares/auth-gaurd.middleware";
import WalletBalanceMiddleWare from "../middlewares/wallet-balance.middleware";
import {addToCart, getCart, moveFromCartToOrder, removeFromCart} from "../controllers/cart.controller";
const meRouter = Router();

const upload = multer({
    storage: userImageUploadOptions.storage,
    limits: userImageUploadOptions.limits,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  });
  
  meRouter.post("/login", login, handleSequelizeError);
  meRouter.post(
    "/register",
    upload.single("file"),
    register,
    handleSequelizeError
  );
  
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
  
  meRouter.put(
    "/",
    upload.single("file"),
    authGaurd,
    updateUserById,
    handleSequelizeError
  );
  
  
  meRouter.post("/verify-account", verifyAccount, handleSequelizeError);
  meRouter.post("/send-otp", sendOTP, handleSequelizeError);
  meRouter.post("/reset-password", resetPassword, handleSequelizeError);
  meRouter.post("/update-email", resetPassword, handleSequelizeError);
  
  meRouter.post("/forget-password", forgotPassword, handleSequelizeError);
  meRouter.get("/",  authGaurd, getCurrentUser, handleSequelizeError);
  
  meRouter.get("/orders", authGaurd, getOrders,handleSequelizeError);
  meRouter.post("/orders", authGaurd,couponGuard,WalletBalanceMiddleWare, createSale,handleSequelizeError);
  meRouter.patch("/orders/:SalesMasterGUID", authGaurd, cancelOrder,handleSequelizeError);
  meRouter.get("/orders/payments/createOrder", authGaurd,generateRazorpayIntent,handleSequelizeError);
  

  meRouter.get("/cart", authGaurd,getCart,handleSequelizeError);
  meRouter.post("/cart", authGaurd,addToCart,handleSequelizeError);
  meRouter.patch("/cart", authGaurd,removeFromCart,handleSequelizeError);
  meRouter.post("/cart/checkout",authGaurd,WalletBalanceMiddleWare,moveFromCartToOrder,handleSequelizeError);

export default meRouter;