import { NextFunction, Request, Response } from "express";

import express from "express";
import { Banner, Walkthrough } from "../models/cms.model";
const router = express.Router();
require("dotenv").config();
// Define routes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const walkthrogh = await Walkthrough.findAll();
    const banners=await Banner.findAll();
    const url =
      process.env.NODE_ENV == "production"
        ? process.env.STATIC_FILE_URL
        : "http://localhost:3000";
    const splashlogo = url + "/splashscreen/splash_logo.gif";
    const applogo = url + "/icons/milk_bottle.png";
    const tamilmilk_logo=url+"/icons/tamilmilk_logo.jpg"
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
  } catch (error) {
    next(error);
  }
});

export default router;
