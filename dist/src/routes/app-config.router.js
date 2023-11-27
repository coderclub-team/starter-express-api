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
const router = express_1.default.Router();
require("dotenv").config();
// Define routes
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const walkthrogh = yield cms_model_1.Walkthrough.findAll();
        const banners = yield cms_model_1.Banner.findAll();
        const url = process.env.NODE_ENV == "production"
            ? process.env.STATIC_FILE_URL
            : "http://localhost:3000";
        const splashlogo = url + "/splashscreen/splash_logo.gif";
        const applogo = url + "/icons/milk_bottle.png";
        const tamilmilk_logo = url + "/icons/tamilmilk_logo.jpg";
        const config = {
            splashlogo: [
                {
                    image: splashlogo,
                },
                {
                    tamilmilk_logo: tamilmilk_logo
                }
            ],
            applogo: [
                {
                    image: applogo,
                },
            ],
            walkthrogh,
            banners
        };
        res.status(200).json(config);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
