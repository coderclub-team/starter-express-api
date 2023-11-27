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
exports.deleteById = exports.updateById = exports.findOneById = exports.findAll = exports.createCustomerRequest = void 0;
const customer_model_1 = __importDefault(require("../models/customer.model"));
const zod_1 = __importDefault(require("zod"));
const sequelize_1 = require("sequelize");
const createCustomerRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default
            .object({
            name: zod_1.default.string().min(3).max(50),
            description: zod_1.default.string().min(3).max(50).optional(),
            address: zod_1.default.string().min(3).max(50).optional(),
            city: zod_1.default.string().min(3).max(50).optional(),
            state: zod_1.default.string().min(3).max(50).optional(),
            gst_number: zod_1.default.string().min(3).max(50).optional(),
            phone: zod_1.default.string().min(3).max(50),
            email: zod_1.default.string().email(),
        })
            .parse(req.body);
        const [customer, created] = yield customer_model_1.default.findOrCreate({
            where: {
                [sequelize_1.Op.or]: [{ MobileNo: schema.phone }, { EmailID: schema.email }],
            },
            defaults: {
                CustomerName: schema.name,
                MobileNo: schema.phone,
                EmailID: schema.email,
                Description: schema.description,
                Address: schema.address,
                City: schema.city,
                State: schema.state,
                GSTNo: schema.gst_number,
            },
        });
        if (!created) {
            if (customer.MobileNo === schema.phone) {
                throw new Error("Mobile number already exists");
            }
            if (customer.EmailID === schema.email) {
                throw new Error("Email ID already exists");
            }
        }
        res.status(200).json(customer);
    }
    catch (error) {
        next(error);
    }
});
exports.createCustomerRequest = createCustomerRequest;
const findAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Find all", req.params);
    try {
        const customers = yield customer_model_1.default.findAll();
        res.status(200).json(customers);
    }
    catch (error) {
        next(error);
    }
});
exports.findAll = findAll;
const findOneById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id } = req.params;
    try {
        const customer = yield customer_model_1.default.findByPk(customer_id);
        if (!customer)
            throw new Error("Customer not found");
        res.status(200).json(customer);
    }
    catch (error) {
        next(error);
    }
});
exports.findOneById = findOneById;
const updateById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id } = req.params;
    try {
        yield customer_model_1.default.update(req.body, {
            where: {
                CustomerGUID: customer_id,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateById = updateById;
const deleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id } = req.params;
    const { force } = req.query;
    try {
        const customer = yield customer_model_1.default.destroy({
            where: {
                CustomerGUID: customer_id,
            },
            force: force === "true" ? true : false,
        });
        if (!customer)
            throw new Error("Customer not found");
        res.status(200).json({ message: "Customer deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteById = deleteById;
