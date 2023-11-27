import express from 'express';
import { checkPromoCode, getAllPromotions } from '../controllers/promotion.controller';
import couponGuard from '../middlewares/coupon-gaurd.moddleware';
import authGaurdMiddleware from '../middlewares/auth-gaurd.middleware';

const router = express.Router();

router.get('/', getAllPromotions);
router.post('/check',authGaurdMiddleware,couponGuard, checkPromoCode);

export default router;
