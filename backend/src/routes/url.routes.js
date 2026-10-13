import express from "express";
import { createShortUrl, getUserUrls } from "../controllers/url.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createShortUrl);
router.post("/create", createShortUrl);
router.get("/", requireAuth, getUserUrls);
router.get("/urls", requireAuth, getUserUrls);

export default router;
