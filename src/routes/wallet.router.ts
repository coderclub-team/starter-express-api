import express from "express";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
import { creditOrDebit, getWalletBalance, getWalletTransactions, } from "../controllers/user-wallet.controller";
import WalletBalanceMiddleWare from "../middlewares/wallet-balance.middleware";

const router = express.Router();
router.get("/", getWalletTransactions, handleSequelizeError);
router.get("/balance",getWalletBalance, handleSequelizeError);
router.post("/", creditOrDebit, handleSequelizeError);

export default router;
