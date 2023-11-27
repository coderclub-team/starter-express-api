import express from "express";
import { Banner, ContactForm, FAQ, Walkthrough } from "../models/cms.model";
import authGaurdMiddleware from "../middlewares/auth-gaurd.middleware";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const router = express.Router();

// Define your routes here
router.get("/faqs", async (req, res, next) => {
  try {
    const faqs = await FAQ.findAll({
      order: ["SortOrder"],
    });
    res.status(200).json(faqs);
  } catch (error) {
    next(error);
  }
});

router.get("/banners", async (req, res, next) => {
  try {
    const banners = await Banner.findAll({
      order: ["SortOrder"],
    });
    res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
});

router.get("/walkthroughs", async (req, res, next) => {
  try {
    const banners = await Walkthrough.findAll({
      order: ["SortOrder"],
    });
    res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
});

router.post("/contact", authGaurdMiddleware, async (req, res, next) => {
  const { Message } = req.body;
  const { EmailAddress, MobileNo,FirstName } = req.body.user;
  if (Message.length < 2) {
    throw new Error("Message is too short");
  }

  try {
    const contact_exists = await ContactForm.findOne({
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
    const contact = await ContactForm.create({
        Name:FirstName,
      Phone: MobileNo,
      Email: EmailAddress,

      Message,
    });
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

export default router;
