import Coupon from '../models/coupon.js';
import { Course } from '../models/course.js';
import { hashData, encryptData } from '../utils/auth.js';
import { v4 as uuid } from 'uuid';

const coupon = {
    hashedCoupon: async (req, res) => {
        try {
            const { course_id, user_id, count } = req.body;
            const encodedHashResults = [];
            const hashed = [];
            const course = await Course.findOne({ slug: course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            for (let i = 0; i < count; i++) {
                const hashedData = hashData(course_id, uuid());
                hashed.push(hashedData);
            }
            const newCoupon = new Coupon({
                course_id: course_id,
                user_id: user_id,
                hash_secret: hashed,
            });
            await newCoupon.save();
            for (const hash of hashed) {
                const encodedHash = hashData(hash, process.env.SECRET_KEY);
                encodedHashResults.push(encodedHash);
            }

            return res.status(200).json({ encodedHashResults, hashed });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred.' });
        }
    },
    getCoupon: async (req, res) => {
        try {
            const { course_id, user_id } = req.body;
            const course = await Course.findOne({ slug: course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            const data = await Coupon.findOne({ course_id }).exec();
            console.log(data);
            res.json(data);
        } catch (error) {
            console.log('Error : ', error);
            return res.status(400).send('Fetching courses failed');
        }
    },

    useCoupon: async (req, res) => {
        try {
            const { coupon } = req.body;
            const { course_id } = req.params;
            const course = await Coupon.findOne({ course_id }).exec();
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            console.log(course.hash_secret.includes(coupon));

            if (course.hash_secret.includes(coupon)) {
                // Remove coupon from hash_secret array
                const updatedHashSecret = course.hash_secret.filter(
                    (hash) => hash !== coupon,
                );
                course.hash_secret = updatedHashSecret;

                // Assign coupon value to hash_used field
                course.hash_used.push(coupon);

                // Save the updated course document
                await course.save();
            } else {
                return res.status(404).json({
                    message: 'Coupon not found ',
                });
            }
            res.json(course);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

export default coupon;
