import express from "express";
import { loginRequest,  registerRequest, resetPassword, resetPasswordRequest, verifyRegistration } from "../controllers/lineman.controller";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";
import multer from "multer";
import path from "path";
const router = express.Router();



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
  "/:store_id/register/request",
  upload.fields([
    { name: "aadhaar_front" },
    { name: "aadhaar_back" },
    { name: "driving_licence_front" },
    { name: "driving_licence_back" },
  ]),
  registerRequest
);
router.post("/:store_id/register/request/confirm",verifyRegistration)
router.post("/:store_id/password/reset/request",resetPasswordRequest)
router.post("/:store_id/password/reset/request/confirm",resetPassword)
router.post("/:store_id/login/request",loginRequest)


export default router;
