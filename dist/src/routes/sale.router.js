"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_controller_1 = require("../controllers/sale.controller");
// import {
//   createLineMan,
//   deleteLineMan,
//   getAllLineMen,
//   getLineManById,
//   updateLineMan,
// } from "../controllers/lineMenu.controller";
const router = (0, express_1.Router)();
router.get("/", sale_controller_1.getAllSales);
router.get("/:SaleMasterGUID", sale_controller_1.getSaleById);
// router.post("/", createLineMan);
// router.put("/:LineManGUID", updateLineMan);
// router.delete("/:LineManGUID", deleteLineMan);
// router.get("/", getAllLineMen);
exports.default = router;
