import express from "express";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  updateAddress,
} from "../controllers/user-address.conroller";

const router = express.Router();
router.get("/:me",getMyAddresses,handleSequelizeError )
router.post("", createAddress, handleSequelizeError);
router.put("/:AddressGUID", updateAddress, handleSequelizeError);
router.delete("/:AddressGUID", deleteAddress, handleSequelizeError);

export default router;
