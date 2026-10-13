import express from "express";
import { register, login, logout, getCurrentUser, updateProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateProfile);
router.patch("/me", requireAuth, updateProfile);

export default router;
