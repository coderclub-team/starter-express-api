import express from "express";
import {
  createStoreMaster,
  deleteStoreMaster,
  getAllStoreMasters,
  getStoreMasterById,
  updateStoreMaster,
} from "../controllers/store-master.controller";

const router = express.Router();

router.get("/", getAllStoreMasters);
router.get("/:StoreGUID", getStoreMasterById);
router.post("/", createStoreMaster);
router.put("/:StoreGUID", updateStoreMaster);
router.delete("/:StoreGUID", deleteStoreMaster);

export default router;
