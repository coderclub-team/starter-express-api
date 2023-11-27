import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Op, UniqueConstraintError } from "sequelize";
import User from "../models/user.model";
import path from "node:path";
import fs from "node:fs";
import { UniqueUserException } from "../../custom.error";

const uniqueUserGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { MobileNo, EmailAddress, LoginName } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ MobileNo }, { EmailAddress }, { LoginName }],
      },
    });
    if (user) {
      if (user.MobileNo === MobileNo) {
        throw new UniqueUserException("MobileNo already exists!");
        //
      } else if (user.EmailAddress === EmailAddress) {
        throw new UniqueUserException(
          `EmailAddress ${user.EmailAddress} already exists!`
        );
      } else if (user.LoginName === LoginName) {
        throw new UniqueUserException(
          `LoginName ${user.LoginName} already exists!`
        );
      } else {
        throw new UniqueUserException("User already exists!");
      }
    }

    next();
  } catch (error: any) {
    if (req.file) {
      const tmpPath = path.join("public/tmp", req?.file?.filename);
      fs.existsSync(tmpPath) && fs.unlinkSync(tmpPath);
    }
    return res.status(400).json(error);
  }
};
export default uniqueUserGaurd;
