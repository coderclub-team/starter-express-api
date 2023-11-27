"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lineman_controller_1 = require("../controllers/lineman.controller");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
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
router.post("/:store_id/register/request", upload.fields([
    { name: "aadhaar_front" },
    { name: "aadhaar_back" },
    { name: "driving_licence_front" },
    { name: "driving_licence_back" },
]), lineman_controller_1.registerRequest);
router.post("/:store_id/register/request/confirm", lineman_controller_1.verifyRegistration);
router.post("/:store_id/password/reset/request", lineman_controller_1.resetPasswordRequest);
router.post("/:store_id/password/reset/request/confirm", lineman_controller_1.resetPassword);
router.post("/:store_id/login/request", lineman_controller_1.loginRequest);
exports.default = router;
