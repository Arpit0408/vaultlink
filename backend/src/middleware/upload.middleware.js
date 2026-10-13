import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "../utils/appError.js";

const uploadDir = path.resolve("uploads");
const originalDir = path.resolve("uploads/originals");
const watermarkedDir = path.resolve("uploads/watermarked");

[uploadDir, originalDir, watermarkedDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, originalDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowedExt = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext);
    const isAllowedMime = file.mimetype === "application/pdf" || file.mimetype.startsWith("image/");
    if (isAllowedExt || isAllowedMime) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Only PDF and Image files are permitted for secure vault storage"), false);
    }
  },
});
