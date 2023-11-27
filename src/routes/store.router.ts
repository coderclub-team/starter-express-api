import express, { NextFunction, Request, Response } from "express";
import zod from "zod";
const router = express.Router();
import {
  findAll,
  findOneById,
  createCustomerRequest,
  deleteById,
} from "../controllers/customer.controller";
import StoreMaster from "../models/store-master.model";
import {
  loginRequest,
  registerRequest,
  resetPassword,
  resetPasswordRequest,
  verifyRegistration,
} from "../controllers/lineman.controller";
import multer from "multer";
import { allRoutes } from "../controllers/route.controller";
import GlobalType from "../models/global-type.model";
import { capitalizeEveryWord } from "../functions";
import ProductSubscription from "../models/product-subscription.model";
import SubscriptionCycle, {
  SubscriptionCycleCreationAttributes,
} from "../models/billing-cycle.model";
import { Sequelize } from "sequelize";
import { sequelize } from "../database";

router.use(
  "/:store_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const store = await StoreMaster.findByPk(req.params.store_id);
      if (store === null) throw new Error("Store not found");
      next();
    } catch (error) {
      next(error);
    }
  }
);

// lineman

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/tmp");
    },
    filename: (req, file, cb) => {
      // a unique name for the file with the original extension
      cb(null, `${Date.now()}.${file.originalname.split(".").pop()}`);
    },
  }),
  limits: { fileSize: 2024 * 1024 * 2 },
  dest: "public/tmp",
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

router.post(
  "/:store_id/lineman/register/request",
  upload.fields([
    { name: "aadhaar_front" },
    { name: "aadhaar_back" },
    { name: "driving_licence_front" },
    { name: "driving_licence_back" },
  ]),
  registerRequest
);
router.post("/:store_id/lineman/register/request/confirm", verifyRegistration);
router.post("/:store_id/lineman/password/reset/request", resetPasswordRequest);
router.post("/:store_id/lineman/password/reset/request/confirm", resetPassword);
router.post("/:store_id/lineman/login/request", loginRequest);

// customers (shops)
router.get("/:store_id/customers", findAll);
router.get("/:store_id/customers/:customer_id", findOneById);
router.post("/:store_id/customers/create/request", createCustomerRequest);
router.delete("/:store_id/customers/:customer_id", deleteById);

// routes
router.get("/:store_id/routes/all/request", allRoutes);
router.get("/:store_id/routes/:route_id", allRoutes);

router.post(
  "/:store_id/subscriptions/create/request",
  async (req: Request, res: Response, next: NextFunction) => {

    console.log("req.body.user", req.body.user.UserGUID)
    
    try {
      const zod_object = zod
        .object({
          product_id: zod.number(),
          interval_type: zod.string(),
          sunday: zod.number(),
          monday: zod.number(),
          tuesday: zod.number(),
          wednesday: zod.number(),
          thursday: zod.number(),
          friday: zod.number(),
          saturday: zod.number(),
          nthday_interval: zod.number().optional(),
          nth_day_qty: zod.number().optional(),
          product_guid: zod.number(),
        })
        .refine(
          (data) => {
            // Define the condition for making nth_day_qty and nthday_interval optional
            if (
              capitalizeEveryWord(data.interval_type) ===
              "Nth Day Subscription Interval"
            ) {
              return !(
                data.nthday_interval === undefined ||
                data.nth_day_qty === undefined
              );
            }
            return true; // For other interval types, no restriction on nth_day_qty and nthday_interval
          },
          {
            message:
              "For Nth Day Subscription Interval, nthday_interval and nth_day_qty are required",
          }
        )
        .refine(
          (data) => {
            if (
              capitalizeEveryWord(data.interval_type) ===
              "Custom Days In Week Subscription Interval"
            ) {
              return !(
                data.monday === undefined ||
                data.tuesday === undefined ||
                data.wednesday === undefined ||
                data.thursday === undefined ||
                data.friday === undefined ||
                data.saturday === undefined ||
                data.sunday === undefined
              );
            }
            return true;
          },
          {
            message:
              "For Custom Days In Week Subscription Interval, all days are required",
          }
        );

      const schema = zod_object.parse(req.body);
      const global_type = await GlobalType.findOne({
        where: {
          GlobalTypeName: capitalizeEveryWord(schema.interval_type),
          GlobalTypeCategoryGUID: 10,
        },
      });

      if (global_type === null) throw new Error("Invalid interval type");
      const { GlobalTypeName } = global_type;
      const t = await sequelize.transaction();

      const default_data: SubscriptionCycleCreationAttributes = {
        MondayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.monday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.monday
            : undefined,
        TuesdayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.tuesday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.tuesday
            : undefined,
        WednesdayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.wednesday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.wednesday
            : undefined,
        ThursdayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.thursday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.thursday
            : undefined,
        FridayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.friday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.friday
            : undefined,
        SaturdayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.saturday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.saturday
            : undefined,
        SundayQty:
          GlobalTypeName === "Daily Subscription Interval"
            ? schema.sunday || 1
            : GlobalTypeName === "Custom Days In Week Subscription Interval"
            ? schema.sunday
            : undefined,
        EveryNthDayInterval:
          GlobalTypeName === "Nth Day Subscription Interval"
            ? schema.nthday_interval
            : undefined,
        EveryNthDayQty:
          GlobalTypeName === "Nth Day Subscription Interval"
            ? schema.nth_day_qty
            : undefined,
        BillingCycleName: "Daily",
        NumberOfCycles: 0,
        ProductGUID: schema.product_id,
        UserGUID: req.body.user.UserGUID,
      };
      const [bcycle, bcycle_created] = await SubscriptionCycle.findOrCreate({
        where: {
          UserGUID: req.body.user.UserGUID,
          ProductGUID: schema.product_id,
        },
        defaults: {
          ...default_data,
          UserGUID: req.body.user.UserGUID,
          ProductGUID: schema.product_id,
        
        },
      });
      if (!bcycle_created) {
        await SubscriptionCycle.update(
          {
            ...default_data,
          },
          {
            where: {
              UserGUID: req.body.user.UserGUID,
              ProductGUID: schema.product_id,
            },
          }
        );
      }

      const [subscription, created] = await ProductSubscription.findOrCreate({
        where: {
          ProductGUID: schema.product_id,
          UserGUID: req.body.user.UserGUID,
        },
        defaults: {
          SubscriptionStartDate: new Date(),
          SubscriptionEndDate: new Date(),
          SubscriptionOccurrences: 0,
          CreatedGUID: req.body.user.UserGUID,
          BillingCycleGUID: bcycle.BillingCycleGUID,
          Status: "ACTIVE",
        },
        transaction: t,
      });
      await t.commit();

      if(created){
        res.status(200).json(subscription)
      }
    } catch (error: any) {
      console.log("error.message", error.message);
      next(error.message);
    }
  }
);
export default router;
