import { expressjwt } from 'express-jwt';
import { User } from '../models/user.js';
import { Course } from '../models/course.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
export const isAuthenticatedUser = expressjwt({
  getToken: (req, res) => req.cookies.token,
  secret: jwtSecret,
  algorithms: ['HS256'],
});

// export const isAuthenticatedUser = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   console.log('token: ', token);
//   if (!token) {
//     return res.status(401).json({ error: 'Access denied. Not authenticated.' });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     console.log('decoded: ', decoded);
//     const user = await User.findOne({ email: decoded.email });
//     console.log('user: ', decoded.email);

//     if (!user) {
//       return res.status(401).json({ error: 'Access denied. User not found.' });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     return res.status(401).json({ error: 'Access denied. Invalid token.' });
//   }
// };

export const isInstructor = async (req, res, next) => {
  // try {
  //   const user = await User.findById(req.auth._id);

  //   if (!user.role.includes('Instructor')) {
  //     return res.sendStatus(403);
  //   } else {
  //     next();
  //   }
  // } catch (err) {
  //   console.log('Error : ', err);
  // }
  next();
};
export const isEnrolled = async (req, res, next) => {
  // try {
  //   const user = await User.findById(req.auth._id).exec();
  //   const course = await Course.findOne({ slug: req.params.slug }).exec();

  //   // Check if course id is found in user courses array
  //   let ids = [];

  //   for (let i = 0; i < user.courses.length; i++) {
  //     ids.push(user.courses[i].toString());
  //   }

  //   if (!ids.includes(course._id.toString())) {
  //     res.sendStatus(403);
  //   } else {
  //     next();
  //   }
  // } catch (error) {
  //   console.log('Error : ', error);
  // }
  next();
};
