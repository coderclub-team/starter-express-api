import { Router } from "express";
import { getAllSales, getSaleById } from "../controllers/sale.controller";

const router = Router();

router.get("/", getAllSales);
// router.get("/:SaleMasterGUID", getSaleById);

export default router;
