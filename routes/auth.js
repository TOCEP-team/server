import express from "express";

const router = express.Router();
//  middleware
import { isAuthenticatedUser } from '../middleware/index.js';
import {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get('/current-user', currentUser);
router.get("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
