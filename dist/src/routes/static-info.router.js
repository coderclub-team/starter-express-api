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
const cms_model_1 = require("../models/cms.model");
const auth_gaurd_middleware_1 = __importDefault(require("../middlewares/auth-gaurd.middleware"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const router = express_1.default.Router();
// Define your routes here
router.get("/faqs", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield cms_model_1.FAQ.findAll({
            order: ["SortOrder"],
        });
        res.status(200).json(faqs);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/banners", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield cms_model_1.Banner.findAll({
            order: ["SortOrder"],
        });
        res.status(200).json(banners);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/walkthroughs", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield cms_model_1.Walkthrough.findAll({
            order: ["SortOrder"],
        });
        res.status(200).json(banners);
    }
    catch (error) {
        next(error);
    }
}));
router.post("/contact", auth_gaurd_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Message } = req.body;
    const { EmailAddress, MobileNo, FirstName } = req.body.user;
    if (Message.length < 2) {
        throw new Error("Message is too short");
    }
    try {
        const contact_exists = yield cms_model_1.ContactForm.findOne({
            where: {
                Phone: MobileNo,
                Email: EmailAddress,
                Message,
            },
        });
        if (contact_exists) {
            return res
                .status(400)
                .json({ message: "You have already submitted this form" });
        }
        const contact = yield cms_model_1.ContactForm.create({
            Name: FirstName,
            Phone: MobileNo,
            Email: EmailAddress,
            Message,
        });
        res.status(200).json(contact);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
