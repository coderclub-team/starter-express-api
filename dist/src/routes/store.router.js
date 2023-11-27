"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const router = express_1.default.Router();
const customer_controller_1 = require("../controllers/customer.controller");
const store_master_model_1 = __importDefault(require("../models/store-master.model"));
const lineman_controller_1 = require("../controllers/lineman.controller");
const multer_1 = __importDefault(require("multer"));
const route_controller_1 = require("../controllers/route.controller");
const global_type_model_1 = __importDefault(require("../models/global-type.model"));
const functions_1 = require("../functions");
const product_subscription_model_1 = __importDefault(require("../models/product-subscription.model"));
const billing_cycle_model_1 = __importDefault(require("../models/billing-cycle.model"));
const database_1 = require("../database");
router.use("/:store_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield store_master_model_1.default.findByPk(req.params.store_id);
        if (store === null)
            throw new Error("Store not found");
        next();
    }
    catch (error) {
        next(error);
    }
}));
// lineman
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
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
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});
router.post("/:store_id/lineman/register/request", upload.fields([
    { name: "aadhaar_front" },
    { name: "aadhaar_back" },
    { name: "driving_licence_front" },
    { name: "driving_licence_back" },
]), lineman_controller_1.registerRequest);
router.post("/:store_id/lineman/register/request/confirm", lineman_controller_1.verifyRegistration);
router.post("/:store_id/lineman/password/reset/request", lineman_controller_1.resetPasswordRequest);
router.post("/:store_id/lineman/password/reset/request/confirm", lineman_controller_1.resetPassword);
router.post("/:store_id/lineman/login/request", lineman_controller_1.loginRequest);
// customers (shops)
router.get("/:store_id/customers", customer_controller_1.findAll);
router.get("/:store_id/customers/:customer_id", customer_controller_1.findOneById);
router.post("/:store_id/customers/create/request", customer_controller_1.createCustomerRequest);
router.delete("/:store_id/customers/:customer_id", customer_controller_1.deleteById);
// routes
router.get("/:store_id/routes/all/request", route_controller_1.allRoutes);
router.get("/:store_id/routes/:route_id", route_controller_1.allRoutes);
router.post("/:store_id/subscriptions/create/request", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body.user", req.body.user.UserGUID);
    try {
        const zod_object = zod_1.default
            .object({
            product_id: zod_1.default.number(),
            interval_type: zod_1.default.string(),
            sunday: zod_1.default.number(),
            monday: zod_1.default.number(),
            tuesday: zod_1.default.number(),
            wednesday: zod_1.default.number(),
            thursday: zod_1.default.number(),
            friday: zod_1.default.number(),
            saturday: zod_1.default.number(),
            nthday_interval: zod_1.default.number().optional(),
            nth_day_qty: zod_1.default.number().optional(),
            product_guid: zod_1.default.number(),
        })
            .refine((data) => {
            // Define the condition for making nth_day_qty and nthday_interval optional
            if ((0, functions_1.capitalizeEveryWord)(data.interval_type) ===
                "Nth Day Subscription Interval") {
                return !(data.nthday_interval === undefined ||
                    data.nth_day_qty === undefined);
            }
            return true; // For other interval types, no restriction on nth_day_qty and nthday_interval
        }, {
            message: "For Nth Day Subscription Interval, nthday_interval and nth_day_qty are required",
        })
            .refine((data) => {
            if ((0, functions_1.capitalizeEveryWord)(data.interval_type) ===
                "Custom Days In Week Subscription Interval") {
                return !(data.monday === undefined ||
                    data.tuesday === undefined ||
                    data.wednesday === undefined ||
                    data.thursday === undefined ||
                    data.friday === undefined ||
                    data.saturday === undefined ||
                    data.sunday === undefined);
            }
            return true;
        }, {
            message: "For Custom Days In Week Subscription Interval, all days are required",
        });
        const schema = zod_object.parse(req.body);
        const global_type = yield global_type_model_1.default.findOne({
            where: {
                GlobalTypeName: (0, functions_1.capitalizeEveryWord)(schema.interval_type),
                GlobalTypeCategoryGUID: 10,
            },
        });
        if (global_type === null)
            throw new Error("Invalid interval type");
        const { GlobalTypeName } = global_type;
        const t = yield database_1.sequelize.transaction();
        const default_data = {
            MondayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.monday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.monday
                    : undefined,
            TuesdayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.tuesday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.tuesday
                    : undefined,
            WednesdayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.wednesday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.wednesday
                    : undefined,
            ThursdayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.thursday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.thursday
                    : undefined,
            FridayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.friday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.friday
                    : undefined,
            SaturdayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.saturday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.saturday
                    : undefined,
            SundayQty: GlobalTypeName === "Daily Subscription Interval"
                ? schema.sunday || 1
                : GlobalTypeName === "Custom Days In Week Subscription Interval"
                    ? schema.sunday
                    : undefined,
            EveryNthDayInterval: GlobalTypeName === "Nth Day Subscription Interval"
                ? schema.nthday_interval
                : undefined,
            EveryNthDayQty: GlobalTypeName === "Nth Day Subscription Interval"
                ? schema.nth_day_qty
                : undefined,
            BillingCycleName: "Daily",
            NumberOfCycles: 0,
            ProductGUID: schema.product_id,
            UserGUID: req.body.user.UserGUID,
        };
        const [bcycle, bcycle_created] = yield billing_cycle_model_1.default.findOrCreate({
            where: {
                UserGUID: req.body.user.UserGUID,
                ProductGUID: schema.product_id,
            },
            defaults: Object.assign(Object.assign({}, default_data), { UserGUID: req.body.user.UserGUID, ProductGUID: schema.product_id }),
        });
        if (!bcycle_created) {
            yield billing_cycle_model_1.default.update(Object.assign({}, default_data), {
                where: {
                    UserGUID: req.body.user.UserGUID,
                    ProductGUID: schema.product_id,
                },
            });
        }
        const [subscription, created] = yield product_subscription_model_1.default.findOrCreate({
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
        yield t.commit();
        if (created) {
            res.status(200).json(subscription);
        }
    }
    catch (error) {
        console.log("error.message", error.message);
        next(error.message);
    }
}));
exports.default = router;
