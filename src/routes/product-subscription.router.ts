import { Router } from "express";
import {
  calcelSubscription,
  getUserSubscriptions,
  subscribeProduct,
} from "../controllers/product-subscription.controller";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
import WalletBalance from "../middlewares/wallet-balance.middleware";
import couponGuard from "../middlewares/coupon-gaurd.moddleware";

const router = Router();

router.get("", getUserSubscriptions,handleSequelizeError);
router.post("",  WalletBalance,couponGuard,subscribeProduct,handleSequelizeError);
router.patch("/:SubscriptionGUID", calcelSubscription,handleSequelizeError);

export default router;
