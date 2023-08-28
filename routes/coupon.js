import coupon from '../controllers/coupon.js';
import express from 'express';
const router = express.Router();

router.post('/coupon', coupon.hashedCoupon);
router.get('/coupon',coupon.getCoupon);
router.put('/coupon/:course_id', coupon.useCoupon);

export default router;
