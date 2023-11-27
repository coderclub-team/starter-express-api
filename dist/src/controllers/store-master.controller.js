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
exports.deleteStoreMaster = exports.updateStoreMaster = exports.createStoreMaster = exports.getStoreMasterById = exports.getAllStoreMasters = void 0;
const store_master_model_1 = __importDefault(require("../models/store-master.model"));
const product_category_model_1 = __importDefault(require("../models/product-category.model"));
const getAllStoreMasters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeMasters = yield store_master_model_1.default.findAll({
            attributes: {
                exclude: ["CreatedByGUID", "ModifiedByGUID", "DeletedByGUID"],
            },
            include: [
                {
                    model: product_category_model_1.default,
                    as: "ProductCategory",
                },
            ],
            raw: true,
            nest: true,
        });
        res.status(200).json({
            message: "Store Masters fetched successfully!",
            storeMasters,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.getAllStoreMasters = getAllStoreMasters;
const getStoreMasterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { StoreGUID } = req.params;
    try {
        const storeMaster = yield store_master_model_1.default.findByPk(StoreGUID, {
            //   include: [
            //     {
            //       model: User,
            //       as: "CreatedBy",
            //       attributes: ["UserID", "UserName"],
            //     },
            //     {
            //       model: User,
            //       as: "ModifiedBy",
            //       attributes: ["UserID", "UserName"],
            //     },
            //     {
            //       model: User,
            //       as: "DeletedBy",
            //       attributes: ["UserID", "UserName"],
            //     },
            //   ],
            attributes: {
                exclude: ["CreatedByGUID", "ModifiedByGUID", "DeletedByGUID"],
            },
        });
        res.status(200).json({
            message: "Store Master fetched successfully!",
            storeMaster,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.getStoreMasterById = getStoreMasterById;
const createStoreMaster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.CreatedGUID = req.body.user.UserGUID;
    try {
        const storeMaster = yield store_master_model_1.default.create(req.body);
        res.status(201).json({
            message: "Store Master created successfully!",
            storeMaster,
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.createStoreMaster = createStoreMaster;
const updateStoreMaster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.ModifiedGUID = req.body.user.UserGUID;
    const { StoreGUID } = req.params;
    try {
        const store = yield store_master_model_1.default.findByPk(StoreGUID);
        if (store) {
            const storeMaster = yield store.update(req.body);
            res.status(200).json({
                message: "Store Master updated successfully!",
                storeMaster,
            });
        }
        else {
            res.status(404).json({ message: "Store not found!" });
        }
    }
    catch (error) {
        console.log("storeMasterController.ts: error: ", error.message);
        res.status(500).json({ error });
    }
});
exports.updateStoreMaster = updateStoreMaster;
const deleteStoreMaster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { StoreGUID } = req.params;
    try {
        const store = yield store_master_model_1.default.findByPk(StoreGUID);
        if (store) {
            const storeMaster = yield store.destroy();
            res.status(200).json({
                message: "Store Master deleted successfully!",
                storeMaster,
            });
        }
        else {
            res.status(404).json({ message: "Store not found!" });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.deleteStoreMaster = deleteStoreMaster;
