import express from "express";
import {
  addCartItem,
  getCartItems,
} from "../controllers/user.controller.";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";

const router = express.Router();

router.get("", getCartItems, handleSequelizeError);
router.post("", addCartItem, handleSequelizeError);

export default router;
