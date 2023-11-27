import { Router } from "express";
import BillingCycles from "../models/billing-cycle.model";
const billingcyclesRouter = Router();
billingcyclesRouter.all("", async (req, res) => {
  const billingcycles = await BillingCycles.findAll();
  res.send(billingcycles);
});

export { billingcyclesRouter };
