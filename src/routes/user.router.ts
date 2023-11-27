// a /login route that will return a JWT token

import { Router } from "express";
import multer from "multer";
import { userImageUploadOptions } from "../../config";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.";
import handleSequelizeError from "../middlewares/handle-sequelize-error.middleware";

const userRouter = Router();


userRouter.get("/", getAllUsers);
userRouter.get("/:UserGUID", getUserById);
userRouter.delete("/:UserGUID", deleteUserById, handleSequelizeError);







export default userRouter;
